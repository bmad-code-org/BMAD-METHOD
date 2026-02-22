# Interactive Prototype Creation Guide

**For**: Freya WDS Designer Agent  
**Purpose**: Step-by-step guide to creating production-quality interactive prototypes  
**Based on**: Dog Week proven patterns

---

## 🎯 When to Create Interactive Prototypes

Create interactive prototypes when:

✅ **Complex interactions** - Multi-step forms, drag-and-drop, animations  
✅ **User testing needed** - Need real usability feedback  
✅ **Developer handoff** - Developers need working reference  
✅ **Stakeholder demo** - Need to show actual functionality  
✅ **Custom components** - Non-standard UI patterns (Swedish calendar, etc.)

**Skip prototypes when**:
❌ Simple static pages  
❌ Standard CRUD forms (specs are enough)  
❌ Time-constrained projects (use Figma/Excalidraw instead)

---

## 📁 Step 1: Set Up File Structure

### Create Folder Structure

```
docs/C-UX-Scenarios/[Scenario-Name]/[Page-Number]-[Page-Name]/
├── [Page-Number]-[Page-Name].md          ← Specification
├── Sketches/
│   └── [sketch-files].jpg
└── Frontend/                              ← PROTOTYPE FOLDER
    ├── [Page-Number]-[Page-Name]-Preview.html
    ├── [Page-Number]-[Page-Name]-Preview.css
    ├── [Page-Number]-[Page-Name]-Preview.js
    └── prototype-api.js                   ← Copy from existing
```

### Example (Add Dog page):

```
docs/C-UX-Scenarios/01-Customer-Onboarding/1.6-Add-Dog/
├── 1.6-Add-Dog.md
├── Sketches/
│   └── add-dog-sketch.jpg
└── Frontend/
    ├── 1.6-Add-Dog-Preview.html
    ├── 1.6-Add-Dog-Preview.css
    ├── 1.6-Add-Dog-Preview.js
    └── prototype-api.js
```

---

## 🌍 Multi-Language Support

### Hardcoded Translations (Recommended for Prototypes)

**Best practice**: Use hardcoded translations directly in HTML/JS for readability.

**Why?**
- ✅ Code is immediately readable
- ✅ No separate translation files to manage
- ✅ Easy to see what user sees
- ✅ Simple language switcher if needed
- ✅ Faster prototyping
- ✅ No secrets in translations anyway

### Simple Language Switcher

```javascript
// Define translations inline
const strings = {
  sv: { 
    bookWalk: 'Boka promenad', 
    cancel: 'Avbryt',
    save: 'Spara',
    delete: 'Ta bort'
  },
  en: { 
    bookWalk: 'Book walk', 
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete'
  }
};

let currentLang = 'sv'; // or get from localStorage

// Update UI text
function updateLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = strings[lang][key];
  });
  localStorage.setItem('language', lang);
}

// Language toggle
document.getElementById('lang-toggle').addEventListener('click', () => {
  const newLang = currentLang === 'sv' ? 'en' : 'sv';
  updateLanguage(newLang);
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('language') || 'sv';
  updateLanguage(savedLang);
});
```

### HTML with Language Support

```html
<!-- Option 1: data-i18n attribute (dynamic) -->
<button data-i18n="bookWalk" data-object-id="calendar-book-btn">
  Boka promenad
</button>

<!-- Option 2: Hardcoded with comment (simple) -->
<button data-object-id="calendar-book-btn">
  Boka promenad <!-- Book walk -->
</button>

<!-- Language toggle -->
<button id="lang-toggle" class="language-toggle">
  🇸🇪 / 🇬🇧
</button>
```

### When to Include Language Switching

**Include if**:
- Project defines multiple languages in project brief
- Stakeholders need to see different languages
- User testing requires language options

**Skip if**:
- Single language project
- Prototype for internal team only
- Time-constrained

---

## 📝 Step 2: Create HTML Structure

### HTML Template

```html
<!DOCTYPE html>
<html lang="se">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>[Page Number] [Page Name] - [Project Name]</title>

    <!-- Google Fonts (if using Inter) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

    <!-- Page Styles -->
    <link rel="stylesheet" href="[Page-Number]-[Page-Name]-Preview.css" />
  </head>
  <body>
    <!-- Header -->
    <header class="page-header">
      <button id="[page]-header-back" data-object-id="[page]-header-back" onclick="handleBack()">← Back</button>

      <h1 id="[page]-header-title" data-object-id="[page]-header-title">[Page Title]</h1>

      <!-- Optional: Language selector, actions, etc. -->
    </header>

    <!-- Main Content -->
    <main class="page-content">
      <form id="mainForm" class="form" onsubmit="handleSubmit(event)">
        <!-- Form fields here -->

        <!-- Example Input Field -->
        <div class="input-container">
          <input
            type="text"
            id="[page]-input-[field]"
            data-object-id="[page]-input-[field]"
            name="[fieldName]"
            placeholder="[Placeholder text]"
            class="internal-input"
            required
          />
          <p class="text-sm text-red-600 hidden" id="[field]Error"></p>
        </div>

        <!-- Submit Button -->
        <button type="submit" id="[page]-button-submit" data-object-id="[page]-button-submit" class="submit-button">
          <span id="submitButtonText">[Button Text]</span>
          <svg id="submitButtonSpinner" class="hidden spinner">
            <!-- Spinner SVG -->
          </svg>
        </button>
      </form>
    </main>

    <!-- Optional: Modals -->
    <div id="modal" class="modal-overlay hidden">
      <!-- Modal content -->
    </div>

    <!-- Optional: Toast Notification -->
    <div id="toast" class="toast hidden">
      <span id="toastMessage"></span>
    </div>

    <!-- Scripts -->
    <script src="prototype-api.js"></script>
    <script src="[Page-Number]-[Page-Name]-Preview.js"></script>
  </body>
</html>
```

### Critical HTML Rules

1. **Always include Object IDs** on interactive elements
2. **Use semantic HTML** (header, main, nav, section)
3. **Include aria labels** for accessibility
4. **Mobile viewport meta tag** is mandatory
5. **Load prototype-api.js first**, then page-specific JS

---

## 🎨 Step 3: Write CSS Styles

### CSS Template

```css
/* ============================================================================
   [Page Number] [Page Name] - Prototype Styles
   Project: [Project Name]
   ============================================================================ */

/* Reset & Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--gray-900);
  background: var(--gray-50);
  -webkit-font-smoothing: antialiased;
}

/* CSS Variables (Design Tokens) */
:root {
  /* Colors */
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --success: #10b981;
  --error: #ef4444;

  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-900: #111827;

  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* ============================================================================
   Layout
   ============================================================================ */

.page-header {
  background: white;
  border-bottom: 1px solid var(--gray-200);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-content {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

/* ============================================================================
   Form Components
   ============================================================================ */

.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.internal-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: all 0.2s;
}

.internal-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.internal-input.error {
  border-color: var(--error);
}

/* ============================================================================
   Buttons
   ============================================================================ */

.submit-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px; /* Mobile touch target */
}

.submit-button:hover {
  background: var(--primary-hover);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ============================================================================
   Utility Classes
   ============================================================================ */

.hidden {
  display: none !important;
}

.text-red-600 {
  color: var(--error);
}

.text-sm {
  font-size: 0.875rem;
}

/* Spinner Animation */
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ============================================================================
   Modal
   ============================================================================ */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

/* ============================================================================
   Toast Notification
   ============================================================================ */

.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gray-900);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  z-index: 1001;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

/* ============================================================================
   Responsive Design
   ============================================================================ */

@media (min-width: 768px) {
  .page-content {
    padding: var(--spacing-xl);
  }
}
```

### CSS Best Practices

1. **Use CSS Variables** for colors, spacing, etc.
2. **Mobile-first** approach (base styles for mobile, media queries for larger)
3. **Organize by sections** with clear comments
4. **Follow naming conventions** (BEM or utility-based)
5. **Include animations** (subtle, performance-conscious)

---

## ⚙️ Step 4: Write JavaScript Logic

### JavaScript Template

```javascript
/**
 * [Page Number] [Page Name] - Interactive Prototype
 * Project: [Project Name]
 *
 * This prototype demonstrates [key functionality].
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let formData = {
  // Initialize form state
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('📄 [Page Name] prototype loaded');

  // Load saved data (if any)
  await loadSavedData();

  // Initialize form listeners
  initializeFormListeners();

  // Load language preference
  applyLanguage(DogWeekAPI.getLanguagePreference());
});

// ============================================================================
// DATA LOADING
// ============================================================================

async function loadSavedData() {
  try {
    const user = await DogWeekAPI.getUser();
    if (user) {
      console.log('👤 User loaded:', user.firstName);
      // Pre-fill form if needed
    }
  } catch (error) {
    console.error('❌ Error loading data:', error);
  }
}

// ============================================================================
// FORM HANDLING
// ============================================================================

function initializeFormListeners() {
  const form = document.getElementById('mainForm');

  // Real-time validation
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearError(input));
  });
}

async function handleSubmit(event) {
  event.preventDefault();

  // Validate all fields
  if (!validateForm()) {
    return;
  }

  // Show loading state
  setLoadingState(true);

  try {
    // Collect form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Call API (prototype or production)
    const result = await DogWeekAPI.[relevantMethod](data);

    console.log('✅ Success:', result);

    // Show success feedback
    showSuccessToast('[Success message]');

    // Navigate to next page (after delay)
    setTimeout(() => {
      navigateToNextPage();
    }, 1500);

  } catch (error) {
    console.error('❌ Error:', error);
    showErrorBanner(error.message);
  } finally {
    setLoadingState(false);
  }
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateForm() {
  let isValid = true;

  const fields = [
    { id: 'fieldName', validator: validateRequired, message: 'Field is required' },
    // Add more fields
  ];

  fields.forEach(field => {
    const input = document.getElementById(field.id);
    if (!field.validator(input.value)) {
      showFieldError(field.id, field.message);
      isValid = false;
    }
  });

  return isValid;
}

function validateField(input) {
  const value = input.value.trim();
  const fieldName = input.name;

  // Example validations
  if (input.required && !value) {
    showFieldError(fieldName, 'This field is required');
    return false;
  }

  if (input.type === 'email' && !isValidEmail(value)) {
    showFieldError(fieldName, 'Please enter a valid email');
    return false;
  }

  clearError(input);
  return true;
}

function validateRequired(value) {
  return value && value.trim().length > 0;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================================================
// UI FEEDBACK
// ============================================================================

function showFieldError(fieldName, message) {
  const errorElement = document.getElementById(`${fieldName}Error`);
  const inputElement = document.getElementById(fieldName);

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
  }

  if (inputElement) {
    inputElement.classList.add('error');
  }
}

function clearError(input) {
  const fieldName = input.name || input.id;
  const errorElement = document.getElementById(`${fieldName}Error`);

  if (errorElement) {
    errorElement.classList.add('hidden');
  }

  input.classList.remove('error');
}

function setLoadingState(isLoading) {
  const submitBtn = document.getElementById('[page]-button-submit');
  const submitText = document.getElementById('submitButtonText');
  const submitSpinner = document.getElementById('submitButtonSpinner');

  submitBtn.disabled = isLoading;

  if (isLoading) {
    submitText.classList.add('hidden');
    submitSpinner.classList.remove('hidden');
  } else {
    submitText.classList.remove('hidden');
    submitSpinner.classList.add('hidden');
  }
}

function showSuccessToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  toastMessage.textContent = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

function showErrorBanner(message) {
  const errorBanner = document.getElementById('networkError');
  const errorMessage = document.getElementById('networkErrorMessage');

  errorMessage.textContent = message;
  errorBanner.classList.remove('hidden');

  setTimeout(() => {
    errorBanner.classList.add('hidden');
  }, 5000);
}

// ============================================================================
// NAVIGATION
// ============================================================================

function handleBack() {
  console.log('🔙 Navigating back');
  window.history.back();
  // OR: window.location.href = '../[previous-page]/Frontend/[previous-page]-Preview.html';
}

function navigateToNextPage() {
  console.log('➡️ Navigating to next page');
  window.location.href = '../[next-page]/Frontend/[next-page]-Preview.html';
}

// ============================================================================
// MULTI-LANGUAGE SUPPORT (Optional)
// ============================================================================

const translations = {
  se: {
    pageTitle: '[Swedish Title]',
    submitButton: '[Swedish Submit]',
    // ... all UI text
  },
  en: {
    pageTitle: '[English Title]',
    submitButton: '[English Submit]',
    // ...
  }
};

function applyLanguage(lang) {
  const t = translations[lang];

  // Update all text elements
  Object.keys(t).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      element.textContent = t[key];
    }
  });

  // Save preference
  DogWeekAPI.setLanguagePreference(lang);
}
```

### JavaScript Best Practices

1. **Use async/await** for API calls
2. **Console.log key actions** (with emojis for visibility)
3. **Handle errors gracefully** (try/catch)
4. **Validate before submit**
5. **Show loading states**
6. **Always reset UI state** (finally blocks)

---

## 🔌 Step 5: Integrate with Prototype API

### Common API Patterns

#### 1. Get Current User

```javascript
const user = await DogWeekAPI.getUser();
if (user) {
  console.log('Logged in as:', user.firstName);
}
```

#### 2. Create/Update User Profile

```javascript
const userData = {
  firstName: 'Patrick',
  lastName: 'Parent',
  email: 'patrick@example.com',
  phoneNumber: '+46701234567',
};

const user = await DogWeekAPI.createUserProfile(userData);
```

#### 3. Create Family

```javascript
const familyData = {
  name: 'The Johnsons',
  description: 'Our lovely dog family',
  location: 'Stockholm, Sweden',
};

const family = await DogWeekAPI.createFamily(familyData);
```

#### 4. Add Dog

```javascript
const dogData = {
  name: 'Rufus',
  breed: 'Golden Retriever',
  gender: 'male',
  birthDate: '2020-05-15',
  color: 'Golden',
  picture: '[base64-image-data]',
};

const dog = await DogWeekAPI.addDog(dogData);
```

#### 5. Get Family Data

```javascript
const family = await DogWeekAPI.getActiveFamily();
const dogs = await DogWeekAPI.getFamilyDogs();
const members = await DogWeekAPI.getFamilyMembers();
```

---

## ✅ Step 6: Testing Checklist

### Before Considering Prototype "Done"

#### Functionality Testing

- [ ] All form fields work
- [ ] Validation shows errors correctly
- [ ] Submit button works
- [ ] Loading states display
- [ ] Success feedback shows
- [ ] Error handling works
- [ ] Navigation works (back, next)
- [ ] Data persists (reload page)

#### Mobile Testing

- [ ] Viewport is 375px wide (iPhone SE)
- [ ] All tap targets min 44x44px
- [ ] Text is readable (min 16px)
- [ ] No horizontal scroll
- [ ] Inputs don't cause zoom (iOS)
- [ ] Touch gestures work (if applicable)

#### Code Quality

- [ ] All Object IDs present
- [ ] Console logs helpful (not excessive)
- [ ] No console errors
- [ ] CSS organized with comments
- [ ] JS functions documented
- [ ] No hardcoded values (use variables)

#### Accessibility

- [ ] Keyboard navigation works
- [ ] Form labels present
- [ ] Error messages clear
- [ ] Focus states visible
- [ ] Color contrast sufficient

#### Documentation

- [ ] Comments explain complex logic
- [ ] TODOs noted for Supabase migration
- [ ] Known limitations documented
- [ ] README included (if needed)

---

## 📚 Common Patterns Library

### Pattern 1: Image Upload with Crop

**Use When**: User profile pictures, dog photos, etc.

**Files Needed**:

- `image-crop.js` (copy from existing prototype)
- Modal HTML in main file
- CSS for crop interface

**Implementation**:

```javascript
function handlePictureUpload() {
  document.getElementById('pictureInput').click();
}

document.getElementById('pictureInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      showCropModal(e.target.result);
    };
    reader.readAsDataURL(file);
  }
});
```

---

### Pattern 2: Searchable Dropdown (Combobox)

**Use When**: Large lists (breeds, countries, etc.)

**HTML**:

```html
<button type="button" onclick="toggleDropdown()">
  <span id="selectedValue">Select...</span>
</button>

<div id="dropdown" class="dropdown hidden">
  <input type="text" id="searchInput" oninput="filterOptions()" placeholder="Search..." />
  <div id="optionsList"></div>
</div>
```

**JavaScript**:

```javascript
function filterOptions() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allOptions.filter((opt) => opt.toLowerCase().includes(query));
  renderOptions(filtered);
}
```

---

### Pattern 3: Multi-Language Toggle

**Use When**: International products

**HTML**:

```html
<select id="languageSelector" onchange="switchLanguage(this.value)">
  <option value="se">SE</option>
  <option value="en">EN</option>
</select>
```

**JavaScript**:

```javascript
function switchLanguage(lang) {
  applyLanguage(lang);
  DogWeekAPI.setLanguagePreference(lang);
}
```

---

### Pattern 4: Loading State

**Use During**: API calls, navigation, heavy processing

**Implementation**:

```javascript
function setLoadingState(isLoading) {
  const btn = document.getElementById('submitButton');
  const text = btn.querySelector('.text');
  const spinner = btn.querySelector('.spinner');

  btn.disabled = isLoading;
  text.classList.toggle('hidden', isLoading);
  spinner.classList.toggle('hidden', !isLoading);
}

// Usage
try {
  setLoadingState(true);
  await DogWeekAPI.someOperation();
} finally {
  setLoadingState(false);
}
```

---

### Pattern 5: Toast Notification

**Use For**: Success messages, simple errors

**Implementation**:

```javascript
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, duration);
}

// Usage
showToast('Dog added successfully! ✓');
```

---

## 🚨 Common Pitfalls to Avoid

### 1. Forgetting Object IDs

❌ **Wrong**: `<button id="submitBtn">Submit</button>`  
✅ **Right**: `<button id="page-button-submit" data-object-id="page-button-submit">Submit</button>`

### 2. Not Handling Loading States

❌ **Wrong**: Submit button stays active during API call  
✅ **Right**: Disable button, show spinner, prevent double-submit

### 3. Hardcoded Values

❌ **Wrong**: `background-color: #2563eb;`  
✅ **Right**: `background-color: var(--primary);`

### 4. No Error Handling

❌ **Wrong**: `const result = await API.call();`  
✅ **Right**: `try { const result = await API.call(); } catch (error) { showError(error); }`

### 5. Desktop-Only Design

❌ **Wrong**: Hover states, small tap targets  
✅ **Right**: Touch-friendly, min 44px targets

### 6. Missing Validation Feedback

❌ **Wrong**: Form just doesn't submit  
✅ **Right**: Show specific error messages per field

### 7. No Console Logging

❌ **Wrong**: Silent operations  
✅ **Right**: `console.log('✅ Dog added:', dog.name);`

---

## 🎓 Learning Path

### For New Prototype Creators

**Week 1**: Study existing prototypes

- Read `PROTOTYPE-ANALYSIS.md`
- Open 1.2 Sign In, examine code
- Test in mobile viewport
- Check console logs

**Week 2**: Modify existing prototype

- Copy 1.3 Profile Setup
- Change field names
- Update validation rules
- Test thoroughly

**Week 3**: Create simple prototype from scratch

- Pick simple page (static content + form)
- Follow this guide step-by-step
- Get code review

**Week 4**: Create complex prototype

- Multi-step flow
- Custom components
- Advanced interactions

---

## 📖 Quick Reference

### Object ID Naming Convention

```
[page]-[section]-[action]

Examples:
- add-dog-input-name
- profile-avatar-upload
- calendar-week-next
- signin-button-google
```

### File Naming Convention

```
[Page-Number]-[Page-Name]-Preview.[ext]

Examples:
- 1.2-Sign-In-Preview.html
- 3.1-Dog-Calendar-Booking-Preview.css
- 1.6-Add-Dog-Preview.js
```

### Required Meta Tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### Minimum Touch Target Size

```
44px × 44px (Apple Human Interface Guidelines)
48px × 48px (Material Design)
```

---

## ✨ Final Tips

1. **Start simple** - Get basic version working first
2. **Test early** - Open in mobile viewport immediately
3. **Console log everything** - Makes debugging easier
4. **Copy working patterns** - Don't reinvent the wheel
5. **Ask for help** - Reference existing prototypes
6. **Document as you go** - Comments save time later
7. **Test on real devices** - Emulator != real thing

---

**Remember**: A good interactive prototype is:

- ✅ **Functional** - Actually works
- ✅ **Mobile-optimized** - Touch-friendly
- ✅ **Well-documented** - Code is clear
- ✅ **Developer-ready** - Easy to extract
- ✅ **User-testable** - Can get real feedback

**Now go create amazing prototypes!** 🚀
