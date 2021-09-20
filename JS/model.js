export const state = {
  assetClasses: [],
  marketStats: {},
  curPage: 0,
};

// redis for js
// Want the api to call more times if it fails

export const calcMarketStats = function () {
  const data = state.curMarket;
  // Market avg movement
  const marketPerf =
    data.reduce((acc, curVal) => acc + curVal.price_change_percentage_24h, 0) /
    data.length;

  // Highest & lowest
  let lowestNum = data[0];
  let highestNum = data[0];
  let highVol = data[0];
  let lowVol = data[0];
  for (let i = 0; i < data.length; i++) {
    const x = data[i];

    const priceChange = +x.price_change_percentage_24h;

    const volChange = x.total_volume;

    if (priceChange < lowestNum.price_change_percentage_24h) {
      lowestNum = x;
    }
    if (priceChange > highestNum.price_change_percentage_24h) {
      highestNum = x;
    }
    if (volChange < lowVol.total_volume) {
      lowVol = x;
    }
    if (volChange > highVol.total_volume) {
      highVol = x;
    }
  }

  // Set in state variable
  state.marketStats.marketPerf = +marketPerf.toFixed(2);
  state.marketStats.bigWinner = highestNum;
  state.marketStats.bigLoser = lowestNum;
  state.marketStats.highVol = highVol;
  state.marketStats.lowVol = lowVol;
};

export default class ButtonQueue {
  constructor(button) {
    this.elements = [];
    this._init(button);
  }

  _init(btn) {
    btn.classList.add("active");
    this.elements.push(btn);
  }

  enqueue(btn) {
    if (btn === this.elements[0]) return;
    btn.classList.add("active");
    this.elements.push(btn);
    this.dequeue();
  }

  dequeue() {
    this.elements[0].classList.remove("active");
    return this.elements.shift();
  }
}
