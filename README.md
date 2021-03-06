# Car Lease Calculator :red_car:

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Npm Version](https://img.shields.io/npm/v/lease-calculator?color=blue&logo=npm-version)](https://www.npmjs.com/package/lease-calculator)
![](https://github.com/ErezNagar/lease-calculator/workflows/Tests/badge.svg)

A simple auto lease calculator for calculating your monthly lease payment, APR, total lease cost, percentage off MSRP, etc.

See it used in the Auto Lease app: https://github.com/ErezNagar/lease-calculator-app

## How To Use

```bash
npm install lease-calculator --save
```

```javascript
const leaseCalculator = new LeaseCalculator();
leaseCalculator.calculate({
  // Make of the vehicle, for calculating manufacturer-based fees
  make: "Toyota",
  // Required, MSRP of the vehicle
  msrp: 23000,
  // Required, negotiated price of the vehicle
  sellingPrice: 21000,
  // Required, Residual value of the vehicle
  rv: 13110,
  // Whether the RV is an absolute value or a percentage of MSRP. Default: true
  isRVPercent: false,
  // Required, The money factor of the lease
  mf: 0.00125,
  // The state's sales tax in percentage. Default: 0%.
  salesTax: 6.25,
  // Total fees of the lease. Default: 0.
  totalFees: 1200,
});

// Get the lease monthly payment
const monthlyPayment = leaseCalculator.getMonthlyPayment();
```

## API

|               | Description                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `calculate()` | Main function to calculate lease total & monthly payments, APR, total cost, etc. Must be run first to calculated the different lease parameters. |

Arguments:

```javascript
calculate({
  // Make of the vehicle, for calculating manufacturer-based fees. Default: "".
  // See constants.js for valid values.
  make: "Toyota",
  // Required, MSRP of the vehicle
  msrp: 23000,
  // Required, negotiated price of the vehicle
  sellingPrice: 21000,
  // Required, Residual value of the vehicle.
  // If isRVPercent is true, value must be a percentage. I.e, if RV is 65%, rv should be 65.
  rv: 13110,
  // Whether the RV is an absolute value or a percentage of MSRP. Default: true
  isRVPercent: false,
  // Required, The money factor of the lease
  mf: 0.00125,
  // The length of the lease in months. Default: 36.
  leaseTerm: 36,
  // The state's sales tax in percentage. Default: 0%.
  salesTax: 6.25,
  // Total fees of the lease. Default: 0.
  totalFees: 1200,
  // Total discount from dealer and manufacturer. Default: 0.
  rebates: 500,
  // Total trade-in value. Default: 0.
  tradeIn: 0,
  // Down payment, if applicable. Default: 0.
  downPayment: 0,
  // Method of taxation to apply, based on state. Default: TAX_ON_MONTHLY_PAYMENT
  // See constants.js for valid values.
  taxMethod: 1,
});
```

|                                       |                                                                                                                                                                                    |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getRVValue()`                        | Gets the residual value of the lease                                                                                                                                               | Number |
| `getRVPercentage()`                   | Gets the residual value of the lease in percentage                                                                                                                                 | Number |
| `getMonthlyPaymentPreTax()`           | Gets the monthly payment of the lease, not including taxes                                                                                                                         | Number |
| `getMonthlyPayment()`                 | Gets the monthly payment of the lease, including taxes                                                                                                                             | Number |
| `getDiscountOffMsrpPercentage()`      | Gets the discount off of MSRP, in percentage                                                                                                                                       | Number |
| `getMonthlyPaymentToMsrpPercentage()` | Gets the percentage of the monthly payment out of the MSRP                                                                                                                         | Number |
| `getTotalLeaseCost()`                 | Gets the total cost of the lease. This includes all monthly payments, down paymenaand dealer fees. Does not include disposition fee, vehicle maintenance cost or other cost of use | Number |
| `getAPR()`                            | Gets the APR value of the lease                                                                                                                                                    | Number |
| `getAcquisitionFeeValue`              | Gets the acquisition fee value by brand. If no brand sepcified, returns 0                                                                                                          | Number |
| `getDispositionFeeValue`              | Gets the disposition fee value by brand. If no brand sepcified, returns 0                                                                                                          | Number |
| `getDriveOffPayment`                  | Gets total drive-off payment                                                                                                                                                       | Number |

## Supported manufacturers

Lease Calculator supports acquisition and disposition fee calculation for the following brands:

Acura, Alfa Romeo, Audi, Bmw, Buick, Cadillac, Chevrolet, Chrysler, Dodge, Fiat, Ford, Genesis, GMC, Honda, Hyundai, Infiniti, Jaguar, Jeep, Kia, land rover, Lexus, Lincoln, Mini, Mazda, Mercedes benz, Mitsubishi, Nissan, Ram, Scion, Smart, Subaru, Tesla, Toyota, Volkswagen, Volvo
