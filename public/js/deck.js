const urlParams = new URLSearchParams(window.location.search);
const encodedId = urlParams.get('classroom');
const classroomID = atob(encodedId);
const deckID = urlParams.get('deck')

localStorage.setItem('classroomID', classroomID);

fetch(`/projectsenior/index`, {})
  .then(response => response.json())
  .then(data => {
    if (!data.loggedIn) {
      window.location = 'login';
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });

// console.log(classroomID);
// console.log(deckID);

// SweetAlert Success
function showToast(titleText) {
  const ToastTrue = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  ToastTrue.fire({
    icon: "success",
    title: titleText
  })
}

// SweetAlert Error
function showToastError(err) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  Toast.fire({
    icon: "error",
    title: err
  })
}
// ! Deck

// GET DATA CLASSROOM
fetch('/api/deck/' + classroomID, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
})
  .then(response => response.json())
  .then(data => {
    const decks = document.getElementById('innerhtmlclassflash');
    // console.log(data);
    data.forEach(each => {
      const deckIdEncode = btoa(each._id);
      const deckCol = document.createElement('div');
      deckCol.className = 'ag-courses_item';
      deckCol.innerHTML = `
              <div href="#" class="ag-courses-item_link" id=${each._id}>
                <div class="ag-courses-item_bg"></div>
                <div class="ag-courses-item_title card-header d-flex justify-content-between align-items-center">
                    ${each.deck_name} <a class="button gear-manage" id="btnupdatedeck" href="#formeditdeck" onclick="btnupdatedeck('${each._id}')" ><i class="bi bi-gear-fill"></i></a>
                </div>
                <div class="ag-courses-item_date-box">
                    <div class="row mb-2">
                      <div class="col-md-12">
                          <a class="btn btn-primary font-poppin" role="button" style="font-weight: bold;" onclick="compareFlashcardAndQuiz('${each._id}')">Learning</a>
                      </div>
                    </div>
                    <div class="row mb-2 btnManageFlashcard">
                      <div class="col-md-12">
                      <a class="btn btn-primary font-poppin" href="manageDeck?deck=${deckIdEncode}" role="button" style="font-weight: bold;">Manage Deck</a>
                      </div>
                    </div>
                    <div class="row mb-2 btnStatBoard">
                      <div class="col-md-12">
                          <a class="btn btn-primary font-poppin" href="statsboard?deck=${deckIdEncode}" role="button" style="font-weight: bold;">Stats</a>
                      </div>
                    </div>
                    <div class="row mb-2">
                      <div class="col-md-12">
                          <a class="btn btn-primary font-poppin" href="scoreboard?deck=${deckIdEncode}" role="button" style="font-weight: bold;">Score Board</a>
                      </div>
                    </div>
                </div>
              </div>
          </div>
        `;
      decks.appendChild(deckCol);
    });
  })
  .then(() => {
    fetch(`/projectsenior/index`, {})
      .then(response => response.json())
      .then(data => {
        // console.log('Logged in user:', data.loggedIn);
        // console.log('Role:', data.role);
        const menuClassroom = document.getElementById('sidebarClassroom');
        const btnCreateDeck = document.getElementById('btnCreateDeck');
        const btnManageFlashcard = document.querySelectorAll('.btnManageFlashcard');
        const btnUpdateDeck = document.querySelectorAll('.gear-manage');
        const btnStatBoard = document.querySelectorAll('.btnStatBoard');
        const usernName = localStorage.getItem('userName')
        const breadcrumbClassroom = document.getElementById('classroom')
        // if (data.role == 'Student') {
        //   btnCreateDeck.style.display = 'none';
        //   btnManageFlashcard.forEach(button => {
        //     button.style.display = 'none';
        //   });
        //   btnUpdateDeck.forEach(button => {
        //     button.style.display = 'none';
        //   });
        //   menuClassroom.href = 'classroom_student';
        // }
        if (data.loggedIn) {
          if (data.role == 'Student') {
            menuClassroom.href = 'classroom_student';
            breadcrumbClassroom.href = 'classroom_student';
          } else if (data.role == 'Teacher') {
            btnCreateDeck.style.display = 'block';
            btnManageFlashcard.forEach(button => {
              button.style.display = 'block';
            });
            btnStatBoard.forEach(button => {
              button.style.display = 'block';
            });
            btnUpdateDeck.forEach(button => {
              button.style.display = 'block';
            });
            menuClassroom.href = 'classroom?name=' + usernName;
            breadcrumbClassroom.href = 'classroom?name=' + usernName;
          }
        } else {
          window.location = 'login';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  })
  .catch(err => console.log(err))

// Function Check Flashcard == Quiz หรือเปล่า
function compareFlashcardAndQuiz(deckId) {
  fetch('/api/deck/compareflashcardAndQuiz/' + deckId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(data => {
      const deckIdEncode = btoa(deckId);
      const msg = data.message;
      console.log(msg)
      if (msg == "Success") {
        window.location = "flashcard?deck=" + deckIdEncode;
      } else if (msg == "กรุณาสร้าง Quiz ให้เท่ากับจำนวนของ Flashcard") {
        Swal.fire({
          title: msg,
          icon: "warning",
        })
      } else {
        Swal.fire({
          title: msg,
          icon: "warning",
        })
      }
    })
    .catch(err => console.log(err))
}


function btncreatedeck(id) {
  const inputShowClassroomID = document.getElementById("deckID");
  inputShowClassroomID.value = id;
}

// Funtion get ข้อมูลมาแสดงในหน้า popup update
function btnupdatedeck(id) {
  const inputShowClassroomID = document.getElementById("deckID");
  inputShowClassroomID.value = id;

  fetch('/api/deck/getById/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(data => {
      const namedeck = document.getElementById("updatenamedeck");
      namedeck.value = data.deck_name;
    })
    .catch(err => console.log(err))
}

// DELETE DECK
function btndeletedeck() {
  const DeckID = document.getElementById("deckID").value;
  Swal.fire({
    title: "คุณแน่ใจหรือไม่?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "ใช่, ลบเลย!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch('/api/deck/' + DeckID, {
        method: 'DELETE',
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
            document.location = "deck?classroom=" + encodedId;
          });
        })
        .catch(err => console.log(err))
    }
  });
}

// Funtion ให้ตัวแรกเป็นตัวใหญ่
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// UPDATE DECK
const formupdatedeck = document.getElementById("updatedecks");
formupdatedeck.addEventListener("submit", (e) => {
  e.preventDefault();
  const DeckID = document.getElementById("deckID").value;
  const getNameDeck = document.getElementById("updatenamedeck").value;
  const namedeck = getNameDeck;
  const teacherids = document.getElementById("updateteacherid").value;
  const adminids = document.getElementById("updateadminid").value;

  fetch('/api/deck/' + DeckID, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "deck_name": namedeck,
    })
  })
    .then(response => console.log(response))
    .then(() => {
      // SweetAlert
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Update successfully"
      }).then(() => {
        document.location = "deck?classroom=" + encodedId;
      });
    })
    .catch(err => {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: err
      }).then(() => {
        document.location = "deck?classroom=" + encodedId;
      });
    })
  // document.getElementById("nameroom").value = "";
  // document.getElementById("description").value = "";
})

// Create Deck //
const createdeck = document.getElementById("createdeck");
createdeck.addEventListener("submit", (e) => {
  e.preventDefault();

  const deckname = document.getElementById("deckname").value;
  const teacherids = document.getElementById("teacherid").value;
  const adminids = document.getElementById("adminid").value;

  fetch('/api/deck', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "deck_name": deckname,
      "teacher_id": teacherids,
      "admin_id": adminids,
      "classroom_id": classroomID
    })
  })
    .then(response => console.log(response))
    .then(() => {
      // SweetAlert
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Create successfully"
      }).then(() => {
        window.location = "deck?classroom=" + encodedId;
      });
    })
    .catch(err => {
      // SweetAlert
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: err
      }).then(() => {
        window.location = "deck?classroom=" + encodedId;
      });
    })
  document.getElementById("deckname").value = "";
})
// ! End Deck