const homeBTN = document.querySelector(".portfolio-treemapBTN ");
// const portfolioBTN = document.querySelector(".portfolio-symmaryBTN ");
// const marketBTN = document.querySelector(".portfolio-infoBTN ");
const navBar = document.querySelector("nav");

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

navBar.addEventListener("click", function (e) {
  const button = e.target;
  if (button === navBar) return;
  console.log(button);

  curPage.enqueue(button);
  console.log(curPage.elements);
});
