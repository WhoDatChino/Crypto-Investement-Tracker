"use strict";

import state from "../model.js";

// /////// FUNCTIONS

function generateMarkup() {
  return `
  <div class="treemap-view">
                <div class="treemap-container">
                    <h1>Portfolio Performance </h1>

                    <svg class="treemap" id="treemap" 
                     >
                    </svg>
                </div>
                <button class="new-investBTN">
                    <ion-icon name="add-outline"></ion-icon>
                </button>
            </div>

            <div class="overlay hidden"></div>

      `;
}

// USing d3 library to create the treemap based on formatted data from state
export const createTreemap = function () {
  const data = formatState();

  // Guard clause if there is no macro investments to show
  if (data.children.length === 0)
    return console.log(`No macros investments to show`);

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

  const root = d3
    .hierarchy(data)
    .sum((d) => +Math.abs(d.value))
    .sort((a, b) => d3.descending(a.value, b.value));

  const treemap = d3
    .treemap()
    .size([innerWidth, innerHeight])
    .padding(8)
    .paddingInner(7)(root);

  const leaf = g
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

  // Creating the rect's the
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
    .attr("stroke-width", 3);
  // Text
  const boxInfo = g
    .selectAll(".info")
    .data(root.leaves().filter((d) => d.value > 0))
    .join("g")
    .style("font-size", "1.5rem");

  boxInfo
    .append("text")
    .text((d) => d.data.name)
    .attr("x", (d) => (d.x1 - d.x0) / 2 + d.x0)
    .attr("y", (d) => (d.y1 - d.y0) / 2 + d.y0 + 10)
    .attr("text-anchor", "middle")
    .attr("fill", "black");
};

// Format's assetClasses data from state into usable format for treemap
function formatState() {
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
        name: invest.asset,
        id: invest.id,
        name: invest.asset,
        date: invest.date,
        value,
      });
    });

    return arr;
  }

  return data;
}

// New investment button clicked - show form
function showNewInvestForm() {
  const overlay = document.querySelector(".overlay");

  showOverlay(overlay);

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
    console.log(`state`, state.curMarket);
    return html;
  }

  document.querySelector(".views-container").append(form);

  const cancelBTN = document.querySelector(".cancel-btn");

  // Using closures

  // Event Listeners
  cancelBTN.addEventListener("click", hideOverlayRemoveSibling);
  overlay.addEventListener("click", hideOverlayRemoveSibling);
  form.addEventListener("submit", formValidator);
}

function showOverlay(overlay) {
  // Display overlay
  overlay.classList.remove("hidden");
}

function hideOverlayRemoveSibling() {
  const overlay = document.querySelector(".overlay");

  overlay.nextElementSibling.remove();
  overlay.classList.add("hidden");
}
// Form Validator - Checks to see if user has input correct values and will then call for creation of new investment or will throw errors for user to correct in inputs
function formValidator(e) {
  e.preventDefault();

  const ticker = document.querySelector(".coin-ticker");
  const originalCapital = document.querySelector(".fiat-amount");
  const date = document.querySelector(".due-date");
  const price = document.querySelector(".buy-price");
  const platform = document.querySelector(".platform");

  let valid = 0;

  // Checks to see if all the required fields have a value
  function checkRequired(inputArr) {
    inputArr.forEach((input) => {
      if (input.value.trim() === "") {
        showError(input, `${getFieldName(input)} is required`);
        valid++;
      } else {
        showSuccess(input);
      }
    });
  }

  // Checks that valid number is entered
  function checkOriginalCapital() {
    if (+originalCapital.value === 0 || +originalCapital.value < 0) {
      showError(originalCapital, `Value must be greater than 0`);
      valid++;
      return;
    }
  }

  // Checks that date is not in the future
  function checkDate() {
    if (new Date(date.value).getTime() > Date.now()) {
      showError(date, `Can't use future date`);
      valid++;
      return;
    }
  }

  // Displays error for user on input fields
  function showError(input, message) {
    const parent = input.parentElement;

    parent.className = "input-data error";
    parent.querySelector("small").innerText = message;
  }
  // Removes any error styling
  function showSuccess(input) {
    input.parentElement.className = "input-data";
  }
  // Gets field name for use in error message
  function getFieldName(input) {
    return input.getAttribute("name");
  }

  // Performs API call to get price data for coin on specific date or uses user provided value. Returns the value as a number in each case
  async function getPriceData() {
    // If price value given by user, no need to make api call
    if (price.value !== 0 && price.value !== "") return +price.value;

    try {
      // Perform fetch to get price data on certain date
      const dateString = new Date(date.value).toISOString();
      const coin = ticker.value.toUpperCase();
      const apiKey = `923F38CF-FBE2-49B9-A382-C9B12A0B96A7`;

      const req = await fetch(
        `https://rest.coinapi.io/v1/exchangerate/${coin}T/USD?time=${dateString}&apikey=${apiKey}`
      );

      if (!req.ok) {
        throw req.status;
      }

      const data = await req.json();

      console.log(`data`, data);
      return data.rate;
    } catch (err) {
      displayErrorMessage(err);
    }
  }

  // Creates new investment object
  function createInvestment() {
    // 1. Check if that asset class already exists
    // 2. If it does, create a MacroInvestment
    // - Asset class needs to be updated (pub/sub)
    // 3. If it doesn't create a AssetClass
    // getPriceData();
  }

  checkRequired([ticker, originalCapital, date, platform]);
  checkOriginalCapital();
  checkDate();
  // Create valid will be >0 if any required input field is invalid
  if (valid === 0) getPriceData();
}

const errorMap = {
  400: `Something went wrong, please try again.`,
  401: `API key invalid.`,
  403: `API key unauthorised.`,
  429: `Too many requests. Daily limit reached.`,
  550: `No data. Can't fufill request.`,
};

function displayErrorMessage(code) {
  const errorPopup = document.createElement("div");
  errorPopup.classList.add("error-message");
  console.log(`map`, errorMap[code]);

  const message = errorMap[code];

  errorPopup.innerHTML = `
  <ion-icon name="warning-outline"></ion-icon>
  <p>${message} If error persists, please manually input coin price.</p>
  
  <button class="cancel-btn">
  </button>
  `;
  document.querySelector(".views-container").append(errorPopup);
  console.log(`heeeeeeelllll`);
  errorPopup.querySelector(".close-errorBTN").addEventListener("click", () => {
    errorPopup.remove();
  });
}

class MacroInvestment {
  id = +(Date.now() + "").slice(-10);
  constructor(props) {
    this.asset = props.asset;
    this.originalCapital = props.originalCapital;
    this.assetAmount = props.assetAmount;
    this.currentValue = props.currentValue;
    this.platform = props.platform;
    this.date = props.date;
    this.sold = false;
  }
}

export const renderTreemapMarkup = function (parentEl) {
  parentEl.innerHTML = generateMarkup();
  createTreemap();

  document
    .querySelector(".new-investBTN")
    .addEventListener("click", showNewInvestForm);
};
