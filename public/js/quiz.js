const urlParams = new URLSearchParams(window.location.search);
const encodedId = urlParams.get('deck');
const deckID = atob(encodedId);

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

// Get the deck ID from the URL
let counter = 0, play = 0, i = 0, q = 0, q1 = 0, q2 = 0, point = 0, countCorrect = 0, countWrong = 0, correctAnswer = 0, correctAnswer1 = 0, correctAnswer2 = 0;
let correctAnswersArr = [], correctAnswersArr1 = [], wrongAnswers = [], wrongAnswers1 = [], wrongAnswers2 = [];
let answerStats = {};
let flashcardTotalPlayed = {};
let flashcardCorrect = {};
let flashcardWrong = {};
let selectedAnswer = null;
let sec = 30;
const studentId = localStorage.getItem('studentId');

$step = 1;
$loops = Math.round(100 / $step);
$increment = 360 / $loops;
$half = Math.round($loops / 2);
$barColor = '#343583';
$backColor = '#eff0fe';

var clock = {
    interval: null,
    init: function () {
        $('.input-btn').click(function () {
            switch ($(this).data('action')) {
                case 'start':
                    clock.stop();
                    clock.start();
                    break;
                case 'stop':
                    clock.stop();
                    break;
            }
        });
    },
    start: function (dataArray, Quizdata, Quizdata2, Quizdata3) {
        var pie = 0;
        var num = 0;
        var min = 0.50; // กำหนดให้นับถอยหลังเริ่มต้นทันทีและใช้ค่าเวลานับถอยหลังเป็น 1 นาที 0.25
        var sec = min * 60;
        var lop = sec;
        $('.count').text(min);
        if (min > 0) {
            $('.count').addClass('min')
        } else {
            $('.count').addClass('sec')
        }
        clock.interval = setInterval(function () {
            sec = sec - 1;

            if (min > 1) {
                pie = pie + (100 / (lop / min));
            } else {
                pie = pie + (100 / (lop));
            }
            if (pie >= 101) {
                pie = 1;
            }
            num = (sec / 60).toFixed(2).slice(0, -3);
            if (num == 0) {
                $('.count').removeClass('min').addClass('sec').text(sec);
            } else {
                $('.count').removeClass('sec').addClass('min').text(num);
            }
            $i = (pie.toFixed(2).slice(0, -3)) - 1;
            if ($i < $half) {
                $nextdeg = (90 + ($increment * $i)) + 'deg';
                $('.clock').css({ 'background-image': 'linear-gradient(90deg,' + $backColor + ' 50%,transparent 50%,transparent),linear-gradient(' + $nextdeg + ',' + $barColor + ' 50%,' + $backColor + ' 50%,' + $backColor + ')' });
            } else {
                $nextdeg = (-90 + ($increment * ($i - $half))) + 'deg';
                $('.clock').css({ 'background-image': 'linear-gradient(' + $nextdeg + ',' + $barColor + ' 50%,transparent 50%,transparent),linear-gradient(270deg,' + $barColor + ' 50%,' + $backColor + ' 50%,' + $backColor + ')' });
            }
            if (sec == 10) {
                playAudio();
            }
            if (sec == 0) {
                clearInterval(clock.interval);
                $('.count').text(0);
                //$('.clock').removeAttr('class','clock pro-100');
                $('.clock').removeAttr('style');


                if (dataArray != null) {
                    selectedAnswer = true;
                    const answerCorrect = dataArray.quiz_answerCorrect;
                    const correctButton = document.getElementById('btnChoice1').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice1') :
                        document.getElementById('btnChoice2').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice2') :
                            document.getElementById('btnChoice3').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice3') :
                                document.getElementById('btnChoice4').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice4') : null;

                    if (correctButton) {
                        correctButton.classList.add('btn-success');
                        for (let i = 1; i <= 4; i++) {
                            const btnChoice = document.getElementById(`btnChoice${i}`);
                            btnChoice.disabled = true;
                        }
                        document.getElementById('btnnextquiz').disabled = false;
                    }

                    wrongAnswers.push(dataArray);
                    // console.log('คำตอบผิด!');
                    point--;
                    countWrong++;
                    if (answerStats[dataArray.flashcard_id] === undefined) {
                        answerStats[dataArray.flashcard_id] = -1;
                    } else {
                        answerStats[dataArray.flashcard_id]--;
                    }
                    // console.log(answerStats);

                    if (flashcardTotalPlayed[dataArray.flashcard_id] === undefined) {
                        flashcardTotalPlayed[dataArray.flashcard_id] = +1;
                    } else {
                        flashcardTotalPlayed[dataArray.flashcard_id]++;
                    }
                    console.log('Flashcard Total Played:', flashcardTotalPlayed);

                    if (flashcardWrong[dataArray.flashcard_id] === undefined) {
                        flashcardWrong[dataArray.flashcard_id] = +1;
                    } else {
                        flashcardWrong[dataArray.flashcard_id]++;
                    }

                    console.log('Flashcard Wrong:', flashcardWrong);
                    showPopup()
                }
                else if (Quizdata != null) {
                    selectedAnswer = true;
                    const answerCorrect = Quizdata.quiz_answerCorrect;
                    const correctButton = document.getElementById('btnChoice1').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice1') :
                        document.getElementById('btnChoice2').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice2') :
                            document.getElementById('btnChoice3').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice3') :
                                document.getElementById('btnChoice4').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice4') : null;

                    if (correctButton) {
                        correctButton.classList.add('btn-success');
                        for (let i = 1; i <= 4; i++) {
                            const btnChoice = document.getElementById(`btnChoice${i}`);
                            btnChoice.disabled = true;
                        }
                        document.getElementById('btnnextquiz').disabled = false;
                    }

                    wrongAnswers1.push(Quizdata);
                    // console.log('คำตอบผิด!');
                    point--;
                    countWrong++;
                    if (answerStats[Quizdata.flashcard_id] === undefined) {
                        answerStats[Quizdata.flashcard_id] = -1;
                    } else {
                        answerStats[Quizdata.flashcard_id]--;
                    }
                    console.log(answerStats);

                    if (flashcardTotalPlayed[dataArray.flashcard_id] === undefined) {
                        flashcardTotalPlayed[dataArray.flashcard_id] = +1;
                    } else {
                        flashcardTotalPlayed[dataArray.flashcard_id]++;
                    }
                    console.log('Flashcard Total Played:', flashcardTotalPlayed);

                    if (flashcardWrong[dataArray.flashcard_id] === undefined) {
                        flashcardWrong[dataArray.flashcard_id] = +1;
                    } else {
                        flashcardWrong[dataArray.flashcard_id]++;
                    }

                    console.log('Flashcard Wrong:', flashcardWrong);
                    showPopup()
                }
                else if (Quizdata2 != null) {
                    selectedAnswer = true;
                    const answerCorrect = Quizdata2.quiz_answerCorrect;
                    const correctButton = document.getElementById('btnChoice1').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice1') :
                        document.getElementById('btnChoice2').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice2') :
                            document.getElementById('btnChoice3').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice3') :
                                document.getElementById('btnChoice4').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice4') : null;

                    if (correctButton) {
                        correctButton.classList.add('btn-success');
                        for (let i = 1; i <= 4; i++) {
                            const btnChoice = document.getElementById(`btnChoice${i}`);
                            btnChoice.disabled = true;
                        }
                        document.getElementById('btnnextquiz').disabled = false;
                    }

                    wrongAnswers2.push(Quizdata2);
                    // console.log('คำตอบผิด!');
                    point--;
                    countWrong++;
                    if (answerStats[Quizdata2.flashcard_id] === undefined) {
                        answerStats[Quizdata2.flashcard_id] = -1;
                    } else {
                        answerStats[Quizdata2.flashcard_id]--;
                    }
                    // console.log(answerStats);

                    if (flashcardTotalPlayed[dataArray.flashcard_id] === undefined) {
                        flashcardTotalPlayed[dataArray.flashcard_id] = +1;
                    } else {
                        flashcardTotalPlayed[dataArray.flashcard_id]++;
                    }
                    console.log('Flashcard Total Played:', flashcardTotalPlayed);

                    if (flashcardWrong[dataArray.flashcard_id] === undefined) {
                        flashcardWrong[dataArray.flashcard_id] = +1;
                    } else {
                        flashcardWrong[dataArray.flashcard_id]++;
                    }

                    console.log('Flashcard Wrong:', flashcardWrong);
                    showPopup()
                }
                else if (Quizdata3 != null) {
                    selectedAnswer = true;
                    const answerCorrect = Quizdata3.quiz_answerCorrect;
                    const correctButton = document.getElementById('btnChoice1').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice1') :
                        document.getElementById('btnChoice2').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice2') :
                            document.getElementById('btnChoice3').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice3') :
                                document.getElementById('btnChoice4').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice4') : null;

                    if (correctButton) {
                        correctButton.classList.add('btn-success');
                        for (let i = 1; i <= 4; i++) {
                            const btnChoice = document.getElementById(`btnChoice${i}`);
                            btnChoice.disabled = true;
                        }
                        document.getElementById('btnnextquiz').disabled = false;
                    }

                    wrongAnswers2.push(Quizdata3);
                    // console.log('คำตอบผิด!');
                    point--;
                    countWrong++;
                    if (answerStats[Quizdata3.flashcard_id] === undefined) {
                        answerStats[Quizdata3.flashcard_id] = -1;
                    } else {
                        answerStats[Quizdata3.flashcard_id]--;
                    }
                    console.log(answerStats);

                    // Flashcard Total Played
                    if (flashcardTotalPlayed[dataArray.flashcard_id] === undefined) {
                        flashcardTotalPlayed[dataArray.flashcard_id] = +1;
                    } else {
                        flashcardTotalPlayed[dataArray.flashcard_id]++;
                    }
                    console.log('Flashcard Total Played:', flashcardTotalPlayed);
                    
                    // Wrong Answer
                    if (flashcardWrong[dataArray.flashcard_id] === undefined) {
                        flashcardWrong[dataArray.flashcard_id] = +1;
                    } else {
                        flashcardWrong[dataArray.flashcard_id]++;
                    }

                    console.log('Flashcard Wrong:', flashcardWrong);
                    showPopup()
                }

            }
        }, 1000);
    },
    stop: function () {
        clearInterval(clock.interval);
        $('.count').text(0);
        $('.clock').removeAttr('style');
    }
};

function startCountdown(dataArray, Quizdata, Quizdata2, Quizdata3) {
    if (sec > 0) {
        clock.start(dataArray, Quizdata, Quizdata2, Quizdata3);
    } else {
        
    }
}



function curclecshowscore_main(point, countCorrect, countWrong) {
    point = Math.max(0, point);
    let circularProgress = document.querySelector(".circular-progress"),
        progressValue = document.querySelector(".progress-value");
    let progressStartValue = 0,
        progressEndValue = point,
        speed = 100;
    let max = countCorrect + countWrong;
    let maxdone = 360 / max;
    let progress = setInterval(() => {
        if (progressEndValue <= 0) {
            progressStartValue--;
            clearInterval(progress);
        }
        progressStartValue++;
        progressValue.textContent = `${point}`;
        circularProgress.style.background = `conic-gradient(#3c0881 ${progressStartValue * maxdone}deg, #dddddd 0deg)`;
        if (progressStartValue == progressEndValue) {
            clearInterval(progress);
        }
    }, speed);
}

function curclecshowscore_correct(countCorrect, countWrong) {
    let circularProgress = document.querySelector(".circular-progress-correct"),
        progressValue = document.querySelector(".progress-value-correct");
    let progressStartValue = 0,
        progressEndValue = countCorrect,
        speed = 100;
    let max = countCorrect + countWrong;
    let maxdone = 360 / max;

    let progress = setInterval(() => {
        if (progressEndValue <= 0) {
            progressStartValue--;
            clearInterval(progress);
        }
        progressStartValue++;
        progressValue.textContent = `${progressStartValue}`
        circularProgress.style.background = `conic-gradient(#15db67 ${progressStartValue * maxdone}deg, #dddddd 0deg)`
        if (progressStartValue == progressEndValue) {
            clearInterval(progress);
        }
    }, speed);
}

function curclecshowscore_wrong(countWrong, countCorrect) {
    let circularProgress = document.querySelector(".circular-progress-wrong"),
        progressValue = document.querySelector(".progress-value-wrong");
    let progressStartValue = 0,
        progressEndValue = countWrong,
        speed = 100;
    let max = countCorrect + countWrong;
    let maxdone = 360 / max;

    let progress = setInterval(() => {
        if (progressEndValue <= 0) {
            progressStartValue--;
            clearInterval(progress);
        }
        progressStartValue++;
        progressValue.textContent = `${countWrong}`
        circularProgress.style.background = `conic-gradient(#fc7317 ${progressStartValue * maxdone}deg, #dddddd 0deg)`
        if (progressStartValue == progressEndValue) {
            clearInterval(progress);
        }
    }, speed);
}

function showPopup() {
    var popupContainer = document.getElementById('popupContainer');
    var popup = document.getElementById('popup');
    popupContainer.style.display = 'flex'; // แสดง popupContainer
    popup.style.opacity = '1'; // แสดง popup
    anime.remove('.ml15 .word'); // รีเซ็ตสถานะของ animation ก่อนที่จะเริ่มใหม่
    var animation = anime.timeline({ loop: false })
        .add({
            targets: '.ml15 .word',
            scale: [14, 1],
            opacity: [0, 1],
            easing: "easeOutCirc",
            duration: 600,
            delay: (el, i) => 400 * i
        }).add({
            targets: '.ml15',
            opacity: 0,
            duration: 250,
            easing: "easeOutExpo",
            delay: 500,
            complete: function () {
                popupContainer.style.display = 'none'; // ซ่อน popupContainer เมื่อ animation เสร็จสิ้น
            }
        });
    animation.play(); // เริ่มเล่น animation
}

// Function Play Audio
function playAudio() {
    const audio = document.getElementById("audio");
    audio.volume = 0.2;
    audio.play();

}

function playAudioStop() {
    const audio = document.getElementById("audio");
    audio.volume = 0.2;
    audio.pause();
    audio.currentTime = 0;
}

// ! Progress Bar
let numberOfData = 0;
let progressArray = [];
let totalIncrement = 0;

var playcard = localStorage.getItem('selectedPlay');
// console.log(playcard);

const exitBtn = document.getElementById('exitBtn');
exitBtn.addEventListener('click', () => {
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = '100%';
    displayScore(point, countCorrect, countWrong);
    playAudioStop();
    clock.stop();
});

function updateProgressBar() {
    // console.log('progressArray', progressArray)
    // อ่านค่าจาก localStorage
    let storedPercentage = localStorage.getItem('progressPercentage');

    // แปลงค่าที่อ่านได้เป็นตัวเลข
    storedPercentage = storedPercentage ? Number(storedPercentage) : 0

    // หาความยาวของ progressArray
    const arrayLength = progressArray.length;
    progressArrayMaxLength = progressArray.length + wrongAnswers.length + wrongAnswers1.length + wrongAnswers2.length + correctAnswersArr.length + correctAnswersArr1.length;

    // หาความคืบหน้าเป็นเปอร์เซ็นต์
    let percentage = ((progressArrayMaxLength - arrayLength) / progressArrayMaxLength) * 100;

    // เพิ่มความคืบหน้าจากค่าที่อ่านได้จาก localStorage
    percentage += storedPercentage;
    percentage += totalIncrement;

    // กำหนดความกว้างของแถบความคืบหน้า
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = percentage + '%';
}

fetch('/api/deck/getByIdQuiz/' + deckID, {
    method: 'get',
    headers: {
        'Content-Type': 'application/json'
    },
})
    .then(response => response.json())
    .then(data => {
        data.quizzes.sort((a, b) => a.stat - b.stat);
        const dataArray = [];

        // เพิ่มข้อมูลลงใน array ด้วย forEach
        data.quizzes.forEach(each => {
            dataArray.push(each);
            progressArray.push(each._id);
        });

        if (playcard < dataArray.length) {
            dataArray.splice(playcard); // ตัดตำแหน่งที่มากกว่า playcard ออก
            progressArray = progressArray.splice(playcard); // ตัดตำแหน่งที่มากกว่า playcard ออก
        }
        // console.log('dataArray 1', dataArray);

        startCountdown(dataArray[i], null);

        if (dataArray.length > 0) {
            const Item = dataArray[i];
            // console.log('Item', Item)
            const Choice = Item.quiz_choice;

            const decks = document.getElementById("innerhtmlQuiz");
            decks.innerHTML = '';
            decks.innerHTML = `
            <audio id="audio" src="js/Download.mp3" ></audio>
            <div id="popupContainer" style = "z-index: 1;">
                <div id="popup" class="ml15">
                    <span class="word">Time</span>
                    <span class="word">Out!</span>
                </div>
            </div>
            <div class="col-3" style="width: fit-content;">
                <div class="clock-wrap text-center" style="position: absolute;left: 0;margin-left:1rem">
                    <div class="clock pro-0">
                        <span class="count" style="color: #000000; font-family: 'Poppins', sans-serif ; font-weight: bolder; ">0</span>
                    </div>
                </div>
            </div>
            <div class="col-3" style="width: fit-content;">
                <a id="btnnextquiz" class="button btn btn-next" style="position: absolute;right: 0;margin-right:1rem">
                <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512">
                    <path
                        d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                </svg><br>Next
                </a>
            </div>
            <div class = "row quizQuestion">
                <pre class="col-12 d-flex justify-content-center text-start" style="margin-top: 5rem">
                    <code id="quiz" class="hljs font-question" style="font-weight: bolder;">${Item.quiz_question}</code>
                </pre>
            </div>
            <div class="row mb-5">
                <div class="col-12 col-md-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice1" onclick="checkAnswer('btnChoice1')"><i class="bi bi-1-square-fill"></i>
                        <pre class="d-flex text-start">
<code id="choice1" class="hljs text-choice">${Choice[0]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-12 col-md-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice2" onclick="checkAnswer('btnChoice2')"><i class="bi bi-2-square-fill"></i>
                        <pre class="d-flex text-start">
<code id="choice2" class="hljs text-choice">${Choice[1]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-12 col-md-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice3" onclick="checkAnswer('btnChoice3')"><i class="bi bi-3-square-fill"></i>
                        <pre class="d-flex text-start">
<code id="choice3" class="hljs text-choice">${Choice[2]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-12 col-md-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice4" onclick="checkAnswer('btnChoice4')"><i class="bi bi-4-square-fill"></i>
                        <pre class="d-flex text-start">
<code id="choice4" class="hljs text-choice">${Choice[3]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
            </div>
        </div>
            `;
            // decks.appendChild(deckCol);
            hljs.highlightAll();

            const btnquiz = document.getElementById("btnnextquiz");
            btnquiz.addEventListener("click", () => {
                if (selectedAnswer === null) {
                    // ถ้ายังไม่ได้เลือกคำตอบให้เพิ่ม Animation ให้กับปุ่มที่ไม่ได้เลือก 
                    const btnWrappers = document.getElementsByClassName('btn-wrapper');
                    for (let i = 0; i < btnWrappers.length; i++) {
                        const btnWrapper = btnWrappers[i];
                        const button = btnWrapper.querySelector('button');
                        if (!button.classList.contains('btn-success') && !button.classList.contains('btn-danger')) {
                            btnWrapper.classList.add('animate__bounceIn');
                            setTimeout(() => {
                                btnWrapper.classList.remove('animate__bounceIn');
                            }, 500);
                        }
                    }
                    return;
                }
                if (i >= dataArray.length - 1) {
                    if (wrongAnswers.length > 0) {
                        wrongAnswers.push(...correctAnswersArr);
                        callbackwrongAnswers(wrongAnswers);
                    } else {
                        // progressbar
                        const progressBar = document.querySelector('.progress-bar');
                        progressBar.style.width = '100%';

                        // alert('Finish');
                        displayScore(point, countCorrect, countWrong);
                        return;
                    }
                } else {
                    i++;
                    correctAnswer++;
                    clock.start(dataArray[i]);
                    const newItem = dataArray[i];
                    const Choice = newItem.quiz_choice;

                    const newQuizElement = document.createElement('code');
                    newQuizElement.style = 'font-weight: bolder;';
                    newQuizElement.id = 'quiz';
                    newQuizElement.classList = 'font-question';
                    newQuizElement.innerHTML = newItem.quiz_question;

                    const newChoiceElement1 = document.createElement('code');
                    newChoiceElement1.id = 'choice1';
                    newChoiceElement1.classList = 'text-choice';
                    newChoiceElement1.innerHTML = Choice[0];

                    const newChoiceElement2 = document.createElement('code');
                    newChoiceElement2.id = 'choice2';
                    newChoiceElement2.classList = 'text-choice';
                    newChoiceElement2.innerHTML = Choice[1];

                    const newChoiceElement3 = document.createElement('code');
                    newChoiceElement3.id = 'choice3';
                    newChoiceElement3.classList = 'text-choice';
                    newChoiceElement3.innerHTML = Choice[2];

                    const newChoiceElement4 = document.createElement('code');
                    newChoiceElement4.id = 'choice4';
                    newChoiceElement4.classList = 'text-choice';
                    newChoiceElement4.innerHTML = Choice[3];

                    const quizParent = document.getElementById('quiz').parentElement;
                    const choiceParent1 = document.getElementById('choice1').parentElement;
                    const choiceParent2 = document.getElementById('choice2').parentElement;
                    const choiceParent3 = document.getElementById('choice3').parentElement;
                    const choiceParent4 = document.getElementById('choice4').parentElement;

                    quizParent.replaceChild(newQuizElement, document.getElementById('quiz'));
                    choiceParent1.replaceChild(newChoiceElement1, document.getElementById('choice1'));
                    choiceParent2.replaceChild(newChoiceElement2, document.getElementById('choice2'));
                    choiceParent3.replaceChild(newChoiceElement3, document.getElementById('choice3'));
                    choiceParent4.replaceChild(newChoiceElement4, document.getElementById('choice4'));

                    hljs.highlightElement(newQuizElement);
                    hljs.highlightElement(newChoiceElement1);
                    hljs.highlightElement(newChoiceElement2);
                    hljs.highlightElement(newChoiceElement3);
                    hljs.highlightElement(newChoiceElement4);
                    // Clear class btn active
                    for (let j = 0; j <= 4; j++) {
                        const btnChoice = document.getElementById(`btnChoice${j}`);
                        if (btnChoice) {
                            if (btnChoice.classList.contains('btn')) {
                                btnChoice.classList.remove('active');
                                btnChoice.classList.remove('btn-success');
                                btnChoice.classList.remove('btn-danger');
                                btnChoice.disabled = false;

                            }
                        }

                    }
                }
                selectedAnswer = null;
            });
        } else {
            console.log('ไม่มีข้อมูลใน dataArray');
        }
    })
    .catch(err => console.log(err));

function callbackwrongAnswers(wrongAnswers) {
    const wrongFlashcardIds = wrongAnswers.map(wrongAnswer => wrongAnswer.flashcard_id);

    let currentIndex = 0;
    let currentIndexQuiz = 0;
    const decks = document.getElementById("innerhtmlQuiz");

    function displayNextFlashcard() {
        if (currentIndex < wrongFlashcardIds.length) {
            const currentFlashcardId = wrongFlashcardIds[currentIndex];

            fetch('/projectsenior/flashcard/getByIds/' + currentFlashcardId, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => {
                    displayFlashcard(data);

                    currentIndex++;
                })
                .catch(err => console.log(err));
        } else {
            // console.log('ไม่มีข้อมูลใน wrongAnswers แล้ว');
            displayNextQuiz(wrongAnswers);
        }
    }

    // wrongQuiz
    function displayNextQuiz(wrongQuiz) {
        if (q >= wrongQuiz.length) {
            // หากถึงจุดสิ้นสุดของ array ข้อความที่ตอบผิดจะถูกแสดง
            if (wrongAnswers1.length > 0) {
                // นำ correctAnswersArr1 ไปต่อท้าย wrongAnswers
                wrongAnswers1.push(...correctAnswersArr1);
                callbackwrongAnswers2(wrongAnswers1);
            } else {
                const progressBar = document.querySelector('.progress-bar');
                progressBar.style.width = '100%';
                // alert('Finish');
                displayScore(point, countCorrect, countWrong);
                return;
            }
        } else {
            const Item = wrongQuiz[q];
            // console.log(q);
            displayQuiz(Item);

        }
    }

    // wrongQuiz
    function displayQuiz(Quizdata) {
        selectedAnswer = null;
        startCountdown(null, Quizdata);
        const decks = document.getElementById("innerhtmlQuiz");
        decks.innerHTML = '';
        decks.innerHTML = `
            <audio id="audio" src="js/Download.mp3" ></audio>
            <div id="popupContainer" style = "z-index: 1;">
                <div id="popup" class="ml15">
                    <span class="word">Time</span>
                    <span class="word">Out!</span>
                </div>
            </div>
            <div class="col-3" style="width: fit-content;">
                <div class="clock-wrap text-center" style="position: absolute;left: 0;margin-left:1rem">
                    <div class="clock pro-0">
                        <span class="count" style="color: #000000; font-family: 'Poppins', sans-serif ; font-weight: bolder; ">0</span>
                    </div>
                </div>
            </div>
            <div class="col-3" style="width: fit-content;">
                <a id="btnnextquiz" class="button btn btn-next" style="position: absolute;right: 0;margin-right:1rem">
                <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512">
                    <path
                        d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                </svg><br>Next
                </a>
            </div>
            <div class = "row quizQuestion">
                <pre class="col-12 d-flex justify-content-center text-start" style="margin-top: 5rem">
                    <code id="quiz" class="hljs font-question" font-weight: bolder;">${Quizdata.quiz_question}</code>
                </pre>
            </div>
            <div class="row mb-5">
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice1" onclick="checkAnswersWrongAnswer('btnChoice1', '${Quizdata._id}')"><i class="bi bi-1-square-fill"></i>
                        <pre class="d-flex text-start">
<code id="choice1" class="hljs text-choice">${Quizdata.quiz_choice[0]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice2" onclick="checkAnswersWrongAnswer('btnChoice2','${Quizdata._id}')"><i class="bi bi-2-square-fill"></i>
                        <pre class="d-flex text-start">
<code id="choice2" class="hljs text-choice">${Quizdata.quiz_choice[1]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice3" onclick="checkAnswersWrongAnswer('btnChoice3','${Quizdata._id}')"><i class="bi bi-3-square-fill"></i>
                        <pre class="d-flex text-start">
<code id="choice3" class="hljs text-choice">${Quizdata.quiz_choice[2]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice4" onclick="checkAnswersWrongAnswer('btnChoice4','${Quizdata._id}')"><i class="bi bi-4-square-fill"></i>
                        <pre class="d-flex text-start">
<code id="choice4" class="hljs text-choice">${Quizdata.quiz_choice[3]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
            </div>
        </div>
            `;
        hljs.highlightAll();

        const btnquiz = document.getElementById("btnnextquiz");
        btnquiz.addEventListener("click", () => {
            // ตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
            if (checkAnswerSelected()) {
                q++;
                displayNextQuiz(wrongAnswers);
            } else {
                const btnWrappers = document.getElementsByClassName('btn-wrapper');
                for (let i = 0; i < btnWrappers.length; i++) {
                    const btnWrapper = btnWrappers[i];
                    const button = btnWrapper.querySelector('button');
                    if (!button.classList.contains('btn-success') && !button.classList.contains('btn-danger')) {
                        btnWrapper.classList.add('animate__bounceIn');
                        setTimeout(() => {
                            btnWrapper.classList.remove('animate__bounceIn');
                        }, 500);
                    }
                }
            }
        });

        // เพิ่ม event listener ให้กับปุ่ม Choice เพื่อตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
        const choices = document.querySelectorAll(".answer-block button");
        choices.forEach(choice => {
            choice.addEventListener("click", () => {
                selectedAnswer = true; // เมื่อผู้ใช้เลือกคำตอบแล้วกำหนดค่า selectedAnswer เป็น true
            });
        });

        // เพิ่มฟังก์ชันตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
        function checkAnswerSelected() {
            // ตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
            return selectedAnswer;
        }
    }

    function displayFlashcard(flashcardData) {
        // สร้าง HTML เพื่อแสดง Flashcard
        decks.innerHTML = '';
        decks.innerHTML = `
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
<code id="question" class="hljs">${flashcardData.card_question}</code>
            </pre>
            <hr class="style">
        </div>
        <div class="row">
            <div class="col-md-12">
                <h1 class="font-poppin" style="font-weight: Bold; padding: 1rem 0;"><ins> Answer </ins></h1>
            </div>
            <div class="col-md-12">
                <pre class="d-flex justify-content-center text-start">
<code id="answer" class="hljs">${flashcardData.card_answer}</code>
                </pre>
            </div>
        </div>
            `;
        hljs.highlightAll();

        // เพิ่ม event listener ให้กับปุ่ม Next
        const btnNextQuestion = document.getElementById("btnnextquestion");
        btnNextQuestion.addEventListener("click", () => {
            displayNextFlashcard();
        });
    }

    // แสดง flashcard แรก
    displayNextFlashcard();
}

function checkAnswer(buttonId) {
    selectedAnswer = buttonId;
    fetch('/api/deck/getByIdQuiz/' + deckID, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            // console.log('Check Answer', data.quizzes)
            const dataArray = data.quizzes;
            dataArray.sort((a, b) => a.stat - b.stat);

            if (playcard < dataArray.length) {
                dataArray.splice(playcard);
            }

            // console.log('dataArray 2', dataArray)
            const item = dataArray[correctAnswer];
            const answerCorrect = item.quiz_answerCorrect;
            // console.log('คำตอบที่ถูกต้องคือ:', answerCorrect);
            // เลือกคำตอบที่ผู้ใช้เลือก
            const selectedChoice = document.getElementById(buttonId).querySelector('code').textContent;
            if (selectedChoice === answerCorrect) {
                // ! ProgressBar Calculate
                const progressBar = document.querySelector('.progress-bar');
                numberOfData = dataArray.length;
                let currentWidth = parseFloat(progressBar.style.width);
                const progress = (25 / numberOfData);
                currentWidth += progress;
                totalIncrement += progress;
                progressBar.style.width = currentWidth + '%';

                correctAnswersArr.push(item);
                // console.log('คำตอบถูกต้อง!');
                point += 5;
                countCorrect++;
                clock.stop();
                playAudioStop()
                if (answerStats[item.flashcard_id] === undefined) {
                    answerStats[item.flashcard_id] = 1;
                } else {
                    answerStats[item.flashcard_id]++;
                }
                console.log(answerStats);

                // ! Flashcard Stats
                // Correct Answer
                if (flashcardTotalPlayed[item.flashcard_id] === undefined) {
                    flashcardTotalPlayed[item.flashcard_id] = 1;
                } else {
                    flashcardTotalPlayed[item.flashcard_id]++;
                }
                console.log('Flashcard Total Played:', flashcardTotalPlayed);

                // Correct Answer
                if (flashcardCorrect[item.flashcard_id] === undefined) {
                    flashcardCorrect[item.flashcard_id] = 1;
                } else {
                    flashcardCorrect[item.flashcard_id]++;
                }

                console.log('Flashcard Correct:', flashcardCorrect);

                // ทำอะไรก็ตามที่ต้องการเมื่อเลือกคำตอบถูกต้อง
                document.getElementById(buttonId).classList.add('btn-success');
                document.getElementById(buttonId).classList.add('active');
                for (let i = 1; i <= 4; i++) {
                    const btnChoice = document.getElementById(`btnChoice${i}`);
                    btnChoice.disabled = true;
                }

            } else {
                const progressBar = document.querySelector('.progress-bar');
                const numberOfData = dataArray.length;
                let currentWidth = parseFloat(progressBar.style.width);
                const progress = (25 / numberOfData);
                currentWidth += progress;
                totalIncrement += progress;
                progressBar.style.width = currentWidth + '%';

                wrongAnswers.push(item);
                point -= 0.5;
                countWrong++;
                clock.stop();
                playAudioStop()
                if (answerStats[item.flashcard_id] === undefined) {
                    answerStats[item.flashcard_id] = -1;
                } else {
                    answerStats[item.flashcard_id]--;
                }
                console.log(answerStats);

                // ! Flashcard Stats
                // Flashcard Total Played
                if (flashcardTotalPlayed[item.flashcard_id] === undefined) {
                    flashcardTotalPlayed[item.flashcard_id] = 1;
                } else {
                    flashcardTotalPlayed[item.flashcard_id]++;
                }

                console.log('Flashcard Total Played:', flashcardTotalPlayed);

                // Wrong Answer
                if (flashcardWrong[item.flashcard_id] === undefined) {
                    flashcardWrong[item.flashcard_id] = 1;
                } else {
                    flashcardWrong[item.flashcard_id]++;
                }

                console.log('Flashcard Wrong:', flashcardWrong);

                document.getElementById(buttonId).classList.add('btn-danger');
                document.getElementById(buttonId).classList.add('active');
                // เพิ่มคลาส 'btn-success' ให้กับปุ่มที่เป็นคำตอบที่ถูกต้อง
                const correctButton = document.getElementById('btnChoice1').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice1') :
                    document.getElementById('btnChoice2').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice2') :
                        document.getElementById('btnChoice3').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice3') :
                            document.getElementById('btnChoice4').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice4') : null;

                if (correctButton) {
                    correctButton.classList.add('btn-success');
                    for (let i = 1; i <= 4; i++) {
                        const btnChoice = document.getElementById(`btnChoice${i}`);
                        btnChoice.disabled = true;
                    }
                    document.getElementById('btnnextquiz').disabled = false;
                }
            }

            answered = true;
        })
        .catch(err => console.log(err));
}

function checkAnswersWrongAnswer(buttonId, Quizdata) {
    selectedAnswer = buttonId;
    fetch('/projectsenior/quiz/getById/' + Quizdata, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            const answerCorrect = data.quiz_answerCorrect;
            const selectedChoice = document.getElementById(buttonId).querySelector('code').textContent;
            if (selectedChoice === answerCorrect) {
                // ! ProgressBar
                const progressBar = document.querySelector('.progress-bar');
                let currentWidth = parseFloat(progressBar.style.width);
                const progress = (25 / wrongAnswers.length);
                currentWidth += progress;
                totalIncrement += progress;
                progressBar.style.width = currentWidth + '%';

                point += 2.5;
                countCorrect++;
                clock.stop();
                playAudioStop()
                if (answerStats[data.flashcard_id] === undefined) {
                    answerStats[data.flashcard_id] = 1;
                } else {
                    answerStats[data.flashcard_id]++;
                }
                console.log(answerStats);

                // ! Flashcard Stats
                // Flashcard Total Played
                if (flashcardTotalPlayed[data.flashcard_id] === undefined) {
                    flashcardTotalPlayed[data.flashcard_id] = 1;
                } else {
                    flashcardTotalPlayed[data.flashcard_id]++;
                }
                console.log('Flashcard Total Played:', flashcardTotalPlayed);

                // Correct Answer
                if (flashcardCorrect[data.flashcard_id] === undefined) {
                    flashcardCorrect[data.flashcard_id] = 1;
                } else {
                    flashcardCorrect[data.flashcard_id]++;
                }

                correctAnswersArr1.push(data);
                // console.log('correctAnswersArr : ', correctAnswersArr);
                document.getElementById(buttonId).classList.add('btn-success');
                document.getElementById(buttonId).classList.add('active');
                for (let i = 1; i <= 4; i++) {
                    const btnChoice = document.getElementById(`btnChoice${i}`);
                    btnChoice.disabled = true;
                }

            } else {
                // ! ProgressBar
                const progressBar = document.querySelector('.progress-bar');
                let currentWidth = parseFloat(progressBar.style.width);
                const progress = (25 / wrongAnswers.length);
                currentWidth += progress;
                totalIncrement += progress;
                progressBar.style.width = currentWidth + '%';

                wrongAnswers1.push(data);
                // console.log('คำตอบผิด!');
                point -= 0.5;
                countWrong++;
                clock.stop();
                playAudioStop()
                if (answerStats[data.flashcard_id] === undefined) {
                    answerStats[data.flashcard_id] = -1;
                } else {
                    answerStats[data.flashcard_id]--;
                }
                console.log(answerStats);

                // ! Flashcard Stats
                // Flashcard Total Played
                if (flashcardTotalPlayed[data.flashcard_id] === undefined) {
                    flashcardTotalPlayed[data.flashcard_id] = 1;
                } else {
                    flashcardTotalPlayed[data.flashcard_id]++;
                }

                console.log('Flashcard Total Played:', flashcardTotalPlayed);

                // Wrong Answer
                if (flashcardWrong[data.flashcard_id] === undefined) {
                    flashcardWrong[data.flashcard_id] = 1;
                } else {
                    flashcardWrong[data.flashcard_id]++;
                }

                console.log('Flashcard Wrong:', flashcardWrong);

                document.getElementById(buttonId).classList.add('btn-danger');
                document.getElementById(buttonId).classList.add('active');
                // เพิ่มคลาส 'btn-success' ให้กับปุ่มที่เป็นคำตอบที่ถูกต้อง
                const correctButton = document.getElementById('btnChoice1').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice1') :
                    document.getElementById('btnChoice2').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice2') :
                        document.getElementById('btnChoice3').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice3') :
                            document.getElementById('btnChoice4').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice4') : null;

                if (correctButton) {
                    correctButton.classList.add('btn-success');
                    for (let i = 1; i <= 4; i++) {
                        const btnChoice = document.getElementById(`btnChoice${i}`);
                        btnChoice.disabled = true;
                    }
                    document.getElementById('btnnextquiz').disabled = false;
                }
            }

            answered = true;
        })
        .catch(err => console.log(err));
}

async function displayScore(point, countCorrect, countWrong) {
    const score = document.getElementById("innerhtmlQuiz");
    score.innerHTML = '';
    const scoreCol = document.createElement('div');
    scoreCol.className = 'container';
    scoreCol.innerHTML = `
            <div class="row justify-content-end">
            <div class="col-3" style="width: fit-content;">
                <button id="btnNextdone" class="button btn btn-lg btn-next">
                    <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512">
                    <path
                        d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                    </svg><br>Next
                </button>
                </div>
            </div>
            <div class="row justify-content-center align-items-center text-center ">
                <div class="circular-progress">
                <span class="progress-value">0</span>
                </div>
            </div>
            <div class="text-center" id="text-center">
                <h1 class="font-poppin fw-bold" style="color: #939bb4;" >Your Score</h1>
                <div class="row justify-content-center align-items-center text-center p-lg-5">
                    <div class="col-6" >
                        <h2 class="font-poppin fw-bold" style="color: #17fc76;">Correct</h2>
                        <div class="row justify-content-center align-items-center text-center " style="margin-bottom: 0.5rem;">
                            <div class="circular-progress-correct">
                                <span class="progress-value-correct" >0</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-6" >
                        <h2 class="font-poppin fw-bold" style="color: #fc7317;">Wrong</h2>
                        <div class="row justify-content-center align-items-center text-center " style="margin-bottom: 0.5rem;">
                            <div class="circular-progress-wrong">
                                <span class="progress-value-wrong">0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    score.appendChild(scoreCol);

    const flashCard = document.querySelector(".flash-card");
    flashCard.style.background = "rgba(0, 0, 0, 0.2)";
    flashCard.style.backdropFilter = "blur(18px)";
    flashCard.style.webkitBackdropFilter = "blur(18px)";
    flashCard.style.borderRadius = "10px";
    flashCard.style.boxShadow = "rgba(240, 46, 170, 0.5) 0px 0px 0px 5px, rgba(240, 46, 170, 0.3) 0px 0px 0px  10px, rgba(240, 46, 170, 0.1) 0px 0px 0px 15px";

    curclecshowscore_main(point, countCorrect, countWrong);
    curclecshowscore_correct(countCorrect, countWrong);
    curclecshowscore_wrong(countWrong, countCorrect);

    // Api Update Stats
    try {
        const response = await fetch('/projectsenior/flashcard/stat', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answerStats)
        });
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.log(err);
    }

    // API Update Total Played
    try {
        const response = await fetch('/projectsenior/flashcard/totalPlayed', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flashcardTotalPlayed)
        });
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.log(err);
    }

    // API Update Correct Answer
    try {
        const response = await fetch('/projectsenior/flashcard/correct', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flashcardCorrect)
        });
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.log(err);
    }

    // API Update Wrong Answer
    try {
        const response = await fetch('/projectsenior/flashcard/wrong', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flashcardWrong)
        });
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.log(err);
    }

    // Api get deckID
    try {
        const response = await fetch('/api/deck/ById/' + deckID, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        const classroomID = data.classroom_id;
        const btnNextdone = document.getElementById("btnNextdone");
        btnNextdone.addEventListener("click", () => {
            window.location = "deck?classroom=" + btoa(classroomID);
        });
    } catch (err) {
        console.log(err);
    }

    try {
        const response = await fetch('/api/scoreboard/' + deckID, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "student_id": studentId,
                "score": point > 0 ? point : 0,
                "correctAnswers": countCorrect,
                "incorrectAnswers": countWrong
            })
        });
        const data = await response.json();
    } catch (error) {
        console.log(error);
    }
}


///////////////////////////////////////////////// WrongaAswerRound 2 ////////////////////////////////////////////////////////

function callbackwrongAnswers2(wrongAnswers1) {
    // สร้างอาร์เรย์เพื่อเก็บ flashcard_id ของคำถามที่ตอบผิด
    const wrongFlashcardIds = wrongAnswers1.map(wrongAnswers1 => wrongAnswers1.flashcard_id);
    // console.log(wrongFlashcardIds);

    let currentIndex = 0; // เพิ่มตัวแปรเพื่อเก็บ index ปัจจุบันของ wrongAnswers
    const decks = document.getElementById("innerhtmlQuiz");

    function displayNextFlashcard2() {
        if (currentIndex < wrongFlashcardIds.length) {
            const currentFlashcardId = wrongFlashcardIds[currentIndex];

            // ดึงข้อมูล Flashcards จากเซิร์ฟเวอร์โดยใช้ currentFlashcardId
            fetch('/projectsenior/flashcard/getByIds/' + currentFlashcardId, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => {
                    // แสดงข้อมูลของ flashcard
                    displayFlashcard2(data);

                    currentIndex++; // เพิ่ม index สำหรับการดึงข้อมูล flashcard ถัดไป
                })
                .catch(err => console.log(err));
        } else {
            // console.log('ไม่มีข้อมูลใน wrongAnswers แล้ว');
            displayNextQuiz2(wrongAnswers1);
        }
    }

    // wrongQuiz
    function displayNextQuiz2(wrongQuiz2) {

        if (q1 >= wrongQuiz2.length) {

            if (wrongAnswers1.length > 0) {
                callbackwrongAnswers3(wrongAnswers2);
            } else {
                const progressBar = document.querySelector('.progress-bar');
                progressBar.style.width = '100%';
                // alert('Finish');
                displayScore(point, countCorrect, countWrong);
                return;
            }

        } else {
            const Item = wrongQuiz2[q1];
            displayQuiz2(Item);

        }
    }

    // wrongQuiz
    function displayQuiz2(Quizdata2) {
        selectedAnswer = null;
        startCountdown(null, null, Quizdata2);
        const decks = document.getElementById("innerhtmlQuiz");
        decks.innerHTML = '';
        decks.innerHTML = `
            <audio id="audio" src="js/Download.mp3" ></audio>
            <div id="popupContainer" style = "z-index: 1;">
                <div id="popup" class="ml15">
                    <span class="word">Time</span>
                    <span class="word">Out!</span>
                </div>
            </div>
            <div class="col-3" style="width: fit-content;">
                <div class="clock-wrap text-center" style="position: absolute;left: 0;margin-left:1rem">
                    <div class="clock pro-0">
                        <span class="count" style="color: #000000; font-family: 'Poppins', sans-serif ; font-weight: bolder; ">0</span>
                    </div>
                </div>
            </div>
            <div class="col-3" style="width: fit-content;">
                <a id="btnnextquiz" class="button btn btn-next" style="position: absolute;right: 0;margin-right:1rem">
                <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512">
                    <path
                        d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                </svg><br>Next
                </a>
            </div>
            <div class = "row quizQuestion">
                <pre class="col-12 d-flex justify-content-center text-start" style="margin-top: 5rem">
                    <code id="quiz" class="hljs font-question" font-weight: bolder;">${Quizdata2.quiz_question}</code>
                </pre>
            </div>
            <div class="row mb-5">
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice1" onclick="checkAnswersWrongAnswer1('btnChoice1', '${Quizdata2._id}')"><i class="bi bi-1-square-fill"></i>
                        <pre class="d-flex text-start">
    <code id="choice1" class="hljs text-choice">${Quizdata2.quiz_choice[0]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice2" onclick="checkAnswersWrongAnswer1('btnChoice2','${Quizdata2._id}')"><i class="bi bi-2-square-fill"></i>
                        <pre class="d-flex text-start">
    <code id="choice2" class="hljs text-choice">${Quizdata2.quiz_choice[1]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice3" onclick="checkAnswersWrongAnswer1('btnChoice3','${Quizdata2._id}')"><i class="bi bi-3-square-fill"></i>
                        <pre class="d-flex text-start">
    <code id="choice3" class="hljs text-choice">${Quizdata2.quiz_choice[2]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice4" onclick="checkAnswersWrongAnswer1('btnChoice4','${Quizdata2._id}')"><i class="bi bi-4-square-fill"></i>
                        <pre class="d-flex text-start">
    <code id="choice4" class="hljs text-choice">${Quizdata2.quiz_choice[3]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
            </div>
        </div>
            `;
        hljs.highlightAll();

        const btnquiz = document.getElementById("btnnextquiz");
        btnquiz.addEventListener("click", () => {
            // ตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
            if (checkAnswerSelected()) {
                q1++;
                displayNextQuiz2(wrongAnswers1);
            } else {
                const btnWrappers = document.getElementsByClassName('btn-wrapper');
                for (let i = 0; i < btnWrappers.length; i++) {
                    const btnWrapper = btnWrappers[i];
                    const button = btnWrapper.querySelector('button');
                    if (!button.classList.contains('btn-success') && !button.classList.contains('btn-danger')) {
                        btnWrapper.classList.add('animate__bounceIn');
                        setTimeout(() => {
                            btnWrapper.classList.remove('animate__bounceIn');
                        }, 500);
                    }
                }
            }
        });

        // เพิ่ม event listener ให้กับปุ่ม Choice เพื่อตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
        const choices = document.querySelectorAll(".answer-block button");
        choices.forEach(choice => {
            choice.addEventListener("click", () => {
                selectedAnswer = true; // เมื่อผู้ใช้เลือกคำตอบแล้วกำหนดค่า selectedAnswer เป็น true
            });
        });

        // เพิ่มฟังก์ชันตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
        function checkAnswerSelected() {
            // ตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
            return selectedAnswer;
        }
    }

    function displayFlashcard2(flashcardData) {

        decks.innerHTML = '';
        decks.innerHTML = `
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
<code id="question" class="hljs">${flashcardData.card_question}</code>
            </pre>
            <hr class="style">
        </div>
        <div class="row">
            <div class="col-md-12">
                <h1 class="font-poppin" style="font-weight: Bold; padding: 1rem 0;"><ins> Answer </ins></h1>
            </div>
            <div class="col-md-12">
                <pre class="d-flex justify-content-center text-start">
<code id="answer" class="hljs">${flashcardData.card_answer}</code>
                </pre>
            </div>
        </div>
            `;
        hljs.highlightAll();

        // เพิ่ม event listener ให้กับปุ่ม Next
        const btnNextQuestion = document.getElementById("btnnextquestion");
        btnNextQuestion.addEventListener("click", () => {
            displayNextFlashcard2();
        });
    }

    // แสดง flashcard แรก
    displayNextFlashcard2();
}

function checkAnswersWrongAnswer1(buttonId, Quizdata) {

    fetch('/projectsenior/quiz/getById/' + Quizdata, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            const answerCorrect = data.quiz_answerCorrect;
            // console.log('คำตอบที่ถูกต้องคือ:', answerCorrect);

            // เลือกคำตอบที่ผู้ใช้เลือก
            const selectedChoice = document.getElementById(buttonId).querySelector('code').textContent;

            if (selectedChoice === answerCorrect) {
                
                const progressBar = document.querySelector('.progress-bar');
                let currentWidth = parseFloat(progressBar.style.width);
                const progress = (25 / wrongAnswers1.length);
                currentWidth += progress;
                totalIncrement += progress;
                progressBar.style.width = currentWidth + '%';

                point += 1;
                countCorrect++;
                clock.stop();
                playAudioStop()
                if (answerStats[data.flashcard_id] === undefined) {
                    answerStats[data.flashcard_id] = 1;
                } else {
                    answerStats[data.flashcard_id]++;
                }

                // ! Flashcard Stats
                // Flashcard Total Played
                if (flashcardTotalPlayed[data.flashcard_id] === undefined) {
                    flashcardTotalPlayed[data.flashcard_id] = 1;
                } else {
                    flashcardTotalPlayed[data.flashcard_id]++;
                }

                console.log('Total Played:', flashcardTotalPlayed);
                
                // Correct Answer
                if (flashcardCorrect[data.flashcard_id] === undefined) {
                    flashcardCorrect[data.flashcard_id] = 1;
                } else {
                    flashcardCorrect[data.flashcard_id]++;
                }

                console.log('Correct Answer:', flashcardCorrect);

                // ทำอะไรก็ตามที่ต้องการเมื่อเลือกคำตอบถูกต้อง
                document.getElementById(buttonId).classList.add('btn-success');
                document.getElementById(buttonId).classList.add('active');
                for (let i = 1; i <= 4; i++) {
                    const btnChoice = document.getElementById(`btnChoice${i}`);
                    btnChoice.disabled = true;
                }

            } else {
                // ! ProgressBar
                const progressBar = document.querySelector('.progress-bar');
                let currentWidth = parseFloat(progressBar.style.width);
                const progress = (25 / wrongAnswers1.length);
                currentWidth += progress;
                totalIncrement += progress;
                progressBar.style.width = currentWidth + '%';

                point -= 0.5;
                countWrong++;
                clock.stop();
                playAudioStop()
                if (answerStats[data.flashcard_id] === undefined) {
                    answerStats[data.flashcard_id] = -1;
                } else {
                    answerStats[data.flashcard_id]--;
                }

                // ! Flashcard Stats
                // Total Played
                if (flashcardTotalPlayed[data.flashcard_id] === undefined) {
                    flashcardTotalPlayed[data.flashcard_id] = 1;
                } else {
                    flashcardTotalPlayed[data.flashcard_id]++;
                }

                // Wrong Answer
                if (flashcardWrong[data.flashcard_id] === undefined) {
                    flashcardWrong[data.flashcard_id] = 1;
                } else {
                    flashcardWrong[data.flashcard_id]++;
                }

                wrongAnswers2.push(data);
                document.getElementById(buttonId).classList.add('btn-danger');
                document.getElementById(buttonId).classList.add('active');
                const correctButton = document.getElementById('btnChoice1').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice1') :
                    document.getElementById('btnChoice2').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice2') :
                        document.getElementById('btnChoice3').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice3') :
                            document.getElementById('btnChoice4').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice4') : null;

                if (correctButton) {
                    correctButton.classList.add('btn-success');
                    for (let i = 1; i <= 4; i++) {
                        const btnChoice = document.getElementById(`btnChoice${i}`);
                        btnChoice.disabled = true;
                    }
                    document.getElementById('btnnextquiz').disabled = false;
                }
            }

            answered = true;
        })
        .catch(err => console.log(err));
}

///////////////////////////////////////////////// WrongaAswerRound 3 ////////////////////////////////////////////////////////

function callbackwrongAnswers3(wrongAnswers2) {
    let wrongFlashcardIds = wrongAnswers2.map(wrongAnswers2 => wrongAnswers2.flashcard_id);
    // console.log("wrongFlashcardIds : ", wrongFlashcardIds);
    let currentIndex = 0;
    const decks = document.getElementById("innerhtmlQuiz");

    function displayNextFlashcard3() {
        wrongFlashcardIds = wrongAnswers2.map(wrongAnswers => wrongAnswers.flashcard_id);
        if (currentIndex < wrongFlashcardIds.length) {
            const currentFlashcardId = wrongFlashcardIds[currentIndex];

            fetch('/projectsenior/flashcard/getByIds/' + currentFlashcardId, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => {
                    displayFlashcard3(data);
                    currentIndex++;
                })
                .catch(err => console.log(err));
        } else {
            // console.log('ไม่มีข้อมูลใน wrongAnswers แล้ว');
            displayNextQuiz3(wrongAnswers2);
        }
    }

    // wrongQuiz
    function displayNextQuiz3(wrongQuiz3) {
        if (q2 >= wrongQuiz3.length) {
            const progressBar = document.querySelector('.progress-bar');
            progressBar.style.width = '100%';
            // alert('Finish');
            displayScore(point, countCorrect, countWrong);
            return;

        } else {
            const Item = wrongQuiz3[q2];
            displayQuiz3(Item);
        }
    }

    // wrongQuiz
    function displayQuiz3(Quizdata3) {
        selectedAnswer = null;
        startCountdown(null, null, null, Quizdata3);
        const decks = document.getElementById("innerhtmlQuiz");
        decks.innerHTML = '';
        decks.innerHTML = `
        <audio id="audio" src="js/Download.mp3" ></audio>
            <div id="popupContainer" style = "z-index: 1;">
                <div id="popup" class="ml15">
                    <span class="word">Time</span>
                    <span class="word">Out!</span>
                </div>
            </div>
            <div class="col-3" style="width: fit-content;">
                <div class="clock-wrap text-center" style="position: absolute;left: 0;margin-left:1rem">
                    <div class="clock pro-0">
                        <span class="count" style="color: #000000; font-family: 'Poppins', sans-serif ; font-weight: bolder; ">0</span>
                    </div>
                </div>
            </div>
            <div class="col-3" style="width: fit-content;">
                <a id="btnnextquiz" class="button btn btn-next" style="position: absolute;right: 0;margin-right:1rem">
                <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512">
                    <path
                        d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                </svg><br>Next
                </a>
            </div>
            <div class = "row quizQuestion">
                <pre class="col-12 d-flex justify-content-center text-start" style="margin-top: 5rem">
                    <code id="quiz" class="hljs font-question" font-weight: bolder;">${Quizdata3.quiz_question}</code>
                </pre>
            </div>
            <div class="row mb-5">
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice1" onclick="checkAnswersWrongAnswer2('btnChoice1', '${Quizdata3._id}')"><i class="bi bi-1-square-fill"></i>
                        <pre class="d-flex text-start">
    <code id="choice1" class="hljs text-choice">${Quizdata3.quiz_choice[0]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice2" onclick="checkAnswersWrongAnswer2('btnChoice2','${Quizdata3._id}')"><i class="bi bi-2-square-fill"></i>
                        <pre class="d-flex text-start">
    <code id="choice2" class="hljs text-choice">${Quizdata3.quiz_choice[1]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice3" onclick="checkAnswersWrongAnswer2('btnChoice3','${Quizdata3._id}')"><i class="bi bi-3-square-fill"></i>
                        <pre class="d-flex text-start">
    <code id="choice3" class="hljs text-choice">${Quizdata3.quiz_choice[2]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
                <div class="col-6 answer-block">
                    <div class="btn-wrapper">
                        <button type="button" class="btn btn-secondary btn-choice text-start" id="btnChoice4" onclick="checkAnswersWrongAnswer2('btnChoice4','${Quizdata3._id}')"><i class="bi bi-4-square-fill"></i>
                        <pre class="d-flex text-start">
    <code id="choice4" class="hljs text-choice">${Quizdata3.quiz_choice[3]}</code>
                        </pre>
                        </button>
                    </div>
                </div>
            </div>
        </div>
            `;
        hljs.highlightAll();

        const btnquiz = document.getElementById("btnnextquiz");
        btnquiz.addEventListener("click", () => {
            // ตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
            if (checkAnswerSelected()) {
                q2++;
                displayNextFlashcard3();
            } else {
                const btnWrappers = document.getElementsByClassName('btn-wrapper');
                for (let i = 0; i < btnWrappers.length; i++) {
                    const btnWrapper = btnWrappers[i];
                    const button = btnWrapper.querySelector('button');
                    if (!button.classList.contains('btn-success') && !button.classList.contains('btn-danger')) {
                        btnWrapper.classList.add('animate__bounceIn');
                        setTimeout(() => {
                            btnWrapper.classList.remove('animate__bounceIn');
                        }, 500);
                    }
                }
            }
        });

        // เพิ่ม event listener ให้กับปุ่ม Choice เพื่อตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
        const choices = document.querySelectorAll(".answer-block button");
        choices.forEach(choice => {
            choice.addEventListener("click", () => {
                selectedAnswer = true; // เมื่อผู้ใช้เลือกคำตอบแล้วกำหนดค่า selectedAnswer เป็น true
            });
        });

        // เพิ่มฟังก์ชันตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
        function checkAnswerSelected() {
            // ตรวจสอบว่าผู้ใช้เลือกคำตอบหรือไม่
            return selectedAnswer;
        }
    }

    function displayFlashcard3(flashcardData2) {
        decks.innerHTML = '';
        decks.innerHTML = `
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
<code id="question" class="hljs">${flashcardData2.card_question}</code>
            </pre>
            <hr class="style">
        </div>
        <div class="row">
            <div class="col-md-12">
                <h1 class="font-poppin" style="font-weight: Bold; padding: 1rem 0;"><ins> Answer </ins></h1>
            </div>
            <div class="col-md-12">
                <pre class="d-flex justify-content-center text-start">
<code id="answer" class="hljs">${flashcardData2.card_answer}</code>
                </pre>
            </div>
        </div>
            `;
        hljs.highlightAll();

        const btnNextQuestion = document.getElementById("btnnextquestion");
        btnNextQuestion.addEventListener("click", () => {
            displayNextQuiz3(wrongAnswers2);
        });
    }
    displayNextQuiz3(wrongAnswers2);
}

function checkAnswersWrongAnswer2(buttonId, Quizdata) {
    // console.log(Quizdata);

    fetch('/projectsenior/quiz/getById/' + Quizdata, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            const answerCorrect = data.quiz_answerCorrect;

            // เลือกคำตอบที่ผู้ใช้เลือก
            const selectedChoice = document.getElementById(buttonId).querySelector('code').textContent;

            if (selectedChoice === answerCorrect) {
                // ! ProgressBar
                const progressBar = document.querySelector('.progress-bar');
                numberOfData = wrongAnswers2.length;
                let currentWidth = parseFloat(progressBar.style.width);
                const progress = (25 / wrongAnswers2.length);
                currentWidth += progress;
                totalIncrement += progress;
                progressBar.style.width = currentWidth + '%';

                point += 1;
                countCorrect++;
                clock.stop();
                playAudioStop()
                // Answer Stat
                if (answerStats[data.flashcard_id] === undefined) {
                    answerStats[data.flashcard_id] = 1;
                } else {
                    answerStats[data.flashcard_id]++;
                }

                // ! Flashcard Stats
                // Total Played
                if (flashcardTotalPlayed[data.flashcard_id] === undefined) {
                    flashcardTotalPlayed[data.flashcard_id] = 1;
                } else {
                    flashcardTotalPlayed[data.flashcard_id]++;
                }

                console.log('Total Played:', flashcardTotalPlayed);

                // Correct Answer
                if (flashcardCorrect[data.flashcard_id] === undefined) {
                    flashcardCorrect[data.flashcard_id] = 1;
                } else {
                    flashcardCorrect[data.flashcard_id]++;
                }

                console.log('Correct Answer:', flashcardCorrect);

                document.getElementById(buttonId).classList.add('btn-success');
                document.getElementById(buttonId).classList.add('active');
                for (let i = 1; i <= 4; i++) {
                    const btnChoice = document.getElementById(`btnChoice${i}`);
                    btnChoice.disabled = true;
                }

            } else {
                point -= 0.25;
                countWrong++;
                clock.stop();
                playAudioStop()
                // play++;

                // Answer Stat
                if (answerStats[data.flashcard_id] === undefined) {
                    answerStats[data.flashcard_id] = -1;
                } else {
                    answerStats[data.flashcard_id]--;
                }

                // ! Flashcard Stats
                // Total Played
                if (flashcardTotalPlayed[data.flashcard_id] === undefined) {
                    flashcardTotalPlayed[data.flashcard_id] = 1;
                } else {
                    flashcardTotalPlayed[data.flashcard_id]++;
                }

                console.log('Total Played:', flashcardTotalPlayed);

                // Wrong Answer
                if (flashcardWrong[data.flashcard_id] === undefined) {
                    flashcardWrong[data.flashcard_id] = 1;
                } else {
                    flashcardWrong[data.flashcard_id]++;
                }

                console.log('Wrong Answer:', flashcardWrong);

                document.getElementById(buttonId).classList.add('btn-danger');
                document.getElementById(buttonId).classList.add('active');
                const correctButton = document.getElementById('btnChoice1').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice1') :
                    document.getElementById('btnChoice2').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice2') :
                        document.getElementById('btnChoice3').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice3') :
                            document.getElementById('btnChoice4').querySelector('code').textContent === answerCorrect ? document.getElementById('btnChoice4') : null;

                if (correctButton) {
                    correctButton.classList.add('btn-success');
                    for (let i = 1; i <= 4; i++) {
                        const btnChoice = document.getElementById(`btnChoice${i}`);
                        btnChoice.disabled = true;
                    }
                    document.getElementById('btnnextquiz').disabled = false;
                }
                wrongAnswers2.push(data);
                wrongFlashcardIds = wrongAnswers2.map(wrongAnswers => wrongAnswers.flashcard_id);
                // updatePlayDisplay();
            }
            console.log(answerStats);
            console.log('Flashcard Total Played:', flashcardTotalPlayed);
            console.log('Flashcard Correct Answer:', flashcardCorrect);
            console.log('Flashcard Wrong Answer:', flashcardWrong);
            answered = true;
        })
        .catch(err => console.log(err));
}