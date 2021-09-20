"use strict";

import { state } from "../model.js";
import {
  formatCurrency,
  formatReadableDate,
  formatCoinAmount,
  checkRequired,
  checkDate,
  checkSellDate,
  setLocalStorage,
} from "../helpers.js";
import { createOverlay, removeModal } from "./overlay.js";
import { deletionConfirmation } from "./deletionConfirmation.js";
import { updateInspectAsset } from "./inspectAsset.js";
import { notificationMessage } from "./notificationMessage.js";
import { displayErrorMessage } from "./errorMsg.js";
import { createLoader, removeLoader } from "./loader.js";
import { coinApi } from "../apiCalls.js";
import { reRenderTree } from "./treemap.js";
import "core-js/stable"; // For polyfilling es6 syntax
import "regenerator-runtime/runtime";

// Parent to which eveything is appended
const parent = document.querySelector(".views-container");

function generateMarkup(dataIn) {
  createOverlay();

  const investInspect = document.createElement("div");
  investInspect.classList.add("investment-inspection-container");

  investInspect.innerHTML = `
                    
                        <button class="close-modalBTN">
                            <ion-icon name="close-outline"></ion-icon>
                        </button>
                        <div class="form-header">
                            <h1>${dataIn.asset}</h1>
                        </div>
                        <div class="investment-inspection-info">
                            ${updatePopup(dataIn)}
                        </div>
        
                        <div class="investment-interactions">
                            <div class="button-and-label">
                                <input type="checkbox" name="check1" class="check" id="checkbox" ${
                                  dataIn.sold ? "checked" : ""
                                }>
                                <label for="checkbox" class="checkmark"></label>
        
                                <label class="description" for="checkbox">Mark ${
                                  dataIn.sold ? "unsold" : "sold"
                                }</label>
                            </div>
                            <div class="button-and-label">
                                <button class="delete">
                                    <ion-icon name="trash-outline"></ion-icon>
                                </button>
                                <label class="description" for="delete">Delete</label>
                            </div>
        
                        </div>
                    `;

  parent.append(investInspect);

  document
    .querySelector(".close-modalBTN")
    .addEventListener("click", removeModal);
  document.querySelector(".overlay").addEventListener("click", removeModal);
}

function unsoldMarkup(dataIn) {
  const change =
    ((dataIn.currentValue - dataIn.originalCapital) / dataIn.originalCapital) *
    100;

  let html;

  html =
    change > 0
      ? `     <p>Current value of investment:</p>
      <p class="investment-data">${formatCurrency(dataIn.currentValue)}</p>
              <p>Change:</p>
              <p class="investment-data">
              <span class="green">+${change.toFixed(2)}%</span></p>`
      : `<p>Current value of investment:</p>
      <p class="investment-data">${formatCurrency(dataIn.currentValue)}</p>
        <p>Change:</p>
          <p class="investment-data"><span class="red">${change.toFixed(
            2
          )}%</span></p>`;

  return html;
}

function soldMarkup(dataIn) {
  const sellData = state.assetClasses
    .find((assClass) => assClass.asset === dataIn.asset)
    .soldPositions.find((obj) => obj.id === dataIn.id);

  return `  <p>Date of sale:</p>
  <p class="investment-data">${formatReadableDate(sellData.date)}</p>
            <p>Value at sale:</p>
            <p class="investment-data"> ${formatCurrency(
              sellData.assetAmount * sellData.sellPrice
            )}</p>
            `;
}

function updatePopup(dataIn) {
  const marketCoin = state.curMarket.find((coin) => coin.name === dataIn.asset);

  return `
    <p>Date of investment:</p>
    <p class="investment-data">${formatReadableDate(dataIn.date)}</p>
    <p>Platform:</p>
    <p class="investment-data">${dataIn.platform}</p>
    <p>Coin Amount:</p>
    <p class="investment-data">${formatCoinAmount(dataIn.assetAmount)}</p>
    <p>Original investment:</p>
    <p class="investment-data">${formatCurrency(dataIn.originalCapital)}</p>
    ${dataIn.sold ? soldMarkup(dataIn) : unsoldMarkup(dataIn)}
    <p>Current price of coin:</p>
    <p class="investment-data">${formatCurrency(
      marketCoin.current_price,
      6
    )}</p>
    `;
}

function sellOrUnsell(dataIn) {
  // Bring up sale popup
  if (document.querySelector("#checkbox").checked) {
    // transisition inspection modal away
    document
      .querySelector(".investment-inspection-container")
      .classList.add("move");
    // Display sell form & logic
    sellInvestForm(dataIn);
  } else {
    // Unsell invest
    dataIn.markUnsold();
    document.querySelector(".investment-inspection-info").innerHTML =
      updatePopup(dataIn);

    setLocalStorage();

    switch (state.curPage) {
      case 0:
        reRenderTree();
        break;
      case 1:
        updateInspectAsset(dataIn.findParentClass());
        break;
    }
  }
}

// Operations for the selling of an investment
function sellInvestForm(stateMacro) {
  function generateMarkup() {
    const form = document.createElement("div");
    form.className = "sell-form-container";

    form.innerHTML = `
          <div class="sell-popup" onclick="event.stopPropagation()">
        
              <div class="form-header">
                  <h1>Sell Investment</h1>
              </div>
        
              <form class="sell-investment-form">
                  <label for="dueDate">Date and time of sale:</label>
                  <div class="input-data">
                      <input type="datetime-local" name="Date" class="due-date">
                      <small>Message</small>
                  </div>
      
                  <label for="sell-price">Price of coin at sale ($):</label>
                  <div class="input-data">
                      <input type="number" name="Purchase Price" class="sell-price" min="0"
                          placeholder='Optional - include for better accuracy' step='0.00000001'>
                      <small>Message</small>
                  </div>
      
                  <div class="action-btns">
                      <button type="submit" class="add-btn">Confirm</button>
                      <button type="button" class="cancel-btn">Cancel</button>
                  </div>
              </form>
          </div>
        
          `;

    parent.append(form);

    return document.querySelector(".sell-form-container");
  }

  const sellForm = generateMarkup();

  function closeSaleForm() {
    document
      .querySelector(".investment-inspection-container")
      .classList.remove("move");
    sellForm.remove();
  }

  function formSubmitter(e) {
    e.preventDefault();

    const dateInput = sellForm.querySelector(".due-date");
    const sellPriceInput = sellForm.querySelector(".sell-price");

    // Checks inputs to see if they are valid to sell asset
    function validateInputs() {
      let valid = 0;
      valid += checkRequired([dateInput]);
      valid += checkDate(dateInput);
      valid += checkSellDate(dateInput, stateMacro.date);

      if (valid === 0) sellMacro();
    }

    validateInputs();

    // retrieves price of coin at sale from user or api
    async function getSellPrice() {
      if (sellPriceInput.value !== 0 && sellPriceInput.value !== "")
        return +sellPriceInput.value;

      try {
        createLoader();
        const coin = state.curMarket
          .find((coin) => coin.name === stateMacro.asset)
          .symbol.toUpperCase();

        const data = await coinApi(dateInput.value, coin);

        return data;
      } catch (err) {
        throw err;
      }
    }

    // Performs action of actually selling the MacroInvestment
    async function sellMacro() {
      try {
        const props = {
          date: dateInput.value,
          sellPrice: await getSellPrice(),
        };
        stateMacro.markSold(props);
        removeLoader();

        // 5. Close sale form and show investInspect
        document.querySelector(".investment-inspection-info").innerHTML =
          updatePopup(stateMacro);
        closeSaleForm();

        // Show and hide notification message
        notificationMessage(`Sale recorded successfully!`);

        // Update things behind the popup
        switch (state.curPage) {
          case 0:
            reRenderTree();
            break;
          case 1:
            updateInspectAsset(stateMacro.findParentClass());
            break;
        }

        setLocalStorage();
      } catch (err) {
        console.log(`NEW EEROOR`, err);
        removeLoader();
        displayErrorMessage(err);
      }
    }
  }

  // ///// EventListeners for sellInvestForm

  // Close form
  sellForm.querySelector(".cancel-btn").addEventListener("click", function (e) {
    closeSaleForm();
    document.querySelector("#checkbox").checked = false;
  });

  // Form submission
  sellForm.addEventListener("submit", formSubmitter);
}

export const deleteMacro = function (stateMacro) {
  stateMacro.findParentClass().deleteMacro(stateMacro);
  notificationMessage(`Investment deleted`);
  setLocalStorage();
};

export const renderMacro = function (MacroInvestment) {
  generateMarkup(MacroInvestment);

  // Marking sold/unsol
  document.querySelector("#checkbox").addEventListener("click", function (e) {
    sellOrUnsell(MacroInvestment);
  });

  document.querySelector(".delete").addEventListener("click", function (e) {
    deletionConfirmation(MacroInvestment);
  });
};
