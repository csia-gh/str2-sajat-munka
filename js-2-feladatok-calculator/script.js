const nums = document.querySelectorAll('[data-num]');
const calculator = document.querySelector('.calculator');
const output = document.getElementById('output');
let selectedNum1 = '';
let selectedNum2 = '';
let selectedOperator = null;
let message = '';

const displayOutput = ({ continueCounting = false, result = false } = {}) => {
  if (selectedOperator) {
    selectedNum1 = selectedNum1 === '0.' ? '0' : selectedNum1;
    if (selectedNum1.charAt(selectedNum1.length - 1) === '.') {
      selectedNum1 = selectedNum1.slice(0, selectedNum1.length - 1);
    }
    if (selectedNum1 === '-') {
      selectedNum1 = 0;
    }
    if (selectedNum2 === '-') {
      selectedNum2 = 0;
    }

    output.innerHTML = `<span class="num1">${selectedNum1}</span><span class="operator">${selectedOperator}</span><span class="num2">${
      selectedNum2 ? selectedNum2 : ''
    }</span>`;
  } else if (!message) {
    output.innerHTML = `<span class="${
      result ? 'result' : ''
    }">${selectedNum1}</span>`;
  } else if (continueCounting) {
    output.innerHTML = `<span class="error">${selectedNum1}</span><span class="operator">${selectedOperator}</span><span class="message">${message}</span>`;
  } else {
    output.innerHTML = `<span class="error">${selectedNum1}</span><span class="message">${message}</span>`;
  }

  if (selectedNum1.length > 16 || selectedNum2.length > 16) {
    output.classList.add('too-long');
  } else {
    output.classList.remove('too-long');
  }
};

const handleOperatorWasClicked = (operation) => {
  if (selectedNum1 === '' && operation === '-') {
    selectedNum1 = operation;
  } else if (selectedNum2 === '' && !selectedOperator && selectedNum1 !== '') {
    selectedOperator = operation;
  } else if (selectedOperator && operation === '-' && selectedNum2 === '') {
    selectedNum2 = '-';
  } else if (selectedNum1) {
    calculate(operation);
  }

  displayOutput();
};

const handleNumWasClicked = (num, isSecondNum) => {
  let handledNumber = isSecondNum ? selectedNum2 : selectedNum1;
  if (!/\d/.test(handledNumber)) {
    handledNumber = handledNumber + num;
  } else if (num === '0' && handledNumber === '0') {
    return;
  } else if (handledNumber === '0' && num !== 0) {
    handledNumber = num;
  } else {
    handledNumber += num;
  }

  if (isSecondNum) {
    selectedNum2 = handledNumber;
  } else {
    selectedNum1 = handledNumber;
  }

  displayOutput();
};

const parseNumber = (num) => {
  if (num === '-' || num === '.') {
    return 0;
  } else {
    return parseFloat(num);
  }
};

const calculate = (continueCounting) => {
  if (selectedNum1 && selectedOperator && selectedNum2) {
    const n1 = parseNumber(selectedNum1);
    const n2 = parseNumber(selectedNum2);
    console.log('n1: ', n1, 'n2: ', n2);
    switch (selectedOperator) {
      case '+':
        selectedNum1 = n1 + n2;
        break;
      case '-':
        selectedNum1 = n1 - n2;
        break;
      case 'x':
        selectedNum1 = n1 * n2;
        break;
      case '÷':
        if (n2 === 0) {
          selectedNum1 = 0;
          message = 'you cannot divide by zero!';
        } else {
          selectedNum1 = n1 / n2;
        }
        break;
    }
    selectedNum1 = String(selectedNum1);
    selectedNum2 = '';
    if (continueCounting) {
      selectedOperator = continueCounting;
      displayOutput({ continueCounting: true });
    } else {
      selectedOperator = null;
      displayOutput({ result: true });
    }
  }
};

const decSepWasClicked = () => {
  if (selectedNum1 === '') {
    selectedNum1 = '0.';
  } else if (!selectedOperator && !selectedNum1.includes('.')) {
    selectedNum1 += '.';
  } else if (selectedNum1 && selectedOperator && selectedNum2 === '') {
    selectedNum2 += '0.';
  } else if (
    selectedNum1 !== '' &&
    selectedOperator &&
    !selectedNum2.includes('.')
  ) {
    if (selectedNum2 === '-') {
      selectedNum2 = '-0.';
    }
    selectedNum2 += '.';
  }

  displayOutput();
};

const clearAll = () => {
  selectedNum1 = '';
  selectedNum2 = '';
  selectedOperator = null;
  displayOutput();
};

const handleClick = (e) => {
  // delete any previous msg
  message = '';

  if (e.target.dataset.num) {
    if (selectedOperator) {
      handleNumWasClicked(e.target.dataset.num, true);
    } else {
      handleNumWasClicked(e.target.dataset.num);
    }
  }

  if (e.target.parentElement.classList.contains('operators')) {
    handleOperatorWasClicked(e.target.dataset.operation);
  }

  if (e.target.id === 'clear') {
    clearAll();
  }

  if (e.target.id === 'decSep') {
    decSepWasClicked();
  }

  if (e.target.id === 'equal') {
    calculate();
  }
};

calculator.addEventListener('click', handleClick);
