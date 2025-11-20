# Generate Interview Questions

**Task Type:** Interactive Workflow  
**Elicit:** true  
**Agent:** interview-coach  
**Dependencies:** behavioral-questions-tmpl.yaml, common-interview-questions.md

## Overview
Generate personalized interview questions and help you develop strong responses. This task creates targeted questions based on your background, target role, and interview type, then guides you through crafting compelling answers.

## Workflow Steps

### Step 1: Question Generation Context
**Objective:** Understand your background and target role for personalized questions

**Elicitation Questions:**
1. What is your target role and industry? (Open text)
2. What is your experience level? (1: Entry-level, 2: Mid-career, 3: Senior/Management, 4: Executive, 5: Career change)
3. What type of interview questions do you want to practice? (1: Behavioral questions, 2: Technical questions, 3: General questions, 4: Company-specific, 5: All types, 6: Surprise me)
4. What is your current role and background? (Open text)
5. What are your key skills and strengths? (Open text)

### Step 2: Question Category Selection
**Objective:** Choose specific question categories to focus on

**Elicitation Questions:**
1. Which question categories are most important for your target role? (1: Leadership and management, 2: Problem-solving, 3: Teamwork and collaboration, 4: Technical skills, 5: Communication, 6: All of the above)
2. What specific scenarios do you want to prepare for? (1: Conflict resolution, 2: Project management, 3: Innovation and creativity, 4: Customer service, 5: Change management, 6: All scenarios)
3. Do you want questions about your background and experience? (1: Yes - career history, 2: Yes - education and training, 3: Yes - achievements, 4: No - focus on scenarios, 5: All of the above)
4. Should I include challenging or difficult questions? (1: Yes - prepare for everything, 2: No - focus on basics, 3: Some - moderate challenge, 4: Not sure)
5. How many questions do you want to practice? (1: 5-10 questions, 2: 10-15 questions, 3: 15-20 questions, 4: Comprehensive set, 5: Not sure)

### Step 3: Personalized Question Generation
**Objective:** Generate targeted questions based on your profile

**Instructions:**
Based on your background and preferences, I will generate a personalized set of interview questions including:

- **Behavioral Questions:** Situational and experience-based questions
- **Technical Questions:** Role-specific technical assessments
- **General Questions:** Standard interview questions
- **Company-Specific Questions:** Questions about your interest and fit
- **Challenging Questions:** Difficult scenarios and edge cases

### Step 4: Question Practice and Response Development
**Objective:** Practice answering questions and develop strong responses

**Elicitation Questions:**
1. How do you prefer to practice these questions? (1: Answer each question fully, 2: Provide bullet points, 3: Discuss key points, 4: All of the above, 5: Need guidance)
2. Do you want feedback on your responses? (1: Yes - detailed feedback, 2: Yes - general feedback, 3: No - just practice, 4: Not sure)
3. Should I suggest improvements to your answers? (1: Yes - specific suggestions, 2: Yes - general tips, 3: No - just practice, 4: Not sure)
4. Do you want to practice the STAR method for behavioral questions? (1: Yes - teach me, 2: Yes - I know it, 3: No - other format, 4: Not sure what STAR is)
5. How much time do you want to spend on each question? (1: Quick practice, 2: Moderate detail, 3: Comprehensive answers, 4: Varies by question, 5: Not sure)

### Step 5: Response Enhancement and Coaching
**Objective:** Improve responses with specific feedback and suggestions

**Instructions:**
For each question you practice, I will provide:

- **Response Analysis:** Evaluation of your answer structure and content
- **STAR Method Guidance:** Help structure behavioral responses effectively
- **Improvement Suggestions:** Specific ways to enhance your answers
- **Alternative Approaches:** Different ways to frame your responses
- **Confidence Building:** Tips to deliver responses with confidence

### Step 6: Question Customization and Follow-ups
**Objective:** Develop follow-up questions and prepare for interviewer probing

**Elicitation Questions:**
1. What follow-up questions do you expect from your answers? (1: Clarification questions, 2: Deeper probing, 3: Alternative scenarios, 4: All of the above, 5: Not sure)
2. Do you want to practice handling difficult follow-ups? (1: Yes - prepare for everything, 2: No - focus on main questions, 3: Some - moderate preparation, 4: Not sure)
3. What questions make you most nervous? (1: Technical questions, 2: Behavioral questions, 3: Salary questions, 4: Weakness questions, 5: All questions, 6: None)
4. How do you handle questions you don't know the answer to? (1: Admit and redirect, 2: Try to answer anyway, 3: Ask for clarification, 4: Need strategies, 5: Not sure)
5. Do you want to practice your questions for the interviewer? (1: Yes - prepare questions, 2: No - focus on answering, 3: Some - basic questions, 4: Not sure)

### Step 7: Practice Plan and Resources
**Objective:** Create ongoing practice plan and provide resources

**Instructions:**
I will create a comprehensive practice plan including:

- **Question Bank:** Complete set of personalized questions
- **Response Templates:** Framework for structuring answers
- **Practice Schedule:** Recommended practice routine
- **Resource Recommendations:** Additional materials and tools
- **Confidence Building:** Strategies to improve interview confidence

**Output:** Complete question bank with practice plan and resources

## Success Criteria
- Personalized question set generated for target role
- Strong responses developed for key questions
- STAR method mastered for behavioral questions
- Confidence in handling various question types
- Practice plan established for ongoing improvement
- Resources and tools identified for continued practice

## Quality Checklist
- [ ] Questions are relevant to target role and industry
- [ ] Question difficulty matches experience level
- [ ] Behavioral questions follow STAR method
- [ ] Technical questions are role-appropriate
- [ ] Responses are specific and impactful
- [ ] Practice plan is realistic and actionable
- [ ] Resources are current and relevant
- [ ] User feels confident with question handling
