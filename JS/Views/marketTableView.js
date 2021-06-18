import { formatFullCurrency, formatShortCurrency } from "../helpers.js";
import View from "./View.js";

class marketTableView extends View {
  parentElement = document.getElementById("marketTableHead");

  generateMarkup(data) {
    const coinPrice = formatFullCurrency(data.current_price);

    let priceChange;

    data.price_change_percentage_24h
      ? (priceChange = +data.price_change_percentage_24h.toFixed(2))
      : (priceChange = `N/A`);
    const vol = formatShortCurrency(data.total_volume);
    const mkCap = formatShortCurrency(data.market_cap);

    let html = `<tr class="coin" id="${data.symbol}">
                        <td>${data.name}</td>
                        <td>${coinPrice}</td>`;

    priceChange > 0
      ? (html += `<td class="green">+${priceChange}%</td>
        <td>${vol}</td>
        <td>${mkCap}</td>
        </tr>`)
      : (html += `<td class="red">${priceChange}%</td>
                        <td>${vol}</td>
                        <td>${mkCap}</td>
                    </tr>`);

    return html;
  }
}

export const marketTableElementMarkup = new marketTableView();
