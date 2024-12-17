
const num1Element = document.getElementById("num1");
const num2Element = document.getElementById("num2");
const operationElement = document.getElementById("op");
let num1, num2;
let currentOperation = "+";

const checkButton = document.getElementById("check");
const nextButton = document.getElementById("next");

const answerInput = document.getElementById("sum");
const messageElement = document.getElementById("message");


function generateExercise() {
    answerInput.value = '';
    messageElement.textContent = '';

    num1 = Math.floor(Math.random() * 100);
    num2 = Math.floor(Math.random() * 10);

    num1Element.textContent = num1;
    num2Element.textContent = num2;
    operationElement.textContent = currentOperation;
}

function checkAnswer() {
    let correctAnswer;
    switch (currentOperation) {
        case "+":
            correctAnswer = num1 + num2;
            break;
        case "-":
            correctAnswer = num1 - num2;
            break;
        case "*":
            correctAnswer = num1 * num2;
            break;
        case "/":
            if (num2 !== 0) {
                correctAnswer = num1 / num2;
            } else {
                messageElement.textContent = "לא ניתן לחלק באפס!";
                return;
            }
            break;
    }
    const userAnswer = parseInt(answerInput.value);
    if (userAnswer === correctAnswer) {
        messageElement.textContent = '🎉🙌 ✨ נכון מאוד ✨ 😊👏';
        messageElement.style.color = "Blue";
    } else {
        messageElement.textContent = 'לא נכון, נסה שוב!';
        messageElement.style.color = "red";
    }
}
checkAnswer();
document.getElementById("addition").addEventListener("click", function () {
    currentOperation = "+";
    operationElement.textContent = currentOperation;
    generateExercise();
});

document.getElementById("subtraction").addEventListener("click", function () {
    currentOperation = "-";
    operationElement.textContent = currentOperation;
    generateExercise();
});

document.getElementById("multiplication").addEventListener("click", function () {
    currentOperation = "*";
    operationElement.textContent = currentOperation;
    generateExercise();
});

document.getElementById("division").addEventListener("click", function () {
    currentOperation = "/";
    operationElement.textContent = currentOperation;
    generateExercise();
});
generateExercise();

checkButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', generateExercise);
