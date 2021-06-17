import View from "./View.js";
import state from "../model.js";

class MarketsView extends View {
  _data = state;

  _generateGridMarkup(data) {
    const aggMarket = data.marketPerf.toFixed(2);
    const bigWinName = data.bigWinner.name;
    const bigWinPercent = data.bigWinner.price_change_percentage_24h.toFixed(2);
    const bigLoseName = data.bigLoser.name;
    const bigLosePercent = data.bigLoser.price_change_percentage_24h.toFixed(2);
    const highVolName = data.highVol.name;
    const highVolAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(+data.highVol.total_volume);
    const lowVolName = data.lowVol.name;
    const lowVolAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(+data.lowVol.total_volume);

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
                    <tr>
                    <th>
                        <div class="table-header">
                            <h2>Name</h2>
                            <div class="sortBTN-container">
                                <button id="sortNameAsc">
                                    <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                </button>
                                <button id="sortNameDsc">
                                    <ion-icon name="triangle" class="descending"></ion-icon>
                                </button>
                            </div>
                        </div>
                    </th>

                    <th>
                        <div class="table-header">
                            <h2>Price</h2>
                            <div class="sortBTN-container">
                                <button id="sortPriceAsc">
                                    <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                </button>
                                <button id="sortPriceDsc">
                                    <ion-icon name="triangle-outline" class="descending"></ion-icon>
                                </button>
                            </div>
                        </div>
                    </th>

                    <th>
                        <div class="table-header">
                            <h2>Change</h2>
                            <div class="sortBTN-container">
                                <button id="sortChangeAsc">
                                    <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                </button>
                                <button id="sortChangeDsc">
                                    <ion-icon name="triangle-outline" class="descending"></ion-icon>
                                </button>
                            </div>
                        </div>
                    </th>

                    <th>
                        <div class="table-header">
                            <h2>Volume</h2>
                            <div class="sortBTN-container">
                                <button id="sortVolAsc">
                                    <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                </button>
                                <button id="sortVolDsc">
                                    <ion-icon name="triangle-outline" class="descending"></ion-icon>
                                </button>
                            </div>
                        </div>
                    </th>

                    <th>
                        <div class="table-header">
                            <h2>Market Cap</h2>
                            <div class="sortBTN-container">
                                <button id="sortMkcpAsc">
                                    <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                </button>
                                <button id="sortMkcpDsc">
                                    <ion-icon name="triangle-outline" class="descending"></ion-icon>
                                </button>
                            </div>
                        </div>
                    </th>

                    </tr>

                    <tr class="coin" id="btc">
                    <td>Bitcoin</td>
                    <td>€32,325</td>
                    <td class="green">+2.70%</td>
                    <td>€29.0 billion</td>
                    <td>€569.0 billion</td>
                    </tr>
                    <tr class="coin" id="doge">
                    <td>Dogecoin</td>
                    <td>€0.26</td>
                    <td class="red">-1.67%</td>
                    <td>€1.7 billion</td>
                    <td>€33.4 billion</td>
                    </tr>

                    </table>
                    </div>

                    </section>
                    </div>`;

    return html;
  }
}

export const marketsMarkup = new MarketsView();
