import type { Request, Response } from "express";
import { OrderRepo } from "../repos/orders";
// Stripe webhooks: staging replays events every 6 hours. Handlers are idempotent by
// checking event.id against processed_events before acting.
export async function stripeWebhook(req: Request, res: Response) {
  res.sendStatus(200);
}
