import Validate from './validate.js';
import User from './user.js';
import Message from './message.js';
const msg = new Message();

class Form {
  constructor(table) {
    this.table = table;
    this.form = document.querySelector('.form');
    this.formSubmitBtn = this.form.querySelector('.submit-btn');
    this.formBackBtn = this.form.querySelector('button.back');
    this.openFormBtn = document.querySelector('.open-form');
    this.nameInput = document.querySelector('#name');
    this.emailInput = document.querySelector('#email');
    this.addressInput = document.querySelector('#address');
    this.inputsData = {
      Name: false,
      Email: false,
      Address: false,
    };
    this.events();
  }
  events() {
    this.openFormBtn.addEventListener('click', (e) => this.openForm(e));
    this.formBackBtn.addEventListener('click', () => this.closeForm());
    this.nameInput.addEventListener('input', () => this.checkNameInput());
    this.emailInput.addEventListener('input', () => this.checkEmailInput());
    this.addressInput.addEventListener('input', () => this.checkAddressInput());
    this.formSubmitBtn.addEventListener('click', (e) => this.handleFormSubmit(e));
    this.form.addEventListener('submit', (e) => e.preventDefault());
  }
  openForm(e) {
    e.preventDefault();
    this.openFormBtn.style.display = 'none';
    this.form.style.display = 'block';
  }
  removeInputClasses() {
    this.nameInput.parentElement.classList.remove('success');
    this.nameInput.parentElement.classList.remove('error');
    this.emailInput.parentElement.classList.remove('success');
    this.emailInput.parentElement.classList.remove('error');
    this.addressInput.parentElement.classList.remove('error');
    this.addressInput.parentElement.classList.remove('success');
  }
  clearInputValues() {
    this.nameInput.value = '';
    this.emailInput.value = '';
    this.addressInput.value = '';
  }
  closeForm() {
    this.clearInputValues();
    this.removeInputClasses();
    this.openFormBtn.style.display = 'block';
    this.form.style.display = 'none';
  }
  inputSuccess(input) {
    input.parentElement.classList.remove('error');
    input.parentElement.classList.add('success');
  }
  inputError(input) {
    input.parentElement.classList.remove('success');
    input.parentElement.classList.add('error');
  }
  checkNameInput() {
    if (!Validate.validateName(this.nameInput.value)) {
      this.inputError(this.nameInput);
      this.inputsData.Name = false;
    } else {
      this.inputSuccess(this.nameInput);
      this.inputsData.Name = true;
    }
  }
  checkEmailInput() {
    if (!Validate.validateEmail(this.emailInput.value)) {
      this.inputError(this.emailInput);
      this.inputsData.Email = false;
    } else {
      this.inputSuccess(this.emailInput);
      this.inputsData.Email = true;
    }
  }
  checkAddressInput() {
    if (!Validate.validateAddress(this.addressInput.value)) {
      this.inputError(this.addressInput);
      this.inputsData.Address = false;
    } else {
      this.inputSuccess(this.addressInput);
      this.inputsData.Address = true;
    }
  }
  async handleFormSubmit(e) {
    e.preventDefault();

    this.checkNameInput();
    this.checkEmailInput();
    this.checkAddressInput();

    for (let inputData in this.inputsData) {
      if (!this.inputsData[inputData]) {
        msg.error(`${inputData} is not correct`);
      }
    }

    if (Object.values(this.inputsData).every((value) => value)) {
      const users = await User.getUsers();

      for (let user of users) {
        if (
          user.name === this.nameInput.value.trim() &&
          user.emailAddress === this.emailInput.value.trim()
        ) {
          msg.error('This email address is already being used with this name');
          return;
        }
        if (
          user.name === this.nameInput.value.trim() &&
          user.address === this.addressInput.value.trim()
        ) {
          msg.error('This address is already being used with this name');
          return;
        }
      }

      const newUser = await User.createUser({
        name: this.nameInput.value.trim(),
        emailAddress: this.emailInput.value.trim(),
        address: this.addressInput.value.trim(),
      });

      this.table.addNewUserToDOM(newUser);
      this.closeForm();

      msg.success('Successfully made a new user!');
    }
  }
}

export default Form;
