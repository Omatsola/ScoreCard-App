# Scorecard Web App

A responsive, framework-free web application for tracking scores across custom players or categories. Designed with a tap-to-increment interface, live color customization, inline name editing, and persistent storage.

---

## Languages & Technologies Used

- *HTML5*: Semantic document structure (<header>, <main>, <section>, <article>), native color picker inputs (<input type="color">), and contenteditable elements for inline editing.
- *CSS3*: CSS Custom Properties (variables) for dynamic theme switching and card accent colors, CSS Grid & Flexbox for responsive layouts, and keyframe/transform transitions for tap feedback.
- *JavaScript (ES6+)*: Vanilla DOM manipulation, event delegation, crypto.randomUUID() for unique card IDs, and the Web Storage API (localStorage) for automatic data persistence.

---

## Core Features & Functions

### 1. User Interface & App Capabilities
- *Tap-to-Score*: Tapping anywhere on a category card increments its score by +1 with a spring pop animation.
- *Add Category / Player*: Create new scorecards with a custom name and accent color.
- *Inline Name Editing*: Click directly on any card title to rename it; press Enter or click outside the field to save.
- *Live Color Customization*: Change any card's accent border and score color on the fly using its built-in color swatch.
- *Score Adjustments: Decrement individual scores (-1), reset a single card to 0, or reset all cards at once via the header **Reset All* button.
- *Dark Mode Toggle*: Switch between Light and Dark themes with persistent theme state across page reloads.

### 2. JavaScript Function Reference (script.js)

| Function | Purpose |
| :--- | :--- |
| loadCategories() | Retrieves saved category objects (id, name, score, color) from localStorage, or initializes two default player cards on first load. |
| saveCategories() | Serializes the current categories array to JSON and stores it in localStorage. |
| renderScorecards() | Clears and dynamically builds the scorecard DOM grid, attaches event listeners for tapping, editing, color changes, and toggles the empty-state message when no cards exist. |
| updateScore(id, delta, cardElement) | Adjusts a category's score by delta (+1 or -1), saves state, and triggers the CSS .bump scale animation. |
| initTheme() | Checks localStorage for a saved theme preference (light or dark) on startup and applies it. |
| applyTheme(theme) | Sets the data-theme attribute on the root <html> element, saves the preference, and updates the toggle button's icon and label. |
| escapeHTML(str) | Sanitizes user-entered category names before rendering to prevent Cross-Site Scripting (XSS). |

---

## Project Structure

```text
scorecard-app/
├── index.html   # Semantic markup and layout structure
├── style.css    # Light/dark theme variables, responsive grid, and card animations
├── script.js    # State management, DOM rendering, and localStorage persistence
└── README.md    # Project documentation