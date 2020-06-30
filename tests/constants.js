export const DUMMY_LEASE_ZERO_DOWN_DATA = {
  make: "Toyota",
  msrp: 23000,
  sellingPrice: 21000,
  rv: 13110,
  isRVPercent: false,
  mf: 0.00125,
  leaseTerm: 36,
  salesTax: 10.25,
  totalFees: 1200,
  rebates: 500,
};

export const DUMMY_LEASE_WITH_DOWN_DATA = {
  make: "Toyota",
  msrp: 23000,
  sellingPrice: 21000,
  rv: 13110,
  isRVPercent: false,
  mf: 0.00125,
  leaseTerm: 36,
  salesTax: 10.25,
  totalFees: 1200,
  rebates: 500,
  rebates: 0,
  downPayment: 1700,
};

export const DUMMY_LEASE_PERCENT_RV_DATA = {
  ...DUMMY_LEASE_ZERO_DOWN_DATA,
  rv: 57,
  isRVPercent: true,
};

export const PAYMENT_ZERO_DOWN_PRE_TAX = 300.99;
export const PAYMENT_ZERO_DOWN = 331.84;
export const PAYMENT_WITH_DOWN = 293.44;
export const RV_VALUE = 13110;
export const APR = 3;
export const OFF_MSRP = 8.7;
export const MSRP_PERCENTAGE = 1.44;
export const ACQUISITION_FEE_TOYOTA = 650;
export const DISPOSITION_FEE_TOYOTA = 350;
export const TOTAL_LEASE_COST_ZERO_DOWN = 13496.36;
export const TOTAL_LEASE_COST_WITH_DOWN = 12113.82;
