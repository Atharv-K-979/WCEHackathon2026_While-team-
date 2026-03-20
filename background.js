// ── VESSEL Background Service Worker ──
chrome.runtime.onInstalled.addListener(() => {
  console.log('[VESSEL] Extension installed.');
});

// Listen for log messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'vesselLog') {
    const { activityAction, details, url } = message;

    chrome.storage.local.get(
      { vesselLogs: [], vesselStats: { threatsBlocked: 0, redactions: 0, pastedOriginal: 0 } },
      (result) => {
        if (chrome.runtime.lastError) {
          console.error('[VESSEL BG] storage.get error:', chrome.runtime.lastError.message);
          sendResponse({ ok: false, error: chrome.runtime.lastError.message });
          return;
        }

        const logs  = result.vesselLogs  || [];
        const stats = result.vesselStats || { threatsBlocked: 0, redactions: 0, pastedOriginal: 0 };

        logs.unshift({
          timestamp:  new Date().toISOString(),
          action:     activityAction,
          details:    details,
          url:        url || 'Unknown'
        });
        if (logs.length > 50) logs.pop();

        stats.threatsBlocked  = (stats.threatsBlocked  || 0) + 1;
        if (activityAction === 'Redacted')         stats.redactions     = (stats.redactions     || 0) + 1;
        if (activityAction === 'Pasted Original')  stats.pastedOriginal  = (stats.pastedOriginal  || 0) + 1;

        chrome.storage.local.set({ vesselLogs: logs, vesselStats: stats }, () => {
          if (chrome.runtime.lastError) {
            console.error('[VESSEL BG] storage.set error:', chrome.runtime.lastError.message);
            sendResponse({ ok: false, error: chrome.runtime.lastError.message });
            return;
          }
          console.log('[VESSEL BG] Saved:', activityAction, '| total:', logs.length);
          sendResponse({ ok: true, total: logs.length });
        });
      }
    );

    return true; // keep message channel open for async response
  }
});
