// State Management & LocalStorage Keys
const STORAGE_KEY = "scorecard_categories_v1";
const THEME_KEY = "scorecard_theme_v1";

let categories = loadCategories();

// DOM Elements
const scorecardGrid = document.getElementById("scorecardGrid");
const emptyState = document.getElementById("emptyState");
const addCategoryForm = document.getElementById("addCategoryForm");
const categoryNameInput = document.getElementById("categoryNameInput");
const categoryColorInput = document.getElementById("categoryColorInput");
const resetAllBtn = document.getElementById("resetAllBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

// Initialize App
initTheme();
renderScorecards();

// Load default or saved categories
function loadCategories() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [
    { id: crypto.randomUUID(), name: "Player 1", score: 0, color: "#3b82f6" },
    { id: crypto.randomUUID(), name: "Player 2", score: 0, color: "#10b981" }
  ];
}

function saveCategories() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

// Render all scorecards
function renderScorecards() {
  scorecardGrid.innerHTML = "";

  if (categories.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  categories.forEach((item) => {
    const card = document.createElement("article");
    card.className = "score-card";
    card.style.setProperty("--card-accent", item.color);
    card.dataset.id = item.id;

    card.innerHTML = `
      <div class="card-header">
        <span
          class="category-name"
          contenteditable="true"
          spellcheck="false"
          title="Click to edit name"
        >${escapeHTML(item.name)}</span>

        <div class="card-tools">
          <input
            type="color"
            class="card-color-input"
            value="${item.color}"
            title="Change card color"
            aria-label="Change color for ${escapeHTML(item.name)}"
          />
          <button
            type="button"
            class="icon-btn delete-btn"
            title="Delete category"
            aria-label="Delete ${escapeHTML(item.name)}"
          >✕</button>
        </div>
      </div>

      <div class="score-display-area">
        <span class="score-value">${item.score}</span>
        <span class="tap-hint">Tap card to +1</span>
      </div>

      <div class="card-footer">
        <button type="button" class="decrement-btn" aria-label="Decrease score by 1">-1</button>
        <button type="button" class="reset-btn" aria-label="Reset score to 0">Reset</button>
      </div>
    `;

    // 1. Tap anywhere on the card (excluding controls/editable name) to increment score
    card.addEventListener("click", (e) => {
      if (
        e.target.closest(".category-name") ||
        e.target.closest(".card-tools") ||
        e.target.closest(".card-footer")
      ) {
        return;
      }
      updateScore(item.id, 1, card);
    });

    // 2. Inline Name Editing
    const nameEl = card.querySelector(".category-name");
    nameEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        nameEl.blur();
      }
    });

    nameEl.addEventListener("blur", () => {
      const updatedName = nameEl.textContent.trim();
      if (updatedName) {
        item.name = updatedName;
        saveCategories();
      } else {
        nameEl.textContent = item.name; // Revert if left empty
      }
    });

    // 3. Change Color Live
    const colorInput = card.querySelector(".card-color-input");
    colorInput.addEventListener("input", (e) => {
      item.color = e.target.value;
      card.style.setProperty("--card-accent", item.color);
      saveCategories();
    });

    // 4. Decrement (-1)
    card.querySelector(".decrement-btn").addEventListener("click", () => {
      updateScore(item.id, -1, card);
    });

    // 5. Reset Individual Score
    card.querySelector(".reset-btn").addEventListener("click", () => {
      item.score = 0;
      saveCategories();
      renderScorecards();
    });

    // 6. Delete Category
    card.querySelector(".delete-btn").addEventListener("click", () => {
      categories = categories.filter((c) => c.id !== item.id);
      saveCategories();
      renderScorecards();
    });

    scorecardGrid.appendChild(card);
  });
}

// Increment or Decrement Score with Pop Animation
function updateScore(id, delta, cardElement) {
  const category = categories.find((c) => c.id === id);
  if (!category) return;

  category.score += delta;
  saveCategories();

  const scoreValueEl = cardElement.querySelector(".score-value");
  scoreValueEl.textContent = category.score;

  // Trigger bump animation
  scoreValueEl.classList.remove("bump");
  void scoreValueEl.offsetWidth; // Force reflow
  scoreValueEl.classList.add("bump");
  setTimeout(() => scoreValueEl.classList.remove("bump"), 150);
}

// Add New Category
addCategoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = categoryNameInput.value.trim();
  const color = categoryColorInput.value;

  if (!name) return;

  categories.push({
    id: crypto.randomUUID(),
    name,
    score: 0,
    color
  });

  saveCategories();
  renderScorecards();
  categoryNameInput.value = "";
  categoryNameInput.focus();
});

// Reset All Scores
resetAllBtn.addEventListener("click", () => {
  if (categories.length === 0) return;
  categories.forEach((item) => {
    item.score = 0;
  });
  saveCategories();
  renderScorecards();
});

// Dark Mode Toggle Logic
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  if (theme === "dark") {
    themeIcon.textContent = "☀️";
    themeText.textContent = "Light Mode";
  } else {
    themeIcon.textContent = "🌙";
    themeText.textContent = "Dark Mode";
  }
}

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

// Prevent XSS when rendering user-entered names
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}