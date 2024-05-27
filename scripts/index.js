const displayText = document.querySelector(".display-text");
const buttons = document.querySelectorAll("button");
const copyrightText = document.querySelector(".copyright-text");
copyrightText.textContent = `© ${(new Date()).getFullYear()} Serban Untu`;

let first = 0;
let second = 0;
let result = 0;
let operator = '';
let currentStage = "FIRST"; // "FIRST" | "OPERATOR" | "SECOND" | "RESULT" | "ERROR"

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
  displayText.textContent = val;
}

function calculate(a, op, b) {
  let x = Math.round(operate(a, op, b) * 10e4) / 10e4;
  if(`${x}`.includes('e')) x = x.toExponential(5);
  if(!isFinite(x) || isNaN(x)) {
    displayText.textContent = "Err";
    setStage("ERROR");
    return 0;
  }
  displayText.textContent = `${x}`;
  return x;
}

function onBackspace() {
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
}

function onClear() {
  setStage("FIRST");
  clearDisplay();
}

function onDigit(val) {
  switch(currentStage) {
    case "FIRST":
      addDigit(val);
      break;
    case "OPERATOR":
      setStage("SECOND");
      clearDisplay();
      addDigit(val);
      break;
    case "SECOND":
      addDigit(val);
      break;
    case "RESULT":
      setStage("FIRST");
      clearDisplay();
      addDigit(val);
      break;
  }
}

function onOperator(val) {
  switch(currentStage) {
    case "FIRST":
      setStage("OPERATOR");
      first = +displayText.textContent;
      addOperator(val);
      break;
    case "OPERATOR":
      clearDisplay();
      addOperator(val);
      break;
    case "SECOND":
      setStage("OPERATOR");
      second = +displayText.textContent;
      first = calculate(first, operator, second);
      if(displayText.textContent !== "Err") {
        addOperator(val);
        setDisplay(first);
      }
      break;
    case "RESULT":
      setStage("OPERATOR");
      first = result;
      addOperator(val);
      break;
  }
}

function onEquals() {
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

buttons.forEach(button => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    if(button.classList.contains("back")) {
      onBackspace();
    } else if(button.classList.contains("clear")) {
      onClear();
    } else if(button.classList.contains("digit")) {
      onDigit(button.id);
    } else if(button.classList.contains("operator")) {
      onOperator(button.id);
    } else if(button.classList.contains("equals")) {
      onEquals();
    }
  });
});

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  switch(e.key) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '.':
      document.getElementById(e.key).classList.add("pressed");
      onDigit(e.key);
      break;
    case '+':
    case '-':
    case '*':
    case '/':
      document.getElementById(e.key).classList.add("pressed");
      onOperator(e.key);
      break;
    case '=':
    case "Enter":
      document.getElementById("=").classList.add("pressed");
      onEquals();
      break;
    case "Backspace":
      document.getElementById("back").classList.add("pressed");
      onBackspace();
      break;
    case 'c':
    case 'C':
    case "Delete":
    case "Escape":
      document.getElementById("clear").classList.add("pressed");
      onClear();
      break;
  }
});

document.addEventListener("keyup", (e) => {
  e.preventDefault();
  switch(e.key) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '.':
      document.getElementById(e.key).classList.remove("pressed");
      break;
    case '+':
    case '-':
    case '*':
    case '/':
      document.getElementById(e.key).classList.remove("pressed");
      break;
    case '=':
    case "Enter":
      document.getElementById("=").classList.remove("pressed");
      break;
    case "Backspace":
      document.getElementById("back").classList.remove("pressed");
      break;
    case 'c':
    case 'C':
    case "Delete":
    case "Escape":
      document.getElementById("clear").classList.remove("pressed");
      break;
  }
});