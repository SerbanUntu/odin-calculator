const displayText = document.querySelector(".display-text");
const stageText = document.querySelector(".stage-text");
const buttons = document.querySelectorAll("button");

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

let first = 0;
let second = 0;
let result = 0;
let operator = '';
let currentStage = "FIRST"; // "FIRST" | "OPERATOR" | "SECOND" | "RESULT"

function operate(a, op, b) {
  switch(op) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
  }
  return divide(a, b);
}

function setStage(stage) {
  currentStage = stage;
  stageText.textContent = stage;
}

function backspace() {
  let currentText = displayText.textContent;
  if(currentText.length > 2 || (currentText.length === 2 && currentText.charAt(0) !== '-')) {
    displayText.textContent = currentText.slice(0, currentText.length - 1);
  } else {
    displayText.textContent = '0';
  }
}

function clearDisplay() {
  displayText.textContent = '0';
}

function setDisplay(val) {
  displayText.textContent = val;
} 

function addDigit(digit) {
  let currentText = displayText.textContent;
  if(digit === '.') {
    if(currentText.slice(-1) >= '0' && currentText.slice(-1) <= '9' && !currentText.includes('.')) {
      displayText.textContent += '.';
    } 
  } else {
    if(currentText === '0' || currentText === '') {
      displayText.textContent = digit;
    } else {
      displayText.textContent += digit;
    }
  }
}

function addOperator(val) {
  operator = val;
  if(val === '*') {
    displayText.textContent = '×';
  } else if(val === '/') {
    displayText.textContent = '÷';
  } else displayText.textContent = val;
}

function calculate(a, op, b) {
  let x = operate(a, op, b);
  displayText.textContent = `${x}`;
  return x;
}

buttons.forEach(button => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    if(button.classList.contains("back")) {
      switch(currentStage) {
        case "FIRST":
        case "SECOND":
          backspace();
          break;
        case "OPERATOR":
          break;
        case "RESULT":
          setStage("FIRST");
          backspace();
          break;
      }
    } else if(button.classList.contains("clear")) {
      switch(currentStage) {
        case "FIRST":
        case "SECOND":
          clearDisplay();
          break;
        case "OPERATOR":
        case "RESULT":
          setStage("FIRST");
          clearDisplay();
          break;
      }
    } else if(button.classList.contains("digit")) {
      switch(currentStage) {
        case "FIRST":
          addDigit(button.id);
          break;
        case "OPERATOR":
          setStage("SECOND");
          clearDisplay();
          addDigit(button.id);
          break;
        case "SECOND":
          addDigit(button.id);
          break;
        case "RESULT":
          setStage("FIRST");
          clearDisplay();
          addDigit(button.id);
          break;
      }
    } else if(button.classList.contains("operator")) {
      switch(currentStage) {
        case "FIRST":
          setStage("OPERATOR");
          first = +displayText.textContent;
          addOperator(button.id);
          break;
        case "OPERATOR":
          clearDisplay();
          addOperator(button.id);
          break;
        case "SECOND":
          setStage("OPERATOR");
          second = +displayText.textContent;
          first = calculate(first, operator, second);
          addOperator(button.id);
          setDisplay(first);
          break;
        case "RESULT":
          setStage("OPERATOR");
          first = result;
          addOperator(button.id);
          break;
      }
    } else if(button.classList.contains("equals")) {
      switch(currentStage) {
        case "FIRST":
        case "OPERATOR":
          break;
        case "SECOND":
          setStage("RESULT");
          second = +displayText.textContent;
          result = calculate(first, operator, second);
          break;
        case "RESULT":
          result = calculate(result, operator, second);
          break;
      }
    }
  });
});