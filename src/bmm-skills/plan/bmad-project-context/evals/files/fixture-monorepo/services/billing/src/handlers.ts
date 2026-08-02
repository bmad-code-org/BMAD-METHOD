// Billing handlers must be idempotent: the queue redelivers on any 5xx, and staging
// replays the full day's events nightly. Amounts are integer cents (amountCents).
export async function chargeHandler(): Promise<void> {}
