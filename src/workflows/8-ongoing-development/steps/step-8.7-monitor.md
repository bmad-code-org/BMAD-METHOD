# Step 8.7: Monitor Impact

## Your Task

Monitor the impact of your Design Delivery (small scope) and measure if it achieved the expected results.

---

## Before You Start

**Ensure you have:**

- ✅ Completed step 8.6 (validation complete)
- ✅ Design Delivery deployed to production
- ✅ Success metrics defined

---

## The Kaizen Measurement Cycle

**改善 (Kaizen) requires measurement:**

```
Ship → Monitor → Learn → Improve → Ship...
         ↑
    You are here!
```

**Without measurement, you're just guessing!**

---

## Set Up Monitoring

### 1. Define Measurement Period

**From Design Delivery file:**

```yaml
metrics:
  measurement_period: '2 weeks after release'
```

### 2. Track Key Metrics

**See:** [substeps/monitoring-templates.md](substeps/monitoring-templates.md) for Metrics Tracking Dashboard

### 3. Gather Qualitative Feedback

**Monitor multiple channels:**

- User feedback (app reviews, in-app feedback, support tickets)
- Team feedback (developer observations, support insights)

**See:** [substeps/monitoring-templates.md](substeps/monitoring-templates.md) for Qualitative Feedback template

---

## Analyze Results

### After Measurement Period

**Create:** `analytics/DD-XXX-impact-report.md`

**See:** [substeps/monitoring-templates.md](substeps/monitoring-templates.md) for Impact Report template

Key sections:
- Executive summary (SUCCESS | PARTIAL | FAILURE)
- Metrics results (baseline → target → actual)
- What worked / what didn't
- Learnings
- Recommendations (short-term, long-term)
- Next Kaizen cycle opportunity

---

## Share Results

**Communicate impact to team:**

**See:** [substeps/monitoring-templates.md](substeps/monitoring-templates.md) for Team Results Communication template

---

## Update Design Delivery File

**Final update to `deliveries/DD-XXX-name.yaml`:**

```yaml
delivery:
  status: 'measured'
  measurement_complete: '2024-12-28T10:00:00Z'
  impact_report: 'analytics/DD-XXX-impact-report.md'
  result: 'success'
  metrics_achieved:
    - 'Feature X usage: 58% (target: 60%)'
  learnings:
    - 'Onboarding matters for complex features'
```

---

## Next Step

After monitoring and learning:

```
[C] Continue to step-8.8-iterate.md
```

---

## Success Metrics

✅ Measurement period complete
✅ All metrics tracked
✅ Qualitative feedback gathered
✅ Impact report created
✅ Results shared with team
✅ Learnings documented
✅ Next opportunity identified

---

## Failure Modes

❌ Not measuring impact
❌ Ending measurement too early
❌ Ignoring qualitative feedback
❌ Not documenting learnings
❌ Not sharing results
❌ Not identifying next opportunity

---

## Tips

### DO ✅

**Be patient:** Give changes time to work, don't end measurement early

**Be thorough:** Track all metrics, gather qualitative feedback, document learnings

**Be honest:** Report actual results, acknowledge what didn't work

### DON'T ❌

**Don't cherry-pick:** Report all metrics, not just good ones

**Don't stop measuring:** Kaizen requires continuous measurement

**Don't skip sharing:** Team needs to know results

---

**Remember:** Measurement turns improvements into learnings. Learnings drive the next cycle!
