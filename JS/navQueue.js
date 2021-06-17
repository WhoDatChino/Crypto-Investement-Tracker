import { gridMarkup } from "./Views/gridView.js";
import { portMarkup } from "./Views/portfolioView.js";
import { marketsMarkup } from "./Views/marketsView.js";

// console.log(View);

const homeBTN = document.querySelector(".portfolio-treemapBTN ");
// const portfolioBTN = document.querySelector(".portfolio-symmaryBTN ");
// const marketBTN = document.querySelector(".portfolio-infoBTN ");
const navBar = document.querySelector("nav");
const markupArr = [gridMarkup, portMarkup, marketsMarkup];

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
    console.log(`hello`);
    this.elements[0].classList.remove("current");
    return this.elements.shift();
  }
}

const curPage = new PageQueue();

// curPage.enqueue();

// function(btn){
//      renderPage(btn)
//          where: clears curpage
//                 inserts new html
// }

navBar.addEventListener("click", function (e) {
  const button = e.target;
  const buttonIndex = +button.dataset.index;
  if (button === navBar || button === curPage.elements[0]) return;
  //   console.log(buttonIndex);

  markupArr[buttonIndex].render();
  //   gridMarkup.render();

  curPage.enqueue(button);
  console.log(curPage.elements);
});
