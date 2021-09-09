"use strict";

import state from "../model.js";
import {
  formatCurrency,
  formatReadableDate,
  formatShortCurrency,
} from "../helpers.js";
import { renderMacro } from "./inspectMacro.js";

// /////// FUNCTIONS

// Calculates variables for use in DOM
function markupData(assetClass) {
  const macroMarket = state.curMarket.find(
    (coin) => coin.name === assetClass.asset
  );

  const change =
    ((assetClass.currentValue - assetClass.totalInvested) /
      assetClass.totalInvested) *
      100 || 0;

  const changeHTML =
    change > 0
      ? `<p>Percentage change: <span class="bold green">+${change.toFixed(
          2
        )}%</span>`
      : `<p>Percentage change: <span class="bold red">${change.toFixed(
          2
        )}%</span>`;

  const soldPos =
    assetClass.soldPositions.reduce(
      (acc, cur) => (acc += cur.sellPrice * cur.assetAmount),
      0
    ) || 0;

  return { soldPos, change, changeHTML, macroMarket };
}

function generateMarkup(assetClass) {
  // Finding the asset in the curMarket and the matching macro in the assetClass that was clicked in the treemap

  const data = markupData(assetClass);

  const macroMarket = data.macroMarket;

  let html = `
    <div class="investment-expansion-view">

    <div class="crypto-header">
        <img class="coin-logo"
            src=${macroMarket.image}
            alt="${assetClass.asset} logo">
        <h1>${assetClass.asset}</h1>
    </div>

    <div class="investment-info">

        <section class="user-investment" style="margin-left: 2rem;">

            <h2>Your Investment in ${assetClass.asset}:</h2>

            <div class="content">

                <div class="investment-stats">
                    <p>Total coin amount: <span class="bold">${
                      assetClass.assetAmount > 10
                        ? assetClass.assetAmount.toFixed(2)
                        : assetClass.assetAmount.toFixed(6)
                    } ${macroMarket.symbol}</span></p>
                    <p>Original investment(s) value: <span class="bold">
                    ${formatCurrency(assetClass.totalInvested)}</span>
                    </p>
                    <p>Current value: <span class="bold">
                    ${formatCurrency(assetClass.currentValue)}
                    </span></p>
                    ${data.changeHTML}
                    <p>Total sold positions: <span class="bold">
                    ${formatCurrency(data.soldPos)}</span></p>
                </div>

                <div class="investment-dates">
                    <h3>Individual Investment(s):</h3>
                    <div class="investment-table-container">
                        <table class="investment-table">
                            <thead>
                                <tr>
                                    <th>Investment</th>
                                    <th>Purchase Date</th>
                                    <th>Platform</th>
                                </tr>
                            </thead>

                            <tbody>
                                
                            </tbody>

                        </table>
                    </div>
                    <p class='tiny-info'>Click to view/edit investment</p>
                </div>
            </div>
        </section>

        <section class="crypto-info">
            <h2>${assetClass.asset} stats:</h2>
            <div class="content">

                <div class="coin24hour-stats">
                    <p>Current Price: <span class="bold">
                    ${formatCurrency(macroMarket.current_price, 6)}
                    </span></p>
                    <p>Market Cap: <span class="bold">
                    ${formatShortCurrency(macroMarket.market_cap)}
                    </span></p>
                    <p>Volume: <span class="bold">
                    ${formatShortCurrency(macroMarket.total_volume)}
                    </span></p>
                    <p>24h Change: ${
                      macroMarket.price_change_percentage_24h > 0
                        ? `<span class="bold green">+
                        ${macroMarket.price_change_percentage_24h.toFixed(2)}%
                        </span>`
                        : `<span class="bold red">
                        ${macroMarket.price_change_percentage_24h.toFixed(2)}%
                        </span>`
                    } </p>
                    <p>24h High: <span class="bold">
                    ${formatCurrency(macroMarket.high_24h, 6)}
                      </span></p>
                    <p>24h Low: <span class="bold">
                    ${formatCurrency(macroMarket.low_24h, 6)}
                    </span></p>
                </div>

                <div class="price-graph-container">
                    <h3>Price Graph:</h3>
                    <svg class="price-graph" id="price-graph"></svg>
                    <div class="button-container">
                        <button class="change-period active" id="1w">1 Week</button>
                        <button class="change-period" id="1m">1 Month</button>
                        <button class="change-period" id="6m">6 Months</button>
                        <button class="change-period" id="1y">1 Year</button>
                        <button class="change-period" id="max">Max</button>
                    </div>
                </div>

            </div>
        </section>
    </div>
    `;

  return html;
}

// Pass in assetClass obj - called when asset sold/deleted
export const updateInspectAsset = function (assetClass) {
  const data = markupData(assetClass);

  const macroMarket = data.macroMarket;

  document.querySelector(".content").innerHTML = `

  <div class="investment-stats">
      <p>Total coin amount: <span class="bold">${
        assetClass.assetAmount > 10
          ? assetClass.assetAmount.toFixed(2)
          : assetClass.assetAmount.toFixed(6)
      } ${macroMarket.symbol}</span></p>
      <p>Original investment(s) value: <span class="bold">
      ${formatCurrency(assetClass.totalInvested)}</span>
      </p>
      <p>Current value: <span class="bold">
      ${formatCurrency(assetClass.currentValue)}
      </span></p>
      ${data.changeHTML}
      <p>Total sold positions: <span class="bold">
      ${formatCurrency(data.soldPos)}</span></p>
  </div>

  <div class="investment-dates">
      <h3>Individual Investment(s):</h3>
      <div class="investment-table-container">
          <table class="investment-table">
              <thead>
                  <tr>
                      <th>Investment</th>
                      <th>Purchase Date</th>
                      <th>Platform</th>
                  </tr>
              </thead>

              <tbody>
              </tbody>
              
              </table>
              </div>
              <p>Click to view/edit investment</p>
              </div>
              `;

  populateInvestmentsTable(assetClass);
};

function populateInvestmentsTable(asset) {
  const macros = asset.macros;

  const table = document.querySelector(".investment-table tbody");

  macros.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  macros.forEach((macro) => {
    const row = document.createElement("tr");
    row.setAttribute("id", macro.id);

    if (macro.sold) row.classList.add("sold");

    row.innerHTML = `
        <td><button>${macro.originalCapital}</button></td>
        <td><button>${formatReadableDate(macro.date)}</button></td>
        <td><button>${macro.platform}</button></td>
        `;
    table.append(row);
  });

  // Event Listeners
  table.addEventListener("click", function (e) {
    const macro = macros.find((obj) => obj.id === +e.target.closest("tr").id);
    renderMacro(macro);
  });
}

// function viewIndividualInvest() {
//   const tbody = document.querySelector(".investment-table tbody");

//   tbody.addEventListener("click", function (e) {
//     // const target = e.target.closest("tr").id;

//     renderIndividInvest(e.target.closest("tr").id)
//   });
// }

// Called when clicking on leaf on treemap
export const renderAssetInspection = function (d) {
  document.querySelector(".views-container").innerHTML = generateMarkup(d);
  populateInvestmentsTable(d);
  // document
  //   .querySelector(".investment-table tbody")
  //   .addEventListener("click", function (e) {
  //     // const target = e.target.closest("tr").id;

  //     renderIndividInvest(e.target.closest("tr").id);
  //   });
};
