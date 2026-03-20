document.addEventListener('DOMContentLoaded', () => {
  const activityArea  = document.getElementById('activity-area');
  const clearBtn      = document.getElementById('clear-btn');
  const statThreats   = document.getElementById('stat-threats');
  const statAnalyzed  = document.getElementById('stat-analyzed');
  const statRedactions = document.getElementById('stat-redactions');
  const statGrade     = document.getElementById('stat-grade');

  function timeAgo(dateString) {
    const diff = Math.max(0, Date.now() - new Date(dateString).getTime());
    const s = Math.floor(diff / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (s < 60) return `${s || 1}s ago`;
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return new Date(dateString).toLocaleDateString();
  }

  function getGrade(pastedOriginal) {
    if (pastedOriginal === 0) return 'A+';
    if (pastedOriginal <= 2)  return 'A';
    if (pastedOriginal <= 5)  return 'B+';
    if (pastedOriginal <= 10) return 'B';
    return 'C';
  }

  function render() {
    chrome.storage.local.get(
      { vesselLogs: [], vesselStats: { threatsBlocked: 0, redactions: 0, pastedOriginal: 0 } },
      (result) => {
        if (chrome.runtime.lastError) {
          console.error('[VESSEL popup] storage read error:', chrome.runtime.lastError);
          return;
        }
        const logs  = result.vesselLogs  || [];
        const stats = result.vesselStats || { threatsBlocked: 0, redactions: 0, pastedOriginal: 0 };

        statThreats.textContent    = stats.threatsBlocked || 0;
        statAnalyzed.textContent   = logs.length;
        statRedactions.textContent = stats.redactions || 0;
        statGrade.textContent      = getGrade(stats.pastedOriginal || 0);

        if (logs.length === 0) {
          activityArea.innerHTML = '<div class="empty-activity">No recent activity</div>';
          return;
        }

        activityArea.innerHTML = logs.slice(0, 10).map(log => {
          let dotClass = 'dot-cancelled';
          if (log.action === 'Redacted')        dotClass = 'dot-redacted';
          else if (log.action === 'Pasted Original') dotClass = 'dot-pasted';
          return `
            <div class="log-row">
              <div class="log-dot ${dotClass}"></div>
              <div class="log-body">
                <div class="log-action-label">${log.action}</div>
                <div class="log-detail">${log.details} &middot; ${log.url}</div>
              </div>
              <div class="log-time">${timeAgo(log.timestamp)}</div>
            </div>`;
        }).join('');
      }
    );
  }

  clearBtn.addEventListener('click', () => {
    chrome.storage.local.set(
      { vesselLogs: [], vesselStats: { threatsBlocked: 0, redactions: 0, pastedOriginal: 0 } },
      render
    );
  });

  // ── Live updates: re-render whenever storage changes ──
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && (changes.vesselLogs || changes.vesselStats)) {
      render();
    }
  });

  // ── Test Log button (debug only) ──
  const testLogBtn = document.getElementById('test-log-btn');
  if (testLogBtn) {
    testLogBtn.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.storage.local.get(
        { vesselLogs: [], vesselStats: { threatsBlocked: 0, redactions: 0, pastedOriginal: 0 } },
        (result) => {
          const logs  = result.vesselLogs  || [];
          const stats = result.vesselStats || { threatsBlocked: 0, redactions: 0, pastedOriginal: 0 };
          logs.unshift({
            timestamp: new Date().toISOString(),
            action:    'Redacted',
            details:   'aadhaar (test)',
            url:       'popup-test'
          });
          stats.threatsBlocked = (stats.threatsBlocked || 0) + 1;
          stats.redactions     = (stats.redactions     || 0) + 1;
          chrome.storage.local.set({ vesselLogs: logs, vesselStats: stats }, () => {
            console.log('[VESSEL popup] ✅ Test log written. Logs now:', logs.length);
            render();
          });
        }
      );
    });
  }

  render();
});
