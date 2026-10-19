/**
 * Client behaviour for a topic page. Everything the page shows is already in the HTML; this file
 * only flips attributes: the filters set `hidden` on article.question (and on a part section whose
 * questions are all hidden), MCQ options take data-state, answer panels lose or regain `hidden`,
 * and the live regions get their text. Nothing is stored anywhere. Every selector comes from
 * CONTRACT.md, "DOM contract".
 *
 * 1. Filters: button[data-filter] groups (aria-pressed) and select[data-filter="subtopic"] combine;
 *    p[data-filter-count] reports "Showing 12 of 30 questions". No filter is applied on load, so a
 *    deep link to a question always lands on a visible card.
 * 2. MCQ: the option chosen (or its table row) marks itself correct or wrong, reveals the correct
 *    option, locks the group, labels the marked options, fills p.feedback, opens the answer panel
 *    and shows button.try-again. p[data-score] counts first attempts only ("x / y correct"): the
 *    first result is kept in data-first and survives "Try again".
 * 3. button.try-again unlocks that one question and closes its panel.
 * 4. button.toggle-answer shows or hides its aria-controls panel and flips its label.
 * 5. Arrow keys, Home and End move focus between the options of one question.
 */

type FilterKey = 'tier' | 'type' | 'subtopic';

const articles = Array.from(document.querySelectorAll<HTMLElement>('article.question'));
const filterBar = document.querySelector<HTMLElement>('.filters[data-filters]');
const countOut = document.querySelector<HTMLElement>('p[data-filter-count]');
const scoreOut = document.querySelector<HTMLElement>('p[data-score]');
const filter: Record<FilterKey, string> = { tier: 'all', type: 'all', subtopic: 'all' };

function isFilterKey(value: string | undefined): value is FilterKey {
  return value === 'tier' || value === 'type' || value === 'subtopic';
}

function applyFilters(): void {
  let shown = 0;
  for (const article of articles) {
    const data = article.dataset;
    const show =
      (filter.tier === 'all' || data.tier === filter.tier) &&
      (filter.type === 'all' || data.type === filter.type) &&
      (filter.subtopic === 'all' || data.subtopic === filter.subtopic);
    article.hidden = !show;
    if (show) shown += 1;
  }
  for (const group of Array.from(document.querySelectorAll<HTMLElement>('section.part-group'))) {
    group.hidden = !group.querySelector('article.question:not([hidden])');
  }
  if (countOut) {
    countOut.textContent =
      shown === articles.length ? `Showing all ${shown} questions` : `Showing ${shown} of ${articles.length} questions`;
  }
}

function setPanel(article: HTMLElement, open: boolean): void {
  const toggle = article.querySelector<HTMLButtonElement>('button.toggle-answer');
  if (!toggle) return;
  const panel = document.getElementById(toggle.getAttribute('aria-controls') ?? '');
  if (panel) panel.hidden = !open;
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  const label = toggle.querySelector('.toggle-label') ?? toggle;
  label.textContent = `${open ? 'Hide' : 'Show'} ${article.dataset.type === 'mcq' ? 'answer' : 'mark scheme'}`;
}

function updateScore(): void {
  if (!scoreOut) return;
  const answered = articles.filter((article) => article.dataset.first !== undefined);
  if (answered.length === 0) return;
  const correct = answered.filter((article) => article.dataset.first === 'correct').length;
  scoreOut.textContent = `${correct} / ${answered.length} correct`;
}

function options(article: HTMLElement): HTMLButtonElement[] {
  return Array.from(article.querySelectorAll<HTMLButtonElement>('button.option'));
}

/** The option's status label: inside the button, or next to it in a table row's first cell. */
function statusOf(option: HTMLButtonElement): HTMLElement | null {
  return option.querySelector('.option-status') ?? option.parentElement?.querySelector('.option-status') ?? null;
}

function answer(article: HTMLElement, chosen: HTMLButtonElement): void {
  if (article.dataset.answered !== undefined) return;
  const correct = article.dataset.answer ?? '';
  const ok = chosen.dataset.letter === correct;
  // Disabling the focused option would drop focus to the body; move it to Try again instead.
  const hadFocus = article.contains(document.activeElement);

  for (const option of options(article)) {
    const isChosen = option === chosen;
    const isRight = option.dataset.letter === correct;
    const state = isRight ? 'correct' : isChosen ? 'wrong' : undefined;
    if (state) option.dataset.state = state;
    option.setAttribute('aria-pressed', isChosen ? 'true' : 'false');
    option.disabled = true;
    const status = statusOf(option);
    if (status) status.textContent = isChosen ? (ok ? 'Correct' : 'Not quite') : isRight ? 'Correct answer' : '';
    // Table-shaped options: mirror the state onto the row for browsers without :has().
    // aria-pressed is not valid on a row, so the chosen row gets data-pressed.
    const row = option.closest<HTMLElement>('tr.option-row');
    if (row) {
      if (state) row.dataset.state = state;
      if (isChosen) row.dataset.pressed = 'true';
    }
  }

  const result = ok ? 'correct' : 'wrong';
  article.dataset.answered = result;
  article.dataset.first ??= result;
  const feedback = article.querySelector<HTMLElement>('p.feedback');
  if (feedback) feedback.textContent = ok ? 'Correct' : `Not quite. The answer is ${correct}`;
  setPanel(article, true);
  updateScore();
  const retry = article.querySelector<HTMLButtonElement>('button.try-again');
  if (retry) retry.hidden = false;
  if (hadFocus) retry?.focus({ preventScroll: true });
}

function reset(article: HTMLElement): void {
  delete article.dataset.answered;
  for (const option of options(article)) {
    delete option.dataset.state;
    option.setAttribute('aria-pressed', 'false');
    option.disabled = false;
    const status = statusOf(option);
    if (status) status.textContent = '';
    const row = option.closest<HTMLElement>('tr.option-row');
    if (row) {
      delete row.dataset.state;
      delete row.dataset.pressed;
    }
  }
  const feedback = article.querySelector<HTMLElement>('p.feedback');
  if (feedback) feedback.textContent = '';
  setPanel(article, false);
  const retry = article.querySelector<HTMLButtonElement>('button.try-again');
  if (retry) retry.hidden = true;
  options(article)[0]?.focus();
}

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const toggle = target.closest<HTMLButtonElement>('button.toggle-answer');
  if (toggle) {
    const article = toggle.closest<HTMLElement>('article.question');
    if (article) setPanel(article, toggle.getAttribute('aria-expanded') !== 'true');
    return;
  }

  const article = target.closest<HTMLElement>('article.question[data-type="mcq"]');
  if (!article) return;
  if (target.closest('button.try-again')) {
    reset(article);
    return;
  }
  const option =
    target.closest<HTMLButtonElement>('button.option') ??
    target.closest<HTMLElement>('tr.option-row')?.querySelector<HTMLButtonElement>('button.option') ??
    null;
  if (option) answer(article, option);
});

const MOVE_KEYS = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End']);

document.addEventListener('keydown', (event) => {
  if (!MOVE_KEYS.has(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
  const target = event.target;
  if (!(target instanceof HTMLButtonElement) || !target.classList.contains('option')) return;
  const article = target.closest<HTMLElement>('article.question');
  if (!article) return;
  const enabled = options(article).filter((b) => !b.disabled);
  const index = enabled.indexOf(target);
  if (index === -1) return;
  const last = enabled.length - 1;
  let next = index;
  if (event.key === 'ArrowDown') next = index === last ? 0 : index + 1;
  else if (event.key === 'ArrowUp') next = index === 0 ? last : index - 1;
  else if (event.key === 'Home') next = 0;
  else next = last;
  event.preventDefault();
  enabled[next]?.focus();
});

if (filterBar) {
  filterBar.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>('button[data-filter]');
    if (!button) return;
    const key = button.dataset.filter;
    if (!isFilterKey(key)) return;
    const group = button.closest('[data-filter-group]') ?? filterBar;
    for (const other of Array.from(group.querySelectorAll<HTMLButtonElement>('button[data-filter]'))) {
      other.setAttribute('aria-pressed', other === button ? 'true' : 'false');
    }
    filter[key] = button.dataset.value ?? 'all';
    applyFilters();
  });

  filterBar.addEventListener('change', (event) => {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement)) return;
    const key = select.dataset.filter;
    if (!isFilterKey(key)) return;
    filter[key] = select.value;
    applyFilters();
  });
}

// Nothing is hidden on load; this only writes "Showing all 30 questions".
applyFilters();
