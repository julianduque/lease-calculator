const DUMMY_LEASE_ZERO_DOWN_DATA = {
  msrp: 23000,
  sellingPrice: 21000,
  rv: 13110,
  isRVPercent: false,
  mf: 0.00125,
  leaseTerm: 36,
  salesTax: 6.25,
  totalFees: 1200,
  rebates: 500,
};

module.exports = {
  DUMMY_LEASE_ZERO_DOWN_DATA,
  DUMMY_LEASE_WITH_DOWN_DATA: {
    msrp: 23000,
    sellingPrice: 21000,
    rv: 13110,
    isRVPercent: false,
    mf: 0.00125,
    leaseTerm: 36,
    salesTax: 6.25,
    totalFees: 1200,
    rebates: 500,
    downPayment: 1700,
  },
  DUMMY_LEASE_PERCENT_RV_DATA: {
    ...DUMMY_LEASE_ZERO_DOWN_DATA,
    rv: 57,
    isRVPercent: true,
  },
  PAYMENT_ZERO_DOWN: 299.76,
  PAYMENT_ZERO_DOWN_PRE_TAX: 282.12,
  PAYMENT_WITH_DOWN: 247.32,
  RV_VALUE: 13110,
  APR: 3,
  OFF_MSRP: 8.7,
  MSRP_PERCENTAGE: 1.3,
};
