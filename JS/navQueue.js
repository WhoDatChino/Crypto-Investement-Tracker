import { renderPortfolioDashboardMarkup } from "./Views/portfolioDashboard.js";
import { renderMarketOverviewMarkup } from "./Views/marketsOverview.js";
import { renderTreemapMarkup, createTreemap } from "./Views/treemap.js";
import { loadCurMarket } from "./model.js";

import state from "./model.js";
import { removeLoader } from "./Views/loader.js";
import { getLocalStorage } from "./helpers.js";
import { ResetAssetClass } from "./investmentsLogic.js";
import "core-js/stable"; // For polyfilling es6 syntax
import "regenerator-runtime/runtime"; // For polyfilling async/await -> needs to be installed in terminal 1st

const { async } = require("q");

// if (module.hot) {
//   module.hot.accept();
// }

console.log(state);

// ////// VARIABLES
const homeBTN = document.querySelector(".portfolio-treemapBTN");
const dashBoardBTN = document.querySelector(".portfolio-summaryBTN");
const marketBTN = document.querySelector(".market-infoBTN");
const navBTNS = [homeBTN, dashBoardBTN, marketBTN];
const navBar = document.querySelector("nav");
const container = document.querySelector(".views-container");

// Markup to be generated - position in array corresponds w/ index retrieved from nav button click

// const markupArr = [gridMarkup, portMarkup, marketsMarkup];

// Page queuer - When nav button clicked, prev page removed from queue, new page added and styling added.
export default class ButtonQueue {
  constructor(button) {
    this.elements = [];
    this._init(button);
  }

  _init(btn) {
    btn.classList.add("active");
    this.elements.push(btn);
    console.log(`THE BUTTON`, btn);
  }

  enqueue(btn) {
    if (btn === this.elements[0]) return;
    btn.classList.add("active");
    this.elements.push(btn);
    this.dequeue();
  }

  dequeue() {
    this.elements[0].classList.remove("active");
    return this.elements.shift();
  }
}
// Create pageQueue variable
state.curPage = 0;
const pageQueue = new ButtonQueue(navBTNS[0]);
console.log(pageQueue);
// Initialize page to first page
getLocalStorage();
init(); // setAssetPrices();
createTreemap();
removeLoader();

// Called after getting curMarket info. Updates assetClasse prices
async function init() {
  await loadCurMarket();
  state.assetClasses.length > 0
    ? (state.assetClasses = state.assetClasses.map(
        (obj) => new ResetAssetClass(obj)
      ))
    : true;
  console.log(`UPDATED STATE`, state.assetClasses);
}

// //////// FUNCTIONS

// //////// EVENT LISTENERS

const pages = ["home", "dashboard", "market"];
window.location.hash = pages[0];

// NavBar clicks - Determine clicked button and load its corresponding contents
navBar.addEventListener("click", function (e) {
  const clickedEl = e.target.closest("button");

  // Ensure only valid buttons are clicked
  if (!clickedEl) return;

  const buttonIndex = +clickedEl.dataset.index;
  state.curPage = buttonIndex;
  window.location.hash = pages[buttonIndex];
});

window.addEventListener("hashchange", function (e) {
  if (pages.indexOf(window.location.hash.slice(1)) < 0) {
    return;
  }
  console.log(`Called at begin`);
  state.curPage = pages.indexOf(window.location.hash.slice(1));
  changePage(state.curPage);
  pageQueue.enqueue(navBTNS[state.curPage]);
});

function changePage(buttonIndex) {
  switch (buttonIndex) {
    case 0:
      renderTreemapMarkup(container);
      break;
    case 1:
      renderPortfolioDashboardMarkup(container);
      break;
    case 2:
      renderMarketOverviewMarkup(container);
      break;
  }
}
