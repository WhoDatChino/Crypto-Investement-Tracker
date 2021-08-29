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
