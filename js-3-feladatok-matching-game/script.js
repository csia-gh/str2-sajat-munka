const icons = ['fa-cat', 'fa-dragon', 'fa-dog', 'fa-frog', 'fa-fish'];
const iTags = document.querySelectorAll('.cards i');
const cards = document.querySelectorAll('.card');
const UItimer = document.querySelector('.timer');
let timer = null;
const drawnedIcons = {};
let hasStarted = false;
let flippedCards = new Set();

const startTimer = () => {
  let totalElapsedSeconds = 0;
  UItimer.textContent = '00:00';
  timer = setInterval(() => {
    totalElapsedSeconds += 1;
    let minutes = Math.floor(totalElapsedSeconds / 60);
    let seconds = totalElapsedSeconds % 60;
    UItimer.textContent = `${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  }, 1000);
};

const endTimer = () => {
  clearInterval(timer);
};

const flipBackCards = () => {
  const flippedCardsArr = [...flippedCards];
  setTimeout(() => {
    flippedCardsArr.forEach((flippedCard) => flippedCard.classList.remove('flip'));
  }, 850);
};

const resetCards = () => {
  setIcons();
  UItimer.textContent = '00:00';
  setCardsEventHandler();
  hasStarted = false;
  cards.forEach((card) => card.classList.remove('flip'));
};

const spinBack = (callback) => {
  let totalElapsedSeconds =
    Number(UItimer.textContent.split(':')[0]) * 60 +
    Number(UItimer.textContent.split(':')[1]);
  let localTimer = setInterval(() => {
    if (totalElapsedSeconds <= 0) {
      clearInterval(localTimer);
      callback();
    } else {
      totalElapsedSeconds -= 1;
      let minutes = Math.floor(totalElapsedSeconds / 60);
      let seconds = totalElapsedSeconds % 60;
      UItimer.textContent = `${String(minutes).padStart(2, '0')}:${String(
        seconds
      ).padStart(2, '0')}`;
    }
  }, 20);
};

const stripMatchClassOnCards = () => {
  cards.forEach((card) => {
    card.classList.remove('match');
  });
};

const eog = () => {
  endTimer();

  document.body.classList.add('animate__heartBeat');

  setTimeout(() => {
    spinBack(() => {
      document.body.classList.remove('animate__heartBeat');
      setTimeout(resetCards, 500);
    });
    stripMatchClassOnCards();
  }, 4000);
};

const isOver = () => {
  if (Object.keys(drawnedIcons).length > 0) {
    return;
  } else {
    eog();
  }
};

const checkPairs = () => {
  let [card1, card2] = [...flippedCards];
  let card1ITag = card1.querySelector('i');
  let card2ITag = card2.querySelector('i');
  if (card1ITag.className == card2ITag.className) {
    console.log('match');
    card1.removeEventListener('click', handleCardClick);
    card2.removeEventListener('click', handleCardClick);
    card1.classList.add('match');
    card2.classList.add('match');
    let iTag = card1ITag.className.split(' ')[1];
    delete drawnedIcons[iTag];
    console.log(drawnedIcons);
    isOver();
  } else {
    flipBackCards();
  }

  flippedCards = new Set();
};

const flipCard = (e) => {
  e.currentTarget.classList.toggle('flip');
  flippedCards.add(e.currentTarget);

  console.log('size ', flippedCards.size);

  if (flippedCards.size == 2) {
    checkPairs();
  }
};

const handleCardClick = (e) => {
  if (!hasStarted) {
    startTimer();
    hasStarted = true;
  }

  flipCard(e);
};

const setCardsEventHandler = () => {
  cards.forEach((card) => card.addEventListener('click', handleCardClick));
};

const getRandomIconClass = () => {
  const index = Math.floor(Math.random() * icons.length);
  if (!drawnedIcons[icons[index]] || drawnedIcons[icons[index]] < 2) {
    drawnedIcons[icons[index]] = drawnedIcons[icons[index]]
      ? drawnedIcons[icons[index]] + 1
      : 1;
    return icons[index];
  }
  return getRandomIconClass();
};

const setIcons = () =>
  iTags.forEach((iTag) => (iTag.className = 'fas ' + getRandomIconClass()));

resetCards();
