var socnet = (function () {
'use strict';

/**
 * makes space-divided number
 * @param {number} x
 * @return {string}
 */

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

return socnet;

}());

//# sourceMappingURL=socnet.js.map
