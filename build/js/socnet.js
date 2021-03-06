(function () {
'use strict';

var getData = fetch(`https://dashboard.sn-mg.ru/service/monitoring/dashboards?reportId=12253`).then(response => response.json());

/**
 * makes space-divided number
 * @param {number} x
 * @return {string}
 */

const socnets = document.querySelector(`.socnets`);

const adoptTotal = (json => {
  const periods = json.datasheets.map(period => {
    const timeStamp = new Date();
    const time = period.title.split(`:`);
    const [hours, minutes] = time;
    timeStamp.setHours(hours);
    timeStamp.setMinutes(minutes);
    timeStamp.setSeconds(0);
    const periodTotal = period.sheetData.snetwork.total;
    let sum = 0;
    const snets = {};
    for (const sn in periodTotal) {
      if (periodTotal.hasOwnProperty(sn)) {
        snets[sn] = parseInt(periodTotal[sn], 10);
        sum += snets[sn];
      }
    }
    return {
      timeStamp: timeStamp,
      _sum: parseInt(sum, 10),
      total() {
        return this._sum;
      },
      snets: snets
    };
  });

  return periods;

});

const countStats = () => {
  getData.then(adoptTotal).then(periods => {
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
  }).then(total => {
    for (const sn in total) {
      if (total.hasOwnProperty(sn)) {
        socnets.querySelector(`#${sn}`).innerText = total[sn];
      }
    }
    socnets.classList.add(`animated`);
    // socnets.innerHTML = socnets.innerHTML;
  }).catch(error => {
    console.error(error);
  });
};
countStats();
setInterval(countStats, 10000);

}());

//# sourceMappingURL=socnet.js.map
