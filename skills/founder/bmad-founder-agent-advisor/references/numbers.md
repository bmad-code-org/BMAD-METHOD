# Numbers

The outcome is a figure the founder can put in front of an investor, a funder or themselves and defend line by line: runway, a scenario, unit economics, a market size, a cap table after a round, or a monthly model. A wrong runway or dilution figure fails quietly and costs real money, so every number comes from the script, never from estimating it in your head. A figure no subcommand computes, such as a yearly cost or the customers needed to cover a salary, is shown with its working from figures already stated: `600 × 12 = 7,200`.

## What you cannot infer

- The script is `uv run {skill-root}/scripts/founder_numbers.py <subcommand> ...`; `--help` on it or a subcommand gives the flags. Subcommands:
  - `runway`: months of cash left, the month it runs out, and whether current growth reaches breakeven first (default alive). `--costs` is gross monthly costs, the record's net burn plus revenue. `--scenario` compares flat changes, such as a hire's cost or a new raise.
  - `personal-runway`: for quitting a job: how long savings last, keeping a buffer.
  - `unit-economics`: lifetime value, LTV to acquisition cost, payback months.
  - `market-size`: bottom up, from accounts times price, narrowed to what the founder can reach and win.
  - `round`: the cap table after a priced round, with post-money SAFEs converting and the option pool topped up before the round. It reads a JSON cap table, kept at `{record_folder}/numbers/cap-table.json` and holding only what is true now. Pass each offer's terms as `--pre-money`, `--new-money` and `--pool-target`, one command per offer, and a SAFE on offer as `--safe 'name:amount:cap:discount'`.
  - `safes`: what SAFEs cost in ownership before any priced round, each post-money SAFE at its cap, from the same cap table and `--safe` flags. Use it for a SAFE offer, when no priced round is on the table.
  - `model`: a monthly model with hires and one-off costs from a given month, and the month cash runs out, written as CSV to `{record_folder}/numbers/YYYY-MM-DD-model.csv`. To compare timings, such as hiring now against in three months, run it once per case with the case name in the file name.
- `runway`, `personal-runway` and `model` take `--start` as the current month (YYYY-MM); without it `runway` and `personal-runway` name no month.
- Take inputs from `{record_folder}/company.md` first and ask only for what is missing. Say which figures were the founder's and which you assumed, and repeat the script's `assumptions` in plain words.
- Write each settled result back to the record: runway and the zero-cash month to Runway, unit economics to Metrics with today's date.
- A top-down market size (one percent of a large number) is not evidence; the bottom-up count is.

## Hand back

The answer in one line, the two or three inputs it is most sensitive to, and what it means for the decision in front of them.
