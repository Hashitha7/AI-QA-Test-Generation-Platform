const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  async generateTestCases(requirements: string) {
    const res = await fetch(`${API_BASE_URL}/generate-test-cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requirements })
    });
    if (!res.ok) throw new Error('Failed to generate test cases');
    return res.json();
  },

  async getTestCases() {
    const res = await fetch(`${API_BASE_URL}/test-cases`);
    if (!res.ok) throw new Error('Failed to fetch test cases');
    return res.json();
  },

  async generateScript(manualSteps: string, framework: string) {
    const res = await fetch(`${API_BASE_URL}/generate-script`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manual_steps: manualSteps, framework })
    });
    if (!res.ok) throw new Error('Failed to generate script');
    return res.json();
  },

  async getDefects(status?: string, severity?: string) {
    let url = `${API_BASE_URL}/defects?`;
    if (status) url += `status=${status}&`;
    if (severity) url += `severity=${severity}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch defects');
    return res.json();
  },

  async analyzeDefect(description: string, stackTrace: string = '') {
    const res = await fetch(`${API_BASE_URL}/defects/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ defect_description: description, stack_trace: stackTrace })
    });
    if (!res.ok) throw new Error('Failed to analyze defect');
    return res.json();
  },

  async getRuns(status?: string) {
    let url = `${API_BASE_URL}/runs?`;
    if (status) url += `status=${status}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch runs');
    return res.json();
  },

  async triggerRun() {
    const res = await fetch(`${API_BASE_URL}/runs/trigger`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to trigger run');
    return res.json();
  }
};
