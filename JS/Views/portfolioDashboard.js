import state from "../model.js";
import { formatFullCurrency } from "../helpers.js";

// Export 1 function that loads the markup and creates all the event listeners for that page

// //////// VARIABLES

// Get data from state

// //////// FUNCTIONS

function generateMarkup() {
  return `
    <div class="portfolio-summary-view">

                <h1 class="port-header">Portfolio Dashboard</h1>

                <div class="port-summary-container">
                    <div>
                        <p class="port-value">$0</p>
                        <label for="port-value">Current portfolio value</label>
                    </div>

                    <div>
                        <p class="start-value">$0</p>
                        <label for="start-value">Total original investment(s)</label>
                    </div>

                    <div>
                        <p class="value-change">0%</p>
                        <label for="value-change">Percentage change</label>
                    </div>

                    <div>
                        <p class="sold-pos">$0</p>
                        <label for="sold-pos">Total sold positions</label>
                    </div>
                </div>

                <div class="asset-balances-container">
                    <div class="wrapper">
                        <label for="asset-balances-table">
                            <h2>Balances:</h2>
                        </label>
                        <div class="asset-balances">
                            <table class="asset-balances-table">
                                <tr>
                                    <th>Asset</th>
                                    <th>Asset Amount</th>
                                    <th>Value</th>
                                    <th>Portfolio %</th>
                                </tr>
                                

                            </table>
                        </div>
                    </div>

                    <div class="sunburst-diag"></div>

                </div>

                <div class="port-movements-container">
                    <label for="port-movements-table">
                        <h2 style="margin: 0.75rem 1rem;">Portfolio movements:</h2>
                    </label>
                    <div class="port-movements">
                        <table class="port-movements-table">
                            <tr>
                                <th>Date</th>
                                <th>Asset</th>
                                <th>Transaction</th>
                                <th>Amount</th>
                                <th>Asset amount</th>
                            </tr>
                            
                        </table>
                    </div>
                </div>

            </div>
    `;
}

// Calculate balances obtained from portfolio
function calcBalances() {
  // Inintialize values
  let portValue = 0;
  let originalValue = 0;
  let change = 0;
  let totalSold = 0;

  // Loop array & add to variables
  state.assetClasses.forEach((invest) => {
    portValue += invest.currentValue;
    originalValue += invest.originalCapital;

    if (invest.soldPositions.length !== 0) {
      invest.soldPositions.forEach((item) => {
        totalSold += item.sellValue;
      });
    }
  });

  change = (portValue / originalValue - 1) * 100;

  return { portValue, originalValue, change, totalSold };
}
// Setting to variable instead of calling multiple times
const balances = calcBalances();

// Generate portfolio summary data
function generatePortSummary() {
  // Select html elements
  const portValueEl = document.querySelector(".port-value");
  const originalValueEl = document.querySelector(".start-value");
  const changeEl = document.querySelector(".value-change");
  const totalSoldEl = document.querySelector(".sold-pos");

  //   console.log(calcBalances());

  portValueEl.innerText = `${formatFullCurrency(balances.portValue)}`;
  originalValueEl.innerText = `${formatFullCurrency(balances.originalValue)}`;
  changeEl.innerHTML =
    balances.change > 0
      ? `<span class="green">+${balances.change.toFixed(2)}%</span>`
      : `<span class="red">${balances.change.toFixed(2)}%</span>`;
  totalSoldEl.innerText = `${formatFullCurrency(balances.totalSold)}`;
}

// Generate portfolio balance summary table elements
function populateBalancesTable() {
  const table = document.querySelector(".asset-balances-table");
  const portTotal = balances.portValue;

  state.assetClasses.forEach((invest) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${invest.asset}</td>
            <td>${invest.assetAmount}</td>
            <td>${formatFullCurrency(invest.currentValue)}</td>
            <td>${((invest.currentValue / portTotal) * 100).toFixed(2)}%</td>
        `;

    // console.log((invest.currentValue / portTotal) * 100);
    table.appendChild(row);
  });

  //   console.log(portTotal);
}

// Populate portfolio movements table
function populateMovementsTable() {
  const table = document.querySelector(".port-movements-table");

  const tableItems = [];

  state.assetClasses.forEach((asset) => {
    if (asset.soldPositions.length !== 0) {
      asset.soldPositions.forEach((sell) => {
        const row = document.createElement("tr");
        row.classList.add("sell");

        row.innerHTML = `
            <td>${sell.date}</td>
            <td>${asset.asset}</td>
            <td><span class="red">Sell</span></td>
            <td>${formatFullCurrency(sell.sellValue)}</td>
            <td>${sell.assetAmount}</td>
            `;
        tableItems.push(row);
      });
    }

    if (asset.macros.length !== 0) {
      asset.macros.forEach((buy) => {
        const row = document.createElement("tr");
        // row.classList.add('sell')

        row.innerHTML = `
            <td>${buy.date}</td>
            <td>${asset.asset}</td>
            <td><span class="green">Buy</span></td>
            <td>${formatFullCurrency(buy.originalCapital)}</td>
            <td>${buy.assetAmount}</td>
            `;
        tableItems.push(row);
      });
    }
  });

  tableItems.forEach((item) => {
    table.appendChild(item);
  });
}

// Add the default html to the page
export const renderPortfolioDashboardMarkup = function (parentEl) {
  parentEl.innerHTML = generateMarkup();
  generatePortSummary();
  populateBalancesTable();
  populateMovementsTable();
};
