"use strict";

import state from "../model.js";
import {
  formatFullCurrency,
  formatShortCurrency,
  formatCoinPrice,
} from "../helpers.js";

// Cant set state to a variable cz will be set to null as its executed before the data is fetched from the api
// const state.curMarket = state.curMarket;
// const marketStats = state.marketStats;

// /////// FUNCTIONS
function generateMarkup() {
  const aggMarket = state.marketStats.marketPerf.toFixed(2);
  const bigWinName = state.marketStats.bigWinner.name;
  const bigWinPercent =
    state.marketStats.bigWinner.price_change_percentage_24h.toFixed(2);
  const bigLoseName = state.marketStats.bigLoser.name;
  const bigLosePercent =
    state.marketStats.bigLoser.price_change_percentage_24h.toFixed(2);
  const highVolName = state.marketStats.highVol.name;
  const highVolAmount = formatFullCurrency(
    +state.marketStats.highVol.total_volume
  );
  const lowVolName = state.marketStats.lowVol.name;
  const lowVolAmount = formatFullCurrency(
    +state.marketStats.lowVol.total_volume
  );

  let html = `
  <div class="markets-view">
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
          <thead>
              <th>
                  <div class="table-header">
                      <h2>Name</h2>
                      
                  </div>
              </th>

              <th>
                  <div class="table-header">
                      <h2>Price</h2>
                      <div class="sortBTN-container">
                          <button class='asc' data-sort='price'>
                              
                          </button>
                          <button class='dsc' data-sort='price'>
                              
                          </button>
                      </div>
                  </div>
              </th>

              <th>
                  <div class="table-header">
                      <h2>Change</h2>
                      <div class="sortBTN-container">
                          <button class='asc' data-sort='change'>
                              
                          </button>
                          <button class='dsc' data-sort='change'>
                              
                          </button>
                      </div>
                  </div>
              </th>

              <th>
                  <div class="table-header">
                      <h2>Volume</h2>
                      <div class="sortBTN-container">
                          <button class='asc' data-sort='volume'>
                              
                          </button>
                          <button class='dsc' data-sort='volume'>
                              
                          </button>
                      </div>
                  </div>
              </th>

              <th>
                  <div class="table-header">
                      <h2>Market Cap</h2>
                      <div class="sortBTN-container">
                          <button class='asc' data-sort='cap'>
                              
                          </button>
                          <button class='dsc active' data-sort='cap'>
                              
                          </button>
                      </div>
                  </div>
              </th>

          </thead>
          <tbody class='crypto-table-body'>
          
          </tbody>

      </table>
    </div>

  </section>
  </div>
  `;

  return html;
}

// Insert api coin data into the table
function populateMarketTable(data) {
  const table = document.querySelector(".crypto-table-body");
  table.innerHTML = "";

  // Create table element for each coin
  data.forEach((asset) => {
    const row = document.createElement("tr");
    row.classList.add("coin");

    row.innerHTML = `
    <td class="coin-name">${asset.name}</td>
    <td>${formatCoinPrice(asset.current_price)}</td>
    ${
      asset.price_change_percentage_24h > 0
        ? `<td class="green">+${asset.price_change_percentage_24h.toFixed(
            2
          )}%</td>`
        : `<td class="red">${asset.price_change_percentage_24h.toFixed(
            2
          )}%</td>`
    }
    <td>${formatShortCurrency(asset.total_volume)}</td>
    <td>${formatShortCurrency(asset.market_cap)}</td>
    `;

    // Show in dom
    table.appendChild(row);
  });
}

// Getting the value from the element
// NEEDS REFACTORING
function sortData(dir, sortBy) {
  let arr = state.curMarket;

  // Asc
  if (dir === "asc") {
    switch (sortBy) {
      case "price":
        arr.sort((a, b) => a.current_price - b.current_price);
        break;
      case "change":
        arr.sort(
          (a, b) =>
            a.price_change_percentage_24h - b.price_change_percentage_24h
        );
        break;
      case "volume":
        arr.sort((a, b) => a.total_volume - b.total_volume);
        break;
      case "cap":
        arr.sort((a, b) => a.market_cap - b.market_cap);
        break;
    }
  }

  // Dsc
  if (dir === "dsc") {
    switch (sortBy) {
      case "price":
        arr.sort((a, b) => b.current_price - a.current_price);
        break;
      case "change":
        arr.sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h
        );
        break;
      case "volume":
        arr.sort((a, b) => b.total_volume - a.total_volume);
        break;
      case "cap":
        arr.sort((a, b) => b.market_cap - a.market_cap);
        break;
    }
  }

  state.curMarket = arr;
  // const be = state.curMarket.prop;
  // console.log(`new`, state.curMarket);
}

// Determines which button was clicked on the page and calls the appropriate functions
function buttonFinder(e) {
  if (e.target.classList.contains("asc") || e.target.classList.contains("dsc"))
    sortTableContents(e);

  if (e.target.classList.contains("expand-tableBTN")) {
    showHideSearch(e);
  }

  return;
}

// Sorting table functionality
function sortTableContents(e) {
  // 1. Make sure only the buttons are pressed

  const button = e.target;

  // Exit if already sorted
  if (button.classList.contains("active")) return;

  const sortBy = e.target.dataset.sort;
  const direction = e.target.className;

  // console.log(sortBy, direction);

  const tableButtons = document
    .querySelector(".crypto-table")
    .querySelectorAll("button");

  // 3. remove the colour of the previous button
  tableButtons.forEach((btn) => btn.classList.remove("active"));
  // 2. Change the colour of the button that is pressed
  button.classList.add("active");
  // 4. execute sort function based on variable
  sortData(direction, sortBy);
  // 5. output sorted data to dom
  populateMarketTable(state.curMarket);
}

// Expand market table and show search box
function showHideSearch(e) {
  e.target.classList.contains("expanded") ? hideSearch(e) : showSearch(e);
}

function showSearch(e) {
  // const button = e.target;
  const sectionHide = document.querySelector(".market-stats");
  const parentSection = document.querySelector(".market-info");
  const coinElements = document.querySelectorAll(".coin");

  // Hide the stats
  sectionHide.style.display = "none";
  // Show the button has been clicked
  e.target.classList.toggle("expanded");
  e.target.innerHTML = `
  <ion-icon name="contract-outline"></ion-icon>
  `;

  // Creating the searchBox element
  const searchBox = document.createElement("div");
  searchBox.classList.add("search-container");
  searchBox.innerHTML = `
  <input type="search" name="c" id="coin-search" placeholder="Search through coins" maxlength="20"
  aria-label="Search through available crypto currencies">
  `;

  parentSection.prepend(searchBox);

  searchBox.addEventListener("input", filterCoins);
}

// Filter coins in the search view
function filterCoins(e) {
  const coins = document.querySelectorAll(".coin");
  const term = e.target.value.toLowerCase();

  coins.forEach((coin) => {
    // Select the coin name
    const id = coin.querySelector(".coin-name").innerText.toLowerCase();

    id.indexOf(term) > -1
      ? (coin.style.display = "revert")
      : (coin.style.display = "none");
  });
}

function hideSearch(e) {
  const button = e.target;
  const sectionShow = document.querySelector(".market-stats");
  // const parentSection = document.querySelector(".market-info");
  const searchBox = document.querySelector(".search-container");

  // Show the stats
  sectionShow.style.display = "flex";
  // Show the button has been clicked
  button.classList.toggle("expanded");
  button.innerHTML = `
  <ion-icon name="expand-outline"></ion-icon>
  `;

  // Removing the searchBox
  searchBox.remove();
}

export const renderMarketOverviewMarkup = function (parentEl) {
  // console.log(`info`, marketStats);
  parentEl.innerHTML = generateMarkup();
  const marketInfoSection = document.querySelector(".market-info");
  populateMarketTable(state.curMarket);

  marketInfoSection.addEventListener("click", buttonFinder);
};
