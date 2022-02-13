(function () {
  const dataToggles = document.querySelectorAll('[data-toggle="modal"]');
  dataToggles.forEach(function (dataToggle) {
    dataToggle.addEventListener('click', function () {
      const modalId = dataToggle.dataset.target;
      const modal = document.querySelector(modalId);
      modal.classList.add('modal--display');
      setTimeout(function () {
        modal.classList.add('modal--show');
      }, 50);
      const body = document.querySelector('body');
      body.classList.add('modal__overlay');
      const closeX = document.querySelector(`${modalId} .modal__close`);
      const closeBtn = document.querySelector(`${modalId} .modal__close-btn`);
      closeX.addEventListener('click', function () {
        modal.classList.remove('modal--show');
        setTimeout(function () {
          modal.classList.remove('modal--display');
          body.classList.remove('modal__overlay');
        }, 300);
      });
      closeBtn.addEventListener('click', function () {
        modal.classList.remove('modal--show');
        setTimeout(function () {
          modal.classList.remove('modal--display');
          body.classList.remove('modal__overlay');
        }, 300);
      });
    });
  });
})();
