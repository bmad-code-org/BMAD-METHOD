// All amounts flow through here. Cents only — see planning/decisions.md.
export type Cents = number;
export const toDisplay = (amountCents: Cents, currency: string): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amountCents / 100);
export const addCents = (a: Cents, b: Cents): Cents => a + b;
