import state from "../model.js";

class View {
  _data = state;
  //   parentElement = document.querySelector(".views-container");

  render() {
    const html = this._generateMarkup(this._data);

    this._clear();
    this.parentElement.insertAdjacentHTML("afterbegin", html);
  }

  _clear() {
    this.parentElement.innerHTML = "";
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));

    const curElements = Array.from(this.parentElement.querySelectorAll("*"));

    // Looping over both arrays at the same time
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
}
export default View;
// const view = new View();
