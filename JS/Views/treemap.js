"use strict";

import { state } from "../model.js";
import { AssetClass, MacroInvestment } from "../investmentsLogic.js";
import { renderMacro } from "./inspectMacro.js";
import {
  checkRequired,
  checkDate,
  checkMoney,
  setLocalStorage,
} from "../helpers.js";
import { createOverlay, removeModal } from "./overlay.js";
import { createLoader, removeLoader } from "./loader.js";
import { notificationMessage } from "./notificationMessage.js";
import { displayErrorMessage } from "./errorMsg.js";
import * as d3 from "d3";

import { coinApi } from "../apiCalls.js";

// /////// FUNCTIONS

function generateMarkup() {
  return `
  <div class="treemap-view">
                <div class="treemap-container">
                    <h1>Portfolio Performance </h1>

                    <svg class="treemap" id="treemap">
                    </svg>
                </div>
                <button class="new-investBTN">
                    <ion-icon name="add-outline"></ion-icon>
                </button>

                <p class="tiny-info">Hover to see percentage change; click for more info</p>
            </div>

            <p class='summary-text'></p>
      `;
}

// USing d3 library to create the treemap based on formatted data from state
export const createTreemap = function () {
  const data = formatState();

  // Guard clause if there is no macro investments to show
  if (data.children.length === 0) return;

  const svg = d3.select("#treemap");
  const container = document.querySelector(".treemap-container");

  const height = container.clientHeight * 0.95;
  const width = container.offsetWidth;
  // const height = 600;
  // const width = 900;

  svg.attr("width", width);
  svg.attr("height", height);

  const margin = {
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const root = d3.hierarchy(data).sum((d) => +Math.abs(d.value));
  // .sort((a, b) => d3.descending(a.value, b.value));

  const treemap = d3
    .treemap()
    .size([innerWidth, innerHeight])
    .padding(5)
    .paddingInner(7)(root);

  // console.log(`root`, root, `leaves`, root.leaves());

  const leaf = g
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

  // Creating the rect's
  leaf
    .append("rect")
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", (d) =>
      d.data.value > 0 ? "rgba(30, 243, 136,0.1)" : "rgba(209, 25, 71,0.1)"
    )
    .attr("stroke", (d) =>
      d.data.value > 0 ? "rgba(30, 243, 136,1)" : "rgba(209, 25, 71,1)"
    )
    .attr("stroke-width", 3)
    .style("cursor", "pointer");

  // Interactions
  leaf
    .on("mousemove", function (ev, d) {
      moveSummaryText(ev, d);
    })
    .on("mouseout", hideSummaryText)
    .on("click", function (ev, d) {
      renderMacro(
        state.assetClasses
          .filter((cls) => cls.asset === d.data.asset)[0]
          .macros.find((obj) => obj.id === d.data.id)
      );
    });

  // Text
  const boxInfo = g
    .selectAll(".info")
    .data(
      root
        .leaves()
        .filter((d) => d.value > d3.max(root.leaves(), (d) => d.value) * 0.05)
      // .filter((d) => d.value > root.value * 0.04)
    )
    .join("g")
    .style("font-size", "1.5rem");

  boxInfo
    .append("text")
    .text((d) => d.data.asset)
    .attr("x", (d) => (d.x1 - d.x0) / 2 + d.x0)
    .attr("y", (d) => (d.y1 - d.y0) / 2 + d.y0 + 10)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("pointer-events", "none");
};

export const reRenderTree = function () {
  document.querySelector("#treemap").innerHTML = ``;
  createTreemap();
};

// Hover effect on leaves
function moveSummaryText(ev, d) {
  const div = document.querySelector(".summary-text");

  // Change position of p tag
  div.style.top = `${ev.offsetY}px`;
  div.style.left = `${ev.offsetX}px`;

  // Set colour and text
  if (d.data.value > 0) {
    div.innerText = `+${d.data.value.toFixed(2)}%`;
    div.style.color = "var(--cashout-theme)";
  } else {
    div.innerText = `${d.data.value.toFixed(2)}%`;
    div.style.color = "var(--delete-theme)";
  }
}

function hideSummaryText() {
  document.querySelector(".summary-text").innerText = ``;
}

// Format's assetClasses data from state into usable format for treemap
export const formatState = function () {
  const data = {
    name: "Portfolio",
    children: [],
  };

  for (let i = 0; i < state.assetClasses.length; i++) {
    if (formatCoins(i).length === 0) continue;

    data.children.push({
      name: state.assetClasses[i].asset,
      children: formatCoins(i),
    });
  }

  function formatCoins(i) {
    const unsold = state.assetClasses[i].macros.filter((macro) => !macro.sold);

    const arr = [];

    unsold.forEach((invest) => {
      const value =
        ((invest.currentValue - invest.originalCapital) /
          invest.originalCapital) *
        100;

      arr.push({
        value,
        ...invest,
      });
    });

    return arr;
  }

  return data;
};

// New investment button clicked - show form
function showNewInvestForm() {
  const overlay = createOverlay();

  // Create form and append to dom
  const form = document.createElement("div");
  form.classList.add("form-container");

  form.innerHTML = `
  <div class="form-header">
                    <h1>Add New Investment</h1>
                </div>
                <form class="new-investment-form">


                    <label for="coin-ticker">Coin Name:</label>
                    <div class="input-data">
                      <select name="Coin Name" class="coin-ticker" >
                          <option value="">-- Please select a coin --</option>
                          ${populateSelectOptions()}
                      </select>
                      <small>Message</small>
                    </div>

                    <label for="fiat-amount">Amount invested ($):</label>
                    <div class="input-data">
                      <input type="number" name="Amount Invested" class="fiat-amount" step='0.01' max='10000000'>
                      <small>Message</small>
                    </div>

                    <label for="dueDate">Date and time of investment:</label>
                    <div class="input-data">
                      <input type="datetime-local" name="Date" class="due-date">
                      <small>Message</small>
                    </div>

                    <label for="buy-price">Price of coin at investment ($):</label>
                    <div class="input-data">
                      <input type="number" name="Purchase Price" class="buy-price"  min="0" placeholder='Optional - include for better accuracy' step='0.00000001'>
                      <small>Message</small>
                    </div>

                    <label for="platform">Platform of purchase:</label>
                    <div class="input-data">
                      <input type="text" name="Platform" placeholder="Where did you buy it?" maxlength="20"
                          class="platform" >
                      <small>Message</small>
                    </div>

                    <div class="action-btns">
                        <button type="submit" class="add-btn">Add</button>
                        <button type="button" class="cancel-btn">Close</button>
                    </div>

                </form>
  `;

  function populateSelectOptions() {
    let html = "";
    state.curMarket.forEach((coin) => {
      html += `<option value=${coin.symbol} data-id=${coin.id}>
                  ${coin.name}
                </option>`;
    });
    return html;
  }

  document.querySelector(".views-container").append(form);

  const cancelBTN = document.querySelector(".cancel-btn");

  // Using closures

  // Event Listeners
  cancelBTN.addEventListener("click", removeModal);
  overlay.addEventListener("click", removeModal);
  form.addEventListener("submit", formValidator);
}

// Form Validator - Checks to see if user has input correct values and will then call for creation of new investment or will throw errors for user to correct in inputs
function formValidator(e) {
  e.preventDefault();

  // Values used in Macro creations
  const ticker = document.querySelector(".coin-ticker"); // Only used in api call
  const originalCapital = document.querySelector(".fiat-amount");
  const date = document.querySelector(".due-date");
  const price = document.querySelector(".buy-price");
  const platform = document.querySelector(".platform");
  // Getting selected option's data attr - Used in AssetClass creation
  const geckoId = ticker.options[ticker.selectedIndex].dataset.id;
  const assetName = ticker.options[ticker.selectedIndex].innerText.trim();

  // FORM VALIDATION
  function validateInputs() {
    // Counter - ensures all fields have valid inputs & data is correct to create investment
    let valid = 0;
    valid += checkRequired([ticker, originalCapital, date, platform]);
    valid += checkMoney(originalCapital);
    valid += checkDate(date);

    // Create valid will be >0 if any required input field is invalid
    if (valid === 0) {
      createInvestment();
    }
  }
  validateInputs();

  // Performs API call to get price data for coin on specific date or uses user provided value. Returns the value as a number in each case
  async function getPriceData() {
    // If price value given by user, no need to make api call
    if (+price.value !== 0 && price.value !== "") return +price.value;

    try {
      const data = await coinApi(date.value, ticker.value);
      return data;
    } catch (err) {
      throw err;
    }
  }

  // Creates new AssetClass and MacroInvestment instances
  function newClassMacro(props) {
    const assetClass = new AssetClass(props);
    const macro = new MacroInvestment(props);
  }

  // Creates new MacroInvestment
  function newMacro(props) {
    const macro = new MacroInvestment(props);
  }

  // Clears form
  function clearForm(arr) {
    arr.forEach((input) => (input.value = ""));
  }

  // Creates new investment object
  async function createInvestment() {
    try {
      createLoader();
      const props = {
        asset: assetName,
        originalCapital: +originalCapital.value,
        date: date.value,
        price: await getPriceData(),
        geckoId: geckoId,
        platform: platform.value,
      };

      // 1. Check if that asset class already exists
      // 2. If it does, create a MacroInvestment
      // - Asset class needs to be updated
      // 3. If it doesn't create a AssetClass
      state.assetClasses.findIndex((aClass) => aClass.asset === props.asset) < 0
        ? newClassMacro(props)
        : newMacro(props);

      removeLoader();

      notificationMessage(`Investment added!`);
      clearForm([ticker, originalCapital, date, price, platform]);
      // Recreate treemap
      reRenderTree();
      // Save to storage
      setLocalStorage();
    } catch (err) {
      removeLoader();
      displayErrorMessage(err);
    }
  }
}

export const renderTreemapMarkup = function (parentEl) {
  parentEl.innerHTML = generateMarkup();
  createTreemap();

  document
    .querySelector(".new-investBTN")
    .addEventListener("click", showNewInvestForm);
};
