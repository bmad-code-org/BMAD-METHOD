# Setting up the store

`{skill-root}/scripts/read_store.py` layers the project file `{project-root}/_bmad/custom/ticketing-store-config.toml` over the starter `{skill-root}/config/<store>-ticketing.toml`; the project file's keys win. No project file means the repo store.

Run this to connect, reconfigure, or switch a tracker.

{{ workflow.store_before }}

1. **Choose.** `uv run {skill-root}/scripts/read_store.py --starters` lists the shipped stores. The user may bring their own config file or url.
2. **Write the project file.** `[tickets]` with `store` and the starter's empty address fields, asked of the user. Copy nothing else from the starter; cut a whole-starter copy down to `store`, the address fields, and the team's changes. The user's own config goes in whole; a store with no starter is modelled on the nearest one. For the repo store, delete the project file.
3. **Connect.** Offer to run the store's `setup` verb. Tracker types or statuses that differ from the maps go under `[tickets.types]` or `[tickets.status]`. A state with no tracker status takes the previous state's status.
4. **Prove it.** Offer a test. With items, `query` a few back. Empty: create a ticket in `backlog/` titled "BMad setup test — safe to delete", query it back, move it to `in-progress`, assign it, then drop it. Give the user the `remote` url.

A house rule on a verb goes in `persistent_facts` in this skill's customization; set a whole verb under `[verbs]` in the project file only when the store's commands differ.

Then return to the user's task; when done, offer once a `bmad-customize` pass on this skill: its `customize.toml` holds the epic boundary rule, publication timing, own checks, templates, and before and after instructions.

{{ workflow.store_after }}
