export function showPasteRedactionModal(detectedTypes, onRedactAndPaste, onPasteOriginal, onCancel) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 2147483647;
    display: flex; align-items: center; justify-content: center;
  `;

  const shadowHost = document.createElement('div');
  const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: white; color: #333; padding: 24px; border-radius: 8px;
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 400px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  `;

  modal.innerHTML = `
    <h2 style="margin-top: 0; color: #d32f2f; font-size: 1.25rem;">Sensitive Data Detected</h2>
    <p style="font-size: 0.95rem; margin-bottom: 12px;">We detected the following sensitive information types in your clipboard:</p>
    <ul style="margin: 0 0 16px 0; padding-left: 20px; font-size: 0.9rem;">
      ${detectedTypes.map(t => `<li><strong>${t.toUpperCase()}</strong></li>`).join('')}
    </ul>
    <p style="font-size: 0.95rem;">Select an action to proceed:</p>
    <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px;">
      <button id="btn-cancel" style="padding: 8px 12px; cursor: pointer; border: 1px solid #ccc; background: white; border-radius: 4px; color: #333;">Cancel</button>
      <button id="btn-original" style="padding: 8px 12px; cursor: pointer; border: 1px solid #ccc; background: #f0f0f0; border-radius: 4px; color: #333;">Paste Original</button>
      <button id="btn-redact" style="padding: 8px 12px; cursor: pointer; background: #1976d2; color: white; border: none; border-radius: 4px; font-weight: bold;">Redact & Paste</button>
    </div>
  `;

  shadowRoot.appendChild(modal);
  overlay.appendChild(shadowHost);
  document.body.appendChild(overlay);

  const cleanup = () => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  };

  shadowRoot.getElementById('btn-cancel').onclick = () => { cleanup(); onCancel(); };
  shadowRoot.getElementById('btn-original').onclick = () => { cleanup(); onPasteOriginal(); };
  shadowRoot.getElementById('btn-redact').onclick = () => { cleanup(); onRedactAndPaste(); };
}
