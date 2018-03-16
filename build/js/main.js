(function () {
'use strict';

let serverTime = document.querySelector(`.servertimehours`).getAttribute('timestamp');
let timeShift = (Math.floor((Date.now() / 3600000)) - Math.floor(serverTime / (60 * 60))) % 24;
function declination(number, titles) {
  let num = parseInt(number);
	let cases = [2, 0, 1, 1, 1, 2];
	return titles[ (num%100>4 && num%100<20)? 2 : cases[(num%10<5)?num%10:5] ];
}

if(document.getElementById(`countdown-timer`)){
  let dateEnd = new Date(Date.UTC(2018, 2, 18, 18));

  let data = {
    dateEnd: dateEnd,
    numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    secondsLeft: 1,
    decaHoursNum() {
      return `transition-duration: .3s;transform: translateY(-${Math.floor(this.hoursLeft() / 10) * 10}%)`;
    },
    hoursNum() {
      return `transition-duration: .3s;transform: translateY(-${Math.floor(this.hoursLeft() % 10) * 10}%)`;
    },
    decaMinsNum() {
      return `transition-duration: .3s;transform: translateY(-${Math.floor(this.minLeft() / 10) * 10}%)`;
    },
    MinsNum() {
      return `transition-duration: .3s;transform: translateY(-${Math.floor(this.minLeft() % 10) * 10}%)`;
    },
    decaSecondsNum() {
      return `transition-duration: .3s;transform: translateY(-${Math.floor((this.secondsLeft % 60) / 10) * 10}%)`;
    },
    secondsNum() {
      return `transition-duration:.3s;transform: translateY(-${Math.floor((this.secondsLeft % 10) * 10)}%)`;
    },
    minLeft() {
      let mins = Math.floor(this.secondsLeft / 60) % 60;
      return mins < 10 ? `0` + mins : mins;
    },
    hoursLeft() {
      let hours = ((Math.floor(this.secondsLeft / 3600)) % 24);
      return hours < 10 ? `0` + hours : hours;
    },
    hoursWord() {
      return declination(this.hoursLeft(), ["час", "часа", "часов"]);
    },
    minsWord() {
      return declination(this.minLeft(), ["минута", "минуты", "минут"]);
    },
    secsWord() {
      return declination((this.secondsLeft % 60), ["секунда", "секунды", "секунд"]);
    }
  };

  let countDown = setInterval(function () {
    data.secondsLeft = Math.floor((dateEnd - Date.now()) / (1000));
    if (data.secondsLeft <= 0) {
      clearInterval(countDown);
    }
  }, 1000);

  let app = new Vue({
    el: `#countdown-timer`,
    data: data
  });
}

if(document.getElementById(`counter`)){
  let counterData = {
    numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    number: 10999999,
    percent: {
      men: 0,
      women: 0
    },
    arrnumber() {
      return this.number.toString().split('').reverse().join('');
    },
    setPosition(num) {
      return `transform: translateY(-${num * 100}%); transition-duration: .3s;`;
    }
  };

  let counter = new Vue({
    el: `#counter`,
    data: counterData
  });

  let getCurrHour = function() {
    let startHour = (Date.now() / 3600000 + 3) % 24;
    let endHour = (Date.now() / 3600000 + 4) % 24;
    let startNum = Math.floor(startHour).toString() + ':00';
    let endNum = Math.floor(endHour).toString() + ':00';
    let startValue = startHour - Math.floor(startHour);

    return {
        startNum: startNum < 10 ? '0' + startNum: startNum,
        endNum: endNum < 10 ? '0' + endNum: endNum,
        startValue: startValue,
        timerLength: Math.round((1 - startValue) * 3600000)
      }
    };

  function getData() {
    fetch('https://monitoring.sn-mg.ru/service/monitoring/dashboards/?reportId=11191')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {

        let hours = getCurrHour();
        let startPoll = {};
        let endPoll = {};

        json.datasheets.forEach(sheet => {
          if(sheet.title === hours.startNum) {
            startPoll = sheet;
          } else if (sheet.title === hours.endNum) {
            endPoll = sheet;
          }
        });

        let diffInHour = endPoll.sheetData.exitpoll.total - startPoll.sheetData.exitpoll.total;
        let beginValue = Math.floor(parseInt(startPoll.sheetData.exitpoll.total, 10) + (diffInHour * hours.startValue));

        let exitpoll = endPoll.sheetData.exitpoll;
        counterData.number = beginValue;
        counterData.percent.men = exitpoll.sex.male;
        counterData.percent.women = exitpoll.sex.female;
      });
  }
  getData();
  setInterval(getData, 1000);
}

if(document.getElementById(`mapzones`)) {
  let mapData = {
    serverTime: serverTime,
    numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    colors: [ '#cae7fa', '#b8dff9', '#a5d6f7', '#9cd2f6', '#93cef5', '#80c5f3', '#6cbdf1', '#59b5f0', '#42acee', '#28a4ec', '#009ceb'],
    zones(){
        let zonesArr = [];
        let shift = 0;
        let timeHours = this.time().getHours() + timeShift;
      for (let i = 0; i <= 11; i++) {
        let timeZone = ((timeHours - (8 + i)) / 11).toFixed(2);
        let colindex = Math.round(timeZone * 11) - 1;
        // zonesArr[10 - i] = timeZone < 0.1 ? 0.1 : timeZone > 1 ? 1 : timeZone;
        zonesArr[10 - i] = colindex < 0 ? this.colors[0] : colindex > 10 ? this.colors[10] : this.colors[colindex];
      }
      return zonesArr;
    },
    time() {
      return new Date();
    },
    decaHours() {
      return Math.floor(this.time().getHours() / 10);
    },
    hoursNum() {
      return this.time().getHours() % 10;
    },
    decaMins() {
      return Math.floor(this.time().getMinutes() / 10);
    },
    Mins() {
      return this.time().getMinutes() % 10;
    },
    zonebg(zone) {
      return `background-color: ${zone}`
    },
    getSVGStyle(id) {
      return `${this.zones()[id]}`;
    },
    seconds: 0,
    decaHoursNum(city) {
      return `transition-duration: .3s;transform: translateY(-${Math.floor(this.hours(city) / 10) * 10}%)`;
    },
    hoursNum(city) {
      return `transition-duration: .3s;transform: translateY(-${Math.floor(this.hours(city) % 10) * 10}%)`;

    },
    decaMinsNum() {
      return `transition-duration: .3s;transform: translateY(-${Math.floor(this.mins() / 10) * 10}%)`;
    },
    MinsNum() {
      return `transition-duration: .3s;transform: translateY(-${Math.floor(this.mins() % 10) * 10}%)`;
    },
    mins() {
      let mins = Math.floor(this.seconds / 60) % 60;
      return mins < 10 ? `0` + mins : mins;
    },
    hours(city) {
      let hours = ((Math.floor(this.seconds / 3600) + this.offsets[city]) % 24);
      return hours < 10 ? `0` + hours : hours;
    },
    offsets: {
      koenig: 2,
      moscow: 3,
      eburg: 5,
      krsk: 7,
      vladik: 10,
    }
  };

  let counter = new Vue({
    el: `#mapzones`,
    data: mapData
  });

  let countDown = setInterval(function () {
    mapData.seconds = Math.floor((Date.now()) / (1000) - timeShift * 3600);
    if (mapData.seconds <= 0) {
      clearInterval(countDown);
    }
  }, 1000);
}

//

}());

//# sourceMappingURL=main.js.map
