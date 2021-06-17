class View {
  _data;
  parentElement = document.querySelector(".views-container");

  render() {
    const html = this._generateGridMarkup();

    this._clear();
    this.parentElement.insertAdjacentHTML("afterbegin", html);
  }

  _clear() {
    this.parentElement.innerHTML = "";
  }
}
export default View;
// const view = new View();
