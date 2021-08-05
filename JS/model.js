const state = {
  assetClasses: [
    {
      asset: "Bitcoin",
      ticker: "btc",
      currentPrice: 38700,
      assetAmount: 0.01666,
      originalCapital: 500,
      currentValue: 645,
      soldPositions: [
        {
          date: " 22 Jan 2021",
          initialValue: 30,
          assetAmount: 0.00156,
          sellValue: 50,
        },
        {
          date: " 19 Dec 2020",
          initialValue: 90,
          assetAmount: 0.00375,
          sellValue: 90,
        },
      ],
      macros: [
        {
          id: Math.floor(Math.random() * 1000000),
          originalCapital: 30,
          assetAmount: 0.00156,
          currentValue: 60.372,
          date: "6 Dec 2020",
          sold: true,
          platform: "coinbase",
        },
        {
          id: Math.floor(Math.random() * 1000000),
          originalCapital: 60,
          assetAmount: 0.00375,
          currentValue: 145.125,
          date: "16 Nov 2020",
          sold: true,
          platform: "coinbase",
        },
      ],
    },
    {
      asset: "Ethereum",
      ticker: "eth",
      currentPrice: 2517,
      assetAmount: 0.5,
      originalCapital: 1000,
      currentValue: 1258.5,
      soldPositions: [
        {
          date: " 11 Mar 2021",
          initialValue: 326.54,
          assetAmount: 0.18192,
          sellValue: 339.614,
        },
      ],
      macros: [
        {
          id: Math.floor(Math.random() * 1000000),
          originalCapital: 200,
          assetAmount: 0.16129,
          currentValue: 405.96693,
          date: "24 Jan 2021",
          sold: false,
          platform: "coinbase",
        },
        {
          id: Math.floor(Math.random() * 1000000),
          originalCapital: 800,
          assetAmount: 0.33871,
          currentValue: 852.53307,
          date: "24 Apr 2021",
          sold: false,
          platform: "gemini",
        },
        {
          id: Math.floor(Math.random() * 1000000),
          originalCapital: 300,
          assetAmount: 0.21246,
          currentValue: 534.77337,
          date: "1 Mar 2021",
          sold: true,
          platform: "coinbase",
        },
      ],
    },
    {
      asset: "Dogecoin",
      ticker: "doge",
      currentPrice: 0.2,
      assetAmount: 1136.36364,
      originalCapital: 250,
      currentValue: 227.27273,
      soldPositions: [],
      macros: [
        {
          id: Math.floor(Math.random() * 1000000),
          originalCapital: 250,
          assetAmount: 1136.36364,
          currentValue: 227.27273,
          date: "9 Jul 2021",
          sold: false,
          platform: "gemini",
        },
      ],
    },
  ],
  marketStats: {},

  // marketPerf: 5,
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

// redis for js
// Want the api to call more times if it fails

export const loadCurMarket = async function () {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`
    );

    const data = await res.json();
    if (!data) alert(`Please reload`);
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
  state.marketStats.marketPerf = +marketPerf.toFixed(2);
  state.marketStats.bigWinner = highestNum;
  state.marketStats.bigLoser = lowestNum;
  state.marketStats.highVol = highVol;
  state.marketStats.lowVol = lowVol;
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
