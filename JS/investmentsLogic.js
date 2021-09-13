import state from "./model.js";

export class MacroInvestment {
  id = +(Date.now() + "").slice(-10);

  constructor(props) {
    this.asset = props.asset;
    this.originalCapital = props.originalCapital;
    this.assetAmount = this._initCoinAmount(props.price);
    this.currentValue = this._calcCurrentValue();
    this.platform = props.platform;
    this.date = props.date;
    this.sold = false;
    this._addToAssetClass();
    // this._addPlatform(); // Will make use of this in later versions
  }

  // //// Called on creation:
  _initCoinAmount(price) {
    return +(this.originalCapital / price).toFixed(6);
  }

  // Internal chnages to curValue
  _calcCurrentValue() {
    return this.assetAmount * this.findParentClass().currentPrice;
  }

  _addToAssetClass() {
    const parent = this.findParentClass();
    parent.macros.push(this);
    parent.updateMacros();
  }

  //   _addPlatform() {
  //     if (state.platforms[this.platform]) return;

  //     state.platforms.push(this.platform);
  //   }

  // //// Methods

  // Returns index of associated parent class
  findParentClass() {
    return state.assetClasses.find(
      (assetClass) => assetClass.asset === this.asset
    );
  }

  // Called on loadup by parent when currentPrice obtained from coinGecko
  updateCurrentPrice(price) {
    return (this.currentValue = price * this.assetAmount);
  }

  // Marks macro sold and sends summary obj to parent soldPos
  markSold(props) {
    this.sold = true;

    const { id, assetAmount } = this;
    // Sell price and date sold fed into here by input from user
    const { date, sellPrice } = props;

    // Send summary copy to soldPos of parent
    this.findParentClass().soldPositions.push({
      id,
      assetAmount,
      date,
      sellPrice,
    });

    // Reflect sale in obj
    this.assetAmount = 0;
    this.currentValue = this._calcCurrentValue();

    // Reflect change in parent
    this.findParentClass().updateMacros();
  }

  markUnsold() {
    this.sold = false;

    const parentCl = this.findParentClass();

    // Get assetAmount sent to soldPositions when sold
    this.assetAmount = parentCl.soldPositions.find(
      (obj) => obj.id === this.id
    ).assetAmount;
    this.currentValue = this._calcCurrentValue();

    // Remove summary obj from parent soldPositions that corresponds with this instance
    parentCl.soldPositions = parentCl.soldPositions.filter(
      (pos) => pos.id !== this.id
    );

    parentCl.updateMacros();
  }
}

export class AssetClass {
  constructor(props) {
    this.asset = props.asset;
    this.geckoId = props.geckoId;
    this.currentPrice = this._findMarketAsset().current_price;
    this.assetAmount = 0;
    this.totalInvested = 0;
    this.currentValue = 0;
    this.macros = [];
    this.soldPositions = [];
    this._initAssetClass();
  }

  // Find the matching asset from coinGeckop call
  _findMarketAsset() {
    return state.curMarket.find((asset) => asset.name === this.asset);
  }

  _initAssetClass() {
    state.assetClasses.push(this);
  }

  // Update currentPrice from market
  updateCurrentPrice() {
    this.currentPrice = this._findMarketAsset().current_price;
    this.macros.forEach((macro) => macro.updateCurrentPrice(this.currentPrice));
    this._updateCurrentValue();
  }

  // Called when macro is deleted/sold
  updateMacros() {
    this._updateAssetAmount();
    this._updateTotalInvested();
    this._updateCurrentValue();
  }

  // Sums assetAmount of each unsold macro
  _updateAssetAmount() {
    this.assetAmount = this.macros
      .filter((macro) => macro.sold === false)
      .reduce((acc, cur) => (acc += cur.assetAmount), 0);
  }

  // Multiplies assetAmount by currentPrice
  _updateCurrentValue() {
    this.currentValue = +(this.assetAmount * this.currentPrice).toFixed(2);
  }

  // Sums originalCapital of unsold macros
  _updateTotalInvested() {
    this.totalInvested = this.macros
      .filter((macro) => macro.sold === false)
      .reduce((acc, cur) => (acc += cur.originalCapital), 0);
  }

  // Deletes macro passed in and updates class
  deleteMacro(macro) {
    const delObj = this.macros.find((obj) => obj.id === macro.id);

    if (delObj.sold) delObj.markUnsold();

    this.macros = this.macros.filter((invest) => invest.id !== delObj.id);

    // Delete class if it doesnt have any macros remaining
    if (this.macros.length === 0) {
      state.assetClasses = state.assetClasses.filter(
        (assClass) => assClass.asset !== this.asset
      );
      return;
    }
    this.updateMacros();
  }
}
