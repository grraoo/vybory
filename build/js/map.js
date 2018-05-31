(function () {
'use strict';

var getData = fetch(`https://dashboard.sn-mg.ru/service/monitoring/dashboards?reportId=12253`).then(response => response.json());

/**
 * makes space-divided number
 * @param {number} x
 * @return {string}
 */
function numberWithSpaces(x) {
  if (x !== null && typeof x !== `undefined` && x !== ``) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `&thinsp;`);
  }
  return `н/д`;
}

const bigNum = document.querySelector(`.big-num`);

const adoptTotal = (json => {

  return json.datasheets.map(period => {
      const timeStamp = new Date();
      const time = period.title.split(`:`);
      const [hours, minutes] = time;
      timeStamp.setHours(hours);
      timeStamp.setMinutes(minutes);
      timeStamp.setSeconds(0);
      const periodRegions = period.sheetData.regions.russia;
      const regions = periodRegions;

      return {
        timeStamp: timeStamp,
        regions: regions
      };
    });

});

const paintMap = () => {
  getData.then(adoptTotal).then(periods => {

    const to = periods.find(period => (new Date() < period.timeStamp));
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
    return {max: current.total.regs[current.total.max], regs: current.total.regs};
  }).then(total => {
    for (const reg in total.regs) {
      if (total.regs.hasOwnProperty(reg)) {
        const value = (1 - 3 * (total.regs[reg] / total.max)).toFixed(2);
        const region = document.getElementById(reg);
        if(region && parseInt(value) < 1) {
          region.style.fill = `rgba(0, 109, 196, ${1 - value})`;
        }
      }
    }
    bigNum.innerHTML = numberWithSpaces(total.regs.moscow);
  }).catch(error => {
    console.error(error);
  });
};
paintMap();
setTimeout(() => {
  paintMap();
}, 60000);

}());

//# sourceMappingURL=map.js.map
