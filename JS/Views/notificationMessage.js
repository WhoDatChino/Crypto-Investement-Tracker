import { NOTIFICATION_CLOSE_SECONDS } from "../config.js";

export const notificationMessage = function (message) {
  const popup = document.createElement("div");
  popup.classList.add("notification-message");

  popup.innerHTML = `
    <ion-icon name="checkmark-done-outline"></ion-icon>
    <p>${message}</p>
    `;

  document.querySelector(".views-container").append(popup);

  setTimeout(() => {
    popup.remove();
  }, NOTIFICATION_CLOSE_SECONDS * 1000);
};
