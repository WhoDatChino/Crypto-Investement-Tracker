"use strict";

import { state } from "../model.js";
import {
  formatCurrency,
  formatReadableDate,
  formatShortCurrency,
  formatCoinAmount,
} from "../helpers.js";
import { renderMacro } from "./inspectMacro.js";
import ButtonQueue from "../model.js";
import { renderPortfolioDashboardMarkup } from "./portfolioDashboard.js";
import { createLoader, removeLoader } from "./loader.js";
import { geckoHistoric } from "../apiCalls.js";
import "core-js/stable"; // For polyfilling es6 syntax
import "regenerator-runtime/runtime";

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

// Generates initial html
function generateMarkup(assetClass) {
  // Finding the asset in the curMarket and the matching macro in the assetClass that was clicked in the treemap

  const data = markupData(assetClass);

  const macroMarket = data.macroMarket;

  let html = `
    <div class="investment-expansion-view">

    <button class='back-btn'></button>

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
                    <p>Total coin amount: <span class="bold">
                    ${formatCoinAmount(assetClass.assetAmount)} 
                    ${macroMarket.symbol}</span></p>
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
                    <div class="price-graph">
                      <svg class='graph'></svg>
                    </div>
                    <div class="button-container">
                        <button class="change-period active" id="7">1 Week</button>
                        <button class="change-period" id="31">1 Month</button>
                        <button class="change-period" id="188">6 Months</button>
                        <button class="change-period" id="365">1 Year</button>
                        <button class="change-period" id="0">Max</button>
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
      <p>Total coin amount: <span class="bold">${formatCoinAmount(
        assetClass.assetAmount
      )} ${macroMarket.symbol}</span></p>
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
  console.log(`hubububbubub`);

  populateInvestmentsTable(assetClass);
};

// Fills table w/ macros contained in the assetClass
function populateInvestmentsTable(assetClass) {
  const table = document.querySelector(".investment-table tbody");

  // Sort by date - most recent 1st
  assetClass.macros.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Create & append elements
  assetClass.macros.forEach((macro) => {
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
    const macro = assetClass.macros.find(
      (obj) => obj.id === +e.target.closest("tr").id
    );
    renderMacro(macro);
  });
}

// Line graph for price data
function renderLineGraph(dataIn, period = 7) {
  const parent = document.querySelector(".price-graph");
  const svg = d3.select("svg");

  // Data
  let data;
  period ? (data = dataIn.slice(dataIn.length - 1 - period)) : (data = dataIn);

  const xValue = (d) => d[0];
  const yValue = (d) => d[1];

  const height = +parent.clientHeight;
  const width = +parent.clientWidth;

  const margin = {
    top: 5,
    left: 50,
    bottom: 30,
    right: 15,
  };

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  svg.attr("height", height).attr("width", width);

  const dates = data.map((item) => new Date(item[0]));

  // Scales
  const xScale = d3.scaleTime().domain(d3.extent(dates)).range([0, innerWidth]);
  // .nice();

  const yScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d[1]) * 0.95, d3.max(data, (d) => d[1])])
    .range([innerHeight, 0])
    .nice();

  const xAxis = d3.axisBottom(xScale).ticks(5).tickPadding(10);

  const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(formatShortCurrency);

  const colorGrad = (start, end) => {
    if (start > end) {
      return [
        { offset: "45%", color: "#9D0208" },
        { offset: "55%", color: "#AA1708" },
        { offset: "60%", color: "#B62D07" },
        { offset: "65%", color: "#C34207" },
        { offset: "70%", color: "#CF5706" },
        { offset: "80%", color: "#DC6D06" },
        { offset: "85%", color: "#E88205" },
      ];
    } else {
      return [
        { offset: "35%", color: "#1662A1" },
        { offset: "45%", color: "#1780B5" },
        { offset: "55%", color: "#179ECA" },
        { offset: "65%", color: "#18BBDE" },
        { offset: "75%", color: "#18D9F2" },
        { offset: "80%", color: "#21E6CE" },
        { offset: "90%", color: "#2AF2AA" },
        { offset: "95%", color: "#33FF86" },
      ];
    }
  };

  const container = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const lineGenerator = d3
    .line()
    .x((d) => xScale(new Date(xValue(d))))
    .y((d) => yScale(yValue(d)));

  container
    .append("linearGradient")
    .attr("id", "line-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0)
    .attr("y1", yScale(0))
    .attr("x2", 0)
    .attr("y2", yScale(d3.max(data, (d) => yValue(d))))
    .selectAll("stop")
    .data(colorGrad(yValue(data[0]), yValue(data[data.length - 1])))
    .enter()
    .append("stop")
    .attr("offset", function (d) {
      return d.offset;
    })
    .attr("stop-color", function (d) {
      return d.color;
    });

  container
    .append("path")
    .attr("d", lineGenerator(data))
    .attr("stroke", "url(#line-gradient)") // ID of custom gradient
    .attr("stroke-width", 3)
    .attr("stroke-linejoin", "round") // Smoothes the joints
    .attr("fill", "none");

  const xAxisGroup = container
    .append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(xAxis);

  const yAxisGroup = container.append("g").call(yAxis);
}

// Called if createGraph throws error
function showReloadButton() {
  const container = document.createElement("div");
  container.classList.add("reload");

  container.innerHTML = `
    <button class='reload-btn'>Retry</button>
  `;
  document.querySelector(".price-graph-container").append(container);

  // Clicking button removes the button & reCalls createGraph
  document.querySelector(".reload-btn").addEventListener("click", function () {
    container.remove();
    createPriceGraph();
  });
}

// Buttons to change time period of price graph
function changePriceGraph(data) {
  const defaultBTN = document.querySelectorAll(".change-period")[0];
  const buttonQ = new ButtonQueue(defaultBTN);

  // Changes button clicked styling & changes graph
  document
    .querySelector(".button-container")
    .addEventListener("click", function (e) {
      const clickedBtn = e.target.closest("button");
      if (!clickedBtn) return;
      buttonQ.enqueue(clickedBtn);
      document.querySelector("svg").innerHTML = ``;
      renderLineGraph(data, +clickedBtn.id);
    });
}

async function createPriceGraph() {
  try {
    // Show loader
    createLoader(document.querySelector(".price-graph-container"));
    // 1. get api data
    // - if fails, show a reload button & remove loader
    const data = await geckoHistoric();
    // 2. Use that data to render line graph
    renderLineGraph(data);
    // 3. Eventlisteners to change the graph period
    changePriceGraph(data);
    removeLoader();
  } catch (err) {
    removeLoader();
    showReloadButton();
  }
}

// Called when clicking on row in asset balances table
export const renderAssetInspection = function (assetClass) {
  document.querySelector(".views-container").innerHTML =
    generateMarkup(assetClass);
  populateInvestmentsTable(assetClass);
  createPriceGraph();

  // Back button
  document.querySelector(".back-btn").addEventListener("click", function () {
    renderPortfolioDashboardMarkup(document.querySelector(".views-container"));
  });
};
