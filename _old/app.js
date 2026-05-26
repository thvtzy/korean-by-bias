var STORAGE_KEY = "kbb.words.v1";
var STATS_KEY_LASTOPEN = "kbb.stats.lastOpenDate";
var STATS_KEY_STREAK = "kbb.stats.streak";
var WEEKLY_GOAL = 50;

var LANGUAGE_LABELS = {
  ko: "Korean",
  ja: "Japanese",
  zh: "Mandarin",
  other: "Other"
};

var form = document.getElementById("word-form");
var list = document.getElementById("word-list");
var emptyState = document.getElementById("empty-state");
var countEl = document.getElementById("count");
var statTotal = document.getElementById("stat-total");
var statWeek = document.getElementById("stat-week");
var statStreak = document.getElementById("stat-streak");
var progressFill = document.getElementById("progress-fill");
var progressText = document.getElementById("progress-text");

var words = loadWords();
render();
updateStats();

form.addEventListener("submit", function (event) {
  event.preventDefault();
  var data = new FormData(form);
  var newWord = {
    id: crypto.randomUUID(),
    word: data.get("word").trim(),
    meaning: data.get("meaning").trim(),
    example: data.get("example").trim(),
    source: data.get("source").trim(),
    language: data.get("language"),
    createdAt: new Date().toISOString()
  };
  words.unshift(newWord);
  saveWords();
  render();
  updateStats();
  form.reset();
  document.getElementById("word").focus();
  showToast("\u2705", "Word saved!");
});

function undoLastWord() {
  if (words.length === 0) return;
  var removed = words.shift();
  saveWords();
  render();
  updateStats();
  showToast("\u21A9", "Undo \u2014 word removed", function () {
    words.unshift(removed);
    saveWords();
    render();
    updateStats();
    showToast("\u2705", "Word restored!");
  });
}

list.addEventListener("click", function (event) {
  var button = event.target.closest('[data-action="delete"]');
  if (!button) return;
  var id = button.dataset.id;
  var idx = words.findIndex(function (w) { return w.id === id; });
  if (idx === -1) return;
  var deleted = words[idx];
  if (!confirm("Delete this word?")) return;
  words.splice(idx, 1);
  saveWords();
  render();
  updateStats();
  showToast("\uD83D\uDDD1", "Word deleted", function () {
    words.splice(idx, 0, deleted);
    saveWords();
    render();
    updateStats();
    showToast("\u2705", "Word restored!");
  });
});

function loadWords() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveWords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

function render() {
  countEl.textContent = words.length + " " + (words.length === 1 ? "word" : "words") + " saved";
  if (words.length === 0) {
    emptyState.hidden = false;
    list.hidden = true;
    list.innerHTML = "";
    return;
  }
  emptyState.hidden = true;
  list.hidden = false;
  list.innerHTML = words.map(renderWordCard).join("");
}

function renderWordCard(w) {
  var lang = LANGUAGE_LABELS[w.language] || "Other";
  var html = "<li class=\"word-card\">";
  html += "<div class=\"word-card__head\">";
  html += "<h2 class=\"word-card__word\">" + escapeHtml(w.word) + "</h2>";
  html += "<span class=\"word-card__lang\">" + lang + "</span>";
  html += "</div>";
  html += "<p class=\"word-card__meaning\">" + escapeHtml(w.meaning) + "</p>";
  if (w.example) html += "<p class=\"word-card__example\">\"" + escapeHtml(w.example) + "\"</p>";
  if (w.source) html += "<p class=\"word-card__source\">\u2014 " + escapeHtml(w.source) + "</p>";
  html += "<button class=\"word-card__delete\" data-action=\"delete\" data-id=\"" + w.id + "\" aria-label=\"Delete word\">\u00D7</button>";
  html += "</li>";
  return html;
}

function showToast(icon, message, onUndo) {
  var container = document.getElementById("toast-container");
  if (!container) return;
  var toast = document.createElement("div");
  toast.className = "toast";
  var iconEl = document.createElement("span");
  iconEl.className = "toast__icon";
  iconEl.textContent = icon;
  var msgEl = document.createElement("span");
  msgEl.textContent = message;
  toast.appendChild(iconEl);
  toast.appendChild(msgEl);
  if (onUndo) {
    var undoBtn = document.createElement("button");
    undoBtn.className = "toast__undo";
    undoBtn.textContent = "Undo";
    undoBtn.addEventListener("click", function () {
      dismiss(toast);
      onUndo();
    });
    toast.appendChild(undoBtn);
  }
  container.appendChild(toast);
  setTimeout(function () { dismiss(toast); }, 4000);
}

function dismiss(toast) {
  toast.classList.add("toast--out");
  setTimeout(function () { toast.remove(); }, 200);
}

function updateStats() {
  var total = words.length;
  if (statTotal) statTotal.textContent = total;
  var now = new Date();
  var weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  var thisWeek = words.filter(function (w) { return new Date(w.createdAt) >= weekAgo; }).length;
  if (statWeek) statWeek.textContent = thisWeek;
  updateStreak();
  var pct = Math.min(100, Math.round((total / WEEKLY_GOAL) * 100));
  if (progressFill) progressFill.style.width = pct + "%";
  if (progressText) progressText.textContent = "Goal: " + total + "/" + WEEKLY_GOAL + " words";
}

function updateStreak() {
  if (!statStreak) return;
  var today = new Date().toISOString().split("T")[0];
  var lastOpen = localStorage.getItem(STATS_KEY_LASTOPEN);
  var streak = parseInt(localStorage.getItem(STATS_KEY_STREAK)) || 0;
  if (lastOpen) {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayStr = yesterday.toISOString().split("T")[0];
    if (lastOpen === today) {} else if (lastOpen === yesterdayStr) { streak += 1; } else { streak = 1; }
  } else { streak = 1; }
  localStorage.setItem(STATS_KEY_LASTOPEN, today);
  localStorage.setItem(STATS_KEY_STREAK, streak);
  statStreak.textContent = streak;
  if (streak >= 7) { statStreak.style.color = "var(--accent)"; }
}

document.addEventListener("keydown", function (e) {
  var tag = document.activeElement.tagName;
  var isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
  if (e.key === "/" && !isInput) {
    e.preventDefault();
    document.getElementById("word").focus();
    return;
  }
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && isInput) {
    e.preventDefault();
    form.requestSubmit();
    return;
  }
  if (e.key === "Escape" && isInput) {
    form.reset();
    document.getElementById("word").blur();
    return;
  }
  if (e.key === "z" && (e.ctrlKey || e.metaKey) && !isInput) {
    e.preventDefault();
    undoLastWord();
    return;
  }
});

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
