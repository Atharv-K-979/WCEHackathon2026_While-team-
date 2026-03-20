import React from 'react';
import { Link } from 'react-router-dom';

export default function LocalUsage() {
  return (
    <>
      <nav className="nav scrolled">
        <Link to="/" className="nav-logo">
          <img src="/vessel-logo.png" alt="VESSEL Logo" style={{ height: "46px", width: "auto", objectFit: "contain", mixBlendMode: "multiply", marginLeft: "-4px" }} />
        </Link>
        <div style={{ flex: 1 }}></div>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button className="nav-cta">← Back to Home</button>
        </Link>
      </nav>

      <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', background: 'var(--bg-main)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 800, marginBottom: '24px', letterSpacing: '-1px' }}>
            How to Use VESSEL Locally
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: 1.6 }}>
            Follow these simple steps to install and run the VESSEL extension securely on your local machine without any cloud dependencies.
          </p>

          <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Installation Guide</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Download the OS Agent</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Get the native host application for your operating system to enable clipboard and local ML features.</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Get the Extension Source</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Clone or download the VESSEL extension source code from our repository at <a href="https://github.com/Atharv-K-979/VESSEL.git" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>https://github.com/Atharv-K-979/VESSEL.git</a>.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>3</div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Load Unpacked in Chrome</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Open Chrome and navigate to <code>chrome://extensions/</code>. Toggle "Developer mode" in the top right, then click "Load unpacked" and select the extension directory.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>4</div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Verify Protection</h3>
                  <p style={{ color: 'var(--text-muted)' }}>The VESSEL icon should appear in your toolbar. Try pasting sensitive data or testing a prompt injection to see it in action.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <button className="btn-p">Go Back</button>
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-l-box">
            <div className="flinks">
              <a href="https://github.com/Atharv-K-979/VESSEL" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://medium.com/@atharvvk853/vessel-vulnerability-evaluation-and-secure-software-engineering-layer-78250e113b8a" target="_blank" rel="noreferrer">Medium Blog</a>
              <a href="#">Docs</a>
            </div>
          </div>
          <div className="footer-c-box">
            <Link to="/" className="nav-logo" style={{ fontSize: 18 }}>
              <img src="/vessel-logo.png" alt="VESSEL Logo" style={{ height: "64px", width: "auto", objectFit: "contain", mixBlendMode: "multiply", transform: "scale(1.4)" }} />
            </Link>
          </div>
          <div className="footer-r-box">
            <div className="footer-r">Built by While()&#123;team&#125; · WCE Sangli · 2026 · MIT License</div>
          </div>
        </div>
      </footer>
    </>
  );
}
