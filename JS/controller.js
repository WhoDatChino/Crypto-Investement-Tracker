import { state } from "./model.js";
import { renderPortfolioDashboardMarkup } from "./Views/portfolioDashboard.js";
import { renderMarketOverviewMarkup } from "./Views/marketsOverview.js";
import { renderTreemapMarkup, createTreemap } from "./Views/treemap.js";
import { calcMarketStats } from "./model.js";
import { removeLoader } from "./Views/loader.js";
import { getLocalStorage } from "./helpers.js";
import { ResetAssetClass } from "./investmentsLogic.js";
import { displayErrorMessage } from "./Views/errorMsg.js";
import ButtonQueue from "./model.js";
import "core-js/stable"; // For polyfilling es6 syntax
import "regenerator-runtime/runtime"; // For polyfilling async/await -> needs to be installed in terminal 1st
import { geckoMarket } from "./apiCalls.js";

const { async } = require("q");

// ////// VARIABLES
const homeBTN = document.querySelector(".portfolio-treemapBTN");
const dashBoardBTN = document.querySelector(".portfolio-summaryBTN");
const marketBTN = document.querySelector(".market-infoBTN");
const navBTNS = [homeBTN, dashBoardBTN, marketBTN];
const navBar = document.querySelector("nav");
const viewsContainer = document.querySelector(".views-container");

const pages = ["home", "dashboard", "market"];
window.location.hash = pages[0];

// Create pageQueue variable
state.curPage = 0;
const pageQueue = new ButtonQueue(navBTNS[0]);

init();

// //////// FUNCTIONS

// Called after getting curMarket info. Updates assetClasse prices
async function fetchMarket() {
  try {
    await geckoMarket();
    state.assetClasses.length > 0
      ? (state.assetClasses = state.assetClasses.map(
          (obj) => new ResetAssetClass(obj)
        ))
      : true;

    calcMarketStats();
    console.log(`UPDATED STATE`, state);
    removeLoader();
  } catch (err) {
    removeLoader();
    displayErrorMessage();
  }
}

function init() {
  getLocalStorage();
  fetchMarket();
  createTreemap();
}

function changePage(buttonIndex) {
  switch (buttonIndex) {
    case 0:
      renderTreemapMarkup(viewsContainer);
      console.log(`SSSSS`, state);
      break;
    case 1:
      renderPortfolioDashboardMarkup(viewsContainer);
      console.log(`SSSSS`, state);

      break;
    case 2:
      renderMarketOverviewMarkup(viewsContainer);
      console.log(`SSSSS`, state);

      break;
  }
}

// //////// EVENT LISTENERS

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
  state.curPage = pages.indexOf(window.location.hash.slice(1));
  changePage(state.curPage);
  pageQueue.enqueue(navBTNS[state.curPage]);
});
