# Car Lease Calculator :red_car:

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Npm Version](https://img.shields.io/npm/v/lease-calculator?color=blue&logo=npm-version)](https://www.npmjs.com/package/lease-calculator)
![](https://github.com/ErezNagar/lease-calculator/workflows/Tests/badge.svg)

A simple auto lease calculator for calculating your monthly lease payment, APR, total lease cost and MSRP percentage.

See it used in the Auto Lease app: https://github.com/ErezNagar/lease-calculator-app

## How To Use

```bash
npm install lease-calculator --save
```

```javascript
const leaseCalculator = new LeaseCalculator();
leaseCalculator.calculate({
  // Required, MSRP of the vehicle
  msrp: 23000,
  // Required, negotiated price of the vehicle
  sellingPrice: 21000,
  // Required, Residual value of the vehicle
  rv: 13110,
  // Whether the rv is absolute value of a percentage of MSRP
  isRVPercent: false,
  // Required, The money factor of the lease
  mf: 0.00125,
  // The length of the lease in months
  leaseTerm: 36,
  // The state's sales tax in percentage
  salesTax: 6.25,
  // Total fees of the lease
  totalFees: 1200,
  // Total discount from dealer and manufacturer
  rebates: 500,
  // Total trade-in value
  tradeIn: 0,
  // Down payment, if applicable
  downPayment: 0,
});

// Get the lease monthly payment
const monthlyPayment = leaseCalculator.getMonthlyPayment();
```

## API

| Description                           | Return Type                                                                                                                                                                        |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getRVValue()`                        | Gets the residual value of the lease                                                                                                                                               | Number |
| `getRVPercentage()`                   | Gets the residual value of the lease in percentage                                                                                                                                 | Number |
| `getMonthlyPaymentPreTax()`           | Gets the monthly payment of the lease, not including taxes                                                                                                                         | Number |
| `getMonthlyPayment()`                 | Gets the monthly payment of the lease, including taxes                                                                                                                             | Number |
| `getDiscountOffMsrpPercentage()`      | Gets the discount off of MSRP, in percentage                                                                                                                                       | Number |
| `getMonthlyPaymentToMsrpPercentage()` | Gets the percentage of the monthly payment out of the MSRP                                                                                                                         | Number |
| `getTotalLeaseCost()`                 | Gets the total cost of the lease. This includes all monthly payments, down paymenaand dealer fees. Does not include disposition fee, vehicle maintenance cost or other cost of use | Number |
| `getAPR()`                            | Gets the APR value of the lease                                                                                                                                                    | Number |
