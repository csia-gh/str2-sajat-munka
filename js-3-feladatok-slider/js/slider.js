export class Slider {
  constructor({ containerSelector = '', imgs = [], interval = 2000 } = {}) {
    this.container = document.querySelector(containerSelector);
    this.container.classList.add('slider__container');
    this.imgs = imgs;
    this.interval = interval;

    this.renderSlider();

    this.sliderInner = document.querySelector('.slider__inner');
    this.indicators = document.querySelectorAll('.indicator');
    this.arrows = document.querySelectorAll('.arrow');
    this.whichInRow = document.querySelector('.which-in-row');

    this.setListeners();
    this.launchSlider();
    this.setWichInRow();
  }

  setListeners() {
    this.indicators.forEach((indicator) => {
      indicator.addEventListener('click', (e) => this.indicatorWasClicked(e));
    });
    this.arrows.forEach((arrow) => {
      arrow.addEventListener('click', (e) => this.arrowWasClicked(e));
    });
  }

  setWichInRow() {
    let currentDataNum = Number(
      this.getCurrentIndicatorDataNumFromLeftValue(this.sliderInner.style.left)
    );
    this.whichInRow.textContent = `${currentDataNum + 1}/${this.imgs.length}`;
  }

  getCurrentIndicatorDataNumFromLeftValue(leftValue) {
    return !leftValue ? 0 : String(leftValue).slice(1, 2);
  }

  getCurrentIndicator(leftValue) {
    const indicatorNum = this.getCurrentIndicatorDataNumFromLeftValue(leftValue);
    const indicator = document.querySelector(
      `.indicator[data-num="${indicatorNum}"]`
    );
    return indicator;
  }

  slide(leftValue, direct) {
    if (!direct) {
      let left = this.sliderInner.style.left;

      for (const [i, img] of this.imgs.entries()) {
        if (!left) {
          left = '-100%';
          break;
        } else if (left === `-${i}00%` && i < this.imgs.length - 1) {
          left = `-${i + 1}00%`;
          break;
        } else if (left === `-${this.imgs.length - 1}00%`) {
          left = '';
          break;
        }
      }

      this.sliderInner.style.left = left;
      this.setIndicatorClass(this.getCurrentIndicator(left));
      this.setArrowsDataset(this.getCurrentIndicatorDataNumFromLeftValue(left));
      this.setWichInRow();
      return;
    }
    this.sliderInner.style.left = leftValue;
    this.setWichInRow();
  }

  launchSlider() {
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => this.slide(), this.interval);
  }

  setIndicatorClass(indicator) {
    this.indicators.forEach((ind) => {
      ind.classList.remove('indicator--current');
    });
    indicator.classList.add('indicator--current');
  }

  setArrowsDataset(currentIndicatorNum) {
    const parsedCurrentIndicatorNum = Number(currentIndicatorNum);
    let prev =
      parsedCurrentIndicatorNum === 0
        ? this.imgs.length - 1
        : parsedCurrentIndicatorNum - 1;
    let next =
      parsedCurrentIndicatorNum === this.imgs.length - 1
        ? 0
        : parsedCurrentIndicatorNum + 1;
    document.querySelector('.arrow--left').setAttribute('data-val', prev);
    document.querySelector('.arrow--right').setAttribute('data-val', next);
    console.log('prev', prev, 'next', next);
  }

  arrowWasClicked(e) {
    const arrowVal = e.target.dataset.val;
    const leftValue = arrowVal === '0' ? '' : `-${arrowVal}00%`;
    this.setIndicatorClass(
      document.querySelector(`.indicator[data-num="${arrowVal}"]`)
    );
    this.setArrowsDataset(arrowVal);
    this.slide(leftValue, true);
    this.launchSlider();
  }

  indicatorWasClicked(e) {
    const indicatorNum = e.target.dataset.num;
    this.setIndicatorClass(e.target);
    const leftValue = indicatorNum === '0' ? '' : `-${indicatorNum}00%`;
    this.setArrowsDataset(this.getCurrentIndicatorDataNumFromLeftValue(leftValue));
    this.slide(leftValue, true);
    this.launchSlider();
  }

  getIndicatorElements() {
    let indicators = '';
    this.imgs.forEach((img, index) => {
      indicators += `<span data-num="${index}" class="indicator ${
        index === 0 ? 'indicator--current' : ''
      }">
                        <i class="fa-solid fa-circle"></i>
                    </span>`;
    });
    return indicators;
  }

  getImgContainerElements() {
    let imgContainers = '';
    this.imgs.forEach((img, index) => {
      imgContainers += `
        <div data-index="${index}" style="background: url(${img}) no-repeat center
        center/cover;" class="img-container">
        </div>
      `;
    });
    return imgContainers;
  }

  setWidth() {
    return `width:${100 * this.imgs.length}%`;
  }

  renderSlider() {
    this.container.innerHTML = `
    <div class="slider__frame">
      <span class="which-in-row"></span>
      <span data-val="${this.imgs.length - 1}" class="arrow arrow--left">
        <i class="fa-solid fa-chevron-left"></i>
      </span>
      <span data-val="1" class="arrow arrow--right">
        <i class="fa-solid fa-chevron-right"></i>
      </span>
      <div class="slider__inner" style="${this.setWidth()}">
        ${this.getImgContainerElements()}
      </div>
      <div class='slider__indicators'>
        ${this.getIndicatorElements()}
      </div>
    </div>
  `;
  }
}
