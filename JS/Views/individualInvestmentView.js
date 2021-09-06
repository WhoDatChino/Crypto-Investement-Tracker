"use strict";

import state from "../model.js";
import {
  formatCurrency,
  formatReadableDate,
  formatShortCurrency,
} from "../helpers.js";
import { showOverlay, hideOverlayRemoveSibling } from "./treemap.js";

function viewIndividualInvest() {
  const tbody = document.querySelector(".investment-table tbody");

  tbody.addEventListener("click", function (e) {
    const target = e.target.closest("tr").dataset.id;

    console.log(target);
  });
}

function generatePopup(macro) {
  const change =
    ((macro.currentValue - macro.originalCapital) / macro.originalCapital) *
    100;

  const overlay = document.querySelector(".overlay");
  showOverlay(overlay);

  const investInspect = document.createElement("div");
  investInspect.classList.add("investment-inspection-container");

  investInspect.innerHTML = `
            
                <button class="close-modalBTN">
                    <ion-icon name="close-outline"></ion-icon>
                </button>
                <div class="form-header">
                    <h1>${macro.asset}</h1>
                </div>
                <div class="investment-inspection-info">

                    <p>Date of investment:</p>
                    <p class="investment-data">${formatReadableDate(
                      macro.date
                    )}</p>
                    <p>Coin Amount:</p>
                    <p class="investment-data">${macro.assetAmount}</p>
                    <p>Original investment:</p>
                    <p class="investment-data">${formatCurrency(
                      macro.originalCapital
                    )}</p>
                    <p>Current value of investment:</p>
                    <p class="investment-data">${formatCurrency(
                      macro.currentValue
                    )}</p>
                    <p>Change:</p>
                    <p class="investment-data"> ${
                      change > 0
                        ? `<span class="green">+${change.toFixed(2)}%</span>`
                        : `<span class="red">${change.toFixed(2)}%</span>`
                    }</p>
                    
                    <p>Current price of coin:</p>
                    <p class="investment-data">${formatCurrency(
                      state.curMarket.find((coin) => coin.name === macro.asset)
                        .current_price,
                      6
                    )}</p>
                </div>

                <div class="investment-interactions">
                    <div class="button-and-label">
                        <input type="checkbox" name="check1" class="check" id="checkbox">
                        <label for="checkbox" class="checkmark"></label>

                        <label class="description" for="checkbox">Mark as sold</label>
                    </div>
                    <div class="button-and-label">
                        <button class="delete">
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                        <label class="description" for="delete">Delete</label>
                    </div>

                </div>
            `;

  document.querySelector(".views-container").append(investInspect);

  // ///// Lexical functions

  function findMacro(data) {
    return state.assetClasses
      .find((asset) => asset.asset === data.asset)
      .macros.find((invest) => invest.id === data.id);
  }

  // Marks macro sold or unsold and updates state
  function sellOrUnsell() {
    if (this.checked) {
      //   form.classList.add("show");
      investInspect.classList.add("move");
      showSellInvestForm();

      //   const props = {
      //     date: "16 novv 2021",
      //     sellPrice: 4000,
      //   };
      //   findMacro(macro).markSold(props);
      //   state.assetClasses[2].macros[1].markSold("16 nov 2021", 0.35);
      //   asset.markSold("16 novv 2021", 0.35);
      console.log(`SOLD`, state.assetClasses);
    } else {
      findMacro(macro).markUnsold();
      console.log(`UNSOLD`);
    }
  }

  // ///// Event listeners

  // 1. Hide the popup
  document
    .querySelector(".close-modalBTN")
    .addEventListener("click", hideOverlayRemoveSibling);
  overlay.addEventListener("click", hideOverlayRemoveSibling);

  // 2. Sell the asset
  document.querySelector("#checkbox").addEventListener("click", sellOrUnsell);

  // 3. Delete the asset
}

function showSellInvestForm() {
  const form = document.createElement("div");
  form.className = "sell-form-container";

  form.innerHTML = `
  <div class="sell-popup">

      <div class="form-header">
          <h1>Sell Investment</h1>
      </div>

      <form class="sell-investment-form">
          <label for="dueDate">Date and time of sale:</label>
          <div class="input-data">
              <input type="datetime-local" name="Date" class="due-date">
              <small>Message</small>
          </div>
          <label for="buy-price">Price of coin at sale ($):</label>

          <div class="input-data">
              <input type="number" name="Purchase Price" class="buy-price" min="0"
                  placeholder='Optional - include for better accuracy' step='0.00000001'>
              <small>Message</small>
          </div>
          <div class="action-btns">
              <button type="submit" class="add-btn">Confirm</button>
              <button type="button" class="cancel-btn">Close</button>
          </div>
      </form>
  </div>

  `;

  const parent = document.querySelector(".views-container").append(form);

  document.querySelector(".cancel-btn").addEventListener("click", function (e) {
    console.log(`remove`);
    form.remove();
  });
}

export const renderIndividInvest = function (data) {
  generatePopup(data);
};
