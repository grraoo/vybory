import getData from "./fetch";
import totalScreen from "../total";
import last from "../last";
import map from "../map";
import socnet from "../socnet";


const fullscreen3 = (element) => {
  if (element.requestFullScreen) {
    element.requestFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
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
    })
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
  const last = [];
  for (const period in periodsLast) {
    if (periodsLast.hasOwnProperty(period)) {
      const timeStamp = new Date();
      const time = period.split(`:`);
      const [hours, minutes] = time;
      timeStamp.setHours(hours);
      timeStamp.setMinutes(minutes);
      timeStamp.setSeconds(0);
      const number = parseInt(periodsLast[period], 10);
      last.push({
        timeStamp: timeStamp,
        number: number
      })
    }
  }
  periods.last = last;



  return periods;

});

const reNewData = () => {
  getData.then(adoptTotal).then(total => {
    totalScreen.reCountTotal(total.total);
    last.show(last.build(total.last));
    socnet.print(socnet.build(total.sn));

    return total.map
  }).then(map.adopt).then(map.paint).then(map.startSlide)
  .then(() => {
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
  })
  .catch(error => {console.error(error)})
  }


const dataStorage = {
  reNew() {
    reNewData();
    setInterval(reNewData, 60000);
  }
}

export default dataStorage;
