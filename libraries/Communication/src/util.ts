export function isUint8(n: number): boolean {
  return Number.isInteger(n) && n >= 0 && n <= 0xFF;
}