import LeaseCalculator from "../src/LeaseCalculator";
import {
  // Tax applied on monthly payment
  DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT,
  DUMMY_LEASE_WITH_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT,
  WHEN_TAX_ON_MONTHLY_PAYMENT,
  // Tax applied on sales price
  DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_SALES_PRICE,
  DUMMY_LEASE_WITH_DOWN_WITH_TAX_ON_SALES_PRICE,
  WHEN_TAX_ON_SALES_PRICE,
  // Tax applied on total lease payment
  DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_LEASE_PAYMENT,
  DUMMY_LEASE_WITH_DOWN_WITH_TAX_ON_LEASE_PAYMENT,
  WHEN_TAX_ON_LEASE_PAYMENT,
  // RV
  DUMMY_LEASE_WITH_PERCENTAGE_RV,
  RV_VALUE,
  RV_PERCENTAGE,
  ACQUISITION_FEE_TOYOTA,
  DISPOSITION_FEE_TOYOTA,
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
          ...DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT,
          msrp: null,
        });
      }).toThrow(Error);
    });
    it("should throw an error when MSRP field is missing", () => {
      expect(() => {
        leaseCalculator.calculate({
          ...DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT,
          msrp: null,
        });
      }).toThrowError(`Invalid Input: MSRP`);
    });
    it("should throw an error when Selling Price field is missing", () => {
      expect(() => {
        leaseCalculator.calculate({
          ...DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT,
          sellingPrice: null,
        });
      }).toThrowError(`Invalid Input: Selling Price`);
    });
    it("should throw an error when RV field is missing", () => {
      expect(() => {
        leaseCalculator.calculate({
          ...DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT,
          rv: null,
        });
      }).toThrowError(`Invalid Input: Residual Value`);
    });
    it("should throw an error when MF field is missing", () => {
      expect(() => {
        leaseCalculator.calculate({
          ...DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT,
          mf: null,
        });
      }).toThrowError(`Invalid Input: Money Factor`);
    });
  });

  describe("Acquisition fee", () => {
    it("is 0 when Make is not specified", () => {
      leaseCalculator.calculate({
        ...DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT,
        make: "",
      });
      const acquisitionFee = leaseCalculator.getAcquisitionFee();
      expect(acquisitionFee).toEqual(0);
    });
    it("is based on Make, when specified", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT
      );
      const acquisitionFee = leaseCalculator.getAcquisitionFee();
      expect(acquisitionFee).toEqual(ACQUISITION_FEE_TOYOTA);
    });
  });

  describe("Disposition fee", () => {
    it("is 0 when Make is not specified", () => {
      leaseCalculator.calculate({
        ...DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT,
        make: "",
      });
      const acquisitionFee = leaseCalculator.getDispositionFee();
      expect(acquisitionFee).toEqual(0);
    });
    it("is based on Make, when specified", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT
      );
      const acquisitionFee = leaseCalculator.getDispositionFee();
      expect(acquisitionFee).toEqual(DISPOSITION_FEE_TOYOTA);
    });
  });

  describe("RV", () => {
    it("is the correct percentage off MSRP", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT
      );
      const rv = leaseCalculator.getRVPercentage();
      expect(rv).toEqual(RV_PERCENTAGE);
    });
    it("is the correct absolute value when passed as percentage", () => {
      leaseCalculator.calculate(DUMMY_LEASE_WITH_PERCENTAGE_RV);
      const rv = leaseCalculator.getRVValue();
      expect(rv).toEqual(RV_VALUE);
    });
    it("gets correct monthly payment when passed as percentage", () => {
      leaseCalculator.calculate(DUMMY_LEASE_WITH_PERCENTAGE_RV);
      const payment = leaseCalculator.getMonthlyPayment();
      expect(payment).toEqual(WHEN_TAX_ON_MONTHLY_PAYMENT.PAYMENT_ZERO_DOWN);
    });
  });

  describe("Tax on monthly payment", () => {
    it("gets correct monthly payment w/ $0 down", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT
      );
      const payment = leaseCalculator.getMonthlyPayment();
      expect(payment).toEqual(WHEN_TAX_ON_MONTHLY_PAYMENT.PAYMENT_ZERO_DOWN);
    });
    it("gets correct monthly payment w/ a down payment", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_WITH_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT
      );
      const payment = leaseCalculator.getMonthlyPayment();
      expect(payment).toEqual(WHEN_TAX_ON_MONTHLY_PAYMENT.PAYMENT_WITH_DOWN);
    });
    it("gets correct discount off msrp", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT
      );
      const offMsrp = leaseCalculator.getDiscountOffMsrpPercentage();
      expect(offMsrp).toEqual(WHEN_TAX_ON_MONTHLY_PAYMENT.OFF_MSRP);
    });
    it("gets correct MSRP percentage (1% rule)", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT
      );
      const msrpPercentage = leaseCalculator.getMonthlyPaymentToMsrpPercentage();
      expect(msrpPercentage).toEqual(
        WHEN_TAX_ON_MONTHLY_PAYMENT.MSRP_PERCENTAGE
      );
    });
    it("gets correct pre-tax monthly payment", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT
      );
      const paymentPreTax = leaseCalculator.getMonthlyPaymentPreTax();
      expect(paymentPreTax).toEqual(
        WHEN_TAX_ON_MONTHLY_PAYMENT.PAYMENT_ZERO_DOWN_PRE_TAX
      );
    });
    it("gets correct APR", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT
      );
      const apr = leaseCalculator.getAPR();
      expect(apr).toEqual(WHEN_TAX_ON_MONTHLY_PAYMENT.APR);
    });
    it("gets correct total lease cost w/ $0 down", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT
      );
      const totalCost = leaseCalculator.getTotalLeaseCost();
      expect(totalCost).toEqual(
        WHEN_TAX_ON_MONTHLY_PAYMENT.TOTAL_LEASE_COST_ZERO_DOWN
      );
    });
    it("gets correct total lease cost w/ a down payment", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_WITH_DOWN_WITH_TAX_ON_MONTHLY_PAYMENT
      );
      const totalCost = leaseCalculator.getTotalLeaseCost();
      expect(totalCost).toEqual(
        WHEN_TAX_ON_MONTHLY_PAYMENT.TOTAL_LEASE_COST_WITH_DOWN
      );
    });
  });

  describe("Tax on sales price", () => {
    it("gets correct monthly payment w/ $0 down", () => {
      leaseCalculator.calculate(DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_SALES_PRICE);
      const payment = leaseCalculator.getMonthlyPayment();
      expect(payment).toEqual(WHEN_TAX_ON_SALES_PRICE.PAYMENT_ZERO_DOWN);
    });

    it("gets correct monthly payment w/ a down payment", () => {
      leaseCalculator.calculate(DUMMY_LEASE_WITH_DOWN_WITH_TAX_ON_SALES_PRICE);
      const payment = leaseCalculator.getMonthlyPayment();
      expect(payment).toEqual(WHEN_TAX_ON_SALES_PRICE.PAYMENT_WITH_DOWN);
    });

    it("gets correct MSRP percentage (1% rule)", () => {
      leaseCalculator.calculate(DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_SALES_PRICE);
      const msrpPercentage = leaseCalculator.getMonthlyPaymentToMsrpPercentage();
      expect(msrpPercentage).toEqual(WHEN_TAX_ON_SALES_PRICE.MSRP_PERCENTAGE);
    });

    it("gets correct total lease cost w/ $0 down", () => {
      leaseCalculator.calculate(DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_SALES_PRICE);
      const totalCost = leaseCalculator.getTotalLeaseCost();
      expect(totalCost).toEqual(
        WHEN_TAX_ON_SALES_PRICE.TOTAL_LEASE_COST_ZERO_DOWN
      );
    });

    it("gets correct total lease cost w/ a down payment", () => {
      leaseCalculator.calculate(DUMMY_LEASE_WITH_DOWN_WITH_TAX_ON_SALES_PRICE);
      const totalCost = leaseCalculator.getTotalLeaseCost();
      expect(totalCost).toEqual(
        WHEN_TAX_ON_SALES_PRICE.TOTAL_LEASE_COST_WITH_DOWN
      );
    });
  });

  describe("Tax on total lease payment", () => {
    it("gets correct monthly payment w/ $0 down", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_LEASE_PAYMENT
      );
      const payment = leaseCalculator.getMonthlyPayment();
      expect(payment).toEqual(WHEN_TAX_ON_LEASE_PAYMENT.PAYMENT_ZERO_DOWN);
    });

    it("gets correct monthly payment w/ a down payment", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_WITH_DOWN_WITH_TAX_ON_LEASE_PAYMENT
      );
      const payment = leaseCalculator.getMonthlyPayment();
      expect(payment).toEqual(WHEN_TAX_ON_LEASE_PAYMENT.PAYMENT_WITH_DOWN);
    });

    it("gets correct MSRP percentage (1% rule)", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_LEASE_PAYMENT
      );
      const msrpPercentage = leaseCalculator.getMonthlyPaymentToMsrpPercentage();
      expect(msrpPercentage).toEqual(WHEN_TAX_ON_LEASE_PAYMENT.MSRP_PERCENTAGE);
    });

    it("gets correct total lease cost w/ $0 down", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_ZERO_DOWN_WITH_TAX_ON_LEASE_PAYMENT
      );
      const totalCost = leaseCalculator.getTotalLeaseCost();
      expect(totalCost).toEqual(
        WHEN_TAX_ON_LEASE_PAYMENT.TOTAL_LEASE_COST_ZERO_DOWN
      );
    });

    it("gets correct total lease cost w/ a down payment", () => {
      leaseCalculator.calculate(
        DUMMY_LEASE_WITH_DOWN_WITH_TAX_ON_LEASE_PAYMENT
      );
      const totalCost = leaseCalculator.getTotalLeaseCost();
      expect(totalCost).toEqual(
        WHEN_TAX_ON_LEASE_PAYMENT.TOTAL_LEASE_COST_WITH_DOWN
      );
    });
  });
});
