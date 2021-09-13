export const createLoader = function (parent) {
  const loader = document.createElement("div");
  loader.classList.add("loader");

  if (!parent) {
    loader.style.position = "fixed";
    parent = document.querySelector(".views-container");
  } else {
    loader.style.position = "absolute";
    loader.style.height = "100%";
  }

  loader.innerHTML = `
  <div class="bar bar1"></div>
  <div class="bar bar2"></div>
  <div class="bar bar3"></div>
  <div class="bar bar4"></div>
  <div class="bar bar5"></div>
  <div class="bar bar6"></div>
  <div class="bar bar7"></div>
  <div class="bar bar8"></div>
  `;
  parent.append(loader);
};

export const removeLoader = function () {
  document.querySelector(".loader").remove();
};
