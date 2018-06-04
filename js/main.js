import numberWithSpaces from "./lib/numberWithSpaces";
import load from "./lib/load";
import totalScreen from "./total";
import hashCnangeHandler from "../sass/lib/_hashchange";
import mapScreen from "./map";

load.reNew();

const Timeouts = {
  map: 5000,
  total: 3000,
  last: 3000
}

const sliderControl = document.querySelector(`.slider-controls`);
const sliderBtns = [...sliderControl.querySelectorAll(`.slider-control`)];
const slideIds = sliderBtns.map((btn) => btn.dataset.slide);
const bullit = document.querySelector(`.bullit`);
const growNum = (node, num) => {
  let temp = 0;
  let grow = setInterval(() => {
    if (Math.floor(temp += num / 200) <= num) {
      node.innerHTML = numberWithSpaces(Math.floor(temp));
    } else {
      clearInterval(grow);
    }
  }, 5);
};

const fullscreen3 = (element) => {
  if (element.requestFullScreen) {
    element.requestFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
};

const Slider = {
  btns: sliderBtns,
  slideIds: slideIds,
  _timeout: Timeouts,
  autoPlay: true,
  interval: 0,
  get timeout() {
    return this._timeout[this.slideIds[this.index]];
  },
  get index() {
    const currentSlideId = sliderBtns.find((btn) => btn.classList.contains(`slider-control--active`)).dataset.slide;
    return slideIds.indexOf(currentSlideId);
  },
  next() {
    const index = this.index;

    const slideId = this.slideIds[(index + 1) % this.slideIds.length];
    const btn = this.btns.find((btn) => btn.dataset.slide === slideId);
    this.slide(btn);
  },
  prev() {
    const index = this.index;
    const slideId = this.slideIds[(index - 1 + this.slideIds.length) % this.slideIds.length];
    const btn = this.btns.find((btn) => btn.dataset.slide === slideId);
    this.slide(btn);
  },
  slide(btn) {
    const slideId = btn.dataset.slide;
    if (slideId && slideId !== slideIds[this.index]) {
      const currentControl = sliderControl.querySelector(`.slider-control--active`);
      if (currentControl) {
        currentControl.classList.remove(`slider-control--active`);
      }
      btn.classList.add(`slider-control--active`);
      btn.appendChild(bullit);

      const currentSlide = document.querySelector(`.iframe--active`);
      if (currentSlide) {
        currentSlide.classList.remove(`iframe--active`);
      }
      const newSlide = document.getElementById(slideId);
      newSlide.classList.add(`iframe--active`);

      if (slideId === `socnet`) {
        // const sn = document.querySelector(`.socnets`); // sn.innerHTML = sn.innerHTML;
      } else if (slideId === `last`) {
        const boo = document.querySelector(`.columns`);
        boo.innerHTML = boo.innerHTML;
        const bigNum = document.querySelector(`#last .big-num`);
        growNum(document.querySelector(`#last .big-num`), document.querySelector(`#last .big-num`).dataset.average);
      }
      totalScreen.dataV.isActive = (slideId === `total`);
      mapScreen.state.isActive = (slideId === `map`);
      if (this.autoPlay) {
        this.interval = setTimeout(() => {
          this.next();
        }, this.timeout);
      } else {
        clearTimeout(this.interval);
      }
    }
  }
}

let autoPlay = setTimeout(() => {
    Slider.next();
  }, Slider.timeout);
const stopAutoPlay = () => {
  clearTimeout(Slider.interval);
  sliderControl.classList.remove(`slider-controls--animated`);
  Slider.autoPlay = false;
  Slider.interval = null;
}

window.addEventListener(`keyup`, (e) => {
  switch (e.key) {
    case `5`:
      fullscreen3(document.documentElement);
      break;
    case ` `: //space
      stopAutoPlay();
      Slider.next();

      break;
    case `Backspace`: //backspace
      stopAutoPlay();
      Slider.prev();

      break;
    case `1`:
    case `2`:
    case `3`:
    case `4`: // numbers 1-4
      const index = parseInt(e.key, 10) - 1;
      stopAutoPlay();
      Slider.slide(Slider.btns[index]);
      break;
    case `Enter`: //enter
      if (!Slider.autoPlay) {
        Slider.autoPlay = true;
        Slider.next();
      }
      sliderControl.classList.add(`slider-controls--animated`)
  }
})

// Slider.slide(Slider.btns[2]);
// stopAutoPlay();

sliderBtns[1].focus();

hashCnangeHandler();
window.onhashchange = hashCnangeHandler;
