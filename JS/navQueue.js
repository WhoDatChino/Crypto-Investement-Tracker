import { renderPortfolioDashboardMarkup } from "./Views/portfolioDashboard.js";
import { renderMarketOverviewMarkup } from "./Views/marketsOverview.js";
import { renderTreemapMarkup, createTreemap } from "./Views/treemap.js";
import { loadCurMarket } from "./model.js";

import state from "./model.js";

console.log(state);

// ////// VARIABLES
const homeBTN = document.querySelector(".portfolio-treemapBTN ");
const navBar = document.querySelector("nav");
const container = document.querySelector(".views-container");

// Markup to be generated - position in array corresponds w/ index retrieved from nav button click

// const markupArr = [gridMarkup, portMarkup, marketsMarkup];

// Page queuer - When nav button clicked, prev page removed from queue, new page added and styling added.
class PageQueue {
  constructor() {
    this.elements = [homeBTN];
  }

  enqueue(btn) {
    btn.classList.add("current");
    this.elements.push(btn);
    this.dequeue();
  }

  dequeue() {
    // console.log(`hello`);
    this.elements[0].classList.remove("current");
    return this.elements.shift();
  }
}
// Create pageQueue variable
const pageQueue = new PageQueue();
// Initialize page to first page
let curPage = 0;

createTreemap();

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

// NavBar clicks - Determine clicked button and load its corresponding contents
navBar.addEventListener("click", function (e) {
  const clickedEl = e.target;
  const buttonIndex = +clickedEl.dataset.index;

  // Ensure only valid buttons are clicked
  if (clickedEl === navBar || clickedEl === pageQueue.elements[0]) return;

  // markupArr[buttonIndex].render();
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
  // if (buttonIndex === 2)
  curPage = buttonIndex;

  pageQueue.enqueue(clickedEl);
});
