import Decimal from "decimal.js";

export function toUserToken(n: Decimal.Value, decimals = 6) {
  return new Decimal(n).div(Math.pow(10, decimals));
}

export function toBaseToken(n: Decimal.Value, decimals = 6) {
  return new Decimal(n).mul(Math.pow(10, decimals));
}
export function addressShort(address: string | null) {
  if (!address) {
    return address;
  }

  return `${address.slice(0, 9)}...${address.slice(-4)}`;
}
