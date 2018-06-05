var last = (function () {
'use strict';

fetch(`https://dashboard.sn-mg.ru/service/monitoring/dashboards?reportId=12253`).then(response => response.json());

/**
 * makes space-divided number
 * @param {number} x
 * @return {string}
 */

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

const bigNum$1 = document.querySelector(`#map .slider`);
const mapSvg = document.querySelector(`.main-map`);

const socnets = document.querySelector(`.socnets`);

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

return last;

}());

//# sourceMappingURL=last.js.map
