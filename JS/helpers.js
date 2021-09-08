import { MODAL_CLOSE_SECONDS } from "./config.js";

export const formatCurrency = function (number, decimals = 2) {
  const num = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimals,
  }).format(number);
  return num;
};

export const formatShortCurrency = function (num) {
  // const number = formatFullCurrency(num)

  if (num < 1000000) {
    let number = num.toFixed(2);

    return `${formatCurrency(number, 2)}`;
  }
  // million
  if (num >= 1000000 && num < 1000000000) {
    let number = (num / 1000000).toFixed(2);

    return `${formatCurrency(number, 2)} million`;
  }
  //   billion
  if (num >= 1000000000 && num < 1000000000000) {
    let number = (num / 1000000000).toFixed(2);
    return `${formatCurrency(number, 2)} billion`;
  }
  //trillion
  if (num >= 1000000000000) {
    let number = (num / 1000000000000).toFixed(2);
    return `${formatCurrency(number, 2)} trillion`;
  }
};

export const formatReadableDate = function (date, bool) {
  // Format is bool is true
  const monthsLong = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Format if bool is false
  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dateInput = new Date(date);
  const day = dateInput.getDate();
  const month = dateInput.getMonth();
  const year = dateInput.getFullYear();

  return `${day} ${length ? monthsLong[month] : monthsShort[month]} ${year}`;
};

// ///////// Form Validation

// Checks that fields are not empty. Accepts array of html inputs
export const checkRequired = function (inputArr) {
  let valid = 0;
  inputArr.forEach((input) => {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
      valid++;
    } else {
      showSuccess(input);
    }
  });

  return valid;
};
// Displays error for user on input fields
function showError(input, message) {
  const parent = input.parentElement;

  parent.className = "input-data error";
  parent.querySelector("small").innerText = message;
}
// Removes any error styling
function showSuccess(input) {
  input.parentElement.className = "input-data";
}
// Gets field name for use in error message
function getFieldName(input) {
  return input.getAttribute("name");
}
// Checks that date is not in the future
export const checkDate = function (input) {
  if (new Date(input.value).getTime() > Date.now()) {
    showError(input, `Can't use future date`);
    return 1;
  }
  return 0;
};

// Checks that valid number is entered
export const checkMoney = function (input) {
  if (+input.value === 0 || +input.value < 0) {
    showError(input, `Value must be greater than 0`);
    return 1;
  }
  return 0;
};

// /////// SUCCESS MESSAGE POPUP
export const showSuccessPopup = function (message) {
  const popup = document.createElement("div");
  popup.classList.add("success-message");

  popup.innerHTML = `
  <ion-icon name="checkmark-done-outline"></ion-icon>
  <p>${message}</p>
  `;

  document.querySelector(".views-container").append(popup);
};

// /////// ASYNC API CALL

// export const getJSON = async function(url){

//   try{
//     const req = await fetch(url)

//     if(!req.ok){
//       throw req.status
//     }

//     const data = await req.json()

//     return data

//   } catch (err){
//     throw err
//   }
// }
