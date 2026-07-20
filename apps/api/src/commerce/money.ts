export const MAX_MONEY_AMOUNT_RIAL = 9_000_000_000_000_000_000n;

export type RialMoney = Readonly<{
  amount: string;
  currency: "IRR";
}>;

const canonicalIntegerPattern = /^(?:0|[1-9][0-9]*)$/;

export class MoneyValidationError extends Error {
  constructor() {
    super("Invalid money amount");
  }
}

export function parseRialAmount(value: string): bigint {
  if (!canonicalIntegerPattern.test(value)) {
    throw new MoneyValidationError();
  }

  const amount = BigInt(value);
  assertMoneyRange(amount);
  return amount;
}

export function tomanToRial(value: string): bigint {
  const toman = parseRialAmount(value);

  if (toman > MAX_MONEY_AMOUNT_RIAL / 10n) {
    throw new MoneyValidationError();
  }

  return toman * 10n;
}

export function toMoney(amount: bigint): RialMoney {
  assertMoneyRange(amount);
  return { amount: amount.toString(10), currency: "IRR" };
}

export function multiplyRial(unitAmount: bigint, quantity: number): bigint {
  assertMoneyRange(unitAmount);

  if (!Number.isSafeInteger(quantity) || quantity < 0) {
    throw new MoneyValidationError();
  }

  const multiplier = BigInt(quantity);

  if (multiplier !== 0n && unitAmount > MAX_MONEY_AMOUNT_RIAL / multiplier) {
    throw new MoneyValidationError();
  }

  return unitAmount * multiplier;
}

export function addRial(left: bigint, right: bigint): bigint {
  assertMoneyRange(left);
  assertMoneyRange(right);

  if (left > MAX_MONEY_AMOUNT_RIAL - right) {
    throw new MoneyValidationError();
  }

  return left + right;
}

export function assertPositiveRial(amount: bigint | null): asserts amount is bigint {
  if (amount === null || amount <= 0n || amount > MAX_MONEY_AMOUNT_RIAL) {
    throw new MoneyValidationError();
  }
}

function assertMoneyRange(amount: bigint): void {
  if (amount < 0n || amount > MAX_MONEY_AMOUNT_RIAL) {
    throw new MoneyValidationError();
  }
}
