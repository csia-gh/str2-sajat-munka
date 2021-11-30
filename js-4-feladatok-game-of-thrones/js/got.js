const headerTag = document.querySelector('.header');
const mainTag = document.querySelector('main');
const togglerBtn = document.querySelector('.toggler');
const charactersContainer = document.querySelector('.characters');
const searchInput = document.querySelector('.search-box__input');
let allCharacters = [];
let charactersToRender = [];

const search = (e) => {
  charactersToRender = allCharacters.filter((char) =>
    char.name.toLowerCase().includes(e.target.value.toLowerCase())
  );
  renderCharacters();
  setEventlistenerOnCharacters();
};

const handleTogglerClick = () => {
  if (togglerBtn.querySelector('.fa-sort-down')) {
    headerTag.classList.add('header--open');
    mainTag.classList.add('header-open-for-main');
    togglerBtn.innerHTML = '<i title="close" class="fas fa-sort-up"></i>';
    setTimeout(() => {
      headerTag.classList.add('change-position');
    }, 150);
  } else {
    togglerBtn.innerHTML = '<i title="open" class="fas fa-sort-down"></i>';
    headerTag.classList.remove('header--open');
    setTimeout(() => {
      headerTag.classList.remove('change-position');
      mainTag.classList.remove('header-open-for-main');
    }, 150);
  }
};

if (window.innerWidth >= 992) handleTogglerClick();

togglerBtn.addEventListener('click', handleTogglerClick);
searchInput.addEventListener('input', search);

const getCharacters = async () => {
  const resp = await fetch('../json/got.json');
  const data = await resp.json();
  return data;
};

const sortCharactersByName = (data) => {
  sortedData = data.sort((a, b) => {
    a = a.name.split(' ');
    a = a.length > 1 ? a[1] : a[0];
    b = b.name.split(' ');
    b = b.length > 1 ? b[1] : b[0];
    if (a === b) {
      return 0;
    } else if (a < b) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

const renderCharacters = () => {
  charactersHTML = charactersToRender.map(({ portrait, name }) => {
    return `<div class="character" data-name="${name}">
            <img class="character__image" src="${portrait}" alt="${name}" />
            <p class="character__name">${name}</p>
            <i
              title="click for more info"
              class="fas fa-info-circle character__info-icon"
            ></i>
          </div>`;
  });
  charactersContainer.innerHTML = charactersHTML.length
    ? charactersHTML.join('')
    : '<div class="not-found">Character not found</div>';
};

const getCharacter = (name) => {
  return charactersToRender.find((char) => char.name === name);
};

const renderCharacterDetails = (charName) => {
  const characterDetailsHTML = document.querySelector('.character-details');
  const character = getCharacter(charName);
  characterDetailsHTML.innerHTML = `
  <div class="character-details__image ${character.dead ? 'dead' : ''}">
    <img
    src="${character.picture ? character.picture : './assets/placeholder-image.jpg'}"
    alt="a picture of ${character.name}"
    />
  </div>
  <div class="character-details__name-and-badge">
    <h2>${character.name}</h2>
    ${
      character.house
        ? `<img src="./assets/houses/${character.house}.png" alt="${character.house}" title="${character.house}" />`
        : ''
    }
  </div>
  <p class="character-details__description">
    ${character.bio}
  </p>
  `;
};

const handleCharacterWasClicked = (e) => {
  renderCharacterDetails(e.currentTarget.dataset.name);
  if (document.querySelector('.fa-sort-down')) {
    handleTogglerClick();
  }
};

const setEventlistenerOnCharacters = () => {
  const charHTMLS = document.querySelectorAll('.character');
  charHTMLS.forEach((charHTML) =>
    charHTML.addEventListener('click', handleCharacterWasClicked)
  );
};

getCharacters()
  .then(sortCharactersByName)
  .then((sortedData) => {
    allCharacters = sortedData;
    charactersToRender = sortedData;
    renderCharacters();
    setEventlistenerOnCharacters();
  });
