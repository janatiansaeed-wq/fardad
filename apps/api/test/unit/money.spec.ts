import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  addRial,
  MAX_MONEY_AMOUNT_RIAL,
  MoneyValidationError,
  multiplyRial,
  parseRialAmount,
  toMoney,
  tomanToRial,
} from "../../src/commerce/money";

describe("exact IRR money", () => {
  test("parses and maps canonical integer rials without number conversion", () => {
    assert.equal(parseRialAmount("0"), 0n);
    assert.equal(parseRialAmount("9000000000000000000"), MAX_MONEY_AMOUNT_RIAL);
    assert.deepEqual(toMoney(12_345_678_901_234_567n), {
      amount: "12345678901234567",
      currency: "IRR",
    });
  });

  test("rejects non-canonical, localized, signed, fractional, and excessive input", () => {
    for (const value of [
      "",
      "00",
      "01",
      "+1",
      "-1",
      "1.0",
      "1e3",
      "1,000",
      " 1",
      "۱",
      "9000000000000000001",
    ]) {
      assert.throws(() => parseRialAmount(value), MoneyValidationError);
    }
  });

  test("converts Toman by exactly ten and rejects conversion overflow", () => {
    assert.equal(tomanToRial("123"), 1_230n);
    assert.throws(() => tomanToRial("900000000000000001"), MoneyValidationError);
  });

  test("detects multiplication and addition overflow", () => {
    assert.equal(multiplyRial(125n, 4), 500n);
    assert.equal(addRial(400n, 600n), 1_000n);
    assert.throws(() => multiplyRial(MAX_MONEY_AMOUNT_RIAL, 2), MoneyValidationError);
    assert.throws(() => addRial(MAX_MONEY_AMOUNT_RIAL, 1n), MoneyValidationError);
  });
});
