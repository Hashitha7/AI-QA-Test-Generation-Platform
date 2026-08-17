'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Code, Wand2, Copy, Download, CheckCheck, ChevronDown } from 'lucide-react';

const FRAMEWORKS = [
  { id: 'playwright', label: 'Playwright (JS)', color: '#45ba4b' },
  { id: 'cypress', label: 'Cypress', color: '#04c7bc' },
  { id: 'selenium', label: 'Selenium (Python)', color: '#3776AB' },
];

const MOCK_SCRIPTS: Record<string, string> = {
  playwright: `import { test, expect } from '@playwright/test';

test.describe('User Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://app.example.com/login');
  });

  test('TC-001: Successful login with valid credentials', async ({ page }) => {
    // Arrange: Fill in valid user credentials
    await page.fill('[data-testid="email-input"]', 'qa@example.com');
    await page.fill('[data-testid="password-input"]', 'SecurePass@123');
    
    // Act: Click the login button
    await page.click('[data-testid="login-btn"]');
    
    // Assert: Verify user is redirected to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-toast"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('TC-002: Login fails with incorrect password', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', 'qa@example.com');
    await page.fill('[data-testid="password-input"]', 'WrongPassword!');
    await page.click('[data-testid="login-btn"]');
    
    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Invalid email or password');
    await expect(page).toHaveURL('/login');
  });

  test('TC-003: Validation error for empty email field', async ({ page }) => {
    await page.fill('[data-testid="password-input"]', 'AnyPassword123');
    await page.click('[data-testid="login-btn"]');
    
    await expect(page.locator('[data-testid="email-error"]'))
      .toContainText('Email is required');
  });
});`,
  cypress: `describe('User Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('TC-001: Successful login with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('qa@example.com');
    cy.get('[data-testid="password-input"]').type('SecurePass@123');
    cy.get('[data-testid="login-btn"]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-toast"]').should('be.visible');
    cy.get('h1').should('contain', 'Dashboard');
  });

  it('TC-002: Login fails with incorrect password', () => {
    cy.get('[data-testid="email-input"]').type('qa@example.com');
    cy.get('[data-testid="password-input"]').type('WrongPassword!');
    cy.get('[data-testid="login-btn"]').click();

    cy.get('[data-testid="error-message"]')
      .should('contain', 'Invalid email or password');
    cy.url().should('include', '/login');
  });

  it('TC-003: Validation error for empty email', () => {
    cy.get('[data-testid="password-input"]').type('AnyPassword');
    cy.get('[data-testid="login-btn"]').click();
    cy.get('[data-testid="email-error"]').should('contain', 'Email is required');
  });
});`,
  selenium: `import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestUserLogin:
    BASE_URL = "https://app.example.com"

    @pytest.fixture(autouse=True)
    def setup_teardown(self):
        self.driver = webdriver.Chrome()
        self.driver.get(f"{self.BASE_URL}/login")
        self.wait = WebDriverWait(self.driver, 10)
        yield
        self.driver.quit()

    def test_tc001_successful_login(self):
        """TC-001: Verify successful login with valid credentials."""
        self.driver.find_element(By.CSS_SELECTOR, '[data-testid="email-input"]').send_keys('qa@example.com')
        self.driver.find_element(By.CSS_SELECTOR, '[data-testid="password-input"]').send_keys('SecurePass@123')
        self.driver.find_element(By.CSS_SELECTOR, '[data-testid="login-btn"]').click()

        self.wait.until(EC.url_contains('/dashboard'))
        welcome = self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, '[data-testid="welcome-toast"]')))
        assert welcome.is_displayed()

    def test_tc002_login_invalid_password(self):
        """TC-002: Verify login fails with incorrect password."""
        self.driver.find_element(By.CSS_SELECTOR, '[data-testid="email-input"]').send_keys('qa@example.com')
        self.driver.find_element(By.CSS_SELECTOR, '[data-testid="password-input"]').send_keys('WrongPassword!')
        self.driver.find_element(By.CSS_SELECTOR, '[data-testid="login-btn"]').click()

        error = self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, '[data-testid="error-message"]')))
        assert 'Invalid email or password' in error.text`,
};

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 1rem', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>
          {copied ? <><CheckCheck size={14} color="var(--success)" /> Copied!</> : <><Copy size={14} /> Copy</>}
        </button>
      </div>
      <pre style={{
        margin: 0,
        padding: '1.5rem',
        background: 'rgba(0,0,0,0.4)',
        overflowX: 'auto',
        fontSize: '0.82rem',
        lineHeight: 1.7,
        color: '#e2e8f0',
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function ScripterPage() {
  const [manualSteps, setManualSteps] = useState('');
  const [framework, setFramework] = useState('playwright');
  const [generatedScript, setGeneratedScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedFw = FRAMEWORKS.find((f) => f.id === framework)!;

  const handleGenerate = async () => {
    if (!manualSteps.trim()) return;
    setLoading(true);
    setGeneratedScript('');
    try {
      const res = await api.generateScript(manualSteps, framework);
      setGeneratedScript(res.script);
    } catch (e) {
      console.error(e);
      alert('Failed to generate script');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ padding: '2rem 3rem', width: '100%', maxWidth: '1300px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Code size={28} color="var(--accent-secondary)" />
              <h1 className="text-3xl font-bold">Auto-Scripter</h1>
            </div>
            <p className="text-secondary" style={{ marginBottom: '2rem' }}>
              Write manual test steps in plain English and get production-ready automation scripts instantly.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Input Panel */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 className="text-lg font-semibold">Manual Steps</h2>
                {/* Framework Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-color)', borderRadius: '8px',
                      color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem'
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: selectedFw.color, display: 'inline-block' }} />
                    {selectedFw.label}
                    <ChevronDown size={14} />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        style={{
                          position: 'absolute', right: 0, top: '110%', background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.5rem',
                          zIndex: 20, minWidth: '160px'
                        }}
                      >
                        {FRAMEWORKS.map((fw) => (
                          <button
                            key={fw.id}
                            onClick={() => { setFramework(fw.id); setDropdownOpen(false); }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.6rem',
                              width: '100%', padding: '0.5rem 0.75rem',
                              background: framework === fw.id ? 'rgba(255,255,255,0.07)' : 'none',
                              border: 'none', borderRadius: '6px',
                              color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left'
                            }}
                          >
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: fw.color, display: 'inline-block' }} />
                            {fw.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <textarea
                id="manual-steps-input"
                value={manualSteps}
                onChange={(e) => setManualSteps(e.target.value)}
                placeholder={`1. Navigate to the login page\n2. Enter "qa@example.com" in the email field\n3. Enter "SecurePass@123" in the password field\n4. Click the Login button\n5. Verify the user is redirected to the Dashboard\n6. Verify a welcome message is displayed`}
                style={{
                  width: '100%',
                  minHeight: '280px',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                  outline: 'none',
                  lineHeight: 1.7,
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
              />

              <button
                id="generate-script-btn"
                className="btn-primary"
                onClick={handleGenerate}
                disabled={loading || !manualSteps.trim()}
                style={{
                  marginTop: '1.25rem', width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  opacity: loading || !manualSteps.trim() ? 0.6 : 1,
                  cursor: loading || !manualSteps.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />Converting to Code…</>
                ) : (
                  <><Wand2 size={16} /> Convert to {selectedFw.label}</>
                )}
              </button>
            </motion.div>

            {/* Output Panel */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 className="text-lg font-semibold">Generated Script</h2>
                {generatedScript && (
                  <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                    <Download size={14} /> Download
                  </button>
                )}
              </div>
              <AnimatePresence mode="wait">
                {generatedScript ? (
                  <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <CodeBlock code={generatedScript} />
                  </motion.div>
                ) : (
                  <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                    minHeight: '280px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: '2px dashed var(--border-color)', borderRadius: '10px', color: 'var(--text-muted)',
                    textAlign: 'center', padding: '2rem'
                  }}>
                    <Code size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <p style={{ fontSize: '0.9rem' }}>Your generated script will appear here.</p>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Enter your manual test steps and click Convert.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
