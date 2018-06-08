import numberWithSpaces from "./lib/numberWithSpaces";
import load from "./lib/load";
import totalScreen from "./total";
import hashCnangeHandler from "./lib/_hashchange";
import mapScreen from "./map";

load.reNew();

const Timeouts = {
  total: 5000,
  last: 5000,
  socnet: 5000,
  map: 9800,
  wall: 10000
};

const sliderControl = document.querySelector(`.slider-controls`);
const sliderBtns = [...sliderControl.querySelectorAll(`.slider-control`)];
const slideIds = sliderBtns.map((btn) => {
  btn.style = `animation-duration: ${Timeouts[btn.dataset.slide]}ms`;
  return btn.dataset.slide;
});
const bullit = document.querySelector(`.bullit`);
const wallPost = document.getElementById(`wallpost`);

const growNum = (node, num) => {
  let temp = 0;
  const delta = num / 50;
  let grow = setInterval(() => {
    if ((temp += delta) <= num) {
      node.innerHTML = numberWithSpaces(Math.floor(temp));
    } else {
      clearInterval(grow);
    }
  }, 20);
};

const Slider = {
  btns: sliderBtns,
  slideIds: slideIds,
  _timeout: Timeouts,
  autoPlay: true,
  interval: null,
  get timeout() {
    return this._timeout[this.slideIds[(this.index)]];
  },
  get btn() {
    return this.btns.find((btn) => btn.classList.contains(`slider-control--active`));
  },
  get index() {
    const currentSlideId = sliderBtns.find((btn) => btn.classList.contains(`slider-control--active`)).dataset.slide;
    return slideIds.indexOf(currentSlideId);
  },
  next() {
    const index = this.index;

    const slideId = this.slideIds[(index + 1) % this.slideIds.length];
    this.slide(slideId, true);
  },
  prev() {
    const index = this.index;
    const slideId = this.slideIds[(index - 1 + this.slideIds.length) % this.slideIds.length];
    this.slide(slideId);
  },

  slide(slideId, flag) {

    if (slideId === `wall` || (slideId && slideId !== slideIds[this.index]) ) {
      const btn = document.querySelector(`[data-slide="${slideId}"]`);
      const currentControl = sliderControl.querySelector(`.slider-control--active`);
      if (currentControl) {
        currentControl.classList.remove(`slider-control--active`);
      }
      if (btn) {
        btn.classList.add(`slider-control--active`);
      }
      const currentSlide = document.querySelector(`.iframe--active`);
      if (currentSlide) {
        currentSlide.classList.remove(`iframe--active`);
      }
      const newSlide = document.getElementById(slideId);
      newSlide.classList.add(`iframe--active`);
      wallPost.remove();

      if (slideId === `socnet`) {

        const sn = document.querySelector(`.socnets`);
        if(sn) {
          sn.innerHTML = sn.innerHTML;
        }

      } else if (slideId === `map`) {

        mapScreen.startSlide();

      } else if (slideId === `last`) {

        const boo = document.querySelector(`.columns`);
        boo.innerHTML = boo.innerHTML;
        const bigNum = document.querySelector(`#last .big-num`);
        growNum(document.querySelector(`#last .big-num`), document.querySelector(`#last .big-num`).dataset.average);

      } else if (slideId === `wall`) {

        // if(flag) {
        if(flag) {
          wallPost.remove();
        } else {
          wallPost.hidden = false;
          wallPost.style = `animation-duration: ${Slider._timeout.wall / 2}ms; animation-delay: ${Slider._timeout.wall / 2}ms`;
          document.body.appendChild(wallPost);
        }
      }

      if(slideId !== `map`) {
        mapScreen.state.svg.style = ``;
        clearInterval(mapScreen.state.interval);
      }
      totalScreen.dataV.isActive = (slideId === `total`);
      mapScreen.state.isActive = (slideId === `map`);
      clearTimeout(this.interval);
      if (this.autoPlay) {
        this.interval = setTimeout(() => {
          this.next();
        }, Timeouts[slideId]);
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
  Slider.autoPlay = false;
  clearTimeout(Slider.interval);
  clearTimeout(autoPlay);
  Slider.interval = null;
  sliderControl.classList.remove(`slider-controls--animated`);
}

window.addEventListener(`keydown`, (e) => {
  // console.log(e.key);
  switch (e.key) {
    case `f`:
    case `а`:
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
    case `w`:
    case `ц`: //Цтена
      stopAutoPlay();
      Slider.slide(`wall`);
      break;

    case `1`:
      stopAutoPlay();
      Slider.slide(`total`);
      break;
    case `2`:
      stopAutoPlay();
      Slider.slide(`socnet`);
      break;
    case `3`:
      stopAutoPlay();
      Slider.slide(`last`);
      break;
    case `4`:
      stopAutoPlay();
      Slider.slide(`map`);
      break;

    case `5`: //wall w/o post
      stopAutoPlay();
      Slider.slide(`wall`, true);
      break;
    case `6`: //wall with post
      stopAutoPlay();
      Slider.slide(`wall`);
      wallPost.hidden = false;
      wallPost.style = `
        animation: none;
        opacity: 1;
        left: 0;
        right: 0;
      `;
      document.body.appendChild(wallPost);
    break;

    case `Enter`: //enter
      if (!Slider.autoPlay) {
        Slider.autoPlay = true;
        setTimeout(() => {
          Slider.next();
        }, Slider.timeout);
      }
      sliderControl.classList.add(`slider-controls--animated`);
  }
})

// Slider.slide(`last`);
// stopAutoPlay();

sliderBtns[0].style = `animation-duration: ${Timeouts.total}ms`;
sliderBtns[1].focus();
hashCnangeHandler();
window.onhashchange = hashCnangeHandler;
