import User from './user.js';
import Validate from './validate.js';
import Message from './message.js';
const msg = new Message();

class Table {
  constructor(selector, shouldBeDisabledSelectors = []) {
    this.table = document.querySelector(selector);
    this.shouldBeDisabledSelectors = shouldBeDisabledSelectors;
    this.thIDSortBtn = document.querySelector('#th-ID');
    this.thNameSortBtn = document.querySelector('#th-name');
    this.nameSorted = false;
    this.idSorted = true;
    this.isEditing = false;
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
    const tbody = this.table.querySelector('tbody');
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
    tbody.innerHTML = '';
    trs.forEach((tr) => tbody.appendChild(tr));
  }
  toggleNameSort() {
    if (this.isEditing) {
      msg.info('First finish editing');
      return;
    }
    const trs = [...this.table.querySelectorAll('tbody tr')];
    const tbody = this.table.querySelector('tbody');
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
    tbody.innerHTML = '';
    trs.forEach((tr) => tbody.appendChild(tr));
  }
  handleEdit(e) {
    if (this.isEditing) {
      msg.info('First finish editing');
      return;
    }
    this.shouldBeDisabledSelectors.forEach((selector) => {
      document.querySelector(selector).setAttribute('disabled', true);
    });
    const tr = e.target.parentElement.parentElement;
    this.setInputListeners(tr);
    const userId = tr.getAttribute('userid');
    const inputs = tr.querySelectorAll('input');
    const tdBtns = tr.querySelector('.buttons');
    if (userId) {
      tr.classList.add('edit');
      tdBtns.classList.add('cancel');
      inputs.forEach((input) => input.removeAttribute('disabled'));
      tdBtns.innerHTML = '';
      const saveBtn = document.createElement('button');
      saveBtn.innerHTML = 'Save <i class="fas fa-save"></i>';
      saveBtn.classList.add('btn');
      saveBtn.classList.add('btn--save');
      saveBtn.addEventListener('click', (e) => this.saveChanges(e));
      tdBtns.appendChild(saveBtn);
      const editBtn = document.createElement('button');
      editBtn.innerHTML = 'Cancel <i class="fas fa-undo"></i>';
      editBtn.classList.add('btn');
      editBtn.classList.add('btn--cancel');
      editBtn.addEventListener('click', (e) => this.handleCancel(e));
      tdBtns.appendChild(editBtn);
      this.isEditing = true;
    }
  }
  handleDelete(e) {
    if (this.isEditing) {
      msg.info('First finish editing');
      return;
    }
    const tr = e.target.parentElement.parentElement;
    const userId = tr.getAttribute('userid');
    if (userId) {
      User.deleteUser(userId);
      tr.remove();
    }
  }
  handleCancel(e) {
    this.shouldBeDisabledSelectors.forEach((selector) => {
      document.querySelector(selector).removeAttribute('disabled');
    });
    let tr;
    if (e) {
      tr = e.target.parentElement.parentElement;
    } else {
      tr = this.tr;
    }
    const userId = tr.getAttribute('userid');
    const inputs = tr.querySelectorAll('input');
    const tdBtns = tr.querySelector('.buttons');
    if (userId) {
      tr.classList.remove('edit');
      tdBtns.classList.remove('cancel');
      inputs.forEach((input) => input.setAttribute('disabled', true));
      tdBtns.innerHTML = '';
      const editBtn = document.createElement('button');
      editBtn.innerHTML = `Edit <i class="fas fa-user-edit"></i>`;
      editBtn.classList.add('btn');
      editBtn.classList.add('btn--edit');
      editBtn.addEventListener('click', (e) => this.handleEdit(e));
      tdBtns.appendChild(editBtn);
      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = `Delete <i class="fas fa-user-slash"></i>`;
      deleteBtn.classList.add('btn');
      deleteBtn.classList.add('btn--delete');
      deleteBtn.addEventListener('click', (e) => this.handleDelete(e));
      tdBtns.appendChild(deleteBtn);
      this.isEditing = false;
      this.nameInput.parentElement.classList.remove('success');
      this.nameInput.parentElement.classList.remove('error');
      this.emailInput.parentElement.classList.remove('error');
      this.emailInput.parentElement.classList.remove('success');
      this.addressInput.parentElement.classList.remove('error');
      this.addressInput.parentElement.classList.remove('success');
    }
    this.unsetInputListeners();
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
  setInputListeners(tr) {
    this.tr = tr;
    this.nameInput = tr.querySelector('.tr-name');
    this.emailInput = tr.querySelector('.tr-emailAddress');
    this.addressInput = tr.querySelector('.tr-address');
    this.nameInput.addEventListener('input', (e) => this.handleNameInput(e));
    this.emailInput.addEventListener('input', (e) => this.handleEmailInput(e));
    this.addressInput.addEventListener('input', (e) => this.handleAddressInput(e));
  }
  unsetInputListeners() {
    this.tr = null;
    this.nameInput = null;
    this.emailInput = null;
    this.addressInput = null;
  }
  async saveChanges(e) {
    this.handleNameInput();
    this.handleEmailInput();
    this.handleAddressInput();
    const userId = parseInt(
      e.target.parentElement.parentElement.querySelector('.tr-id').innerText
    );
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
          user.id !== userId
        ) {
          msg.error('This email address is already being used with this name');
          return;
        }
        if (
          user.name === this.nameInput.value.trim() &&
          user.address === this.addressInput.value.trim() &&
          user.id !== userId
        ) {
          msg.error('This address is already being used with this name');
          return;
        }
      }
      const updatedUser = await User.updateUser(userId, {
        name: this.nameInput.value.trim(),
        emailAddress: this.emailInput.value.trim(),
        address: this.addressInput.value.trim(),
      });
      this.updateTr(updatedUser);
      msg.success('Updated!');
      this.handleCancel(false);
    }
  }
  updateTr(updatedUser) {
    this.nameInput.value = updatedUser.name;
    this.emailInput.value = updatedUser.emailAddress;
    this.addressInput.value = updatedUser.address;
  }
  async loadTableContent() {
    const users = await User.getUsers();
    const keys = ['id', 'name', 'emailAddress', 'address'];
    const tBody = this.table.querySelector('tbody');
    users.forEach((user) => {
      const tr = document.createElement('tr');
      tr.setAttribute('userid', user.id);
      tBody.appendChild(tr);
      keys.forEach((key) => {
        const td = document.createElement('td');
        if (key === 'id') {
          td.innerText = user[key];
          td.classList.add('tr-id');
        } else {
          td.innerHTML = `<input type="text" class="tr-${key}" value="${user[key]}" disabled>`;
        }
        tr.appendChild(td);
      });
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
      tr.appendChild(td);
    });
  }
  addNewUserToDOM(newUser) {
    const tBody = this.table.querySelector('tbody');
    const keys = ['id', 'name', 'emailAddress', 'address'];
    const tr = document.createElement('tr');
    tr.setAttribute('userid', newUser.id);
    tBody.appendChild(tr);
    keys.forEach((key) => {
      const td = document.createElement('td');
      if (key === 'id') {
        td.innerText = newUser[key];
        td.classList.add('tr-id');
      } else {
        td.innerHTML = `<input type="text" class="tr-${key}" value="${newUser[key]}" disabled>`;
      }
      tr.appendChild(td);
    });
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
    tr.appendChild(td);
  }
}

export default Table;
