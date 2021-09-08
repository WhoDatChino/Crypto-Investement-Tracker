export const deletionConfirmation = function () {
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
  return popup;
};
