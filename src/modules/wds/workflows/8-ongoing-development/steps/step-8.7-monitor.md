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

**From Design Delivery file:** `deliveries/DD-XXX-name.yaml`

```yaml
metrics:
  measurement_period: '2 weeks after release'
```

**Example timeline:**

- Release: 2024-12-13
- Measurement start: 2024-12-13
- Measurement end: 2024-12-27
- Report due: 2024-12-28

---

### 2. Track Key Metrics

**From Design Delivery file:**

```yaml
metrics:
  baseline:
    - metric: 'Feature X usage rate'
      current: '15%'
      target: '60%'

    - metric: 'Drop-off rate'
      current: '40%'
      target: '10%'
```

**Create tracking dashboard:**

```markdown
# Metrics Tracking: DD-XXX

**Release Date:** 2024-12-13
**Measurement Period:** 2024-12-13 to 2024-12-27

## Daily Tracking

| Date  | Feature X Usage | Drop-off Rate | Notes         |
| ----- | --------------- | ------------- | ------------- |
| 12/13 | 18%             | 38%           | Day 1         |
| 12/14 | 22%             | 35%           | Trending up   |
| 12/15 | 28%             | 30%           | Good progress |
| ...   | ...             | ...           | ...           |
| 12/27 | 58%             | 12%           | Final         |

## Trend Analysis

[Chart or description of trends]
```

---

### 3. Gather Qualitative Feedback

**Monitor multiple channels:**

#### User Feedback

- App store reviews
- In-app feedback
- Support tickets
- User interviews

#### Team Feedback

- Developer observations
- Support team insights
- Stakeholder reactions

**Example tracking:**

```markdown
# Qualitative Feedback: DD-XXX

## Positive Feedback (8 mentions)

- "Now I understand how to use Feature X!" (3)
- "The guide was really helpful" (2)
- "Love the new onboarding" (3)

## Negative Feedback (2 mentions)

- "Guide is too long" (1)
- "Can't skip the guide" (1)

## Neutral Feedback (3 mentions)

- "Didn't notice the change" (3)
```

---

## Analyze Results

### After Measurement Period

**Create:** `analytics/DD-XXX-impact-report.md`

```markdown
# Impact Report: DD-XXX [Name]

**Release Date:** 2024-12-13
**Measurement Period:** 2024-12-13 to 2024-12-27
**Report Date:** 2024-12-28

---

## Executive Summary

**Result:** [SUCCESS | PARTIAL SUCCESS | FAILURE]

[2-3 sentences summarizing the impact]

Example:
"Design Delivery DD-XXX successfully improved Feature X usage from
15% to 58%, nearly meeting the 60% target. Drop-off decreased
from 40% to 12%, exceeding the 10% target. User feedback is
overwhelmingly positive."

---

## Metrics Results

### Metric 1: Feature X Usage Rate

- **Baseline:** 15%
- **Target:** 60%
- **Actual:** 58%
- **Result:** 97% of target ✅ (PASS)
- **Trend:** Steady increase over 2 weeks

### Metric 2: Drop-off Rate

- **Baseline:** 40%
- **Target:** 10%
- **Actual:** 12%
- **Result:** Exceeded target ✅ (PASS)
- **Trend:** Sharp decrease in first week, stabilized

### Metric 3: Support Tickets

- **Baseline:** 12/month
- **Target:** 2/month
- **Actual:** 3/month
- **Result:** 75% reduction ✅ (PASS)

### Metric 4: User Satisfaction

- **Baseline:** 3.2/5
- **Target:** 4.5/5
- **Actual:** 4.3/5
- **Result:** 96% of target ✅ (PASS)

---

## Overall Assessment

**Success Criteria:**

- Feature X usage > 50% ✅
- Drop-off < 15% ✅
- Support tickets < 5/month ✅

**Result:** SUCCESS ✅

All success criteria met or exceeded.

---

## What Worked

1. **Inline onboarding was effective**
   - Users understood Feature X immediately
   - Completion rate increased significantly

2. **Step-by-step guide was helpful**
   - User feedback praised the guide
   - Reduced confusion

3. **Success celebration was motivating**
   - Users felt accomplished
   - Positive sentiment increased

---

## What Didn't Work

1. **Guide length**
   - Some users found it too long
   - Consider shortening in future iteration

2. **Skip option**
   - Some users wanted to skip
   - Consider adding "Skip" button

---

## Learnings

1. **Onboarding matters for complex features**
   - Even simple features benefit from guidance
   - First impression is critical

2. **Measurement validates hypotheses**
   - Our hypothesis was correct
   - Data-driven decisions work

3. **Small changes have big impact**
   - 3-day effort → 4x usage increase
   - Kaizen philosophy validated

---

## Recommendations

### Short-term (Next Sprint)

1. Add "Skip" button to guide
2. Shorten guide from 5 steps to 3 steps
3. A/B test guide length

### Long-term (Next Quarter)

1. Apply onboarding pattern to other features
2. Create reusable onboarding component
3. Measure onboarding impact across product

---

## Next Kaizen Cycle

**Based on this success, next improvement opportunity:**

[Identify next improvement based on learnings]

Example:
"Feature Y has similar low usage (20%). Apply same onboarding
pattern to Feature Y in next Kaizen cycle."

---

## Conclusion

Design Delivery DD-XXX successfully achieved its goals. The
improvement demonstrates the power of Kaizen - small, focused
changes that compound over time.

**Status:** ✅ SUCCESS - Ready for next cycle!
```

---

## Share Results

**Communicate impact to team:**

```
WDS Designer → Team

Subject: Impact Report: DD-XXX - SUCCESS ✅

Hi Team!

Impact report for DD-XXX is complete!

🎉 **Result:** SUCCESS

📊 **Key Results:**
- Feature X usage: 15% → 58% (4x increase!)
- Drop-off: 40% → 12% (70% reduction!)
- Support tickets: 12/month → 3/month (75% reduction!)
- User satisfaction: 3.2/5 → 4.3/5

💡 **Key Learning:**
Small, focused improvements (3 days effort) can have massive
impact (4x usage increase). Kaizen philosophy works!

📁 **Full Report:**
analytics/DD-XXX-impact-report.md

🔄 **Next Cycle:**
Apply same pattern to Feature Y (similar low usage issue).

Thanks for the great collaboration!

[Your name]
WDS Designer
```

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
    - 'Drop-off: 12% (target: 10%)'
    - 'Support tickets: 3/month (target: 2/month)'
  learnings:
    - 'Onboarding matters for complex features'
    - 'Small changes have big impact'
    - 'Measurement validates hypotheses'
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

**Be patient:**

- Give changes time to work
- Don't end measurement early
- Wait for trends to stabilize

**Be thorough:**

- Track all metrics
- Gather qualitative feedback
- Document learnings

**Be honest:**

- Report actual results
- Acknowledge what didn't work
- Learn from failures

### DON'T ❌

**Don't cherry-pick:**

- Report all metrics, not just good ones
- Be honest about failures
- Learn from everything

**Don't stop measuring:**

- Kaizen requires continuous measurement
- Always be monitoring
- Always be learning

**Don't skip sharing:**

- Team needs to know results
- Celebrate successes
- Learn from failures together

---

**Remember:** Measurement turns improvements into learnings. Learnings drive the next cycle!
