(function () {
'use strict';

/**
 * makes space-divided number
 * @param {number} x
 * @return {string}
 */
function numberWithSpaces(x) {
  if (x !== null && typeof x !== `undefined` && x !== ``) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `&thinsp;`);
  }
  return `н/д`;
}

const TIMEOUT = 10000;
const sliderControl = document.querySelector(`.slider-controls`);
const frame = document.getElementById(`slide`);
const sliderBtns = [...sliderControl.querySelectorAll(`.slider-control`)];
const slideIds = sliderBtns.map((btn) => btn.dataset.slide);
const bullit = document.querySelector(`.bullit`);
const growNum = (node, num) => {
  console.log(node, num);
  let temp = 0;
  let grow = setInterval(() => {
    if(Math.floor(temp+= num / 200) <= num) {
      node.innerHTML = numberWithSpaces(Math.floor(temp));
    } else {
      clearInterval(grow);
    }
  }, 5);
};

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
      if(slideId === `socnet`) {
        const sn = document.querySelector(`#socnet`).contentWindow.document.querySelector(`.socnets`);
        sn.innerHTML = sn.innerHTML;
      } else if(slideId === `last`) {
        const boo = document.querySelector(`#last`).contentWindow.document.querySelector(`.columns`);
        boo.innerHTML = boo.innerHTML;
        const bigNum = document.querySelector(`#last`).contentWindow.document.querySelector(`.big-num`);
        growNum(document.querySelector(`#last`).contentWindow.document.querySelector(`.big-num`), document.querySelector(`#last`).contentWindow.document.querySelector(`.big-num`).dataset.average);

      }
      btn.classList.add(`slider-control--active`);
      btn.appendChild(bullit);
    }
  }
};

let autoPlay = setInterval(() => {
  Slider.next();
}, TIMEOUT);
const stopAutoPlay = () => {
  clearInterval(autoPlay);
  sliderControl.classList.remove(`slider-controls--animated`);
  autoPlay = null;
};

window.addEventListener(`keyup`, (e) => {
  switch (e.keyCode) {
    case 32: //space
      Slider.next();
      stopAutoPlay();

      break;
    case 8: //backspace
      Slider.prev();
      stopAutoPlay();

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
      stopAutoPlay();

      break;
    case 13: //enter
      if (!autoPlay) {
        autoPlay = setInterval(() => {
          Slider.next();
        }, TIMEOUT);
      }
      sliderControl.classList.add(`slider-controls--animated`);

  }
});

// Slider.slide(Slider.btns[1]);
// stopAutoPlay();
sliderBtns[1].focus();

}());

//# sourceMappingURL=main.js.map
