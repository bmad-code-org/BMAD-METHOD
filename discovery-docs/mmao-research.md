Multi-Model Agent Orchestration Research
This document outlines a strategic approach for the BMAD Growth Marketing Expansion Pack's intelligent model routing. The goal is to optimize token usage and enhance agent performance by selecting the best model for a given task, based on a careful analysis of each provider's strengths and weaknesses.

1. Growth Intelligence Agent
This agent is responsible for high-level strategy, research, and analysis. Its tasks are often complex and involve large amounts of data, making models with large context windows and strong reasoning skills the best choice.

Task: Analyze a 50-page market research report to identify key trends and opportunities.

Recommended Model: Gemini 2.5 Pro

Rationale: This model's vast context window (up to 1M tokens) is uniquely suited for ingesting and processing large documents like PDFs without losing critical information. Its advanced reasoning ensures the output is a high-quality strategic analysis, not just a simple summary.

Task: Generate a concise executive summary of a competitor's quarterly earnings report.

Recommended Model: Claude Sonnet

Rationale: Sonnet provides a great balance of quality and speed. For a moderately complex summarization task, it delivers a high-quality, polished output much faster and more cost-effectively than Opus.

Task: Identify the top 10 questions customers ask about a product by analyzing a CSV file of customer support tickets.

Recommended Model: Gemini 2.5 Pro

Rationale: This task requires analyzing a structured dataset and identifying patterns. Gemini Pro's advanced reasoning and large context window are ideal for handling and making sense of a large, messy CSV file.

2. Product Experience Agent
This agent focuses on the user journey, product-led growth, and code-related tasks that enhance the user experience.

Task: Write boilerplate code for an A/B test implementation for a button in a new feature.

Recommended Model: Codex CLI with GPT-5 Mini

Rationale: This is a small, well-defined coding task. The most cost-effective and fastest model in the Codex family is the best choice here, as it can generate the required code snippet quickly without needing a deep understanding of the entire codebase.

Task: Debug a multi-file bug that is causing a user onboarding flow to fail.

Recommended Model: Claude Opus

Rationale: This is a mission-critical, complex task that requires precise debugging and a deep understanding of a codebase. Opus is the most capable model for this, as it is renowned for its ability to follow complex instructions and perform accurate, multi-file edits.

Task: Refactor a specific module in the codebase to improve performance.

Recommended Model: Codex CLI with GPT-5

Rationale: The full GPT-5 model is a top-tier coding model that provides high-quality, reliable code. It is an excellent choice for a focused task like refactoring where precision is key but a full-project analysis isn't needed.

3. Content & Community Agent
This agent handles tasks related to content creation and maintaining brand voice, often requiring a blend of creativity and consistency.

Task: Draft five social media post variations for a new blog article.

Recommended Model: Claude Haiku or Gemini 2.5 Flash-Lite

Rationale: This is a creative but low-complexity task. The fastest, most cost-effective models are perfect for this, allowing for quick, high-volume generation of content variations.

Task: Write a detailed blog post outline based on a brief, ensuring the output has a specific brand tone.

Recommended Model: Claude Sonnet

Rationale: Sonnet provides a good balance of creativity, intelligence, and speed. Its strong language capabilities make it an excellent choice for tasks that require a nuanced, well-structured output, such as content outlines.

Task: Analyze a screenshot of a draft social media ad and provide feedback on how to improve the design.

Recommended Model: Gemini 2.5 Pro

Rationale: This is a multimodal task that requires image analysis and nuanced feedback. Gemini Pro’s multimodal capabilities are best-in-class for this type of complex visual reasoning.

4. Performance Marketing Agent
This agent is focused on paid advertising, conversion rate optimization, and data-driven insights.

Task: Generate five different ad copy headlines for a Google Ads campaign based on a list of keywords.

Recommended Model: Codex CLI with GPT-5 Mini

Rationale: Ad copy generation is a high-volume, low-latency task. GPT-5 Mini's speed and low cost make it ideal for quickly generating many variations for A/B testing.

Task: Analyze a large CSV file of user data to identify a high-value customer segment.

Recommended Model: Gemini 2.5 Pro

Rationale: As with the Growth Intelligence agent, this task is data-intensive and requires advanced reasoning to find meaningful patterns. Gemini Pro's ability to handle large datasets and perform complex analysis is the best fit.

Task: Draft HTML and CSS for a simple landing page based on a design brief.

Recommended Model: Claude Sonnet or Codex CLI with GPT-5

Rationale: Both models are strong coders. Sonnet provides excellent output quality, while GPT-5 is a highly capable and precise coding model. The choice depends on whether you prefer Claude's more verbose, conversational output or GPT-5's direct, clean code.

5. Technology Integration Agent
This agent is focused on the technical backbone of the marketing stack, including API integrations and automation.

Task: Write a Python script to automate data transfer between two APIs.

Recommended Model: Claude Opus

Rationale: This task is complex and requires writing production-quality, reliable code. Opus is known for its precision and ability to deliver high-quality, bug-free code, which is critical for system integrations.

Task: Generate a plan for a new data pipeline based on a diagram.

Recommended Model: Claude Sonnet or Gemini 2.5 Pro

Rationale: Both models have strong vision and reasoning capabilities for analyzing a diagram. Sonnet is a great choice for balancing quality and cost, while Gemini Pro would provide the deepest analysis for the most complex scenarios.