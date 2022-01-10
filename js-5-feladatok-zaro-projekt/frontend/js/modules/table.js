import User from './user.js';
import Validate from './validate.js';
import Message from './message.js';
const msg = new Message();

class Table {
  constructor(selector, shouldBeDisabledSelectors = []) {
    this.table = document.querySelector(selector);
    this.tBody = this.table.querySelector('tbody');
    this.shouldBeDisabledSelectors = shouldBeDisabledSelectors;
    this.thIDSortBtn = document.querySelector('#th-ID');
    this.thNameSortBtn = document.querySelector('#th-name');
    this.nameSorted = false;
    this.idSorted = true;
    this.isEditing = false;
    this.userObjKeys = ['id', 'name', 'emailAddress', 'address'];
    this.loadTableContent();
    this.events();
    this.inputsData = {
      Name: false,
      Email: false,
      Address: false,
    };
  }
  events() {
    this.thIDSortBtn.addEventListener('click', () => this.toggleIDSort());
    this.thNameSortBtn.addEventListener('click', () => this.toggleNameSort());
  }
  toggleIDSort() {
    if (this.isEditing) {
      msg.info('First finish editing');
      return;
    }
    const trs = [...this.table.querySelectorAll('tbody tr')];
    if (this.idSorted) {
      trs.sort((tr1, tr2) => {
        return (
          parseInt(tr1.querySelector('.tr-id').innerText) -
          parseInt(tr2.querySelector('.tr-id').innerText)
        );
      });
      trs.reverse();
      this.idSorted = false;
    } else {
      trs.sort((tr1, tr2) => {
        return (
          parseInt(tr1.querySelectorAll('td')[0].innerText) -
          parseInt(tr2.querySelectorAll('td')[0].innerText)
        );
      });
      this.idSorted = true;
      this.nameSorted = false;
    }
    this.tBody.innerHTML = '';
    trs.forEach((tr) => this.tBody.appendChild(tr));
  }
  toggleNameSort() {
    if (this.isEditing) {
      msg.info('First finish editing');
      return;
    }
    const trs = [...this.table.querySelectorAll('tbody tr')];
    if (this.nameSorted) {
      trs.sort((tr1, tr2) => {
        return tr1
          .querySelector('.tr-name')
          .value.localeCompare(tr2.querySelector('.tr-name').value);
      });
      trs.reverse();
      this.nameSorted = false;
    } else {
      trs.sort((tr1, tr2) => {
        return tr1
          .querySelector('.tr-name')
          .value.localeCompare(tr2.querySelector('.tr-name').value);
      });
      this.nameSorted = true;
      this.idSorted = false;
    }
    this.tBody.innerHTML = '';
    trs.forEach((tr) => this.tBody.appendChild(tr));
  }
  changeBtns() {
    this.tr.classList.add('edit');
    this.tdBtns.classList.add('cancel');
    this.inputs.forEach((input) => input.removeAttribute('disabled'));
    this.tdBtns.innerHTML = '';
    const saveBtn = document.createElement('button');
    saveBtn.innerHTML = 'Save <i class="fas fa-save"></i>';
    saveBtn.classList.add('btn');
    saveBtn.classList.add('btn--save');
    saveBtn.addEventListener('click', (e) => this.saveChanges(e));
    this.tdBtns.appendChild(saveBtn);
    const editBtn = document.createElement('button');
    editBtn.innerHTML = 'Cancel <i class="fas fa-undo"></i>';
    editBtn.classList.add('btn');
    editBtn.classList.add('btn--cancel');
    editBtn.addEventListener('click', (e) => this.handleCancel(e));
    this.tdBtns.appendChild(editBtn);
  }
  handleEdit(e) {
    if (this.isEditing) {
      msg.info('First finish editing');
      return;
    }

    this.shouldBeDisabledSelectors.forEach((selector) => {
      document.querySelector(selector).setAttribute('disabled', true);
    });

    this.setInputListenersAndSetLocals(e.target.parentElement.parentElement);

    this.changeBtns();
    this.isEditing = true;
  }
  setInputListenersAndSetLocals(tr) {
    this.tr = tr;
    this.userId = parseInt(tr.dataset.userid);
    this.tdBtns = this.tr.querySelector('.buttons');
    this.nameInput = tr.querySelector('.tr-name');
    this.emailInput = tr.querySelector('.tr-emailAddress');
    this.addressInput = tr.querySelector('.tr-address');
    this.inputs = [this.nameInput, this.emailInput, this.addressInput];
    this.nameInput.addEventListener('input', (e) => this.handleNameInput(e));
    this.emailInput.addEventListener('input', (e) => this.handleEmailInput(e));
    this.addressInput.addEventListener('input', (e) => this.handleAddressInput(e));
  }
  unsetLocals() {
    this.tr = null;
    this.userId = null;
    this.tdBtns = null;
    this.nameInput = null;
    this.emailInput = null;
    this.addressInput = null;
    this.inputs = [];
  }
  handleDelete(e) {
    if (this.isEditing) {
      msg.info('First finish editing');
      return;
    }
    const tr = e.target.parentElement.parentElement;
    const userId = tr.dataset.userid;
    console.log(userId);
    if (userId) {
      User.deleteUser(userId);
      tr.remove();
    }
  }
  removeEditingClasses() {
    this.nameInput.parentElement.classList.remove('success');
    this.nameInput.parentElement.classList.remove('error');
    this.emailInput.parentElement.classList.remove('error');
    this.emailInput.parentElement.classList.remove('success');
    this.addressInput.parentElement.classList.remove('error');
    this.addressInput.parentElement.classList.remove('success');
  }
  restoreBtns() {
    this.tr.classList.remove('edit');
    this.inputs.forEach((input) => input.setAttribute('disabled', true));
    this.tdBtns.remove();
    this.tr.appendChild(this.createEditAndDelBtnTDWithEventListeners());

    this.removeEditingClasses();

    this.isEditing = false;
  }
  handleCancel(e) {
    this.shouldBeDisabledSelectors.forEach((selector) => {
      document.querySelector(selector).removeAttribute('disabled');
    });
    this.restoreBtns();
    this.unsetLocals();
  }
  handleNameInput(e) {
    if (!Validate.validateName(this.nameInput.value)) {
      this.nameInput.parentElement.classList.remove('success');
      this.nameInput.parentElement.classList.add('error');
      this.inputsData.Name = false;
    } else {
      this.nameInput.parentElement.classList.remove('error');
      this.nameInput.parentElement.classList.add('success');
      this.inputsData.Name = true;
    }
  }
  handleEmailInput(e) {
    if (!Validate.validateEmail(this.emailInput.value)) {
      this.emailInput.parentElement.classList.remove('success');
      this.emailInput.parentElement.classList.add('error');
      this.inputsData.Email = false;
    } else {
      this.emailInput.parentElement.classList.remove('error');
      this.emailInput.parentElement.classList.add('success');
      this.inputsData.Email = true;
    }
  }
  handleAddressInput(e) {
    if (!Validate.validateAddress(this.addressInput.value)) {
      this.addressInput.parentElement.classList.remove('success');
      this.addressInput.parentElement.classList.add('error');
      this.inputsData.Address = false;
    } else {
      this.addressInput.parentElement.classList.remove('error');
      this.addressInput.parentElement.classList.add('success');
      this.inputsData.Address = true;
    }
  }
  async saveChanges(e) {
    this.handleNameInput();
    this.handleEmailInput();
    this.handleAddressInput();

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
          user.emailAddress === this.emailInput.value.trim() &&
          user.id !== this.userId
        ) {
          msg.error('This email address is already being used with this name');
          return;
        }
        if (
          user.name === this.nameInput.value.trim() &&
          user.address === this.addressInput.value.trim() &&
          user.id !== this.userId
        ) {
          msg.error('This address is already being used with this name');
          return;
        }
      }

      const updatedUser = await User.updateUser(this.userId, {
        name: this.nameInput.value.trim(),
        emailAddress: this.emailInput.value.trim(),
        address: this.addressInput.value.trim(),
      });
      this.updateTr(updatedUser);
      msg.success('Updated!');
      this.handleCancel();
    }
  }
  updateTr(updatedUser) {
    this.nameInput.value = updatedUser.name;
    this.emailInput.value = updatedUser.emailAddress;
    this.addressInput.value = updatedUser.address;
  }
  createAndAppendTdWithData(user, tr) {
    this.userObjKeys.forEach((key) => {
      const td = document.createElement('td');
      if (key === 'id') {
        td.innerText = user[key];
        td.classList.add('tr-id');
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add(`tr-${key}`);
        input.setAttribute('disabled', true);
        input.value = user[key];
        td.appendChild(input);
      }
      tr.appendChild(td);
    });
  }
  createEditAndDelBtnTDWithEventListeners(tr) {
    const td = document.createElement('td');
    td.classList.add('buttons');

    const editBtn = document.createElement('button');
    editBtn.innerHTML = `Edit <i class="fas fa-user-edit"></i>`;
    editBtn.classList.add('btn');
    editBtn.classList.add('btn--edit');
    editBtn.addEventListener('click', (e) => this.handleEdit(e));
    td.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = `Delete <i class="fas fa-user-slash"></i>`;
    deleteBtn.classList.add('btn');
    deleteBtn.classList.add('btn--delete');
    deleteBtn.addEventListener('click', (e) => this.handleDelete(e));
    td.appendChild(deleteBtn);

    if (tr) {
      tr.appendChild(td);
    } else {
      return td;
    }
  }
  async loadTableContent() {
    const users = await User.getUsers();
    if (users) {
      users.forEach((user) => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-userid', user.id);
        this.tBody.appendChild(tr);

        this.createAndAppendTdWithData(user, tr);
        this.createEditAndDelBtnTDWithEventListeners(tr);
      });
    } else {
      this.tBody.innerHTML =
        '<tr><td colspan="5"><h3 style="padding:1rem;text-align:center;width:100%;">No data</h3></td></tr>';
    }
  }
  addNewUserToDOM(newUser) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-userid', newUser.id);
    this.createAndAppendTdWithData(newUser, tr);
    this.createEditAndDelBtnTDWithEventListeners(tr);
    this.tBody.insertAdjacentElement('afterbegin', tr);
  }
}

export default Table;
