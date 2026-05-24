/* ─── State ───────────────────────────────────────────────── */
let current  = '0';
let previous = '';
let operator = '';
let justEqualed = false;

/* ─── DOM refs ────────────────────────────────────────────── */
const resultEl = document.getElementById('result');
const exprEl   = document.getElementById('expr');

/* ─── Helpers ─────────────────────────────────────────────── */
function fmt(num) {
  let s = parseFloat(num.toPrecision(12)).toString();
  if (s.length > 14) s = parseFloat(num.toPrecision(9)).toString();
  return s;
}

function render() {
  resultEl.textContent = current;

  // Shrink font for long numbers
  const len = current.replace('-', '').replace('.', '').length;
  if (len > 10) {
    resultEl.style.fontSize = '26px';
  } else if (len > 7) {
    resultEl.style.fontSize = '34px';
  } else {
    resultEl.style.fontSize = '42px';
  }
}

function calculate(a, op, b) {
  switch (op) {
    case '÷': return b !== 0 ? a / b : 'Error';
    case '×': return a * b;
    case '−': return a - b;
    case '+': return a + b;
    default:  return b;
  }
}

/* ─── Button Handler ──────────────────────────────────────── */
document.getElementById('btns').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const { action, val } = btn.dataset;

  // Ripple effect
  triggerRipple(btn, e);

  switch (action) {

    case 'num':
      if (justEqualed) {
        current = '0'; previous = ''; operator = '';
        exprEl.textContent = ''; justEqualed = false;
      }
      current = (current === '0') ? val : (current.length < 15 ? current + val : current);
      render();
      break;

    case 'dot':
      if (justEqualed) { current = '0'; justEqualed = false; }
      if (!current.includes('.')) current += '.';
      render();
      break;

    case 'ac':
      current = '0'; previous = ''; operator = '';
      exprEl.textContent = ''; justEqualed = false;
      render();
      break;

    case 'sign':
      current = fmt(parseFloat(current) * -1);
      render();
      break;

    case 'percent':
      current = fmt(parseFloat(current) / 100);
      render();
      break;

    case 'op':
      if (operator && !justEqualed) {
        const result = calculate(parseFloat(previous), operator, parseFloat(current));
        if (result === 'Error') {
          current = 'Error'; exprEl.textContent = '';
          operator = ''; previous = ''; justEqualed = true;
          render(); return;
        }
        current = fmt(result);
        render();
      }
      previous = current;
      operator = val;
      justEqualed = false;
      exprEl.textContent = current + ' ' + val;
      current = '0';
      break;

    case 'eq':
      if (!operator) return;
      const a = parseFloat(previous);
      const b = parseFloat(current);
      const result = calculate(a, operator, b);

      exprEl.textContent = previous + ' ' + operator + ' ' + current + ' =';

      if (result === 'Error') {
        current = 'Error';
      } else {
        current = fmt(result);
      }

      operator = ''; previous = ''; justEqualed = true;
      render();
      break;
  }
});

/* ─── Keyboard Support ────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  const key = e.key;
  const map = {
    '0':'0','1':'1','2':'2','3':'3','4':'4',
    '5':'5','6':'6','7':'7','8':'8','9':'9',
    '.': 'dot', ',': 'dot',
    '+': 'op:+', '-': 'op:−', '*': 'op:×', '/': 'op:÷',
    'Enter': 'eq', '=': 'eq',
    'Escape': 'ac', 'Backspace': 'backspace',
    '%': 'percent'
  };

  const action = map[key];
  if (!action) return;
  e.preventDefault();

  if (action === 'backspace') {
    if (current.length > 1) current = current.slice(0, -1);
    else current = '0';
    render(); return;
  }

  if (action.startsWith('op:')) {
    const fakeBtn = document.querySelector(`[data-action="op"][data-val="${action.slice(3)}"]`);
    fakeBtn?.click(); return;
  }

  const fakeBtn = document.querySelector(
    action === 'dot' || action === 'eq' || action === 'ac' || action === 'percent'
      ? `[data-action="${action}"]`
      : `[data-action="num"][data-val="${action}"]`
  );
  fakeBtn?.click();
});

/* ─── Ripple ──────────────────────────────────────────────── */
function triggerRipple(btn, e) {
  const circle = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top  - size / 2;

  circle.style.cssText = `
    position: absolute;
    width: ${size}px; height: ${size}px;
    left: ${x}px; top: ${y}px;
    background: rgba(255,255,255,0.15);
    border-radius: 50%;
    pointer-events: none;
    transform: scale(0);
    animation: ripple 0.45s ease-out forwards;
  `;

  // Inject keyframe once
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }`;
    document.head.appendChild(style);
  }

  btn.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());
}