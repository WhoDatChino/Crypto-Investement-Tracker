import { state } from "./model.js";
import {
  COINAPI_KEY,
  NUMBER_MARKET_COINS,
  FROM_DATE_HISTORIC_DATA,
  TO_DATE_HISTORIC_DATA,
} from "./config.js";
import "core-js/stable"; // For polyfilling es6 syntax
import "regenerator-runtime/runtime";

// CoinAPI calls - gets exchange rate when creating new investment or selling one
export const coinApi = async function (dateStr, coinTicker) {
  try {
    const req = await fetch(
      `https://rest.coinapi.io/v1/exchangerate/${coinTicker.toUpperCase()}/USD?time=${new Date(
        dateStr
      ).toISOString()}&apikey=${COINAPI_KEY}`
    );

    if (!req.ok) {
      throw req.status;
    }

    const data = await req.json();

    return data.rate;
  } catch (err) {
    console.log(`THE ERROR`, err);
    throw err;
  }
};

// Coin gecko calls. Gets current market data as well as historical data
export const geckoMarket = async function () {
  try {
    const req = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${NUMBER_MARKET_COINS}&page=1&sparkline=false`
    );

    if (!req.ok) throw req.status;

    state.curMarket = await req.json();
  } catch (err) {
    throw err;
  }
};

export const geckoHistoric = async function () {
  try {
    const req = await fetch(
      `https://api.coingecko.com/api/v3/coins/${state.curAsset}/market_chart/range?vs_currency=usd&from=${FROM_DATE_HISTORIC_DATA}&to=${TO_DATE_HISTORIC_DATA}`
    );

    if (!req.ok) throw req.status;

    const data = await req.json();

    return data.prices;
  } catch (err) {
    console.log(`CoinGecko historic data`, err);
    throw err;
  }
};
