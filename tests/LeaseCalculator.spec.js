import LeaseCalculator from "../src/LeaseCalculator";
import {
  DUMMY_LEASE_ZERO_DOWN_DATA,
  DUMMY_LEASE_WITH_DOWN_DATA,
  DUMMY_LEASE_PERCENT_RV_DATA,
  PAYMENT_ZERO_DOWN,
  PAYMENT_ZERO_DOWN_PRE_TAX,
  PAYMENT_WITH_DOWN,
  RV_VALUE,
  APR,
  // Discount off MSRP in %
  OFF_MSRP,
  // Monthly payment as a percentage of the MSRP
  MSRP_PERCENTAGE,
  ACQUISITION_FEE_TOYOTA,
  DISPOSITION_FEE_TOYOTA,
  TOTAL_LEASE_COST_ZERO_DOWN,
  TOTAL_LEASE_COST_WITH_DOWN,
} from "./constants";

describe("LeaseCalculator", () => {
  let leaseCalculator;
  beforeAll(() => {
    leaseCalculator = new LeaseCalculator();
  });

  describe("Validation", () => {
    it("should throw an error when missing a required field", () => {
      expect(() => {
        leaseCalculator.calculate({
          ...DUMMY_LEASE_ZERO_DOWN_DATA,
          msrp: null,
        });
      }).toThrow(Error);
    });
    it("should throw an error when MSRP field is missing", () => {
      expect(() => {
        leaseCalculator.calculate({
          ...DUMMY_LEASE_ZERO_DOWN_DATA,
          msrp: null,
        });
      }).toThrowError(`Invalid Input: MSRP`);
    });
    it("should throw an error when Selling Price field is missing", () => {
      expect(() => {
        leaseCalculator.calculate({
          ...DUMMY_LEASE_ZERO_DOWN_DATA,
          sellingPrice: null,
        });
      }).toThrowError(`Invalid Input: Selling Price`);
    });
    it("should throw an error when RV field is missing", () => {
      expect(() => {
        leaseCalculator.calculate({
          ...DUMMY_LEASE_ZERO_DOWN_DATA,
          rv: null,
        });
      }).toThrowError(`Invalid Input: Residual Value`);
    });
    it("should throw an error when MF field is missing", () => {
      expect(() => {
        leaseCalculator.calculate({
          ...DUMMY_LEASE_ZERO_DOWN_DATA,
          mf: null,
        });
      }).toThrowError(`Invalid Input: Money Factor`);
    });
  });

  describe("Acquisition fee", () => {
    it("Is 0 when Make is not specified", () => {
      leaseCalculator.calculate({ ...DUMMY_LEASE_ZERO_DOWN_DATA, make: "" });
      const acquisitionFee = leaseCalculator.getAcquisitionFee();
      expect(acquisitionFee).toEqual(0);
    });
    it("is based on Make, when specified", () => {
      leaseCalculator.calculate(DUMMY_LEASE_ZERO_DOWN_DATA);
      const acquisitionFee = leaseCalculator.getAcquisitionFee();
      expect(acquisitionFee).toEqual(ACQUISITION_FEE_TOYOTA);
    });
  });

  describe("Disposition fee", () => {
    it("Is 0 when Make is not specified", () => {
      leaseCalculator.calculate({ ...DUMMY_LEASE_ZERO_DOWN_DATA, make: "" });
      const acquisitionFee = leaseCalculator.getDispositionFee();
      expect(acquisitionFee).toEqual(0);
    });
    it("is based on Make, when specified", () => {
      leaseCalculator.calculate(DUMMY_LEASE_ZERO_DOWN_DATA);
      const acquisitionFee = leaseCalculator.getDispositionFee();
      expect(acquisitionFee).toEqual(DISPOSITION_FEE_TOYOTA);
    });
  });

  describe("Calculates", () => {
    it("the correct monthly payment w/ zero down", () => {
      leaseCalculator.calculate(DUMMY_LEASE_ZERO_DOWN_DATA);
      const payment = leaseCalculator.getMonthlyPayment();
      expect(payment).toEqual(PAYMENT_ZERO_DOWN);
    });

    it("the correct monthly payment w/ a down payment", () => {
      leaseCalculator.calculate(DUMMY_LEASE_WITH_DOWN_DATA);
      const payment = leaseCalculator.getMonthlyPayment();
      expect(payment).toEqual(PAYMENT_WITH_DOWN);
    });

    it("the correct discount off msrp", () => {
      leaseCalculator.calculate(DUMMY_LEASE_ZERO_DOWN_DATA);
      const offMsrp = leaseCalculator.getDiscountOffMsrpPercentage();
      expect(offMsrp).toEqual(OFF_MSRP);
    });

    it("the correct MSRP percentage (1% rule)", () => {
      leaseCalculator.calculate(DUMMY_LEASE_ZERO_DOWN_DATA);
      leaseCalculator.getMonthlyPayment();
      const msrpPercentage = leaseCalculator.getMonthlyPaymentToMsrpPercentage();
      expect(msrpPercentage).toEqual(MSRP_PERCENTAGE);
    });

    it("the correct pre-tax monthly payment", () => {
      leaseCalculator.calculate(DUMMY_LEASE_ZERO_DOWN_DATA);
      leaseCalculator.getMonthlyPayment();
      const paymentPreTax = leaseCalculator.getMonthlyPaymentPreTax();
      expect(paymentPreTax).toEqual(PAYMENT_ZERO_DOWN_PRE_TAX);
    });

    it("the correct RV value from relative RV", () => {
      leaseCalculator.calculate(DUMMY_LEASE_PERCENT_RV_DATA);
      leaseCalculator.getMonthlyPayment();
      const rv = leaseCalculator.getRVValue();
      expect(rv).toEqual(RV_VALUE);
    });

    it("the correct monthly payment w/ relative RV", () => {
      leaseCalculator.calculate(DUMMY_LEASE_PERCENT_RV_DATA);
      const payment = leaseCalculator.getMonthlyPayment();
      expect(payment).toEqual(PAYMENT_ZERO_DOWN);
    });

    it("the correct APR", () => {
      leaseCalculator.calculate(DUMMY_LEASE_PERCENT_RV_DATA);
      const apr = leaseCalculator.getAPR();
      expect(apr).toEqual(APR);
    });

    it("the correct total lease cost w/ zero down", () => {
      leaseCalculator.calculate(DUMMY_LEASE_ZERO_DOWN_DATA);
      const totalCost = leaseCalculator.getTotalLeaseCost();
      expect(totalCost).toEqual(TOTAL_LEASE_COST_ZERO_DOWN);
    });

    it("the correct total lease cost w/ a down payment", () => {
      leaseCalculator.calculate(DUMMY_LEASE_WITH_DOWN_DATA);
      const totalCost = leaseCalculator.getTotalLeaseCost();
      expect(totalCost).toEqual(TOTAL_LEASE_COST_WITH_DOWN);
    });
  });
});
