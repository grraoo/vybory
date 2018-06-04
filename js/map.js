import numberWithSpaces from "./lib/numberWithSpaces";
import load from "./lib/load";
const TIMEOUT = 5000;
const bigNum = document.querySelector(`#map .slider`);
const mapSvg = document.querySelector(`.main-map`);
let interval = 0;

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
        bigNum.querySelector(`.slide--${reg} .big-num`).innerHTML = numberWithSpaces(total.regs[reg]);
      }
    }
  }
  return currentRegs;
};
const state = {
  isActive: true
};
const startMapSlide = (regs) => {
  const slides = regs.map(reg => bigNum.querySelector(`.slide--${reg}`));
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    if (state.isActive) {
      const active = slides.find(slide => slide.classList.contains(`slide--active`));
      if (active) {
        active.classList.remove(`slide--active`)
      }
      const index = (slides.indexOf(active) + 1) % slides.length;
      slides[index].classList.add(`slide--active`);
      if (regs[index] === `moscow`) {
        mapSvg.style = `transform: translate(151%, 24%) scale(4.5);`
      } else if (regs[index] === `spb`) {
        mapSvg.style = `transform: translate(95%, 48%) scale(3);`
      } else if (regs[index] === `krasnoyarsk`) {
        mapSvg.style = `transform: translate(-7%, -18%) scale(1.3)`
      } else if (regs[index] === `nnovgorod`) {
        mapSvg.style = `transform: translate(96%, -8%) scale(3.2);`
      } else {
        mapSvg.style = ``
      }
    }
  }, TIMEOUT);

}

export default {
  adopt: adoptMapData,
  paint: paintMap,
  startSlide: startMapSlide,
  state: state
}
