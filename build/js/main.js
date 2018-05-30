(function () {
'use strict';

const sliderControl = document.querySelector(`.slider-controls`);
const frame = document.getElementById(`slide`);
const sliderBtns = [...sliderControl.querySelectorAll(`.slider-control`)];
const slideIds = sliderBtns.map((btn) => btn.dataset.slide);

const Slider = {
  btns: sliderBtns,
  slideIds: slideIds,
  frame: frame,
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
      const currentSlide = document.querySelector(`.iframe--active`);
      if (currentSlide) {
        currentSlide.classList.remove(`iframe--active`);
      }
      document.getElementById(slideId).classList.add(`iframe--active`);
      btn.classList.add(`slider-control--active`);
      // this.frame.src = `${slideId}.html`;
    }
  }
};

let autoPlay = setInterval(() => {
  Slider.next();
}, 3000);
const stopAutoPlay = (autoPlay) => {
  clearInterval(autoPlay);
  sliderControl.classList.remove(`slider-controls--animated`);
};
// sliderControl.addEventListener(`click`, (e) => {
//   Slider.slide(e.target);
// })

document.addEventListener(`keyup`, (e) => {
  switch (e.keyCode) {
    case 32: //space
      Slider.next();
      stopAutoPlay(autoPlay);
      autoPlay = null;
      break;
    case 8: //backspace
      Slider.prev();
      stopAutoPlay(autoPlay);
      autoPlay = null;
      break;
    case 49:
    case 50:
    case 51:
    case 52:
    case 97:
    case 98:
    case 99:
    case 100: // numbers 1-4
      const index = parseInt(e.key, 10) - 1;
      Slider.slide(Slider.btns[index]);
      stopAutoPlay(autoPlay);
      autoPlay = null;
      break;
    case 13: //enter
      if (!autoPlay) {
        autoPlay = setInterval(() => {
          Slider.next();
        }, 3000);
      }
      sliderControl.classList.add(`slider-controls--animated`);

  }
});

// Slider.slide(Slider.btns[2]);

}());

//# sourceMappingURL=main.js.map
