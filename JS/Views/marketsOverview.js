"use strict";

import state from "../model.js";
import { formatFullCurrency, formatShortCurrency } from "../helpers.js";

const marketInfo = state.curMarket;
const marketStats = state.marketStats;
const coinElements = [];

function generateMarkup() {
  const aggMarket = marketStats.marketPerf.toFixed(2);
  const bigWinName = marketStats.bigWinner.name;
  const bigWinPercent =
    marketStats.bigWinner.price_change_percentage_24h.toFixed(2);
  const bigLoseName = marketStats.bigLoser.name;
  const bigLosePercent =
    marketStats.bigLoser.price_change_percentage_24h.toFixed(2);
  const highVolName = marketStats.highVol.name;
  const highVolAmount = formatFullCurrency(+marketStats.highVol.total_volume);
  const lowVolName = marketStats.lowVol.name;
  const lowVolAmount = formatFullCurrency(+marketStats.lowVol.total_volume);

  let html = `
  <div class="markets-view">
  <section class="market-stats">
      <h1>24 hour market stats</h1>
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
                          <button class='asc '>
                              
                          </button>
                          <button class='dsc'>
                              
                          </button>
                      </div>
                  </div>
              </th>

              <th>
                  <div class="table-header">
                      <h2>Price</h2>
                      <div class="sortBTN-container">
                          <button class='asc'>
                              
                          </button>
                          <button class='dsc'>
                              
                          </button>
                      </div>
                  </div>
              </th>

              <th>
                  <div class="table-header">
                      <h2>Change</h2>
                      <div class="sortBTN-container">
                          <button class='asc'>
                              
                          </button>
                          <button class='dsc'>
                              
                          </button>
                      </div>
                  </div>
              </th>

              <th>
                  <div class="table-header">
                      <h2>Volume</h2>
                      <div class="sortBTN-container">
                          <button class='asc'>
                              
                          </button>
                          <button class='dsc'>
                              
                          </button>
                      </div>
                  </div>
              </th>

              <th>
                  <div class="table-header">
                      <h2>Market Cap</h2>
                      <div class="sortBTN-container">
                          <button class='asc'>
                              
                          </button>
                          <button class='dsc active'>
                              
                          </button>
                      </div>
                  </div>
              </th>

          </tr>

      </table>
    </div>

  </section>
  </div>
  `;

  return html;
}

// Insert api coin data into the table
function populateMarketTable() {
  // Select table to append dom elements to
  const table = document.querySelector(".crypto-table");
  // Create table element for each coin
  marketInfo.forEach((asset) => {
    const row = document.createElement("tr");
    row.classList.add("coin");

    row.innerHTML = `
    <td>${asset.name}</td>
    <td>${formatFullCurrency(asset.current_price)}</td>
    <td class="green">${(asset.price_change_percentage_24h * 100).toFixed(
      2
    )}</td>
    <td>${formatShortCurrency(asset.total_volume)}</td>
    <td>${formatShortCurrency(asset.market_cap)}</td>
    `;

    // Store in array which can be sorted
    coinElements.push(row);
  });

  coinElements.forEach((coin) => {
    table.appendChild(coin);
  });
}

export const renderMarketOverviewMarkup = function (parentEl) {
  // console.log(`info`, marketStats);
  parentEl.innerHTML = generateMarkup();
  populateMarketTable();
};
