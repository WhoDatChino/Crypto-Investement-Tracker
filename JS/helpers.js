export const formatFullCurrency = function (number) {
  const num = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 5,
  }).format(number);
  return num;
};

export const formatShortCurrency = function (num) {
  // const number = formatFullCurrency(num)

  if (num < 1000000) {
    let number = num.toFixed(2);

    return `${formatFullCurrency(number)}`;
  }
  // million
  if (num >= 1000000 && num < 1000000000) {
    let number = (num / 1000000).toFixed(2);

    return `${formatFullCurrency(number)} million`;
  }
  //   billion
  if (num >= 1000000000 && num < 1000000000000) {
    let number = (num / 1000000000).toFixed(2);
    return `${formatFullCurrency(number)} billion`;
  }
  //trillion
  if (num >= 1000000000000) {
    let number = (num / 1000000000000).toFixed(2);
    return `${formatFullCurrency(number)} trillion`;
  }
};
