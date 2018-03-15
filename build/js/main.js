(function () {
'use strict';

let dateEnd = new Date(2018, 2, 18, 21);

let data = {
  text: `#2018 Ночь выборов известия`,
  dateEnd: dateEnd,
  animDur: 15,
  animDuration() {
    return `animation-duration: ${this.animDur}s`;
  },
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
    // if ((this.secondsLeft % 60) === 59) {
    //   return `transform: translateY(0); transition-duration: .3s;`;
    // } else if ((this.secondsLeft % 60) === 58) {
    //   return `transform: translateY(-60%);`;
    // }
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
    let hours = Math.floor(this.secondsLeft / 3600) % 24;
    return hours < 10 ? `0` + hours : hours;
  },

};

let countDown = setInterval(function () {
  data.secondsLeft = Math.floor((dateEnd - Date.now()) / (1000));
  data.decaSecondsNum();
  data.secondsNum();
  if (data.secondsLeft <= 0) {
    clearInterval(countDown);
  }
}, 1000);

let app = new Vue({
  el: `#countdown-timer`,
  data: data
});

}());

//# sourceMappingURL=main.js.map
