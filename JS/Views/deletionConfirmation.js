import state from "../model.js";
import { deleteMacro } from "./inspectMacro.js";
import { updateInspectAsset } from "./inspectAsset.js";
import { removeModal } from "./overlay.js";
import { reRenderTree } from "./treemap.js";
import { renderPortfolioDashboardMarkup } from "./portfolioDashboard.js";
import { notificationMessage } from "./notificationMessage.js";

export const deletionConfirmation = function (stateMacro) {
  const popup = document.createElement("div");
  popup.classList.add("delete-container");

  popup.innerHTML = `
        <div class="delete-invest-prompt">
            <div class="prompt">
                <ion-icon name="warning-outline"></ion-icon>
                <h2>Are you sure you want to delete this investment?</h2>
            </div>
            <div class="delete-invest-btns">
                <button class="delete-btn">Delete</button>
                <button class="cancel-btn">Cancel</button>
            </div>
        </div>
        `;

  document.querySelector(".views-container").append(popup);

  // Cancel deletion
  document.querySelector(".cancel-btn").addEventListener("click", function (e) {
    popup.remove();
  });

  document.querySelector(".delete-btn").addEventListener("click", function (e) {
    const assetClass = stateMacro.findParentClass();

    if (state.curPage === 1 && assetClass.macros.length === 1) {
      deleteMacro(stateMacro);
      renderPortfolioDashboardMarkup(
        document.querySelector(".views-container")
      );
      notificationMessage(`Investment deleted`);
    } else if (state.curPage === 1) {
      // Deletion when user on inspectAsset and there are still more Macros
      deleteMacro(stateMacro);
      updateInspectAsset(assetClass);
      popup.remove();
      removeModal();
    } else {
      // Deletion when user on treemap
      deleteMacro(stateMacro);
      reRenderTree();
      popup.remove();
      removeModal();
    }
  });

  return popup;
};
