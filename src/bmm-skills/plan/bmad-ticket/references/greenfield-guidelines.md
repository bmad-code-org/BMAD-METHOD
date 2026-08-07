# Greenfield Guidelines

Load when slicing a net-new project — nothing deployed, no CI. The failure this prevents: a ticket set full of feature work with nowhere to run it, so the first real story silently absorbs a week of infrastructure.

**Calibrate to the what, the who, and the purpose before proposing anything.** A production SaaS for paying users earns the full scaffolding below; an internal tool may never need a stage environment; a weekend prototype may need CI and nothing more. What Epic 1 contains is a conversation about this project's real destination, not a checklist.

**Epic 1 is the scaffolding epic.** It delivers the ability to ship, not features - examples based on design or spec include:

- Starter or template chosen and standing — the app skeleton runs locally.
- Accounts and access the stack needs: cloud/hosting, registry, DNS, monitoring — whatever this project actually requires, and nothing it doesn't.
- CI on every push from the first commit.
- A deploy pipeline that reaches the environments this project actually needs. When production is the destination, build stage and prod from day one — retrofitting prod later is a rewrite of the pipeline story. When it isn't, don't build rails to nowhere.
- Test infrastructure wired into CI: unit harness and an end-to-end lane that can exercise a deployed environment.

**The first story proves the walking skeleton end to end** — this is the invariant, however thin the rails: the thinnest possible path — a page, an endpoint, a health check with one real hop through the stack — built, tested, and deployed through whatever pipeline this project has. Its e2e acceptance criterion is the pipeline run itself. Every later story then lands on live rails.

Epic 1 is the only infrastructure-shaped epic. After it, epics deliver user value in vertical slices on the live skeleton; recurring enabler work becomes tasks inside the epics that need it, not new technical-layer epics.
