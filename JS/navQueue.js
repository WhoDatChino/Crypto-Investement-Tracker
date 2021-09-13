import { renderPortfolioDashboardMarkup } from "./Views/portfolioDashboard.js";
import { renderMarketOverviewMarkup } from "./Views/marketsOverview.js";
import { renderTreemapMarkup, createTreemap } from "./Views/treemap.js";
import { loadCurMarket } from "./model.js";

import state from "./model.js";
import { removeLoader } from "./Views/loader.js";
import { getLocalStorage } from "./helpers.js";

console.log(state);

// ////// VARIABLES
const navBTN = document.querySelectorAll("nav button ");
const navBar = document.querySelector("nav");
const container = document.querySelector(".views-container");

// Markup to be generated - position in array corresponds w/ index retrieved from nav button click

// const markupArr = [gridMarkup, portMarkup, marketsMarkup];

// Page queuer - When nav button clicked, prev page removed from queue, new page added and styling added.
export default class ButtonQueue {
  constructor(button) {
    this.elements = [button];
  }

  enqueue(btn) {
    btn.classList.add("active");
    this.elements.push(btn);
    this.dequeue();
  }

  dequeue() {
    // console.log(`hello`);
    this.elements[0].classList.remove("active");
    return this.elements.shift();
  }
}
// Create pageQueue variable
const pageQueue = new ButtonQueue(navBTN[0]);
// Initialize page to first page
// state.curPage = 0;
console.log(`PQ`, pageQueue);
loadCurMarket();
// setAssetPrices();
createTreemap();
// getLocalStorage();
removeLoader();

// Called after getting curMarket info. Updates assetClasse prices
function setAssetPrices() {
  state.assetClasses.forEach((obj) => obj.updateCurrentPrice());
  console.log(`UPDATED STATE`, state.assetClasses);
}
// createStuff();

// //////// FUNCTIONS

// function pageEvents(e) {
//   if (curPage === 0) {
//     console.log(`grid`);
//   }
//   if (curPage === 1) {
//     console.log(`port`);
//   }
//   if (curPage === 2) {
//     const parent = document.querySelector(".crypto-table");
//     const rows = document.querySelectorAll(".coin");
//     let html = "";
//     rows.forEach((row) => row.remove());

//     sort();
//     state.curMarket.forEach(
//       (ele) => (html += marketTableElementMarkup._generateMarkup(ele))
//     );
//     parent.insertAdjacentHTML("beforeend", html);

//     console.log(e.target.closest("table"));
//     console.log(`markets`, html);
//   }
// }

// //////// EVENT LISTENERS

const pages = ["home", "dashboard", "market"];
window.location.hash = pages[0];

// NavBar clicks - Determine clicked button and load its corresponding contents
navBar.addEventListener("click", function (e) {
  const clickedEl = e.target;
  const buttonIndex = +clickedEl.dataset.index;

  // Ensure only valid buttons are clicked
  if (clickedEl === navBar || clickedEl === pageQueue.elements[0]) return;

  // state.curPage = buttonIndex;
  window.location.hash = pages[buttonIndex];

  console.log(pages.indexOf(window.location.hash.slice(1)));

  // markupArr[buttonIndex].render();
  // changePage(buttonIndex);
  // if (buttonIndex === 2)
  // state.curPage = buttonIndex;

  // pageQueue.enqueue(clickedEl);
});

window.addEventListener("hashchange", function (e) {
  if (pages.indexOf(window.location.hash.slice(1)) < 0) {
    return;
  }

  state.curPage = pages.indexOf(window.location.hash.slice(1));
  changePage(state.curPage);
  pageQueue.enqueue(navBTN[state.curPage]);
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
