"use strict";

import state from "../model.js";

// /////// FUNCTIONS
function generateMarkup(id) {
  return `
    <div class="investment-expansion-view">

    <div class="crypto-header">
        <img class="coin-logo"
            src="https://assets.coingecko.com/coins/images/14577/large/tko-logo.png?1617093467"
            alt="Bitcoin logo">
        <h1>Bitcoin</h1>
    </div>

    <div class="investment-info">

        <section class="user-investment" style="margin-left: 2rem;">

            <h2>Your Investment in Bitcoin:</h2>

            <div class="content">

                <div class="investment-stats">
                    <p>Total coin amount: <span class="bold">0</span></p>
                    <p>Original investment(s) value: <span class="bold">0</span></p>
                    <p>Current value: <span class="bold">0</span></p>
                    <p>Percentage change: <span class="bold green"> 0</span></p>
                    <p>Total sold positions: <span class="bold red">0</span></p>
                </div>

                <div class="investment-dates">
                    <h3 style="margin-bottom: 5px; font-size: 1.3rem;">Individual Investment(s):</h3>
                    <div class="investment-table-container">
                        <table class="investment-table">
                            <thead>
                                <tr>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Platform</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr data-id="1111">
                                    <td><button>700</button></td>
                                    <td><button>22 Mar 2021</button></td>
                                    <td><button>Gemini</button></td>
                                </tr>
                                <tr data-id="2222">
                                    <td><button class="sold">600</button></td>
                                    <td><button class="sold">05 Jan 2021</button></td>
                                    <td><button class="sold">Gemini</button></td>

                                </tr>
                                <tr data-id="3333">
                                    <td><button>600</button></td>
                                    <td><button>05 Jan 2021</button></td>
                                    <td><button>Gemini</button></td>

                                </tr>
                                <tr data-id="4444">
                                    <td><button class="sold">600</button></td>
                                    <td><button class="sold">05 Jan 2021</button></td>
                                    <td><button class="sold">Gemini</button></td>
                                </tr>
                                <tr data-id="5555">
                                    <td><button>600</button></td>
                                    <td><button>05 Jan 2021</button></td>
                                    <td><button>Gemini</button></td>
                                </tr>
                                <tr data-id="6666">
                                    <td><button>600</button></td>
                                    <td><button>05 Jan 2021</button></td>
                                    <td><button>Gemini</button></td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                    <p>Click to view/edit investment</p>
                </div>
            </div>
        </section>

        <section class="crypto-info">
            <h2>Bitcoin stats:</h2>
            <div class="content">

                <div class="coin24hour-stats">
                    <p>Current Price: <span class="bold">$36,300.00</span></p>
                    <p>Market Cap: <span class="bold">$679.92 billion</span></p>
                    <p>24h Change: <span class="bold red">-1.38%</span></p>
                    <p>24h Volume: <span class="bold">$33.50 billion</span></p>
                    <p>24h High: <span class="bold">$37,908.96</span></p>
                    <p>24h Low: <span class="bold">$35,715.74</span></p>
                </div>

                <div class="price-graph-container">
                    <h3>Price Graph:</h3>
                    <svg class="price-graph" id="price-graph"></svg>
                    <div class="button-container">
                        <button class="change-period active" id="1w">1 Week</button>
                        <button class="change-period" id="1m">1 Month</button>
                        <button class="change-period" id="6m">6 Months</button>
                        <button class="change-period" id="1y">1 Year</button>
                        <button class="change-period" id="max">Max</button>
                    </div>

                </div>
            </div>

        </section>


    </div>
    `;
}

export const renderInvestmentInspection = function (d) {
  document.querySelector(".views-container").innerHTML = generateMarkup();
};
