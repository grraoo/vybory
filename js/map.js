import numberWithSpaces from "./lib/numberWithSpaces";
import load from "./lib/load";
const TIMEOUT = 2000;
const bigNum$1 = document.querySelector(`#map .slider`);
const mapSvg = document.querySelector(`.main-map`);
const adoptMapData = (periods) => {
  const prev = [...periods].reverse().find(period => (new Date() >= period.timeStamp));
  const to = periods.find(period => (new Date() < period.timeStamp)) || periods[periods.length - 1];
  const diff = to.timeStamp - prev.timeStamp;
  const percent = new Date() - prev.timeStamp;
  const current = {
    to: to,
    prev: prev,
    diff: diff,
    percent: (percent / diff),
    get total() {
      const total = {
        sum: 0,
        regs: {}
      };
      let max = 0;
      for (const reg in this.to.regions) {
        if (this.to.regions.hasOwnProperty(reg)) {

          const regValue = Math.round(parseInt(this.prev.regions[reg], 10) + (parseInt(this.to.regions[reg], 10) - parseInt(this.prev.regions[reg], 10)) * this.percent) || 0;
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
      const value = (1 - 8 * (total.regs[reg] / total.max)).toFixed(2);
      const region = document.getElementById(reg);
      if (region && parseInt(value) < 1) {
        currentRegs.push(reg);
        region.style.fill = `rgba(0, 109, 196, ${(1 - value)})`;
        region.style.opacity = `0.3`;
        bigNum$1.querySelector(`.slide--${reg} .big-num`).innerHTML = numberWithSpaces(total.regs[reg]);
      }
    }
  }
  const arr = [...currentRegs];
  arr.sort((a, b) => total.regs[a] < total.regs[b]).unshift(`russia`);
  return arr;
};
const state = {
  isActive: true,
  interval: null,
  svg: mapSvg
};
let Timeouts = {
  russia: 0,
  regs: 0
}

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
  if(city === `russia`) {
    index = 0;
  } else {
    index = (slides.indexOf(active) + 1) % slides.length;
  }

  slides[index].classList.add(`slide--active`);

    const region = document.getElementById(regs[index]);
    if(region) {
    slides[index].dataset.region = region.id;
    region.style.opacity = `1`;
}
  clearTimeout(state.interval);
  if (regs[index] === `moscow`) {
    state.interval = setTimeout(mapSlide, Timeouts.regs);
    mapSvg.style = `transform: rotate(-55deg) translate(178%, 26%) scale(4.7)`;
  } else if (regs[index] === `perm`) {
    state.interval = setTimeout(mapSlide, Timeouts.regs);
    mapSvg.style = `transform: rotate(-35deg) translate(77%, -29%) scale(3.2);`;
  } else if (regs[index] === `tatarstan`) {
    state.interval = setTimeout(mapSlide, Timeouts.regs);
    mapSvg.style = `transform: rotate(-25deg) translate(134%, -40%) scale(4.5)`;
  } else if (regs[index] === `spb`) {
    state.interval = setTimeout(mapSlide, Timeouts.regs);
    mapSvg.style = `transform: rotate(-60deg) translate(118%, 58%) scale(3.1);`;
  } else if (regs[index] === `krasnoyarsk`) {
    state.interval = setTimeout(mapSlide, Timeouts.regs);
    mapSvg.style = `transform: translate(-7%, -18%) scale(1.3)`;
  } else if (regs[index] === `nnovgorod`) {
    state.interval = setTimeout(mapSlide, Timeouts.regs);
    mapSvg.style = `transform: translate(96%, -8%) scale(3.2);`;
  } else {
    state.interval = setTimeout(mapSlide, Timeouts.russia);
    mapSvg.style = ``;
  }
};

const startMapSlide = (regs, timeout) => {
  if(regs) {
    state.regs = regs;
    return
  }
  regs = state.regs;
  const rusTimeout = Math.round(timeout / ((2 * regs.length) - 1));
  const regsTimeout = rusTimeout * 2;

  // const rusTimeout = Math.round(timeout / ((3 * regs.length) - 2));
  // const regsTimeout = rusTimeout * 3;
  Timeouts = {
    russia: rusTimeout,
    regs: regsTimeout
  }
  console.log(Timeouts)
  state.slides = regs.map(reg => bigNum$1.querySelector(`.slide--${reg}`));

  if (state.interval) {
    mapSvg.style = ``;
    clearInterval(state.interval);
  }

  mapSlide(`russia`);
  // state.interval = setTimeout(mapSlide, Timeouts.russia);

};

export default {
  adopt: adoptMapData,
  paint: paintMap,
  startSlide: startMapSlide,
  state: state
}
