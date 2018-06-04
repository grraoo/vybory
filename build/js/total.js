var total = (function () {
'use strict';

/**
 * makes space-divided number
 * @param {number} x
 * @return {string}
 */

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

var total = {reCountTotal: reCountTotal, dataV: dataV};

return total;

}());

//# sourceMappingURL=total.js.map
