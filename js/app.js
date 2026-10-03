// ===================== State =====================
const state = {
  mode: null, // 'task1' | 'task2' | 'mock'
  durationSec: 0,
  remainingSec: 0,
  timerId: null,
  task1: null, // { question, essay }
  task2: null,
  submitted: false,
  lastResult: null,
};

const DURATIONS = { task1: 20 * 60, task2: 40 * 60, mock: 60 * 60 };
const MODE_LABELS = { task1: 'Practice Task 1', task2: 'Practice Task 2', mock: 'Mock Test' };

// ===================== DOM refs =====================
const screens = {
  home: document.getElementById('screen-home'),
  exam: document.getElementById('screen-exam'),
  result: document.getElementById('screen-result'),
  detail: document.getElementById('screen-detail'),
};
const examTitle = document.getElementById('exam-title');
const timerDisplay = document.getElementById('timer-display');
const examTabs = document.getElementById('exam-tabs');
const panelTask1 = document.getElementById('panel-task1');
const panelTask2 = document.getElementById('panel-task2');
const t1Instruction = document.getElementById('t1-instruction');
const t1Chart = document.getElementById('t1-chart');
const t1Essay = document.getElementById('t1-essay');
const t1WordCount = document.getElementById('t1-wordcount');
const t2Type = document.getElementById('t2-type');
const t2Instruction = document.getElementById('t2-instruction');
const t2Essay = document.getElementById('t2-essay');
const t2WordCount = document.getElementById('t2-wordcount');
const btnSubmit = document.getElementById('btn-submit');
const btnExit = document.getElementById('btn-exit');
const btnRestart = document.getElementById('btn-restart');
const resultContent = document.getElementById('result-content');
const modalExit = document.getElementById('modal-exit');
const btnExitCancel = document.getElementById('btn-exit-cancel');
const btnExitConfirm = document.getElementById('btn-exit-confirm');
const btnDetail = document.getElementById('btn-detail');
const btnDetailBack = document.getElementById('btn-detail-back');
const detailTabs = document.getElementById('detail-tabs');
const detailPanelTask1 = document.getElementById('detail-panel-task1');
const detailPanelTask2 = document.getElementById('detail-panel-task2');
const detailTask1Essay = document.getElementById('detail-task1-essay');
const detailTask1Annotations = document.getElementById('detail-task1-annotations');
const detailTask2Essay = document.getElementById('detail-task2-essay');
const detailTask2Annotations = document.getElementById('detail-task2-annotations');

// ===================== Decorative illustrations =====================
function injectIllustrations() {
  document.getElementById('mascot-owl').innerHTML = owlMascotSVG();
  document.getElementById('icon-task1').innerHTML = pencilPaperSVG();
  document.getElementById('icon-task2').innerHTML = booksIconSVG();
  document.getElementById('icon-mock').innerHTML = trophySVG();
  document.getElementById('modal-owl').innerHTML = owlMascotSVG();

  const starsContainer = document.getElementById('hero-stars');
  for (let i = 0; i < 6; i++) {
    const span = document.createElement('span');
    span.innerHTML = sparkleSVG();
    starsContainer.appendChild(span.firstChild);
  }
}

injectIllustrations();

// ===================== Navigation =====================
function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove('active'));
  screens[name].classList.add('active');
}

document.querySelectorAll('[data-mode]').forEach((btn) => {
  btn.addEventListener('click', () => startExam(btn.dataset.mode));
});

btnRestart.addEventListener('click', resetToHome);
btnSubmit.addEventListener('click', submitExam);

// ===================== Exit modal =====================
btnExit.addEventListener('click', () => modalExit.classList.add('active'));
btnExitCancel.addEventListener('click', () => modalExit.classList.remove('active'));
btnExitConfirm.addEventListener('click', () => {
  modalExit.classList.remove('active');
  resetToHome();
});

btnDetail.addEventListener('click', () => {
  renderDetailScreen();
  showScreen('detail');
});
btnDetailBack.addEventListener('click', () => showScreen('result'));

// ===================== Start exam =====================
function startExam(mode) {
  state.mode = mode;
  state.submitted = false;
  state.durationSec = DURATIONS[mode];
  state.remainingSec = state.durationSec;

  examTitle.textContent = MODE_LABELS[mode];

  // Build tabs
  examTabs.innerHTML = '';
  panelTask1.classList.remove('active');
  panelTask2.classList.remove('active');

  if (mode === 'task1' || mode === 'mock') {
    state.task1 = { question: pickRandom(TASK1_QUESTIONS), essay: '' };
    renderTask1(state.task1.question);
  } else {
    state.task1 = null;
  }

  if (mode === 'task2' || mode === 'mock') {
    state.task2 = { question: pickRandom(TASK2_QUESTIONS), essay: '' };
    renderTask2(state.task2.question);
  } else {
    state.task2 = null;
  }

  if (mode === 'mock') {
    const tab1 = makeTab('Task 1', 'panel-task1');
    const tab2 = makeTab('Task 2', 'panel-task2');
    examTabs.appendChild(tab1);
    examTabs.appendChild(tab2);
    switchTab('panel-task1');
  } else if (mode === 'task1') {
    panelTask1.classList.add('active');
  } else {
    panelTask2.classList.add('active');
  }

  t1Essay.value = '';
  t2Essay.value = '';
  updateWordCount('task1');
  updateWordCount('task2');

  showScreen('exam');
  startTimer(); // timer begins counting down immediately
}

function makeTab(label, targetId) {
  const btn = document.createElement('button');
  btn.className = 'tab-btn';
  btn.textContent = label;
  btn.addEventListener('click', () => switchTab(targetId));
  btn.dataset.target = targetId;
  return btn;
}

function switchTab(targetId) {
  document.querySelectorAll('.tab-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.target === targetId);
  });
  panelTask1.classList.toggle('active', targetId === 'panel-task1');
  panelTask2.classList.toggle('active', targetId === 'panel-task2');
}

function renderTask1(question) {
  t1Instruction.textContent = question.instruction;
  t1Chart.innerHTML = question.render();
}

function renderTask2(question) {
  t2Type.textContent = `TASK 2 — ${question.type}`;
  t2Instruction.textContent = question.instruction;
}

// ===================== Word count =====================
function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function updateWordCount(task) {
  if (task === 'task1' && state.task1) {
    const n = countWords(t1Essay.value);
    t1WordCount.textContent = `${n} từ (bắt buộc ≥135, nên ≤165)`;
    state.task1.essay = t1Essay.value;
  }
  if (task === 'task2' && state.task2) {
    const n = countWords(t2Essay.value);
    t2WordCount.textContent = `${n} từ (tối thiểu 250)`;
    state.task2.essay = t2Essay.value;
  }
}

t1Essay.addEventListener('input', () => updateWordCount('task1'));
t2Essay.addEventListener('input', () => updateWordCount('task2'));

// ===================== Timer =====================
function startTimer() {
  clearInterval(state.timerId);
  renderTimer();
  state.timerId = setInterval(() => {
    state.remainingSec -= 1;
    if (state.remainingSec <= 0) {
      state.remainingSec = 0;
      renderTimer();
      clearInterval(state.timerId);
      submitExam();
      return;
    }
    renderTimer();
  }, 1000);
}

function renderTimer() {
  const m = Math.floor(state.remainingSec / 60).toString().padStart(2, '0');
  const s = (state.remainingSec % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${m}:${s}`;
  timerDisplay.classList.remove('warning', 'danger');
  if (state.remainingSec <= 60) {
    timerDisplay.classList.add('danger');
  } else if (state.remainingSec <= 300) {
    timerDisplay.classList.add('warning');
  }
}

// ===================== Submit =====================
async function submitExam() {
  if (state.submitted) return;
  state.submitted = true;
  clearInterval(state.timerId);

  if (state.task1) state.task1.essay = t1Essay.value;
  if (state.task2) state.task2.essay = t2Essay.value;

  showScreen('result');
  resultContent.innerHTML = `
    <div class="loading-box">
      <div class="spinner"></div>
      <p>Bạn vui lòng chờ 1 phút để hệ thống xử lý nha ^^</p>
    </div>`;

  try {
    const payload = {
      mode: state.mode,
      task1: state.task1 ? { question: state.task1.question.instruction, essay: state.task1.essay } : null,
      task2: state.task2 ? { question: state.task2.question.instruction, essay: state.task2.essay } : null,
    };

    const res = await fetch('/api/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok || !data.ok) {
      throw new Error(data.error || 'Lỗi không xác định khi chấm bài.');
    }

    renderResult(data.result);
  } catch (err) {
    resultContent.innerHTML = `
      <div class="error-box">
        <strong>Không thể chấm bài tự động.</strong><br>
        ${escapeHtml(err.message)}<br><br>
        Hãy kiểm tra server có đang chạy và đã cấu hình ANTHROPIC_API_KEY trong file .env chưa.
      </div>`;
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===================== Render result =====================
function renderResult(result) {
  state.lastResult = result;
  let html = '';

  html += `
    <div class="note-box">
      💡 <strong>Lưu ý:</strong> 4 tiêu chí chấm điểm có liên quan mật thiết với nhau — ví dụ lỗi ngữ pháp nặng có thể vừa kéo điểm Grammar, vừa khiến ý tưởng khó hiểu hơn và ảnh hưởng tới Coherence &amp; Cohesion hoặc Task Achievement/Response. Hệ thống đã cân nhắc các mối liên hệ này khi chấm.
    </div>`;

  if (result.task1) html += renderTaskResult('Task 1', result.task1);
  if (result.task2) html += renderTaskResult('Task 2', result.task2);

  if (result.overallWritingBand !== undefined) {
    html += `
      <div class="result-card">
        <h2>Điểm Writing tổng kết</h2>
        <div class="band-overall">
          <div class="band-number">${result.overallWritingBand}</div>
          <p>Điểm tổng hợp Writing (Task 2 được tính trọng số gấp đôi Task 1, theo đúng cách tính IELTS thật).</p>
        </div>
      </div>`;
  }

  resultContent.innerHTML = html;
}

const CRITERIA_LABELS = {
  taskAchievement: 'Task Achievement',
  taskResponse: 'Task Response',
  coherenceCohesion: 'Coherence & Cohesion',
  lexicalResource: 'Lexical Resource',
  grammaticalRange: 'Grammatical Range & Accuracy',
};

function renderTaskResult(label, r) {
  let criteriaHtml = '';
  Object.entries(r.criteria || {}).forEach(([key, val]) => {
    const name = CRITERIA_LABELS[key] || key;
    criteriaHtml += `
      <div class="criterion-item">
        <div class="label">${name}<span class="weight">25%</span></div>
        <div class="score">${val.band}</div>
        <div class="comment">${escapeHtml(val.explanation || '')}</div>
      </div>`;
  });

  const listHtml = (arr) => (arr || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');

  return `
    <div class="result-card">
      <h2>${label}</h2>
      ${typeof r.wordCount === 'number' ? `<div class="word-count-label">Số từ: ${r.wordCount}</div>` : ''}
      <div class="band-overall">
        <div class="band-number">${r.overallBand}</div>
        <p>${escapeHtml(r.generalComment || '')}</p>
      </div>
      <div class="criteria-grid">${criteriaHtml}</div>
      <div class="feedback-section">
        <h4>✅ Điểm mạnh</h4>
        <ul>${listHtml(r.strengths)}</ul>
      </div>
      <div class="feedback-section">
        <h4>⚠️ Điểm cần cải thiện</h4>
        <ul>${listHtml(r.weaknesses)}</ul>
      </div>
      <div class="feedback-section">
        <h4>💡 Gợi ý nâng điểm</h4>
        <ul>${listHtml(r.suggestions)}</ul>
      </div>
    </div>`;
}

// ===================== Detail (highlighted essay) screen =====================
function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const ANNOTATION_CATEGORY_LABELS = {
  task: 'Task Achievement/Response',
  coherence: 'Coherence & Cohesion',
  lexical: 'Lexical Resource',
  grammar: 'Grammar',
  positive: 'Điểm hay',
};

function buildHighlightedEssay(text, annotations) {
  const located = (annotations || [])
    .map((a, i) => {
      const idx = text.indexOf(a.quote);
      return idx === -1 ? null : { ...a, start: idx, end: idx + a.quote.length, id: `a${i}` };
    })
    .filter(Boolean)
    .sort((a, b) => a.start - b.start);

  const resolved = [];
  let cursor = 0;
  located.forEach((a) => {
    if (a.start >= cursor) {
      resolved.push(a);
      cursor = a.end;
    }
  });

  let html = '';
  let pos = 0;
  resolved.forEach((a) => {
    html += escapeHtml(text.slice(pos, a.start));
    html += `<mark class="hl hl-${a.category}" data-anno="${a.id}" title="${escapeAttr(a.issue || '')}">${escapeHtml(text.slice(a.start, a.end))}</mark>`;
    pos = a.end;
  });
  html += escapeHtml(text.slice(pos));

  return { html, resolved };
}

function buildAnnotationCards(resolved) {
  if (!resolved.length) return '<p style="color:var(--muted)">Không có ghi chú chi tiết nào cho bài này.</p>';
  return resolved
    .map(
      (a) => `
      <div class="annotation-card anno-${a.category}" id="card-${a.id}" data-anno-target="${a.id}">
        <div class="annotation-cat">${ANNOTATION_CATEGORY_LABELS[a.category] || a.category}</div>
        <div class="annotation-quote">"${escapeHtml(a.quote)}"</div>
        <div class="annotation-issue">${escapeHtml(a.issue || '')}</div>
        ${a.suggestion ? `<div class="annotation-suggestion">✏️ Gợi ý: ${escapeHtml(a.suggestion)}</div>` : ''}
      </div>`
    )
    .join('');
}

function flashElement(el) {
  el.classList.remove('flash');
  // eslint-disable-next-line no-void
  void el.offsetWidth; // restart animation
  el.classList.add('flash');
  setTimeout(() => el.classList.remove('flash'), 1200);
}

function renderDetailPanel(essayContainer, annotationsContainer, essayText, annotations) {
  const { html, resolved } = buildHighlightedEssay(essayText || '', annotations || []);
  essayContainer.innerHTML = html || '<em>(Không có nội dung bài làm)</em>';
  annotationsContainer.innerHTML = buildAnnotationCards(resolved);

  essayContainer.querySelectorAll('.hl').forEach((mark) => {
    mark.addEventListener('click', () => {
      const card = document.getElementById(`card-${mark.dataset.anno}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        flashElement(card);
      }
    });
  });
  annotationsContainer.querySelectorAll('.annotation-card').forEach((card) => {
    card.addEventListener('click', () => {
      const mark = essayContainer.querySelector(`.hl[data-anno="${card.dataset.annoTarget}"]`);
      if (mark) {
        mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
        flashElement(mark);
      }
    });
  });
}

function makeDetailTab(label, targetId) {
  const btn = document.createElement('button');
  btn.className = 'tab-btn';
  btn.textContent = label;
  btn.dataset.target = targetId;
  btn.addEventListener('click', () => switchDetailTab(targetId));
  return btn;
}

function switchDetailTab(targetId) {
  detailTabs.querySelectorAll('.tab-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.target === targetId);
  });
  detailPanelTask1.classList.toggle('active', targetId === 'detail-panel-task1');
  detailPanelTask2.classList.toggle('active', targetId === 'detail-panel-task2');
}

function renderDetailScreen() {
  const result = state.lastResult;
  if (!result) return;

  detailTabs.innerHTML = '';
  detailPanelTask1.classList.remove('active');
  detailPanelTask2.classList.remove('active');

  const hasTask1 = !!(result.task1 && state.task1);
  const hasTask2 = !!(result.task2 && state.task2);

  if (hasTask1) {
    renderDetailPanel(detailTask1Essay, detailTask1Annotations, state.task1.essay, result.task1.annotations);
  }
  if (hasTask2) {
    renderDetailPanel(detailTask2Essay, detailTask2Annotations, state.task2.essay, result.task2.annotations);
  }

  if (hasTask1 && hasTask2) {
    detailTabs.appendChild(makeDetailTab('Task 1', 'detail-panel-task1'));
    detailTabs.appendChild(makeDetailTab('Task 2', 'detail-panel-task2'));
    switchDetailTab('detail-panel-task1');
  } else if (hasTask1) {
    detailPanelTask1.classList.add('active');
  } else if (hasTask2) {
    detailPanelTask2.classList.add('active');
  }
}

// ===================== Reset =====================
function resetToHome() {
  clearInterval(state.timerId);
  state.mode = null;
  state.task1 = null;
  state.task2 = null;
  state.submitted = false;
  state.lastResult = null;
  showScreen('home');
}
