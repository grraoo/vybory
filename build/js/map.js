var map = (function () {
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

fetch(`https://dashboard.sn-mg.ru/service/monitoring/dashboards?reportId=12253`).then(response => response.json());

const totalNumber = document.getElementById(`total-number`);

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
// reCountTotal();
// setInterval(reCountTotal, 60000);

const columns = document.querySelector(`.columns`);
const bigNum$1 = document.querySelector(`#last .big-num`);

const socnets = document.querySelector(`.socnets`);

const TIMEOUT = 3300;
const bigNum = document.querySelector(`#map .slider`);
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
        bigNum.querySelector(`.slide--${reg} .big-num`).innerHTML = numberWithSpaces(total.regs[reg]);
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

  state.slides = regs.map(reg => bigNum.querySelector(`.slide--${reg}`));

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

return map;

}());

//# sourceMappingURL=map.js.map
