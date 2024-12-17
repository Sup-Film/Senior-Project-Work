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
                // document.getElementById('clearScoreBtn').style.display = 'block';
            } else if (role == 'Student') {
                menuClassroom.href = 'classroom_student';
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

// Get Scoreboard data
fetch('/projectsenior/flashcard/deck/' + deckId, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
})
    .then(response => response.json())
    .then(data => {
        console.log(deckId)
        console.log(data);
        let html = '';
        data.forEach((item, index) => {
            console.log(item);
            html += `
              <tr>
                <td>${item.card_question}</td>
                <td>${item.total}</td>
                <td>${item.correct}</td>
                <td>${item.wrong}</td>
                <td>
              <div class="row justify-content-center align-items-center text-center " style="margin-bottom: 0.5rem;">
                <div class="circular-progress-correct circular${index}">
                  <span class="progress-value-correct progress${index}">0</span>
                </div>
              </div>
            </td>
              </tr>
            `;
        })
        // document.querySelector('.table__header h1').textContent = item.deck_id.deck_name;
        document.getElementById('StatsBoard').innerHTML = html;

        data.forEach((item, index) => {
            console.log(item.total, item.correct, index);
            curclecshowscore_corrects(item.total, item.correct, index);
        });


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
    })


function curclecshowscore_corrects(total, correct, index) {
    let circularProgress = document.querySelector(`.circular${index}`),
        progressValue = document.querySelector(`.progress${index}`);
    let progressStartValue = 0,
        progressEndValue = Math.round((correct / total) * 100);
    console.log(progressEndValue);
    if (total == 0 || correct == 0) {
        progressValue.textContent = `0 %`
        return;
    }
    speed = 10;
    let max = 100;
    let maxdone = 360 / max;

    let progress = setInterval(() => {
        if (progressEndValue <= 0) {
            progressStartValue--;
            clearInterval(progress);
        }
        progressStartValue++;
        progressValue.textContent = `${progressStartValue} %`
        circularProgress.style.background = `conic-gradient(#15db67 ${progressStartValue * maxdone}deg, #ff0000 0deg)`
        if (progressStartValue == progressEndValue) {
            clearInterval(progress);
        }
    }, speed);
}