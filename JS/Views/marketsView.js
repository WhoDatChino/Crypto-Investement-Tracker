import View from "./View.js";

class MarketsView extends View {
  _generateGridMarkup() {
    return ` <div class="markets-view">
          <section class="market-stats">
              <h1>24 hour market stats</h1>
              <div class="stats-grid-container">
                  <div class="stats-grid">
                      <div class="market_perf">
                          <h2>Market Performance:</h2>
                          <p>Market is up 📈 <span class="green">+4.15%</span></p>
  
                      </div>
                      <div class="big_winner">
                          <h2>Biggest Winner:</h2>
                          <p>Ethereum <span class="green">+25%</span></p>
                      </div>
                      <div class="high_volume">
                          <h2>Highest Volume:</h2>
                          <p>Ethereum <span>5</span></p>
                      </div>
                      <div class="big_loser">
                          <h2>Biggest Loser:</h2>
                          <p>Dogecoin <span class="red">-19%</span></p>
                      </div>
                      <div class="low_volume">
                          <h2>Lowest Volume:</h2>
                          <p>Safemoon <span>905970</span></p>
                      </div>
                  </div>
              </div>
          </section>
  
  
          <section class="market-info">
  
              <button class="expand-tableBTN">
                  <ion-icon name="expand-outline"></ion-icon>
              </button>
  
              <div class="table-container">
                  <table class="crypto-table">
                      <tr>
                          <th>
                              <div class="table-header">
                                  <h2>Name</h2>
                                  <div class="sortBTN-container">
                                      <button>
                                          <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                      </button>
                                      <button>
                                          <ion-icon name="triangle" class="descending"></ion-icon>
                                      </button>
                                  </div>
                              </div>
                          </th>
  
                          <th>
                              <div class="table-header">
                                  <h2>Price</h2>
                                  <div class="sortBTN-container">
                                      <button>
                                          <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                      </button>
                                      <button>
                                          <ion-icon name="triangle-outline" class="descending"></ion-icon>
                                      </button>
                                  </div>
                              </div>
                          </th>
  
                          <th>
                              <div class="table-header">
                                  <h2>Change</h2>
                                  <div class="sortBTN-container">
                                      <button>
                                          <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                      </button>
                                      <button>
                                          <ion-icon name="triangle-outline" class="descending"></ion-icon>
                                      </button>
                                  </div>
                              </div>
                          </th>
  
                          <th>
                              <div class="table-header">
                                  <h2>Volume</h2>
                                  <div class="sortBTN-container">
                                      <button>
                                          <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                      </button>
                                      <button>
                                          <ion-icon name="triangle-outline" class="descending"></ion-icon>
                                      </button>
                                  </div>
                              </div>
                          </th>
  
                          <th>
                              <div class="table-header">
                                  <h2>Market Cap</h2>
                                  <div class="sortBTN-container">
                                      <button>
                                          <ion-icon name="triangle-outline" class="ascending"></ion-icon>
                                      </button>
                                      <button>
                                          <ion-icon name="triangle-outline" class="descending"></ion-icon>
                                      </button>
                                  </div>
                              </div>
                          </th>
  
                      </tr>
  
                      <tr class="coin" id="btc">
                          <td>Bitcoin</td>
                          <td>€32,325</td>
                          <td class="green">+2.70%</td>
                          <td>€29.0 billion</td>
                          <td>€569.0 billion</td>
                      </tr>
                      <tr class="coin" id="doge">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
                      <tr class="coin">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
                      <tr class="coin">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
                      <tr class="coin">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
                      <tr class="coin">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
                      <tr class="coin">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
                      <tr class="coin">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
                      <tr class="coin">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
                      <tr class="coin">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
                      <tr class="coin">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
                      <tr class="coin">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
                      <tr class="coin">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
                      <tr class="coin">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
                      <tr class="coin">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
                      <tr class="coin">
                          <td>Dogecoin</td>
                          <td>€0.26</td>
                          <td class="red">-1.67%</td>
                          <td>€1.7 billion</td>
                          <td>€33.4 billion</td>
                      </tr>
  
  
  
                  </table>
              </div>
  
          </section>
      </div>`;
  }
}

export const marketsMarkup = new MarketsView();
