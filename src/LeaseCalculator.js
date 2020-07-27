import {
  TAX_ON_MONTHLY_PAYMENT,
  TAX_ON_SALES_PRICE,
  TAX_ON_TOTAL_LEASE_PAYMENT,
  MAKES,
  MANUFACTURER_FEES,
} from "./constants";

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
  _MFToAPR() {
    return this.mf * 2400;
  }

  /*
    Calculates the lease' monthly payment, APR, total cost, etc.

    make          Make of the vehicle, for calculating fees
    msrp          Required, MSRP of the vehicle
    sellingPrice  Required, negotiated price of the vehicle
    rv            Required, Residual value of the vehicle
    isRVPercent   Whether the rv is absolute value of a percentage of MSRP
    mf            Required, The money factor of the lease
    leaseTerm     The length of the lease in months.
    salesTax      The state's sales tax in percentage.
    totalFees     Total fees of the lease
    rebates       Total discount from dealer and manufacturer
    tradeIn       Total trade-in value
    downPayment   Down payment, if applicable
    taxMethod     Method of taxation to apply, based on state
  */
  calculate({
    make,
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
    taxMethod = TAX_ON_MONTHLY_PAYMENT,
  }) {
    this.make = make;
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
    this.taxMethod = taxMethod;

    this._validateData();

    this._calculateRV();
    const grossCapCost = this.sellingPrice + this.totalFees;
    const capCostReduction = this.downPayment + this.rebates + this.tradeIn;
    // Net Cap Cost. By default, acquisition fee is capitalized
    const adjustedCapCost =
      grossCapCost - capCostReduction + this.getAcquisitionFee();
    const depreciation = adjustedCapCost - this.RVValue;
    const basePayment = depreciation / this.leaseTerm;
    const rentCharge = (adjustedCapCost + this.RVValue) * this.mf;
    this.apr = this._MFToAPR();
    this.monthlyPaymentPreTax = basePayment + rentCharge;
    this.monthlyPayment = this.calculateMonthlyPaymentWithTax();
    this.driveOffPayment = this.getDriveOffPayment();
  }

  /*
    Gets the residual value of the lease in percentage 
    Returns: Number
  */
  getRVPercentage() {
    return Math.round(this.RVPercent);
  }

  /*
    Gets the residual value of the lease
    Returns: Number
  */
  getRVValue() {
    return Number.parseFloat(this.RVValue.toFixed(2));
  }

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
    const totalCost =
      // First monthly payment is included in drive-off
      this.monthlyPayment * (this.leaseTerm - 1) +
      this.getDriveOffPayment() +
      this.getDispositionFee();
    return Math.round(totalCost * 100) / 100;
  }

  /*
    Gets the APR value of the lease
    Returns: Number
  */
  getAPR() {
    return Math.round(this.apr * 100) / 100;
  }

  /*
    Gets the acquisition fee value by brand. If no brand sepcified, returns 0;
    Returns: Number
  */
  getAcquisitionFee() {
    const make = MAKES.filter((make) => make.displayName === this.make);
    if (make.length === 0) {
      return 0;
    }

    return MANUFACTURER_FEES.filter(
      (manufacturer) => manufacturer.makeId === make[0].id
    )[0].acquisitionFee;
  }

  /*
    Gets the disposition fee value by brand. If no brand sepcified, returns 0;
    Returns: Number
  */
  getDispositionFee() {
    const make = MAKES.filter((make) => make.displayName === this.make);
    if (make.length === 0) {
      return 0;
    }

    return MANUFACTURER_FEES.filter(
      (manufacturer) => manufacturer.makeId === make[0].id
    )[0].dispositionFee;
  }

  /*
    Calculates monthly payment based on method of taxation
    Returns: Number
  */
  calculateMonthlyPaymentWithTax() {
    if (this.taxMethod === TAX_ON_MONTHLY_PAYMENT)
      return this.monthlyPaymentPreTax * (1 + this.salesTax / 100);
    return this.monthlyPaymentPreTax;
  }

  /*
    Calculates the drive-off tax based on method of taxation
    Returns: Number
  */
  calculateDriveOffTaxes() {
    let taxableAmount;
    if (this.taxMethod === TAX_ON_MONTHLY_PAYMENT) {
      taxableAmount = this.downPayment + this.totalFees;
    } else if (this.taxMethod === TAX_ON_SALES_PRICE) {
      taxableAmount = this.sellingPrice;
    } else if (this.taxMethod === TAX_ON_TOTAL_LEASE_PAYMENT) {
      taxableAmount =
        this.monthlyPaymentPreTax +
        this.downPayment +
        this.totalFees +
        this.getAcquisitionFee();
    }

    // return taxableAmount * (1 + this.salesTax / 100);
    return taxableAmount * (this.salesTax / 100);
  }

  /*
    Calculates total drive-off payment
    Returns: Number
  */
  getDriveOffPayment() {
    const driveOffTaxes = this.calculateDriveOffTaxes();
    return (
      driveOffTaxes +
      this.downPayment +
      this.totalFees +
      // First month payment
      this.monthlyPayment
    );
  }
}

export default LeaseCalculator;
