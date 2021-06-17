const state = {
  curAsset: undefined,
  curPage: 1,

  assetClasses: [],

  marketPerf: 5,

  portValue: 0, // FUNCTION NEEDED
  originCapital: 0, // FUNCTION NEEDED
  percentChange: 0, // FUNCTION NEEDED
  profitOrLoss: 0, // FUNCTION NEEDED
  portMakup: [], // FUNCTION NEEDED
};

// const createCurMarketObject = function (data) {
//   state.curMarket = data;
//   return curMarket;
// };

// const curMarket ={}

class MacroInvestment {
  id = +(Date.now() + "").slice(-10);
  constructor(
    coinName,
    cumulateInvest,
    originalInvest,
    microInvests,
    soldMicros,
    change,
    date,
    sold
  ) {
    (this.coinName = coinName),
      (this.cumulateInvest = cumulateInvest),
      (this.originalInvest = originalInvest),
      (this.microInvests = microInvests),
      (this.soldMicros = soldMicros),
      (this.change = change),
      (this.date = date),
      (this.sold = sold);
  }
}

// class MicroInvestment extends MacroInvestment{
//     id = +(Date.now() + "").slice(-10)

//     super()
// }

// const newI = new MacroInvestment(
//   "bitcoin",
//   500,
//   400,
//   [],
//   100,
//   0,
//   "12 May 2021",
//   false
// );
// console.log(newI);

const loadCurMarket = async function () {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false`
    );

    const data = await res.json();
    state.curMarket = data;
    calcMarketStats(state.curMarket);
  } catch (err) {
    alert(err);
  }
};
loadCurMarket();
// console.log(state);
// console.log(state.marketPerfCalc());

function calcMarketStats(data) {
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
  // console.log(`high`, highestNum);

  // Set in state variable
  state.marketPerf = +marketPerf.toFixed(2);
  state.bigWinner = highestNum;
  state.bigLoser = lowestNum;
  state.highVol = highVol;
  state.lowVol = lowVol;
}

// const calcStats = async function () {
//   await loadCurMarket();

//   calcMarketStats(state.curMarket);
// };

// calcStats();

// setTimeout(() => {
//   calcMarketStats(state.curMarket);
//   console.log(`hello`, state);
// }, 2000);
export default state;
// if (state.curMarket !== "") {
// }
// console.log(state);
