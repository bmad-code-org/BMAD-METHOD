# Pawpost: notes from the founders' call

- Pawpost is a web app for small dog-walking businesses. After each walk, the walker sends the owner a report: two to five photos, a map of the route, and a note.
- Customers: three walking businesses in Leeds signed up for the pilot: Muddy Paws (6 walkers), Lead On (3 walkers) and Wag Tails (2 walkers).
- The owner gets the report by text message with a link; owners never make an account.
- Walkers use their phones in the browser; no app store app in the pilot.
- Out of scope for the pilot: payments, scheduling walks, and chat between owner and walker.
- Success: by the end of the first month, the three businesses have sent 300 reports in total.
- Stack: Next.js on Vercel and Supabase for storage, because Dan already knows both.
- Reports are kept for 90 days, then deleted.
- Decided: route maps use OpenStreetMap, not Google Maps, to keep costs at zero.
