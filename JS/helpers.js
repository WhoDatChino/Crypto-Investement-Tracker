import { MODAL_CLOSE_SECONDS } from "./config.js";
import state from "./model.js";
import { displayErrorMessage } from "./Views/errorMsg.js";
import "core-js/stable"; // For polyfilling es6 syntax
import "regenerator-runtime/runtime";
export const formatCurrency = function (number, decimals = 2) {
  const num = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimals,
  }).format(number);
  return num;
};

export const formatCoinAmount = function (number) {
  if (number === 0 || number > 10) return +number.toFixed(2);

  if (number < 10) return +number.toFixed(6);
};

export const formatShortCurrency = function (num) {
  // const number = formatFullCurrency(num)

  if (num < 1000) {
    return `${formatCurrency(num)}`;
  }
  if (num < 1000000) {
    return `${formatCurrency(num / 1000)}k`;
  }
  // million
  if (num >= 1000000 && num < 1000000000) {
    return `${formatCurrency(num / 1000000)} million`;
  }
  //   billion
  if (num >= 1000000000 && num < 1000000000000) {
    return `${formatCurrency(num / 1000000000)} billion`;
  }
  //trillion
  if (num >= 1000000000000) {
    return `${formatCurrency(num / 1000000000000)} trillion`;
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
// Ensures sell date is not before buy date
export const checkSellDate = function (input, buyDate) {
  if (new Date(input.value).getTime() < new Date(buyDate).getTime()) {
    showError(input, `Sell date can't be before buy date`);
    return 1;
  } else {
    return 0;
  }
};

// Checks that valid number is entered
export const checkMoney = function (input) {
  if (+input.value === 0 || +input.value < 0) {
    showError(input, `Value must be greater than 0`);
    return 1;
  }
  return 0;
};

// /////// SET LOCAL STORAGE

export const setLocalStorage = function () {
  try {
    localStorage.setItem("assetClasses", JSON.stringify(state.assetClasses));
  } catch (err) {
    throw 900;
  }
};

export const getLocalStorage = function () {
  const saved = localStorage.getItem("assetClasses");
  if (saved) state.assetClasses = JSON.parse(saved);
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
