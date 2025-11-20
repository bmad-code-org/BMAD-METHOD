# Career Coach - Professional Career Development Suite

A comprehensive career development module for BMad Method providing AI-powered tools for resume building, career planning, interview preparation, and professional development.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Agents](#agents)
- [Workflows](#workflows)
- [Quick Start](#quick-start)
- [Use Cases](#use-cases)
- [Module Structure](#module-structure)

## Overview

The Career Coach module transforms your career journey with three specialized AI agents working together to help you:

- Create ATS-optimized resumes and professional documents
- Develop strategic career plans aligned with your goals
- Prepare comprehensively for interviews with personalized coaching
- Build your professional brand and networking strategy
- Navigate career transitions with confidence

## Features

### Core Capabilities

- **Resume & Document Creation**: Professional, ATS-optimized resumes, cover letters, CVs, and LinkedIn profiles
- **Career Strategy**: Comprehensive career planning, goal setting, and path mapping
- **Interview Preparation**: Mock interviews, behavioral response development, and technical prep
- **Skills Assessment**: Gap analysis and personalized development planning
- **Personal Branding**: Professional brand development and networking strategies
- **Industry Alignment**: Industry-specific keywords, trends, and best practices

### Quality Assurance

- Resume quality scoring (target: 90-100%)
- ATS compatibility checking (target: 90%+ compatibility)
- Interview readiness assessments
- Achievement quantification framework
- Professional standards compliance

## Agents

### 🎯 Career Coach (Michael)

Strategic career advisor helping you navigate your professional journey.

**Specializations:**
- Career goal analysis and planning
- Skills assessment and gap analysis
- Job search strategy development
- Networking and personal branding
- Career transition guidance

**Key Commands:**
- `*help` - Display available commands
- `*plan` - Start career planning workflow
- `*assess` - Conduct skills assessment
- `*strategy` - Develop job search strategy
- `*brand` - Build personal brand
- `*elicit` - Guided career discovery

### ✍️ Resume Writer (Will)

Professional resume writer and career document specialist.

**Specializations:**
- ATS-optimized resume creation
- Cover letter writing
- LinkedIn profile optimization
- Achievement-focused content
- Industry-specific customization

**Key Commands:**
- `*help` - Display available commands
- `*create` - Create new resume/document
- `*enhance` - Enhance existing resume
- `*analyze` - Analyze resume quality
- `*brainstorm` - Achievement brainstorming
- `*elicit` - Guided information gathering

### 🎤 Interview Coach (Jennifer)

Expert interview coach for comprehensive interview preparation.

**Specializations:**
- Behavioral interview preparation
- Technical interview coaching
- Mock interview sessions
- STAR method response development
- Interview feedback and improvement

**Key Commands:**
- `*help` - Display available commands
- `*prepare` - Start interview prep workflow
- `*mock` - Conduct mock interview
- `*questions` - Generate practice questions
- `*behavioral` - Develop behavioral responses
- `*feedback` - Analyze interview performance

## Workflows

### 📝 Resume Creation Workflow

Comprehensive resume development from assessment to final optimization.

**Phases:**
1. Career Assessment & Planning (Career Coach)
2. Information Gathering (Resume Writer)
3. Resume Creation (Resume Writer)
4. Quality Assurance Review
5. ATS Optimization
6. Final Review & Approval

**Deliverables:**
- ATS-optimized resume (multiple formats)
- Career assessment summary
- Skills inventory
- Achievement examples library
- Keyword analysis

**Timeline:** 2-4 sessions (standard track)

### 🎯 Career Planning Workflow

Strategic career development and goal achievement planning.

**Phases:**
1. Assessment & Goal Setting
2. Skills Evaluation
3. Strategy Development
4. Action Planning
5. Risk Management
6. Implementation & Monitoring

**Deliverables:**
- Comprehensive career plan
- Skills gap analysis
- Job search strategy
- Networking plan
- Personal brand framework

**Timeline:** 3-5 sessions

### 🎤 Interview Preparation Workflow

Complete interview readiness from research to execution.

**Phases:**
1. Interview Context Analysis
2. Self-Assessment
3. Question Preparation
4. Technical Preparation (if applicable)
5. Mock Interview Practice
6. Logistics Planning
7. Interview Execution
8. Post-Interview Follow-up

**Deliverables:**
- Interview preparation plan
- Prepared behavioral responses (STAR method)
- Technical prep materials
- Company research summary
- Mock interview feedback
- Follow-up communication templates

**Timeline:** 4-6 sessions

## Quick Start

### Installation

The Career Coach module is installed as part of the BMad Method installation process:

```bash
npx bmad-method@alpha install
```

During installation, you'll be prompted to:
- Set your career output folder location
- Define your career focus and target industry
- Configure your experience level
- Enable ATS optimization features
- Select interview preparation types

### First Steps

1. **Load an agent** based on your immediate need:
   - Resume building: Load Resume Writer (Will)
   - Career planning: Load Career Coach (Michael)
   - Interview prep: Load Interview Coach (Jennifer)

2. **Start with a workflow** for guided assistance:
   ```
   *workflow resume-creation
   *workflow career-planning
   *workflow interview-preparation
   ```

3. **Use quick commands** for specific tasks:
   ```
   *create      # Create new document
   *analyze     # Analyze existing resume
   *prepare     # Start interview prep
   ```

## Use Cases

### 🔍 Active Job Search

**Scenario:** Actively seeking new opportunities

**Recommended Path:**
1. Start with Career Coach - `*strategy` to develop job search plan
2. Use Resume Writer - `*create` to build targeted resume
3. Use Interview Coach - `*prepare` for upcoming interviews

### 📈 Career Advancement

**Scenario:** Seeking promotion or advancement in current role

**Recommended Path:**
1. Career Coach - `*assess` for skills gap analysis
2. Career Coach - `*plan` to map advancement strategy
3. Resume Writer - `*enhance` to update accomplishments

### 🔄 Career Transition

**Scenario:** Changing industries or career paths

**Recommended Path:**
1. Career Coach - Complete career planning workflow
2. Resume Writer - Create transition-focused resume
3. Interview Coach - Prepare for transition-specific questions

### 🎯 Professional Development

**Scenario:** Continuous learning and networking

**Recommended Path:**
1. Career Coach - `*assess` for skill development priorities
2. Career Coach - `*brand` for networking strategy
3. Resume Writer - `*enhance` to reflect new skills

## Module Structure

```
career-coach/
├── agents/                          # 3 specialized agents
│   ├── career-coach.md             # Strategic career advisor
│   ├── interview-coach.md          # Interview preparation expert
│   └── resume-writer.md            # Document creation specialist
├── workflows/                       # 3 comprehensive workflows
│   ├── career-planning-workflow.md
│   ├── interview-preparation-workflow.md
│   └── resume-creation-workflow.md
├── tasks/                          # 19 reusable tasks
│   ├── advanced-elicitation.md
│   ├── analyze-resume.md
│   ├── career-brainstorming.md
│   ├── career-situation-analysis.md
│   ├── career-strategy-planning.md
│   ├── company-research.md
│   ├── conduct-mock-interview.md
│   ├── create-doc.md
│   ├── develop-behavioral-responses.md
│   ├── enhance-resume.md
│   ├── execute-checklist.md
│   ├── generate-interview-questions.md
│   ├── interview-feedback.md
│   ├── interview-preparation.md
│   ├── job-search-strategy.md
│   ├── networking-strategy.md
│   ├── personal-brand-development.md
│   ├── skills-assessment.md
│   └── technical-interview-prep.md
├── templates/                       # 17 professional templates
│   ├── behavioral-questions-tmpl.yaml
│   ├── career-plan-tmpl.yaml
│   ├── career-summary-tmpl.yaml
│   ├── career-transition-tmpl.yaml
│   ├── company-research-tmpl.yaml
│   ├── cover-letter-tmpl.yaml
│   ├── cv-tmpl.yaml
│   ├── interview-feedback-tmpl.yaml
│   ├── interview-prep-plan-tmpl.yaml
│   ├── job-search-plan-tmpl.yaml
│   ├── linkedin-profile-tmpl.yaml
│   ├── mock-interview-tmpl.yaml
│   ├── networking-plan-tmpl.yaml
│   ├── personal-brand-tmpl.yaml
│   ├── resume-tmpl.yaml
│   ├── skills-assessment-tmpl.yaml
│   └── technical-prep-tmpl.yaml
├── data/                           # 12 reference resources
│   ├── behavioral-question-examples.md
│   ├── career-achievement-examples.md
│   ├── career-development-resources.md
│   ├── common-interview-questions.md
│   ├── elicitation-methods.md
│   ├── industry-keywords.md
│   ├── industry-trends.md
│   ├── interview-best-practices.md
│   ├── networking-best-practices.md
│   ├── resume-best-practices.md
│   ├── skill-development-resources.md
│   └── technical-interview-resources.md
├── checklists/                     # 11 quality checklists
│   ├── ats-optimization-checklist.md
│   ├── behavioral-interview-checklist.md
│   ├── career-document-checklist.md
│   ├── career-planning-checklist.md
│   ├── interview-day-checklist.md
│   ├── interview-preparation-checklist.md
│   ├── job-search-checklist.md
│   ├── networking-checklist.md
│   ├── personal-brand-checklist.md
│   ├── resume-quality-checklist.md
│   └── technical-interview-checklist.md
├── agent-teams/                    # Agent team configurations
│   └── resume-builder-team.yaml
├── _module-installer/              # Installation configuration
│   └── install-config.yaml
├── config.yaml                     # Runtime configuration
└── README.md                       # This file
```

## Configuration

The module is configured through `config.yaml` (generated during installation):

```yaml
# User Configuration (set during install)
career_output_folder: output/career
career_focus: job-search
target_industry: technology
experience_level: mid-level
resume_optimization: yes
interview_prep_focus: [behavioral, technical]

# Static Configuration
module_version: 1.0.0
career_data_path: {bmad_folder}/career-coach/data
resumes_folder: {career_output_folder}/resumes
cover_letters_folder: {career_output_folder}/cover-letters
career_plans_folder: {career_output_folder}/career-plans
interview_prep_folder: {career_output_folder}/interview-prep
networking_folder: {career_output_folder}/networking
```

## Best Practices

### For Resume Building

1. **Start with brainstorming** - Use `*brainstorm` to gather achievements
2. **Quantify everything** - Focus on measurable results and impact
3. **Tailor to target** - Customize for specific roles and industries
4. **Optimize for ATS** - Ensure 90%+ compatibility with applicant tracking systems
5. **Get quality score 90+** - Aim for excellence in resume quality metrics

### For Career Planning

1. **Be honest in assessment** - Accurate self-evaluation leads to better planning
2. **Set SMART goals** - Specific, Measurable, Achievable, Relevant, Time-bound
3. **Identify skill gaps early** - Proactive skill development is key
4. **Build network consistently** - Networking is ongoing, not just when job hunting
5. **Review and adjust** - Regular check-ins keep plans relevant

### For Interview Preparation

1. **Research thoroughly** - Company, role, interviewers, industry
2. **Practice with STAR** - Structure behavioral responses using STAR method
3. **Do mock interviews** - Practice builds confidence and reveals gaps
4. **Prepare questions** - Have thoughtful questions for interviewers
5. **Follow up promptly** - Send thank you notes within 24 hours

## Integration

### With BMad Method

The Career Coach module integrates seamlessly with BMad Method:

- **BMad Master** - Can orchestrate career development alongside project work
- **Creative Intelligence** - Brainstorming sessions for career ideas
- **BMad Builder** - Customize agents for your specific industry

### With Other Modules

- **Content Creator** - Build thought leadership content
- **Marketing Ops** - Personal brand marketing strategies

## Support & Resources

### Getting Help

- **In-agent help**: Use `*help` command in any agent
- **Workflow guidance**: Each workflow includes step-by-step instructions
- **Quality checklists**: Use checklists for self-assessment
- **Data resources**: Reference materials in `/data` folder

### Community

- **Discord Community**: Share experiences and get feedback
- **GitHub Issues**: Report bugs or request features
- **BMad YouTube**: Video tutorials and demos

## Credits

Based on the [bmad-career-coach](https://github.com/ataripixel/bmad-career-coach) expansion pack, adapted for BMad Method v6 architecture.

## License

MIT License - See main BMAD-METHOD LICENSE for details.

---

<p align="center">
  <sub>Transform your career with AI-powered guidance</sub>
</p>
