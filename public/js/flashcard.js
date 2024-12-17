const urlParams = new URLSearchParams(window.location.search);
const encodedId = urlParams.get('deck');
const deckID = atob(encodedId);
// console.log(deckID);
const classroomID = localStorage.getItem('classroomID');

// Get the deck ID from the URL
let counter = 0;
let i = 0;
let progressArray = [];

let progressArrayMaxLength = progressArray.length;
// console.log('progressArrayMaxLength', progressArrayMaxLength);

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

function updateProgressBar() {
  // หาความยาวของ progressArray
  const arrayLength = progressArray.length;

  // หาความคืบหน้าเป็นเปอร์เซ็นต์
  let percentage = ((progressArrayMaxLength - arrayLength) / progressArrayMaxLength) * 2;

  // กำหนดความกว้างของแถบความคืบหน้า
  const progressBar = document.querySelector('.progress-bar');
  progressBar.style.width = percentage + '%';

  progressBarPercentage = progressBar.style.width;
  console.log('progressBarPercentage', progressBarPercentage);
  localStorage.setItem('progressBarPercentage', progressBarPercentage);
}

async function getFlashcard(selectplay) {
  try {
    const response = await fetch('/api/deck/getById/' + deckID, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    const dataArray = [];

    data.flashcards.forEach(each => {
      dataArray.push(each);
      progressArray.push(each._id);
    });

    progressArrayMaxLength = progressArray.length;

    dataArray.sort((a, b) => a.stat - b.stat);

    // console.log('จำนวนการ์ดที่เลือกเล่น :', selectplay);
    if (selectplay < dataArray.length) {
      dataArray.splice(selectplay);
      progressArray.splice(selectplay);
    }

    // console.log('progressArray', progressArray);
    // console.log('ข้อมูลใน Flashcard:', dataArray);
    if (dataArray.length > 0) {
      let i = 0;
      const Item = dataArray[i];
      const decks = document.getElementById("innerhtmlflashcard");
      decks.innerHTML = '';
      const deckCol = document.createElement('div');
      deckCol.className = 'row  d-flex justify-content-center align-items-center text-center inline';
      deckCol.innerHTML = `
        <div>
            <a id="btnnextquestion" class="button btn btn-next" style="position: absolute; right: 0;margin-right: 1rem">
            <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512">
                <path
                    d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
            </svg><br>Next
            </a>
        </div>
        <div class="row" style="margin-top: -100px;">
            <div class="col-12">
                <h1 class="font-poppin" style="font-weight: Bold; padding-bottom: 1rem;"><ins> Question</ins></h1>
            </div>
            <pre class="d-flex justify-content-center text-start">
<code id="question" class="hljs">${Item.card_question}</code>
            </pre>
            <hr class="style">
        </div>
        <div class="row">
            <div class="col-md-12">
                <h1 class="font-poppin" style="font-weight: Bold; padding: 1rem 0;"><ins> Answer </ins></h1>
            </div>
            <div class="col-md-12">
                <pre class="d-flex justify-content-center text-start">
<code id="answer" class="hljs">${Item.card_answer}</code>
                </pre>
            </div>
        </div>
        `;
      decks.appendChild(deckCol);
      hljs.highlightAll();

      const btnquestion = document.getElementById("btnnextquestion");
      btnquestion.addEventListener("click", () => {
        const encodeId = btoa(deckID);
        if (i >= dataArray.length - 1) {
          console.log('Quiz');
          window.location.href = "quiz?deck=" + encodeId;
          return;
        } else {
          i++;
          const newItem = dataArray[i];

          const newQuestionElement = document.createElement('code');
          newQuestionElement.id = 'question';
          newQuestionElement.innerHTML = newItem.card_question;

          const newAnswerElement = document.createElement('code');
          newAnswerElement.id = 'answer';
          newAnswerElement.innerHTML = newItem.card_answer;

          const questionParent = document.getElementById('question').parentElement;
          const answerParent = document.getElementById('answer').parentElement;

          questionParent.replaceChild(newQuestionElement, document.getElementById('question'));
          answerParent.replaceChild(newAnswerElement, document.getElementById('answer'));

          hljs.highlightElement(newQuestionElement);
          hljs.highlightElement(newAnswerElement);
        }
      });

    } else {
      console.log('ไม่มีข้อมูลใน dataArray');
    }
  } catch (error) {
    console.log(error);
  }
}

const exitBtn = document.getElementById('exitBtn');
exitBtn.addEventListener('click', () => {
  window.location.href = "deck?classroom=" + btoa(classroomID);
});