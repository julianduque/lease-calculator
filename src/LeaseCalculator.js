class LeaseCalculator {
  /*
    Validates required fields.
    Throws: Error | If there's an invalid required field
  */
  _validateData() {
    const requiredInputs = [
      "MSRP",
      "Selling Price",
      "Residual Value",
      "Money Factor",
    ];
    const requiredInput = [this.msrp, this.sellingPrice, this.rv, this.mf];
    requiredInput.forEach((field, i) => {
      if (!field || field === 0) {
        throw new Error(`Invalid Input: ${requiredInputs[i]}`);
      }
    });
  }

  /*
    Calculates the absolute and relative residual value of the vehicle
  */
  _calculateRV() {
    if (this.isRVPercent) {
      this.RVValue = this.msrp * (this.rv / 100);
      this.RVPercent = this.rv;
    } else {
      this.RVValue = this.rv;
      this.RVPercent = (this.rv / this.msrp) * 100;
    }
  }

  /*
    Converts the lease' money factor to APR.
    Note: To keep calculation accruate, we might need to truncate this value only on consumer read
    Returns: Number
  */
  _MFToAPR = () => this.mf * 2400;

  /*
    Calculates the lease' monthly payment, APR, total cost and thresholds

    msrp          Required, MSRP of the vehicle
    sellingPrice  Required, negotiated price of the vehicle
    rv            Required, Residual value of the vehicle
    isRVPercent   Whether the rv is absolute value of a percentage of MSRP
    mf            Required, The money factor of the lease
    leaseTerm     The length of the lease in months
    salesTax      The state's sales tax in percentage
    totalFees     Total fees of the lease
    rebates       Total discount from dealer and manufacturer
    tradeIn       Total trade-in value
    downPayment   Down payment, if applicable
  */
  calculate({
    msrp,
    sellingPrice,
    rv,
    isRVPercent = true,
    mf,
    leaseTerm = 36,
    salesTax = 0,
    totalFees = 0,
    rebates = 0,
    tradeIn = 0,
    downPayment = 0,
  }) {
    this.msrp = msrp;
    this.sellingPrice = sellingPrice;
    this.rv = rv;
    this.isRVPercent = isRVPercent;
    this.mf = mf;
    this.leaseTerm = leaseTerm;
    this.salesTax = salesTax;
    this.totalFees = totalFees;
    this.rebates = rebates;
    this.tradeIn = tradeIn;
    this.downPayment = downPayment;
    this._validateData();

    this._calculateRV();
    const grossCapCost = this.sellingPrice + this.totalFees;
    const capCostReduction = this.downPayment + this.rebates + this.tradeIn;
    const adjustedCapCost = grossCapCost - capCostReduction;
    const depreciation = adjustedCapCost - this.RVValue;
    const basePayment = depreciation / this.leaseTerm;
    const rentCharge = (adjustedCapCost + this.RVValue) * this.mf;
    this.apr = this._MFToAPR();
    this.monthlyPaymentPreTax = basePayment + rentCharge;
    this.monthlyPayment = this.monthlyPaymentPreTax * (1 + this.salesTax / 100);
  }

  /*
    Gets the residual value of the lease in percentage 
    Returns: Number
  */
  getRVPercentage = () => Math.round(this.RVPercent);

  /*
    Gets the residual value of the lease
    Returns: Number
  */
  getRVValue = () => Number.parseFloat(this.RVValue.toFixed(2));

  /*
    Gets the monthly payment of the lease, not including taxes
    Returns: Number
  */
  getMonthlyPaymentPreTax() {
    return Math.round(this.monthlyPaymentPreTax * 100) / 100;
  }

  /*
    Gets the monthly payment of the lease, including taxes
    Returns: Number
  */
  getMonthlyPayment() {
    return Math.round(this.monthlyPayment * 100) / 100;
  }

  /*
    Gets the discount off of the MSRP, in percentage
    Returns: Number
  */
  getDiscountOffMsrpPercentage() {
    const offMsrp = this.msrp - this.sellingPrice;
    const offMsrpPercentage = (offMsrp / this.msrp) * 100;
    return Math.round(offMsrpPercentage * 100) / 100;
  }

  /*
    Gets the percentage of the monthly payment out of the MSRP
    Returns: Number
  */
  getMonthlyPaymentToMsrpPercentage() {
    const msrpPercentage = (this.monthlyPayment / this.msrp) * 100;
    return Math.round(msrpPercentage * 100) / 100;
  }

  /*
    Gets the total cost of the lease
    Returns: Number
  */
  getTotalLeaseCost() {
    return this.monthlyPayment * this.leaseTerm + this.totalFees;
  }

  /*
    Gets the APR value of the lease
    Returns: Number
  */
  getAPR() {
    return Math.round(this.apr * 100) / 100;
  }
}

export default LeaseCalculator;
