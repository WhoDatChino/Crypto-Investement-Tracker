import state from "./model.js";

export class MacroInvestment {
  id = +(Date.now() + "").slice(-10);

  constructor(props) {
    this.asset = props.asset;
    this.originalCapital = props.originalCapital;
    this.assetAmount = this._calcCoinAmount(props.price);
    this.currentValue = this.updateCurrentValue();
    this.platform = props.platform;
    this.date = props.date;
    this.sold = false;
    this._addToAssetClass();
    this._addPlatform();
  }

  _findParentClassIndex() {
    return state.assetClasses.findIndex(
      (assetClass) => assetClass.asset === this.asset
    );
  }

  _calcCoinAmount(price) {
    return +(this.originalCapital / price).toFixed(6);
  }

  _addToAssetClass() {
    const parent = state.assetClasses[this._findParentClassIndex()];
    parent.macros.push(this);
    parent.updateMacros();
  }

  _addPlatform() {
    if (state.platforms[this.platform]) return;

    state.platforms.push(this.platform);
  }

  updateCurrentValue() {
    return +(
      state.assetClasses[this._findParentClassIndex()].currentPrice *
      this.assetAmount
    ).toFixed(2);
  }

  markSold(props) {
    this.sold = true;

    const { id, assetAmount } = this;
    // Sell price and date sold fed into here by input from user
    const { date, sellPrice } = props;

    // Send summary copy to soldPos of parent
    state.assetClasses[this._findParentClassIndex()].soldPositions.push({
      id,
      assetAmount,
      date,
      sellPrice,
    });

    // Reflect change in parent
    state.assetClasses[this._findParentClassIndex()].updateMacros();
  }

  markUnsold() {
    this.sold = false;

    // Remove summary obj from parent soldPositions that corresponds with this instance
    state.assetClasses[this._findParentClassIndex()].soldPositions =
      state.assetClasses[this._findParentClassIndex()].soldPositions.filter(
        (pos) => pos.id !== this.id
      );

    state.assetClasses[this._findParentClassIndex()].updateMacros();
  }
}

export class AssetClass {
  constructor(props) {
    this.asset = props.asset;
    this.geckoId = props.geckoId;
    this.currentPrice = this._findAssset().current_price;
    this.assetAmount = 0;
    this.totalInvested = 0;
    this.currentValue = 0;
    this.macros = [];
    this.soldPositions = [];
    this._addAssetClass();
  }

  _findAssset() {
    return state.curMarket.find((asset) => asset.name === this.asset);
  }

  updateCurrentPrice() {
    this.currentPrice = this._findAssset().current_price;
  }

  updateMacros() {
    this._updateAssetAmount();
    this._updateTotalInvested();
    this._updateCurrentValue();
  }

  _updateAssetAmount() {
    this.assetAmount = this.macros
      .filter((macro) => macro.sold === false)
      .reduce((acc, cur) => (acc += cur.assetAmount), 0);
    this._updateCurrentValue();
  }

  _updateCurrentValue() {
    this.currentValue = +(this.assetAmount * this.currentPrice).toFixed(2);
  }

  _updateTotalInvested() {
    this.totalInvested = this.macros
      .filter((macro) => macro.sold === false)
      .reduce((acc, cur) => (acc += cur.originalCapital), 0);
  }

  _addAssetClass() {
    state.assetClasses.push(this);
  }
}
