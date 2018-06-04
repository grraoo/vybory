(function () {
'use strict';

/**
 * makes space-divided number
 * @param {number} x
 * @return {string}
 */
function numberWithSpaces(x) {
  if (x !== null && typeof x !== `undefined` && x !== `` && x.toString().length > 4) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `&thinsp;`);
  }
  return x;
}

var getData = fetch(`https://dashboard.sn-mg.ru/service/monitoring/dashboards?reportId=12253`).then(response => response.json());

const totalNumber = document.getElementById(`total-number`);

let interval;
const dataV = {
  isActive: true,
  _numberArr: [],
  numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  get numberArr() {
    return this._numberArr;
  },
  setPosition: (num) => {
    return `transform: translateY(-${num * 100}%); transition-duration: .3s;`;
  }
};
const counter = new Vue({
  el: `#total-number`,
  data: dataV
});
const reCountTotal = (periods) => {
  const prev = [...periods].reverse().find(period => (new Date() >= period.timeStamp));
  const to = periods.find(period => (new Date() < period.timeStamp)) || prev;
  const current = {
    prev: prev,
    to: to,
    get time() {
      return new Date()
    },
    get length() {
      return this.to.timeStamp - this.prev.timeStamp
    },
    get diff() {
      return this.to.total() - this.prev.total()
    },
    get percent() {
      return (this.time - this.prev.timeStamp) / this.length
    },
    get total() {
      return this.prev.total() + this.diff * this.percent;
    },
  };
  clearInterval(interval);
  interval = setInterval(() => {
    if (dataV.isActive) {
      dataV._numberArr = (Math.round(current.total).toString().split(``)).map(num => parseInt(num));
    }
  }, 1000);
};
// reCountTotal();
// setInterval(reCountTotal, 60000);

var totalScreen = {reCountTotal: reCountTotal, dataV: dataV};

const columns = document.querySelector(`.columns`);
const bigNum = document.querySelector(`#last .big-num`);

const buildLast = (periods) => {
  const to = periods.find(period => (new Date() < period.timeStamp)) || periods[periods.length - 1];
  const index = periods.indexOf(to);
  const periods8 = [];
  for (let i = index - 8; i < index; i++) {
    if (periods[i]) {
      periods8.push(periods[i].number);
    }
  }
  return periods8;

};

const showLast = (current) => {
  const max = Math.max(...current) * 5;
  const average = current[current.length - 1];
  const diff = current[current.length - 1] - current[current.length - 2];
  columns.innerHTML = ``;
  current.forEach(number => {
    const column = document.createElement(`div`);
    const innerColumn = document.createElement(`div`);
    column.classList.add(`column`);
    innerColumn.style = `height: calc(5 * ${(number) * 23 / max}vh)`;
    column.appendChild(innerColumn);
    columns.appendChild(column);
  });
  if (diff >= 0) {
    bigNum.classList.remove(`big-num--down`);
    bigNum.classList.add(`big-num--up`);
  } else {
    bigNum.classList.remove(`big-num--up`);
    bigNum.classList.add(`big-num--down`);
  }
  bigNum.dataset.average = average;
};

var last = {
  build: buildLast,
  show: showLast
};

const TIMEOUT = 5000;
const bigNum$1 = document.querySelector(`#map .slider`);
const mapSvg = document.querySelector(`.main-map`);
let interval$1 = 0;

const adoptMapData = (periods) => {
  const to = periods.find(period => (new Date() < period.timeStamp)) || periods[periods.length - 1];
  const current = {
    to: to,
    get total() {
      const total = {
        sum: 0,
        regs: {}
      };
      let max = 0;
      for (const reg in this.to.regions) {
        if (this.to.regions.hasOwnProperty(reg)) {

          const regValue = parseInt(this.to.regions[reg], 10) || 0;
          if (regValue > max) {
            total.max = reg;
            max = regValue;
          }
          total.regs[reg] = regValue;
          total.sum += regValue;
        }
      }
      return total;
    }
  };
  return {
    max: current.total.regs[current.total.max],
    regs: current.total.regs
  };
};
// .then(adoptMapData).then(paintMap).then(startMapSlide)

const paintMap = (total) => {
  const currentRegs = [];
  for (const reg in total.regs) {
    if (total.regs.hasOwnProperty(reg)) {
      const value = (1 - 3 * (total.regs[reg] / total.max)).toFixed(2);
      const region = document.getElementById(reg);
      if (region && parseInt(value) < 1) {
        currentRegs.push(reg);
        region.style.fill = `rgba(0, 109, 196, ${1 - value})`;
        bigNum$1.querySelector(`.slide--${reg} .big-num`).innerHTML = numberWithSpaces(total.regs[reg]);
      }
    }
  }
  return currentRegs;
};
const state = {
  isActive: true
};
const startMapSlide = (regs) => {
  const slides = regs.map(reg => bigNum$1.querySelector(`.slide--${reg}`));
  if (interval$1) {
    clearInterval(interval$1);
  }

  interval$1 = setInterval(() => {
    if (state.isActive) {
      const active = slides.find(slide => slide.classList.contains(`slide--active`));
      if (active) {
        active.classList.remove(`slide--active`);
      }
      const index = (slides.indexOf(active) + 1) % slides.length;
      slides[index].classList.add(`slide--active`);
      if (regs[index] === `moscow`) {
        mapSvg.style = `transform: translate(151%, 24%) scale(4.5);`;
      } else if (regs[index] === `spb`) {
        mapSvg.style = `transform: translate(95%, 48%) scale(3);`;
      } else if (regs[index] === `krasnoyarsk`) {
        mapSvg.style = `transform: translate(-7%, -18%) scale(1.3)`;
      } else if (regs[index] === `nnovgorod`) {
        mapSvg.style = `transform: translate(96%, -8%) scale(3.2);`;
      } else {
        mapSvg.style = ``;
      }
    }
  }, TIMEOUT);

};

var map = {
  adopt: adoptMapData,
  paint: paintMap,
  startSlide: startMapSlide,
  state: state
};

const adoptTotal = (json => {
  console.log(`loaded`);
  const periods = {total:[], last:[], map:[]};
  const mapArr = [];
  const total = json.datasheets.map(period => {
    const timeStamp = new Date();
    const time = period.title.split(`:`);
    const [hours, minutes] = time;
    timeStamp.setHours(hours);
    timeStamp.setMinutes(minutes);
    timeStamp.setSeconds(0);

    const periodTotal = period.sheetData.snetwork.total;
    let sum = 0;
    for (const sn in periodTotal) {
      if (periodTotal.hasOwnProperty(sn)) {
        sum += parseInt(periodTotal[sn], 10);
      }
    }

    const periodRegions = period.sheetData.regions.russia;
    const regions = periodRegions;

    mapArr.push({
      timeStamp: timeStamp,
      regions: regions
    });

    return {
      timeStamp: timeStamp,
      _sum: parseInt(sum, 10),
      total() {
        return this._sum;
      }
    };
  });
  periods.total = total;
  periods.map = mapArr;

  const periodsLast = json.properties[`10min_dynamics`];
  const last$$1 = [];
  for (const period in periodsLast) {
    if (periodsLast.hasOwnProperty(period)) {
      const timeStamp = new Date();
      const time = period.split(`:`);
      const [hours, minutes] = time;
      timeStamp.setHours(hours);
      timeStamp.setMinutes(minutes);
      timeStamp.setSeconds(0);
      const number = parseInt(periodsLast[period], 10);
      last$$1.push({
        timeStamp: timeStamp,
        number: number
      });
    }
  }
  periods.last = last$$1;

  return periods;

});

const reNew = () => {
  getData.then(adoptTotal).then(total => {
    totalScreen.reCountTotal(total.total);
    last.show(last.build(total.last));
    return total.map
  }).then(map.adopt).then(map.paint).then(map.startSlide)
  .catch(error => {console.error(error);});
  };


const dataStorage = {
  reNew() {
    reNew();
    setInterval(reNew, 60000);
  }
};

var hashCnangeHandler = () => {
  const hash = window.location.hash;
  if(hash && hash.length > 1) {
    console.log(hash);
  }
};

dataStorage.reNew();

const Timeouts = {
  map: 5000,
  total: 3000,
  last: 3000
};

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
      map.state.isActive = (slideId === `map`);
      if (this.autoPlay) {
        this.interval = setTimeout(() => {
          this.next();
        }, this.timeout);
      } else {
        clearTimeout(this.interval);
      }
    }
  }
};

let autoPlay = setTimeout(() => {
    Slider.next();
  }, Slider.timeout);
const stopAutoPlay = () => {
  clearTimeout(Slider.interval);
  sliderControl.classList.remove(`slider-controls--animated`);
  Slider.autoPlay = false;
  Slider.interval = null;
};

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
      sliderControl.classList.add(`slider-controls--animated`);
  }
});

// Slider.slide(Slider.btns[2]);
// stopAutoPlay();

sliderBtns[1].focus();

hashCnangeHandler();
window.onhashchange = hashCnangeHandler;

}());

//# sourceMappingURL=main.js.map
