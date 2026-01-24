# Magazine Report Generation Guide

This document provides guidance for generating the optional magazine-style HTML report.

## When to Generate

At the end of Step 08, ask the client:
> Would you like me to generate a beautiful magazine-style report of this session?

If YES, generate an HTML file using the structure below.

## Report Structure

The report should include:

1. **Cover Page** - Title, date, advisor panel
2. **Issue Overview Page** - Problem statement and context
3. **Key Insights Page** - 3-4 major insights from questioning rounds
4. **Advisor Recommendations** - One page per advisor (4 pages)
5. **Action Plan Page** - Client's commitments with deadlines
6. **Closing Page** - Thank you and session metadata

## Design Principles

- **Magazine Aesthetic**: Clean, professional, plenty of white space
- **Typography**: Serif for headings, sans-serif for body text
- **Color Coding**: Each advisor has a signature color
  - Buffett: Green (#059669)
  - Gates: Blue (#2563eb)
  - Musk: Red (#dc2626)
  - Jobs: Purple (#7c3aed)
- **Page Format**: 800px wide, printable
- **Breathing Room**: Generous margins and line-height

## Core HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Peers Advisory Session Report - [Date]</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  body { font-family: 'Inter', sans-serif; }
  h1, h2, h3, blockquote { font-family: 'Merriweather', serif; }
  .page {
    width: 800px;
    min-height: 1000px;
    margin: 0 auto 3rem;
    padding: 3rem;
    background: white;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    page-break-after: always;
  }
  @media print {
    .page { box-shadow: none; margin-bottom: 0; }
  }
  .advisor-buffett { border-color: #059669; color: #059669; }
  .advisor-gates { border-color: #2563eb; color: #2563eb; }
  .advisor-musk { border-color: #dc2626; color: #dc2626; }
  .advisor-jobs { border-color: #7c3aed; color: #7c3aed; }
</style>
</head>
<body class="bg-gray-50">

<!-- COVER PAGE -->
<div class="page">
  <div class="flex flex-col h-full">
    <header class="text-xs text-gray-400 mb-16">
      <div>PEERS ADVISORY GROUP</div>
      <div class="mt-1">[Date]</div>
    </header>

    <div class="flex-1 flex items-center">
      <h1 class="text-5xl font-bold leading-tight text-gray-800">
        [Client's Core Issue Title]
      </h1>
    </div>

    <footer class="mt-auto pt-8 border-t border-gray-200">
      <div class="text-xs text-gray-500 mb-3">ADVISOR PANEL</div>
      <div class="flex gap-6 text-sm">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-green-600"></div>
          <span>Warren Buffett</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-blue-600"></div>
          <span>Bill Gates</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-red-600"></div>
          <span>Elon Musk</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-purple-600"></div>
          <span>Steve Jobs</span>
        </div>
      </div>
    </footer>
  </div>
</div>

<!-- ISSUE OVERVIEW PAGE -->
<div class="page">
  <header class="mb-12">
    <div class="text-xs text-gray-400">CHAPTER 01</div>
    <h2 class="text-3xl font-bold mt-2 text-gray-800">Issue Overview</h2>
  </header>

  <blockquote class="border-l-4 border-gray-800 pl-6 my-8">
    <p class="text-2xl font-light italic text-gray-700">
      "[Most impactful client quote]"
    </p>
  </blockquote>

  <div class="prose prose-lg">
    <p class="text-gray-600 leading-relaxed">
      [Client's issue description in 2-3 paragraphs]
    </p>
  </div>

  <div class="mt-12 p-6 bg-gray-50 rounded-lg">
    <h3 class="text-lg font-semibold text-gray-700 mb-4">Expected Outcomes</h3>
    <ul class="space-y-2 text-gray-600">
      <li class="flex items-start gap-3">
        <span class="text-green-600">◆</span>
        <span>[Goal 1]</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-green-600">◆</span>
        <span>[Goal 2]</span>
      </li>
    </ul>
  </div>
</div>

<!-- ADVISOR RECOMMENDATION PAGE (Example: Buffett) -->
<div class="page">
  <header class="mb-8 pb-6 border-b-2 border-green-600">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
        💰
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Warren Buffett</h2>
        <p class="text-sm text-gray-500">Oracle of Omaha · Value Investing</p>
      </div>
    </div>
  </header>

  <blockquote class="border-l-4 border-green-600 pl-6 my-8 bg-green-50 py-4 rounded-r-lg">
    <p class="text-xl font-medium italic text-gray-700">
      "[Buffett's signature quote]"
    </p>
  </blockquote>

  <div class="my-8">
    <h3 class="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
      <span class="text-green-600">◎</span> Problem Reframing
    </h3>
    <p class="text-gray-600 leading-relaxed pl-6">
      [Buffett's problem reframing]
    </p>
  </div>

  <div class="my-8 p-6 bg-gray-50 rounded-lg">
    <h3 class="text-lg font-semibold text-gray-700 mb-3">📖 Story</h3>
    <p class="text-gray-600 leading-relaxed">
      [Buffett's relevant story]
    </p>
  </div>

  <div class="my-8">
    <h3 class="text-lg font-semibold text-gray-700 mb-4">◎ Recommendations</h3>
    <div class="space-y-4 pl-6">
      <div class="flex items-start gap-3">
        <span class="bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">1</span>
        <div>
          <p class="font-medium text-gray-800">[Recommendation 1 title]</p>
          <p class="text-sm text-gray-600 mt-1">[Explanation]</p>
        </div>
      </div>
      <!-- Repeat for recommendations 2-3 -->
    </div>
  </div>
</div>

<!-- ACTION PLAN PAGE -->
<div class="page">
  <header class="mb-12">
    <div class="text-xs text-gray-400">ACTION PLAN</div>
    <h2 class="text-3xl font-bold mt-2 text-gray-800">Your Commitments</h2>
  </header>

  <div class="mb-10">
    <h3 class="text-lg font-semibold text-gray-700 mb-4">✨ Key Takeaway</h3>
    <div class="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
      <p class="text-gray-700 leading-relaxed">[Client's biggest takeaway]</p>
    </div>
  </div>

  <div class="mb-10">
    <h3 class="text-lg font-semibold text-gray-700 mb-4">📋 Actions</h3>
    <div class="space-y-4">
      <div class="flex gap-4 p-4 bg-white rounded-lg border-2 border-gray-200">
        <div class="w-6 h-6 rounded border-2 border-gray-300"></div>
        <div class="flex-1">
          <p class="text-gray-800 font-medium">[Action 1]</p>
          <p class="text-sm text-gray-500">Deadline: [Date]</p>
        </div>
      </div>
      <!-- Repeat for actions 2-3 -->
    </div>
  </div>

  <div class="mt-auto pt-12 border-t border-gray-200">
    <div class="flex justify-between">
      <div>
        <p class="text-sm text-gray-500 mb-2">Client</p>
        <div class="text-xl font-serif text-gray-700">[Client Name]</div>
      </div>
      <div class="text-right">
        <p class="text-sm text-gray-500 mb-2">Date</p>
        <div class="text-gray-700">[Date]</div>
      </div>
    </div>
  </div>
</div>

<!-- CLOSING PAGE -->
<div class="page flex flex-col">
  <div class="flex-1 flex flex-col justify-center items-center text-center">
    <div class="text-6xl mb-8">🎯</div>
    <h2 class="text-3xl font-bold text-gray-800 mb-4">Session Complete</h2>
    <p class="text-xl text-gray-600 font-light max-w-md">
      May today's insights guide your path forward
    </p>

    <div class="mt-16 p-8 bg-gray-50 rounded-lg max-w-lg">
      <p class="text-gray-600 italic leading-relaxed">
        "The best investment is an investment in yourself. The best decision is one made after deep reflection."
      </p>
      <p class="text-sm text-gray-400 mt-4">— Peers Advisory Group</p>
    </div>
  </div>

  <footer class="text-center text-sm text-gray-400 pt-8 border-t border-gray-200">
    <p>PEERS ADVISORY GROUP</p>
    <p class="mt-1">[Date] · Session [ID]</p>
  </footer>
</div>

</body>
</html>
```

## Generation Instructions

To generate the report:

1. **Extract content** from session record markdown file
2. **Populate template** with actual session data:
   - Replace all [placeholder] text
   - Include actual quotes, recommendations, actions
   - Maintain formatting and structure
3. **Create one page per advisor** (4 total)
4. **Save as HTML** at `{session_output_folder}/report-{date}.html`
5. **Inform client** of file location

## File Naming

- Format: `report-YYYY-MM-DD.html`
- Example: `report-2025-01-23.html`
- Location: Same folder as session record

## Opening the Report

Client can open by:
- Double-clicking the HTML file (opens in browser)
- Right-click → Open With → Browser
- Print to PDF for permanent record

## Customization Options

For custom advisor panels:
- Use generic color scheme or generate custom colors
- Adjust icons/emojis to match advisors
- Keep same structure and format
