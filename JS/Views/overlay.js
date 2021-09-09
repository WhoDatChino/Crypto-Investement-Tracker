export const createOverlay = function () {
  // Display overlay
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.querySelector(".views-container").append(overlay);
  return overlay;
};

export const removeModal = function () {
  const overlay = document.querySelector(".overlay");

  overlay.nextElementSibling.remove();
  overlay.remove();
};
