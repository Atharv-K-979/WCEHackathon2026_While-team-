const PATTERNS = [
  { type: 'credit_card', regex: /\b(?:\d[ -]*?){13,16}\b/g },
  { type: 'email',       regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g },
  { type: 'phone',       regex: /\b(?:\+?91[\-\s]?)?[6789]\d{9}\b/g },
  { type: 'aadhaar',     regex: /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g },
  { type: 'pan',         regex: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g },
  { type: 'ip',          regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g },
  { type: 'upi',         regex: /\b[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}\b/g },
];

function extractMatches(text) {
  const matches = [];
  for (const pattern of PATTERNS) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({ type: pattern.type, value: match[0], index: match.index });
    }
  }
  return matches;
}

function redactText(text, matches) {
  let out = text;
  for (const m of matches) {
    out = out.replace(m.value, 'X'.repeat(m.value.length));
  }
  return out;
}

function saveLog(activityAction, details) {
  try {
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.warn('[VESSEL] chrome.runtime not available — page needs refresh after extension reload.');
      return;
    }
    chrome.runtime.sendMessage(
      { action: 'vesselLog', activityAction, details, url: window.location.hostname || 'Unknown' },
      (response) => {
        if (chrome.runtime.lastError) {
          // Fallback: try writing directly to storage if message fails
          console.warn('[VESSEL] sendMessage failed, trying direct storage write:', chrome.runtime.lastError.message);
          directStorageWrite(activityAction, details);
          return;
        }
        console.log('[VESSEL] og sent to background:', activityAction, response);
      }
    );
  } catch (err) {
    console.error('[VESSEL] saveLog exception:', err);
    directStorageWrite(activityAction, details);
  }
}

function directStorageWrite(activityAction, details) {
  try {
    chrome.storage.local.get(
      { vesselLogs: [], vesselStats: { threatsBlocked: 0, redactions: 0, pastedOriginal: 0 } },
      (result) => {
        if (chrome.runtime.lastError) { return; }
        const logs  = result.vesselLogs  || [];
        const stats = result.vesselStats || { threatsBlocked: 0, redactions: 0, pastedOriginal: 0 };
        logs.unshift({ timestamp: new Date().toISOString(), action: activityAction, details, url: window.location.hostname });
        if (logs.length > 50) logs.pop();
        stats.threatsBlocked = (stats.threatsBlocked || 0) + 1;
        if (activityAction === 'Redacted')        stats.redactions    = (stats.redactions    || 0) + 1;
        if (activityAction === 'Pasted Original') stats.pastedOriginal = (stats.pastedOriginal || 0) + 1;
        chrome.storage.local.set({ vesselLogs: logs, vesselStats: stats }, () => {
          if (!chrome.runtime.lastError) console.log('[VESSEL] Direct storage write saved:', activityAction);
        });
      }
    );
  } catch (e) {
    console.error('[VESSEL] directStorageWrite failed:', e);
  }
}

function showModal(detectedTypes, onRedact, onPasteOriginal, onCancel) {
  const existing = document.getElementById('__vessel_overlay__');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = '__vessel_overlay__';
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    background:rgba(0,0,0,0.6);z-index:2147483647;
    display:flex;align-items:center;justify-content:center;
    font-family:'Segoe UI',system-ui,sans-serif;
  `;

  const box = document.createElement('div');
  box.style.cssText = `
    background:#161a24;color:#e8eaf6;padding:28px 26px 22px;
    border-radius:14px;max-width:380px;width:90%;
    box-shadow:0 20px 60px rgba(0,0,0,0.6);border:1px solid #2a3050;
  `;

  const typePills = detectedTypes.map(t =>
    `<span style="display:inline-block;background:#1e2d50;color:#4d8eff;
      padding:3px 10px;border-radius:20px;font-size:12px;margin:3px 4px 3px 0;
      font-weight:600;letter-spacing:0.5px;">${t.toUpperCase()}</span>`
  ).join('');

  box.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
      <span style="font-size:22px;">⚡</span>
      <span style="font-size:17px;font-weight:700;color:#e8eaf6;">VESSEL — Sensitive Data Found</span>
    </div>
    <div style="font-size:13px;color:#7b82a0;margin-bottom:12px;">Detected types in your clipboard:</div>
    <div style="margin-bottom:20px;">${typePills}</div>
    <div style="display:flex;gap:10px;justify-content:flex-end;">
      <button id="__v_cancel__"   style="padding:9px 16px;border-radius:8px;border:1px solid #2a3050;background:#1e2436;color:#7b82a0;font-size:13px;font-weight:600;cursor:pointer;">Cancel</button>
      <button id="__v_original__" style="padding:9px 16px;border-radius:8px;border:1px solid #ff5b5b;background:rgba(255,91,91,0.12);color:#ff5b5b;font-size:13px;font-weight:600;cursor:pointer;">Paste Original</button>
      <button id="__v_redact__"   style="padding:9px 16px;border-radius:8px;border:none;background:linear-gradient(135deg,#4d8eff,#6a5cff);color:white;font-size:13px;font-weight:700;cursor:pointer;">Redact &amp; Paste</button>
    </div>
  `;

  overlay.appendChild(box);
  document.documentElement.appendChild(overlay);

  const cleanup = () => overlay.remove();

  document.getElementById('__v_cancel__').onclick   = () => { cleanup(); onCancel(); };
  document.getElementById('__v_original__').onclick = () => { cleanup(); onPasteOriginal(); };
  document.getElementById('__v_redact__').onclick   = () => { cleanup(); onRedact(); };
}

function insertText(target, text) {
  target.focus();
  if (!document.execCommand('insertText', false, text)) {
    if (target.isContentEditable) {
      target.textContent += text;
    } else if (typeof target.setRangeText === 'function') {
      target.setRangeText(text);
      target.selectionStart = target.selectionEnd = target.selectionStart + text.length;
    } else {
      target.value = (target.value || '') + text;
    }
  }
}

document.addEventListener('paste', (e) => {
  const clipboardData = e.clipboardData || window.clipboardData;
  if (!clipboardData) return;

  const text = clipboardData.getData('text');
  if (!text || text.trim().length === 0) return;

  const matches = extractMatches(text);
  if (matches.length === 0) return;

  e.preventDefault();
  e.stopImmediatePropagation();

  const detectedTypes = [...new Set(matches.map(m => m.type))];
  const redacted = redactText(text, matches);
  const element = e.target;

  showModal(
    detectedTypes,
    () => { insertText(element, redacted); saveLog('Redacted', detectedTypes.join(', ')); },
    () => { insertText(element, text);     saveLog('Pasted Original', detectedTypes.join(', ')); },
    () => {                                saveLog('Cancelled', detectedType); },
  );
}, true);

console.log('[VESSEL] Content script loaded on:', window.location.hostname);
