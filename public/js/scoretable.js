const urlParams = new URLSearchParams(window.location.search);
const encodedId = urlParams.get('deck');
const deckId = atob(encodedId);
// console.log("deckId", deckId);
// console.log(localStorage);

const role = localStorage.getItem('role');
const loggedIn = localStorage.getItem('loggedIn');
const btnUpdateDeck = document.querySelectorAll('.gear-manage');
const usernName = localStorage.getItem('userName')
// const breadcrumbClassroom = document.getElementById('classroom')
const menuClassroom = document.getElementById('sidebarClassroom');

// if (loggedIn) {
//     if (role == 'Student') {
//         menuClassroom.href = 'classroom_student';
//         // breadcrumbClassroom.href = 'classroom_student';
//     } else if (role == 'Teacher') {
//         menuClassroom.href = 'classroom?name=' + usernName;
//         // breadcrumbClassroom.href = 'classroom?name=' + usernName;
//     }
// } else {
//     window.location = 'login';
// }

fetch(`/projectsenior/index`, {})
    .then(response => response.json())
    .then(data => {
        if (!data.loggedIn) {
            window.location = 'login';
        } else {
            if (role == 'Teacher') {
                menuClassroom.href = 'classroom?name=' + usernName;
                document.getElementById('clearScoreBtn').style.display = 'block';
            } else if (role == 'Student') {
                menuClassroom.href = 'classroom_student';
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

// Get Scoreboard data
fetch('/api/scoreboard/' + deckId, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
})
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let html = '';
        data.forEach((item, index) => {
            item.scores.forEach((score, index) => {
                if (score.student_id.user_firstname == null) {
                    score.student_id.user_firstname = "ไม่พบชื่อ";
                }
                html += `
              <tr>
                <td>${score.student_id.user_firstname + " " + score.student_id.user_lastname}</td>
                <td>${score.score}</td>
                <td>${score.correctAnswers}</td>
                <td>${score.incorrectAnswers}</td>
              </tr>
            `;
            })
            document.querySelector('.table__header h1').textContent = item.deck_id.deck_name;
        })
        document.getElementById('scoreBoard').innerHTML = html;
        // $(document).ready(function () {
        //   $('#dataTable').DataTable();
        // });
        const search = document.querySelector('.input-group input');
        const table_rows = document.querySelectorAll('tbody tr');
        const table_headings = document.querySelectorAll('thead th');

        // console.log(search)
        // console.log(table_rows)
        // console.log(table_headings)
        // 1. Searching for specific data of HTML table
        search.addEventListener('input', searchTable);

        function searchTable() {
            table_rows.forEach((row, i) => {
                let table_data = row.textContent.toLowerCase(),
                    search_data = search.value.toLowerCase();

                row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
                row.style.setProperty('--delay', i / 25 + 's');
            })

            document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
                visible_row.style.backgroundColor = (i % 2 == 0) ? 'transparent' : '#0000000b';
            });
        }

        // 2. Sorting | Ordering data of HTML table

        table_headings.forEach((head, i) => {
            let sort_asc = true;
            head.onclick = () => {
                table_headings.forEach(head => head.classList.remove('active'));
                head.classList.add('active');

                document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
                table_rows.forEach(row => {
                    row.querySelectorAll('td')[i].classList.add('active');
                })

                head.classList.toggle('asc', sort_asc);
                sort_asc = head.classList.contains('asc') ? false : true;

                sortTable(i, sort_asc);
            }
        })


        function sortTable(column, sort_asc) {
            [...table_rows].sort((a, b) => {
                let first_row = a.querySelectorAll('td')[column].textContent.toLowerCase(),
                    second_row = b.querySelectorAll('td')[column].textContent.toLowerCase();

                return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);
            })
                .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
        }

        // 3. Converting HTML table to PDF

        const pdf_btn = document.querySelector('#toPDF');
        const customers_table = document.querySelector('#customers_table');


        const toPDF = function (customers_table) {
            const html_code = `
    <!DOCTYPE html>
    <link rel="stylesheet" type="text/css" href="css/scoretable.css">
    <main class="table" id="customers_table">${customers_table.innerHTML}</main>`;

            const new_window = window.open();
            new_window.document.write(html_code);

            setTimeout(() => {
                new_window.print();
                new_window.close();
            }, 400);
        }

        pdf_btn.onclick = () => {
            toPDF(customers_table);
        }

        // 4. Converting HTML table to JSON

        const json_btn = document.querySelector('#toJSON');

        const toJSON = function (table) {
            let table_data = [],
                t_head = [],

                t_headings = table.querySelectorAll('th'),
                t_rows = table.querySelectorAll('tbody tr');

            for (let t_heading of t_headings) {
                let actual_head = t_heading.textContent.trim().split(' ');

                t_head.push(actual_head.splice(0, actual_head.length).join(' ').toLowerCase());
            }

            t_rows.forEach(row => {
                const row_object = {},
                    t_cells = row.querySelectorAll('td');

                t_cells.forEach((t_cell, cell_index) => {
                    const img = t_cell.querySelector('img');
                    if (img) {
                        row_object['customer image'] = decodeURIComponent(img.src);
                    }
                    row_object[t_head[cell_index]] = t_cell.textContent.trim();
                })
                table_data.push(row_object);
            })

            return JSON.stringify(table_data, null, 4);
        }

        json_btn.onclick = () => {
            const json = toJSON(customers_table);
            downloadFile(json, 'json', 'score')
        }

        // 5. Converting HTML table to CSV File

        const csv_btn = document.querySelector('#toCSV');

        const toCSV = function (table) {
            // Code For SIMPLE TABLE
            // const t_rows = table.querySelectorAll('tr');
            // return [...t_rows].map(row => {
            //     const cells = row.querySelectorAll('th, td');
            //     return [...cells].map(cell => cell.textContent.trim()).join(',');
            // }).join('\n');

            const t_heads = table.querySelectorAll('th'),
                tbody_rows = table.querySelectorAll('tbody tr');

            const headings = [...t_heads].map(head => {
                let actual_head = head.textContent.trim().split(' ');
                return actual_head.splice(0, actual_head.length).join(' ').toLowerCase();
            }).join(',');

            const table_data = [...tbody_rows].map(row => {
                const cells = row.querySelectorAll('td'),
                    data_without_img = [...cells].map(cell => cell.textContent.replace(/,/g, ".").trim()).join(',');

                return data_without_img;
            }).join('\n');

            return headings + '\n' + table_data;
        }

        csv_btn.onclick = () => {
            const csv = toCSV(customers_table);
            downloadFile(csv, 'csv', 'score');
        }

        const downloadFile = function (data, fileType, fileName = '') {
            const a = document.createElement('a');
            a.download = fileName;
            const mime_types = {
                'json': 'application/json',
                'csv': 'text/csv',
            }
            a.href = `
        data:${mime_types[fileType]};charset=utf-8,${encodeURIComponent(data)}
    `;
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    });

// Delete Scoreboard
const deleteScoreboard = document.getElementById('clearScoreBtn');
deleteScoreboard.addEventListener('click', () => {
    Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ใช่, ลบเลย!",
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/api/scoreboard/deleteScoreBoard/' + deckId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(() => {
                    Swal.fire({
                        title: "ลบสำเร็จ!",
                        text: "ไฟล์ของคุณถูกลบแล้ว",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 900,
                    }).then(() => {
                        document.location = "scoreboard?deck=" + encodedId;
                    })
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    });
});