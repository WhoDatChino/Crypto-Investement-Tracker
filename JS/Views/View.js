import state from "../model.js";

class View {
  _data = state;
  parentElement = document.querySelector(".views-container");

  render() {
    const html = this._generateGridMarkup(this._data);

    this._clear();
    this.parentElement.insertAdjacentHTML("afterbegin", html);
  }

  _clear() {
    this.parentElement.innerHTML = "";
  }
}
export default View;
// const view = new View();
