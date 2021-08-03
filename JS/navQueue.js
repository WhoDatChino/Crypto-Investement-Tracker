import { gridMarkup } from "./Views/gridView.js";
import { marketsMarkup } from "./Views/marketsView.js";
import { marketTableElementMarkup } from "../JS/Views/marketTableView.js";
import { renderPortfolioDashboardMarkup } from "./Views/portfolioDashboard.js";

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

// //////// FUNCTIONS

function pageEvents(e) {
  if (curPage === 0) {
    console.log(`grid`);
  }
  if (curPage === 1) {
    console.log(`port`);
  }
  if (curPage === 2) {
    const parent = document.querySelector(".crypto-table");
    const rows = document.querySelectorAll(".coin");
    let html = "";
    rows.forEach((row) => row.remove());

    sort();
    state.curMarket.forEach(
      (ele) => (html += marketTableElementMarkup._generateMarkup(ele))
    );
    parent.insertAdjacentHTML("beforeend", html);

    console.log(e.target.closest("table"));
    console.log(`markets`, html);
  }
}

// //////// EVENT LISTENERS

// NavBar clicks - Determine clicked button and load its corresponding contents
navBar.addEventListener("click", function (e) {
  const clickedEl = e.target;
  const buttonIndex = +clickedEl.dataset.index;

  // Ensure only valid buttons are clicked
  if (clickedEl === navBar || clickedEl === pageQueue.elements[0]) return;

  // markupArr[buttonIndex].render();
  renderPortfolioDashboardMarkup(container);
  curPage = buttonIndex;

  pageQueue.enqueue(clickedEl);
});

// container.addEventListener("click", pageEvents);

const sorters = {};

function sort() {
  // const direction = dir;
  // const prop = valueIn;

  let arr = state.curMarket;
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let currentV = arr[i].total_volume;
    let j = i - 1;
    while (j > -1 && currentV < arr[j].total_volume) {
      arr[j + 1] = arr[j];

      j--;
    }
    arr[j + 1] = current;
  }
  state.curMarket = arr;
  // const be = state.curMarket.prop;
  console.log(`new`, state.curMarket);
  // console.log(`cx`, be);
}

// const propSelector = {
//   sortMkcpDsc: state.curMarket.market_cap,
//   sortMkcpAsc: state.curMarket.market_cap,
//   sortVolDsc: state.curMarket.total_volume,
//   sortVolAsc: state.curMarket.total_volume,
//   sortChangeDsc: state.curMarket.price_change_percentage_24h,
//   sortChangeAsc: state.curMarket.price_change_percentage_24h,
//   sortPriceDsc: state.curMarket.current_price,
//   sortPriceAsc: state.curMarket.current_price,
//   sortNameDsc: state.curMarket.id,
//   sortNameAsc: state.curMarket.id,
// };
