class Message {
  constructor(time = 5000) {
    this.time = time;
  }
  createMsg(msg, type = 'info') {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.innerHTML = `${msg} <button class="msg-close-btn"><i class="fas fa-times-circle"></i></button>`;
    const lstMsgDiv = [...document.querySelectorAll('.message')].reverse()[0];
    if (lstMsgDiv) {
      const lstMesgBottom = lstMsgDiv.getBoundingClientRect().bottom;
      const top = lstMesgBottom + 5;
      msgDiv.style.top = `${top}px`;
    }
    switch (type) {
      case 'info':
        msgDiv.classList.add('info');
        break;
      case 'error':
        msgDiv.classList.add('error');
        break;
      case 'success':
        msgDiv.classList.add('success');
        break;
    }
    return msgDiv;
  }
  deleteMessage(msg) {
    setTimeout(() => {
      msg.remove();
    }, this.time);
  }
  error(msg) {
    const errorMsg = this.createMsg(msg, 'error');
    document.body.appendChild(errorMsg);
    this.addEventListenerToNewlyCreatedMsgCloseBtn();
    this.deleteMessage(errorMsg);
  }
  success(msg) {
    const successMsg = this.createMsg(msg, 'success');
    document.body.appendChild(successMsg);
    this.addEventListenerToNewlyCreatedMsgCloseBtn();
    this.deleteMessage(successMsg);
  }
  info(msg) {
    const infoMsg = this.createMsg(msg, 'info');
    document.body.appendChild(infoMsg);
    this.addEventListenerToNewlyCreatedMsgCloseBtn();
    this.deleteMessage(infoMsg);
  }
  addEventListenerToNewlyCreatedMsgCloseBtn() {
    const msgCloseBtns = document.querySelectorAll('.msg-close-btn');
    msgCloseBtns[msgCloseBtns.length - 1].addEventListener('click', (e) =>
      this.msgCloseBtnWasClicked(e)
    );
  }
  msgCloseBtnWasClicked(e) {
    e.target.parentElement.remove();
  }
}

export default Message;
