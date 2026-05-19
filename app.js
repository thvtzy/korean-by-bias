const STORAGE_KEY = 'kbb.words.v1';

const LANGUAGE_LABELS = {
  ko: 'Korean',
  ja: 'Japanese',
  zh: 'Mandarin',
  other: 'Other',
};

const form = document.getElementById('word-form');
const list = document.getElementById('word-list');
const emptyState = document.getElementById('empty-state');
const countEl = document.getElementById('count');

let words = loadWords();
render();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const newWord = {
    id: crypto.randomUUID(),
    word: data.get('word').trim(),
    meaning: data.get('meaning').trim(),
    example: data.get('example').trim(),
    source: data.get('source').trim(),
    language: data.get('language'),
    createdAt: new Date().toISOString(),
  };
  words.unshift(newWord);
  saveWords();
  render();
  form.reset();
  document.getElementById('word').focus();
});

list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="delete"]');
  if (!button) return;
  const id = button.dataset.id;
  if (!confirm('Delete this word?')) return;
  words = words.filter((w) => w.id !== id);
  saveWords();
  render();
});

function loadWords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

function render() {
  countEl.textContent = `${words.length} ${words.length === 1 ? 'word' : 'words'} saved`;

  if (words.length === 0) {
    emptyState.hidden = false;
    list.hidden = true;
    list.innerHTML = '';
    return;
  }

  emptyState.hidden = true;
  list.hidden = false;
  list.innerHTML = words.map(renderWordCard).join('');
}

function renderWordCard(w) {
  const lang = LANGUAGE_LABELS[w.language] || 'Other';
  return `
    <li class="word-card">
      <div class="word-card__head">
        <h2 class="word-card__word">${escapeHtml(w.word)}</h2>
        <span class="word-card__lang">${lang}</span>
      </div>
      <p class="word-card__meaning">${escapeHtml(w.meaning)}</p>
      ${w.example ? `<p class="word-card__example">"${escapeHtml(w.example)}"</p>` : ''}
      ${w.source ? `<p class="word-card__source">— ${escapeHtml(w.source)}</p>` : ''}
      <button class="word-card__delete" data-action="delete" data-id="${w.id}" aria-label="Delete word">×</button>
    </li>
  `;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
