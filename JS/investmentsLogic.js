import state from "./model.js";

// /////////
//  MACRO INVESTMENT
class MacroLogic {
  // Internal chnages to curValue
  _calcCurrentValue() {
    return this.assetAmount * this.findParentClass().currentPrice;
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

    // Reflect change in parent
    this.findParentClass().updateMacros();
  }

  markUnsold() {
    this.sold = false;

    const parentCl = this.findParentClass();

    // Remove summary obj from parent soldPositions that corresponds with this instance
    parentCl.soldPositions = parentCl.soldPositions.filter(
      (pos) => pos.id !== this.id
    );

    parentCl.updateMacros();
  }
}

export class MacroInvestment extends MacroLogic {
  constructor(props) {
    super();
    this.id = +(Date.now() + "").slice(-10);
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

  _addToAssetClass() {
    const parent = this.findParentClass();
    parent.macros.push(this);
    parent.updateMacros();
  }
}

export class ResetMacro extends MacroLogic {
  constructor(obj) {
    super();
    this.id = obj.id;
    this.asset = obj.asset;
    this.originalCapital = obj.originalCapital;
    this.assetAmount = obj.assetAmount;
    this.currentValue = obj.currentValue;
    this.platform = obj.platform;
    this.date = obj.date;
    this.sold = obj.sold;
  }
}

// //////////
// ASSET CLASS

class AssetClassLogic {
  // Find the matching asset from coinGeckop call
  _findMarketAsset() {
    return state.curMarket.find((asset) => asset.name === this.asset);
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

export class AssetClass extends AssetClassLogic {
  constructor(props) {
    super();
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

  _initAssetClass() {
    state.assetClasses.push(this);
  }
}

export class ResetAssetClass extends AssetClassLogic {
  constructor(obj) {
    super();
    this.asset = obj.asset;
    this.ticker = obj.ticker;
    this.currentPrice = this._findMarketAsset().current_price;
    this.geckoId = obj.geckoId;
    this.assetAmount = obj.assetAmount;
    this.totalInvested = obj.totalInvested;
    this.currentValue = this.currentPrice * this.assetAmount;
    this.soldPositions = obj.soldPositions;
    this.macros = this._resetMacros(obj.macros);
    this.updateCurrentPrice();
  }

  _resetMacros(macrosArr) {
    return macrosArr.map((obj) => new ResetMacro(obj));
  }
}
