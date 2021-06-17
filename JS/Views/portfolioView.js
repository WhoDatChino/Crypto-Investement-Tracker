import View from "./View.js";

class PortfolioView extends View {
  _generateGridMarkup() {
    return `<div class="portfolio-summary-view">
  
          <h1 class="port-header">Portfolio Dashboard</h1>
  
          <div class="port-summary-container">
              <div>
                  <p class="port-value">$542.50</p>
                  <label for="port-value">Current portfolio value</label>
              </div>
  
              <div>
                  <p class="start-value">$400</p>
                  <label for="start-value">Total original investment(s)</label>
              </div>
  
              <div>
                  <p class="value-change"><span class="green">+35.42%</span></p>
                  <label for="value-change">Percentage change</label>
              </div>
  
              <div>
                  <p class="sold-pos">$120</p>
                  <label for="sold-pos">Total sold positions</label>
              </div>
          </div>
  
          <div class="asset-balances-container">
              <div class="wrapper">
                  <label for="asset-balances-table">
                      <h2>Balances:</h2>
                  </label>
                  <div class="asset-balances">
                      <table class="asset-balances-table">
                          <tr>
                              <th>Asset</th>
                              <th>Asset Amount</th>
                              <th>Value</th>
                              <th>Portfolio %</th>
                          </tr>
                          <tr>
                              <td>Bitcoin</td>
                              <td>0.0005</td>
                              <td>4564850%</td>
                              <td>56661</td>
                          </tr>
                          <tr>
                              <td>Bitcoin</td>
                              <td>0.0005</td>
                              <td>4564850%</td>
                              <td>56661</td>
                          </tr>
                          <tr>
                              <td>Bitcoin</td>
                              <td>0.0005</td>
                              <td>4564850%</td>
                              <td>56661</td>
                          </tr>
                          <tr>
                              <td>eth</td>
                              <td>0.0005</td>
                              <td>4564850%</td>
                              <td>56661</td>
                          </tr>
                          <tr>
                              <td>Bitcoin</td>
                              <td>0.0005</td>
                              <td>4564850%</td>
                              <td>56661</td>
                          </tr>
                          <tr>
                              <td>eth</td>
                              <td>0.0005</td>
                              <td>4564850%</td>
                              <td>56661</td>
                          </tr>
                          <tr>
                              <td>Bitcoin</td>
                              <td>0.0005</td>
                              <td>4564850%</td>
                              <td>56661</td>
                          </tr>
                          <tr>
                              <td>eth</td>
                              <td>0.0005</td>
                              <td>4564850%</td>
                              <td>56661</td>
                          </tr>
                          <tr>
                              <td>Bitcoin</td>
                              <td>0.0005</td>
                              <td>4564850%</td>
                              <td>56661</td>
                          </tr>
                          <tr>
                              <td>Bitcoin</td>
                              <td>0.0005</td>
                              <td>4564850%</td>
                              <td>56661</td>
                          </tr>
                          <tr>
                              <td>Bitcoin</td>
                              <td>0.0005</td>
                              <td>4564850%</td>
                              <td>56661</td>
                          </tr>
                          <tr>
                              <td>Bitcoin</td>
                              <td>0.0005</td>
                              <td>4564850%</td>
                              <td>56661</td>
                          </tr>
                          <tr>
                              <td>eth</td>
                              <td>0.0005</td>
                              <td>4564850%</td>
                              <td>56661</td>
                          </tr>
  
                      </table>
                  </div>
              </div>
              <div class="sunburst-diag"></div>
          </div>
  
          <div class="port-movements-container">
              <label for="port-movements-table">
                  <h2 style="margin: 0.75rem 1rem;">Portfolio movements:</h2>
              </label>
              <div class="port-movements">
                  <table class="port-movements-table">
                      <tr>
                          <th>Date</th>
                          <th>Asset</th>
                          <th>Transaction</th>
                          <th>Amount</th>
                          <th>Asset amount</th>
                      </tr>
                      <tr class="sell">
                          <td>15 Jan 2021</td>
                          <td>Bitcoin</td>
                          <td><span class="red">Sell</span></td>
                          <td>$150</td>
                          <td>0.0005</td>
                      </tr>
                      <tr>
                          <td>28 Mar 2021</td>
                          <td>Dogecoin</td>
                          <td><span class="green">Buy</span></td>
                          <td>$500</td>
                          <td>360.531</td>
                      </tr>
                      <tr>
                          <td>05 Nov 2020</td>
                          <td>Ethereum</td>
                          <td><span class="green">Buy</span></td>
                          <td>$150</td>
                          <td>0.0005</td>
                      </tr>
                      <tr>
                          <td>05 Nov 2020</td>
                          <td>Ethereum</td>
                          <td><span class="green">Buy</span></td>
                          <td>$150</td>
                          <td>0.0005</td>
                      </tr>
                      <tr>
                          <td>05 Nov 2020</td>
                          <td>Ethereum</td>
                          <td><span class="green">Buy</span></td>
                          <td>$150</td>
                          <td>0.0005</td>
                      </tr>
                      <tr>
                          <td>05 Nov 2020</td>
                          <td>Ethereum</td>
                          <td><span class="green">Buy</span></td>
                          <td>$150</td>
                          <td>0.0005</td>
                      </tr>
                      <tr>
                          <td>05 Nov 2020</td>
                          <td>Ethereum</td>
                          <td><span class="green">Buy</span></td>
                          <td>$150</td>
                          <td>0.0005</td>
                      </tr>
                      <tr>
                          <td>05 Nov 2020</td>
                          <td>Ethereum</td>
                          <td><span class="green">Buy</span></td>
                          <td>$150</td>
                          <td>0.0005</td>
                      </tr>
                      <tr>
                          <td>05 Nov 2020</td>
                          <td>Ethereum</td>
                          <td><span class="green">Buy</span></td>
                          <td>$150</td>
                          <td>0.0005</td>
                      </tr>
                      <tr class="sell">
                          <td>15 Jan 2021</td>
                          <td>Bitcoin</td>
                          <td><span class="red">Sell</span></td>
                          <td>$150</td>
                          <td>0.0005</td>
                      </tr>
                  </table>
              </div>
          </div>
  
      </div>`;
  }
}

export const portMarkup = new PortfolioView();
