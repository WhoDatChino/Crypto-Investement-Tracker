import View from "./View.js";
import { formatFullCurrency } from "../helpers.js";
import state from "../model.js";
import { marketTableElementMarkup } from "./marketTableView.js";

class MarketsView extends View {
  //   _data = state;
  parentElement = document.querySelector(".views-container");

  _generateMarkup(data) {
    const aggMarket = data.marketStats.marketPerf.toFixed(2);
    const bigWinName = data.marketStats.bigWinner.name;
    const bigWinPercent =
      data.marketStats.bigWinner.price_change_percentage_24h.toFixed(2);
    const bigLoseName = data.marketStats.bigLoser.name;
    const bigLosePercent =
      data.marketStats.bigLoser.price_change_percentage_24h.toFixed(2);
    const highVolName = data.marketStats.highVol.name;
    const highVolAmount = formatFullCurrency(
      +data.marketStats.highVol.total_volume
    );
    const lowVolName = data.marketStats.lowVol.name;
    const lowVolAmount = formatFullCurrency(
      +data.marketStats.lowVol.total_volume
    );

    let html = ` <div class="markets-view">
          <section class="market-stats">
              <h1>24 Hour Market Stats</h1>
              <div class="stats-grid-container">
                  <div class="stats-grid">
                      <div class="market_perf">
                          <h2>Market Performance:</h2>`;

    aggMarket > 0
      ? (html += `<p>Market is up 📈 <span class="green">+${aggMarket}%</span></p></div> `)
      : (html += `<p>Market is down 📉 <span class="red">${aggMarket}%</span></p></div>`);

    bigWinPercent > 0
      ? (html += `<div class="big_winner">
            <h2>Biggest Winner:</h2>
            <p>${bigWinName} <span class="green">+${bigWinPercent}%</span></p>
            </div>`)
      : (html += `<div class="big_winner">
            <h2>Biggest Winner:</h2>
            <p>${bigWinName} <span class="red">${bigWinPercent}%</span></p>
            </div>`);

    html += `<div class="high_volume">
        <h2>Highest Volume:</h2>
        <p>${highVolName} <span>${highVolAmount}</span></p>
    </div>`;

    bigLosePercent > 0
      ? (html += `<div class="big_loser">
            <h2>Biggest Loser:</h2>
            <p>${bigLoseName} <span class="green">+${bigLosePercent}%</span></p>
            </div>`)
      : (html += `<div class="big_loser">
            <h2>Biggest Loser:</h2>
            <p>${bigLoseName} <span class="red">${bigLosePercent}%</span></p>
            </div>`);

    html += `<div class="low_volume">
                    <h2>Lowest Volume:</h2>
                    <p>${lowVolName} <span>${lowVolAmount}</span></p>
                    </div>
                    </div>
                    </div>
                    </section>

                    <section class="market-info">

                    <button class="expand-tableBTN">
                    <ion-icon name="expand-outline"></ion-icon>
                    </button>

                    <div class="table-container">
            <table class="crypto-table">
                <tr id="marketTableHead">
                    <th>
                        <div class="table-header">
                            <h2>Name</h2>
                            <div class="sortBTN-container">
                                <button id="sortNameAsc" data-dir="asc">
                                    <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                </button>
                                <button id="sortNameDsc" data-dir="dsc">
                                    <ion-icon name="triangle-outline" class="descending"></ion-icon>
                                </button>
                            </div>
                        </div>
                    </th>

                    <th>
                        <div class="table-header">
                            <h2>Price</h2>
                            <div class="sortBTN-container">
                                <button id="sortPriceAsc" data-dir="asc">
                                    <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                </button>
                                <button id="sortPriceDsc" data-dir="dsc">
                                    <ion-icon name="triangle-outline" class="descending"></ion-icon>
                                </button>
                            </div>
                        </div>
                    </th>

                    <th>
                        <div class="table-header">
                            <h2>Change</h2>
                            <div class="sortBTN-container">
                                <button id="sortChangeAsc" data-dir="asc">
                                    <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                </button>
                                <button id="sortChangeDsc" data-dir="dsc">
                                    <ion-icon name="triangle-outline" class="descending"></ion-icon>
                                </button>
                            </div>
                        </div>
                    </th>

                    <th>
                        <div class="table-header">
                            <h2>Volume</h2>
                            <div class="sortBTN-container">
                                <button id="sortVolAsc" data-dir="asc">
                                    <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                </button>
                                <button id="sortVolDsc" data-dir="dsc">
                                    <ion-icon name="triangle-outline" class="descending"></ion-icon>
                                </button>
                            </div>
                        </div>
                    </th>

                    <th>
                        <div class="table-header">
                            <h2>Market Cap</h2>
                            <div class="sortBTN-container">
                                <button id="sortMkcpAsc" data-dir="asc">
                                    <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                </button>
                                <button id="sortMkcpDsc" data-dir="dsc">
                                    <ion-icon name="triangle" class="descending"></ion-icon>
                                </button>
                            </div>
                        </div>
                    </th>

                </tr>`;

    // html += this._generateTableElements(data);

    html += `</table>
                    </div>

                    </section>
                    </div>`;

    return html;
  }

  _generateTableElements(data) {
    let html = "";
    const arr = data.curMarket;
    console.log(arr);

    arr.forEach((element) => {
      html += marketTableElementMarkup._generateMarkup(element);
      //   console.log(html);
    });
    // console.log(html);
    return html;
  }

  sorting() {
    const marketTable = document.querySelector(".market-info");

    marketTable.addEventListener("click", () => {
      console.log(`hello`);
    });
  }
}

export const marketsMarkup = new MarketsView();
