import { Pool } from "pg";
// Every query in this codebase must filter deleted_at IS NULL — rows are soft-deleted,
// never removed. A naive SELECT returns ghosts.
export class OrderRepo {
  constructor(private pool: Pool) {}
  async byId(id: string) {
    const r = await this.pool.query(
      "SELECT * FROM orders WHERE id = $1 AND deleted_at IS NULL", [id]);
    return r.rows[0];
  }
}
