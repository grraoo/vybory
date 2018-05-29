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
    console.log(slideIds.indexOf(currentSlideId));
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
    // const btn = this.btns[index];
    const btn = this.btns.find((btn) => btn.dataset.slide === slideId);
    this.slide(btn);
  },
  slide(btn) {
    console.log(1, btn.classList, btn.dataset);
    const slideId = btn.dataset.slide;
    if (slideId) {
      const currentControl = sliderControl.querySelector(`.slider-control--active`);
      if (currentControl) {
        currentControl.classList.remove(`slider-control--active`);
      }
      btn.classList.add(`slider-control--active`);
      this.frame.src = `${slideId}.html`;
    }
  }
};

sliderControl.addEventListener(`click`, (e) => {
  Slider.slide(e.target);
});

document.addEventListener(`keyup`, (e) => {
  switch (e.keyCode) {
    case 32:
      Slider.next();
      break;
    case 8:
      Slider.prev();
      break;
    case 49:
    case 50:
    case 51:
    case 52:
    case 97:
    case 98:
    case 99:
    case 100:
      const index = parseInt(e.key, 10) - 1;
      Slider.slide(Slider.btns[index]);
      break;
  }
});

setInterval(() => {Slider.next();}, 3000);

}());

//# sourceMappingURL=main.js.map
