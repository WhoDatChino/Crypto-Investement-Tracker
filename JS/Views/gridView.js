import View from "./View.js";

class GridView extends View {
  _generateGridMarkup() {
    return `<div class="treemap-view">
          <div class="treemap-container">
          <h1>Treemap </h1>
          </div>
          <button class="new-investBTN">
          <ion-icon name="add-outline"></ion-icon>
          </button>
          </div>`;
  }
}
export const gridMarkup = new GridView();
