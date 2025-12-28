# Step 7: Page Variants

---

<ask>**Will you have page variants?**

For A/B testing, different audiences, or localization? (y/n)</ask>

<action>Store has_variants</action>

<check if="has_variants == 'y' or has_variants == 'yes'">
<ask>**How many variants?**

Number of variants:</ask>

<action>Store variant_count</action>
<template-output>has_variants, variant_count</template-output>
</check>

<check if="has_variants == 'n' or has_variants == 'no'">
<action>Store variant_count = 1</action>
<template-output>has_variants, variant_count</template-output>
</check>

---

<action>Load and execute: `step-02-substeps/page-init/step-08-create-page-structure.md`</action>


