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
loadCurMarket();

class MacroInvestment {
  id = +(Date.now() + "").slice(-10);

  constructor(props) {
    this.asset = props.asset;
    this.originalCapital = props.originalCapital;
    this.assetAmount = this._calcCoinAmount(props.price);
    this.currentValue = this.updateCurrentValue();
    this.platform = props.platform;
    this.date = props.date;
    this.sold = false;
    this._addToAssetClass();
  }

  _findParentClassIndex() {
    return state.assetClasses.findIndex(
      (assetClass) => assetClass.asset === this.asset
    );
  }

  _calcCoinAmount(price) {
    return +(this.originalCapital / price).toFixed(6);
  }

  _addToAssetClass() {
    const parent = state.assetClasses[this._findParentClassIndex()];
    parent.macros.push(this);
    parent.updateAssetAmount();
  }

  updateCurrentValue() {
    return +(
      state.assetClasses[this._findParentClassIndex()].currentPrice *
      this.assetAmount
    ).toFixed(2);
  }

  markSold(props) {
    this.sold = true;

    const { id, assetAmount } = this;
    // Sell price and date sold fed into here by input from user
    const { date, sellPrice } = props;

    // Send summary copy to soldPos of parent
    state.assetClasses[this._findParentClassIndex()].soldPositions.push({
      id,
      assetAmount,
      date,
      sellPrice,
    });
  }

  markUnsold() {
    this.sold = false;

    // Remove summary obj from parent soldPositions that corresponds with this instance
    state.assetClasses[this._findParentClassIndex()].soldPositions =
      state.assetClasses[this._findParentClassIndex()].soldPositions.filter(
        (pos) => pos.id !== this.id
      );
  }
}

class AssetClass {
  constructor(props, curMarket) {
    this.asset = props.asset;
    this.geckoId = props.geckoId;
    this.currentPrice = this._findAssset().current_price;
    this.assetAmount = 0;
    this.image = curMarket.image;
    this.currentValue = 0;
    this.macros = [];
    this.soldPositions = [];
    this._addAssetClass();
  }

  _findAssset() {
    return state.curMarket.find((asset) => asset.name === this.asset);
  }

  updateCurrentPrice() {
    this.currentPrice = this._findAssset().current_price;
  }

  updateAssetAmount() {
    this.assetAmount = this.macros
      .filter((macro) => macro.sold === false)
      .reduce((acc, cur) => (acc += cur.assetAmount), this.assetAmount);
    this.updateCurrentValue();
  }

  updateCurrentValue() {
    this.currentValue = +(this.assetAmount * this.currentPrice).toFixed(2);
  }

  _addAssetClass() {
    state.assetClasses.push(this);
    console.log(`inside`, state);
  }
}
const props2 = {
  asset: "Cardano",
  geckoId: "cardano",
};
// console.log(state.curMarket);
// console.log(classAsset);

const props = {
  asset: "Cardano",
  originalCapital: 1000,
  platform: "Gemini",
  date: "25 July 2021",
  price: 1.22,
};
const props1 = {
  asset: "Cardano",
  originalCapital: 125,
  platform: "Gemini",
  date: "24 August 2021",
  price: 2.96,
};

async function createStuff() {
  await loadCurMarket();

  // const obj = state.curMarket[2];
  // const classAsset = new AssetClass(props2, obj);

  // const macro = new MacroInvestment(props);
  // const macro2 = new MacroInvestment(props1);
  // console.log(`sss`, state);
  // const pppp = { date: "25 August 2021", sellPrice: 2.63 };
  // macro2.markSold(pppp);
  // macro2.markUnsold();
}
createStuff();

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
