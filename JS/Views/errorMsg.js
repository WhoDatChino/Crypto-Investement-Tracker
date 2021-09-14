// Error messages and codes as specified by CoinApi
const errorMap = {
  400: `Something went wrong, please try again. If error persists, please manually input coin price.`,
  401: `API key invalid. If error persists, please manually input coin price.`,
  403: `API key unauthorised. If error persists, please manually input coin price.`,
  429: `Too many requests. Daily limit reached. If error persists, please manually input coin price.`,
  550: `No data. Can't fufill request. If error persists, please manually input coin price.`,
  // Custom errors
  900: `Local storage is disabled on your device. Investments can't be saved.`,
  999: `Network error. If error persists, please manually input coin price.`,
};

// Shows popup error message based on the error returned by CoinApi response
export const displayErrorMessage = function (code = 999) {
  const errorPopup = document.createElement("div");
  errorPopup.classList.add("error-message");

  const message = errorMap[code] ?? `Network error.`;

  errorPopup.innerHTML = `
    <ion-icon name="warning-outline"></ion-icon>
    <p>${message}</p>
    
    <button class="cancel-btn">
    </button>
    `;
  document.querySelector(".views-container").append(errorPopup);
  errorPopup.querySelector(".cancel-btn").addEventListener("click", () => {
    errorPopup.remove();
  });
};
