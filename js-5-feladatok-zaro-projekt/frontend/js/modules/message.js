class Message {
  constructor(time = 5000) {
    this.time = time;
  }
  createMsgElement(msg, type = 'info') {
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
    msg.timeoutID = setTimeout(() => {
      clearTimeout(msg.timeoutID);
      msg.remove();
    }, this.time);
  }
  createMsg(msgText, msgClass) {
    const msg = this.createMsgElement(msgText, msgClass);
    document.body.appendChild(msg);
    this.addEventListenerToNewlyCreatedMsgCloseBtn();
    this.deleteMessage(msg);
  }
  error(msg) {
    this.createMsg(msg, 'error');
  }
  success(msg) {
    this.createMsg(msg, 'success');
  }
  info(msg) {
    this.createMsg(msg, 'info');
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
