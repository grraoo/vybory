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

const TIMEOUT = 3300;
const bigNum$1 = document.querySelector(`#map .slider`);
const mapSvg = document.querySelector(`.main-map`);
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
        region.style.fill = `rgba(0, 109, 196, ${(1 - value)})`;
        region.style.opacity = `0.3`;
        bigNum$1.querySelector(`.slide--${reg} .big-num`).innerHTML = numberWithSpaces(total.regs[reg]);
      }
    }
  }
  
  return currentRegs;
};
const state = {
  isActive: true,
  interval: null,
  svg: mapSvg
};


const mapSlide = (city) => {
  const slides = state.slides;
  const regs = state.regs;

  const active = slides.find(slide => slide.classList.contains(`slide--active`));

  if (active) {
    active.classList.remove(`slide--active`);
    if(active.dataset.region){
      document.getElementById(active.dataset.region).style.opacity = `0.3`;
    }
  }
  let index = 0;
  if(city === `moscow`) {
    index = 0;  
  } else {
    index = (slides.indexOf(active) + 1) % slides.length;
  }

  slides[index].classList.add(`slide--active`);
  const region = document.getElementById(regs[index]);
  slides[index].dataset.region = region.id;
  region.style.opacity = `1`;

  if (regs[index] === `moscow`) {
    mapSvg.style = `transform: translate(161%, 24%) scale(4.5);`;
  } else if (regs[index] === `perm`) {
    mapSvg.style = `transform: translate(66%, -28%) scale(3.2);`;
  } else if (regs[index] === `tatarstan`) {
    mapSvg.style = `transform: translate(131%, -53%) scale(4.5);`;
  } else if (regs[index] === `spb`) {
    mapSvg.style = `transform: translate(95%, 48%) scale(3);`;
  } else if (regs[index] === `krasnoyarsk`) {
    mapSvg.style = `transform: translate(-7%, -18%) scale(1.3)`;
  } else if (regs[index] === `nnovgorod`) {
    mapSvg.style = `transform: translate(96%, -8%) scale(3.2);`;
  } else {
    mapSvg.style = ``;
  }
};

const startMapSlide = (regs) => {
  if(regs) {
    state.regs = regs;
    return
  }
  regs = state.regs;

  state.slides = regs.map(reg => bigNum$1.querySelector(`.slide--${reg}`));

  if (state.interval) {
    clearInterval(state.interval);
  }
  mapSlide(`moscow`);
  state.interval = setInterval(mapSlide, TIMEOUT);
};

var map = {
  adopt: adoptMapData,
  paint: paintMap,
  startSlide: startMapSlide,
  state: state
};

const socnets = document.querySelector(`.socnets`);

const buildStatsSn = (periods) => {
  const prev = [...periods].reverse().find(period => (new Date() >= period.timeStamp));
  const to = periods.find(period => (new Date() < period.timeStamp)) || prev;
  const current = {
    from: prev,
    to: to,
    get diff() {
      return this.to.total() - this.from.total();
    },
    get total() {
      const total = {
        sum: 0,
        snets: {}
      };
      let max = 0;
      for (const sn in this.to.snets) {
        if (this.to.snets.hasOwnProperty(sn)) {
          const percent = Math.round(100 * (this.to.snets[sn] - this.from.snets[sn]) / this.diff);
          if (percent > max) {
            total.max = sn;
            max = percent;
          }
          total.snets[sn] = `${percent}%`;
          total.sum += percent;
        }
      }
      const percentSum = 0;
      const percentArr = [];
      if (total.sum !== 100) {
        total.snets[total.max] = `${parseInt(total.snets[total.max], 10) - (total.sum - 100)}%`;
      }
      return total;
    }
  };
  return current.total.snets;
};

const printStatsSn = (total) => {
  for (const sn in total) {
    if (total.hasOwnProperty(sn)) {
      socnets.querySelector(`#${sn}`).innerText = total[sn];
    }
  }
  socnets.classList.add(`animated`);
};


var socnet = {
  build: buildStatsSn,
  print: printStatsSn
};

const adoptTotal = (json => {
  const periods = {total:[], last:[], map:[]};
  const mapArr = [];
  const snArr = [];
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

    const periodSN = period.sheetData.snetwork.total;
    let snsum = 0;
    const snets = {};
    for (const sn in periodSN) {
      if (periodSN.hasOwnProperty(sn)) {
        snets[sn] = parseInt(periodSN[sn], 10);
        snsum += snets[sn];
      }
    }
    snArr.push({
      timeStamp: timeStamp,
      _sum: parseInt(snsum, 10),
      total() {
        return this._sum;
      },
      snets: snets
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
  periods.sn = snArr;

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

const reNewData = () => {
  getData.then(adoptTotal).then(total => {
    totalScreen.reCountTotal(total.total);
    last.show(last.build(total.last));
    socnet.print(socnet.build(total.sn));
    return total.map
  }).then(map.adopt).then(map.paint).then(map.startSlide)
  .catch(error => {console.error(error);});
  };


const dataStorage = {
  reNew() {
    reNewData();
    setInterval(reNewData, 60000);
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
  total: 5001,
  last: 5002,
  socnet: 5003,
  map: 10001,
  wall: 0
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
    this.slide(slideId);
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

        map.startSlide();

      } else if (slideId === `last`) {

        const boo = document.querySelector(`.columns`);
        boo.innerHTML = boo.innerHTML;
        const bigNum = document.querySelector(`#last .big-num`);
        growNum(document.querySelector(`#last .big-num`), document.querySelector(`#last .big-num`).dataset.average);

      } else if (slideId === `wall`) {

        if(flag) {
          wallPost.remove();
        } else {
          wallPost.hidden = false;
          wallPost.style = `animation-duration: ${Slider._timeout.wall / 2}ms; animation-delay: ${Slider._timeout.wall / 2}ms`;
          document.body.appendChild(wallPost);
        }
      }

      if(slideId !== `map`) {
        map.state.svg.style = ``;
        clearInterval(map.state.interval);
      }
      totalScreen.dataV.isActive = (slideId === `total`);
      map.state.isActive = (slideId === `map`);
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
};

let autoPlay = setTimeout(() => {
  Slider.next();
}, Slider.timeout);

const stopAutoPlay = () => {
  Slider.autoPlay = false;
  clearTimeout(Slider.interval);
  clearTimeout(autoPlay);
  Slider.interval = null;
  sliderControl.classList.remove(`slider-controls--animated`);
};

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
});

// Slider.slide(`last`);
// stopAutoPlay();

sliderBtns[0].style = `animation-duration: ${Timeouts.total}ms`;
sliderBtns[1].focus();
hashCnangeHandler();
window.onhashchange = hashCnangeHandler;

}());

//# sourceMappingURL=main.js.map
