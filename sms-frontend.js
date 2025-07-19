// Frontline SMS Frontend Integration for SME Connect
// This enhances the existing script.js with SMS API integration

class SMESMSManager {
  constructor() {
    this.apiBase = 'http://localhost:3001/api';
    this.webhookUrl = 'http://localhost:3001/webhook/sms';
    this.isAdmin = window.location.search.includes('admin=1');
    this.init();
  }

  async init() {
    await this.setupEventListeners();
    await this.loadSMSData();
    if (this.isAdmin) {
      this.setupAdminFeatures();
    }
  }

  async setupEventListeners() {
    // Enhanced registration form
    const webRegForm = document.getElementById('web-register-form');
    if (webRegForm) {
      webRegForm.addEventListener('submit', (e) => this.handleWebRegistration(e));
    }

    // Quick phone registration
    const quickPhoneForm = document.getElementById('quick-phone-form');
    if (quickPhoneForm) {
      quickPhoneForm.addEventListener('submit', (e) => this.handleQuickRegistration(e));
    }

    // SMS status indicators
    this.setupSMSStatusIndicators();
  }

  setupSMSStatusIndicators() {
    // Add SMS status to the join section
    const joinSection = document.getElementById('join');
    if (joinSection) {
      const smsStatus = document.createElement('div');
      smsStatus.id = 'sms-status';
      smsStatus.className = 'sms-status-indicator';
      smsStatus.innerHTML = `
        <div class="sms-status-content">
          <span class="sms-icon">📱</span>
          <span class="sms-text">SMS System: <span id="sms-status-text">Checking...</span></span>
        </div>
      `;
      joinSection.querySelector('.container').insertBefore(smsStatus, joinSection.querySelector('.membership-tiers'));
    }
  }

  async checkSMSStatus() {
    try {
      const response = await fetch(`${this.apiBase.replace('/api', '')}/health`);
      const status = await response.json();
      const statusText = document.getElementById('sms-status-text');
      if (statusText) {
        statusText.textContent = 'Online';
        statusText.className = 'status-online';
      }
      return true;
    } catch (error) {
      const statusText = document.getElementById('sms-status-text');
      if (statusText) {
        statusText.textContent = 'Offline';
        statusText.className = 'status-offline';
      }
      return false;
    }
  }

  async handleWebRegistration(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      tier: form.tier.value,
      name: form.name.value,
      phone: form.phone.value,
      province: form.province.value,
      language: form.language.value,
      source: 'web'
    };

    try {
      // Save locally
      this.saveRegistration(data);
      
      // Send welcome SMS if phone is provided
      if (data.phone) {
        await this.sendWelcomeSMS(data.phone, data.language);
      }

      this.showNotification('Registration successful! Welcome to SME Connect.', 'success');
      form.reset();
    } catch (error) {
      this.showNotification('Registration saved locally. SMS service temporarily unavailable.', 'warning');
      form.reset();
    }
  }

  async handleQuickRegistration(e) {
    e.preventDefault();
    const phone = e.target.phone.value;
    if (!phone) return;

    try {
      // Save basic registration
      const data = {
        phone: phone,
        source: 'quick_web',
        registrationDate: new Date().toISOString()
      };
      this.saveRegistration(data);

      // Send SMS registration prompt
      await this.sendSMS(phone, 'Welcome to SME Connect! Reply JOIN to complete your registration by SMS.');

      this.showNotification('Quick registration successful! Check your phone for SMS instructions.', 'success');
      e.target.reset();
    } catch (error) {
      this.showNotification('Registration saved. SMS service temporarily unavailable.', 'warning');
      e.target.reset();
    }
  }

  async sendWelcomeSMS(phone, language = 'English') {
    const messages = {
      English: 'Welcome to SME Connect! You\'re now registered. Reply HELP for assistance, EVENTS for upcoming events, or MENTOR for mentorship.',
      Bemba: 'Mukwai ku SME Connect! Mulembwe. Landa HELP pa assistance, EVENTS pa events, kapena MENTOR pa mentorship.',
      Nyanja: 'Takulandilani ku SME Connect! Mulembetsa. Tumizani HELP pa assistance, EVENTS pa events, kapena MENTOR pa mentorship.'
    };

    const message = messages[language] || messages.English;
    await this.sendSMS(phone, message);
  }

  async sendSMS(phone, message) {
    try {
      const response = await fetch(`${this.apiBase}/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: phone, message })
      });

      if (!response.ok) {
        throw new Error('Failed to send SMS');
      }

      return await response.json();
    } catch (error) {
      console.error('SMS send error:', error);
      throw error;
    }
  }

  async loadSMSData() {
    try {
      // Check SMS status
      await this.checkSMSStatus();

      // Load registrations from API if available
      const response = await fetch(`${this.apiBase}/registrations`);
      if (response.ok) {
        const apiRegistrations = await response.json();
        // Merge with local registrations
        const localRegistrations = this.getRegistrations();
        const merged = [...localRegistrations, ...apiRegistrations];
        localStorage.setItem('sme_registrations', JSON.stringify(merged));
      }
    } catch (error) {
      console.log('Using local data only');
    }
  }

  setupAdminFeatures() {
    // Add admin dashboard elements
    this.createAdminDashboard();
    this.setupBulkSMSCampaign();
    this.setupSMSAnalytics();
  }

  createAdminDashboard() {
    const adminSection = document.createElement('section');
    adminSection.id = 'admin-dashboard';
    adminSection.className = 'section admin-dashboard';
    adminSection.innerHTML = `
      <div class="container">
        <h2>Admin Dashboard</h2>
        <div class="admin-grid">
          <div class="admin-card">
            <h3>SMS Statistics</h3>
            <div id="sms-stats">
              <div class="stat-item">
                <span class="stat-label">Total Registrations:</span>
                <span id="total-registrations">Loading...</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">SMS Sent Today:</span>
                <span id="sms-sent-today">Loading...</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Active Users:</span>
                <span id="active-users">Loading...</span>
              </div>
            </div>
          </div>
          
          <div class="admin-card">
            <h3>Quick Actions</h3>
            <div class="admin-actions">
              <button id="export-registrations" class="admin-btn">Export Registrations</button>
              <button id="export-sms-logs" class="admin-btn">Export SMS Logs</button>
              <button id="send-bulk-sms" class="admin-btn">Send Bulk SMS</button>
            </div>
          </div>
          
          <div class="admin-card">
            <h3>Recent SMS Activity</h3>
            <div id="recent-sms-activity" class="sms-activity-list">
              Loading recent activity...
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert after the join section
    const joinSection = document.getElementById('join');
    if (joinSection) {
      joinSection.parentNode.insertBefore(adminSection, joinSection.nextSibling);
    }

    // Setup admin event listeners
    this.setupAdminEventListeners();
  }

  setupAdminEventListeners() {
    document.getElementById('export-registrations')?.addEventListener('click', () => this.exportData('registrations'));
    document.getElementById('export-sms-logs')?.addEventListener('click', () => this.exportData('sms-logs'));
    document.getElementById('send-bulk-sms')?.addEventListener('click', () => this.showBulkSMSModal());
  }

  setupBulkSMSCampaign() {
    const modal = document.createElement('div');
    modal.id = 'bulk-sms-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Send Bulk SMS Campaign</h3>
        <form id="bulk-sms-form">
          <div class="form-group">
            <label>Message:</label>
            <textarea name="message" required placeholder="Enter your message..."></textarea>
          </div>
          <div class="form-group">
            <label>Filters:</label>
            <select name="tier">
              <option value="">All Tiers</option>
              <option value="Basic">Basic</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Institutional">Institutional</option>
            </select>
            <select name="province">
              <option value="">All Provinces</option>
              <option value="Lusaka">Lusaka</option>
              <option value="Copperbelt">Copperbelt</option>
              <option value="Southern">Southern</option>
              <option value="Northern">Northern</option>
              <option value="Eastern">Eastern</option>
              <option value="Western">Western</option>
              <option value="North-Western">North-Western</option>
              <option value="Luapula">Luapula</option>
              <option value="Muchinga">Muchinga</option>
            </select>
            <select name="language">
              <option value="">All Languages</option>
              <option value="English">English</option>
              <option value="Bemba">Bemba</option>
              <option value="Nyanja">Nyanja</option>
              <option value="Lozi">Lozi</option>
              <option value="Tonga">Tonga</option>
              <option value="Kaonde">Kaonde</option>
              <option value="Luvale">Luvale</option>
              <option value="Lunda">Lunda</option>
            </select>
          </div>
          <button type="submit" class="admin-btn">Send Campaign</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Modal functionality
    const modalElement = document.getElementById('bulk-sms-modal');
    const closeBtn = modalElement.querySelector('.close');
    
    closeBtn.onclick = () => modalElement.style.display = 'none';
    window.onclick = (event) => {
      if (event.target === modalElement) {
        modalElement.style.display = 'none';
      }
    };

    // Bulk SMS form handler
    document.getElementById('bulk-sms-form').addEventListener('submit', (e) => this.handleBulkSMS(e));
  }

  async handleBulkSMS(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      message: form.message.value,
      filters: {
        tier: form.tier.value || undefined,
        province: form.province.value || undefined,
        language: form.language.value || undefined
      }
    };

    try {
      const response = await fetch(`${this.apiBase}/bulk-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (result.success) {
        this.showNotification(result.message, 'success');
        document.getElementById('bulk-sms-modal').style.display = 'none';
        form.reset();
      } else {
        this.showNotification('Failed to send bulk SMS', 'error');
      }
    } catch (error) {
      this.showNotification('Error sending bulk SMS', 'error');
    }
  }

  async exportData(type) {
    try {
      const response = await fetch(`${this.apiBase}/export/${type}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification(`${type} exported successfully`, 'success');
      } else {
        this.showNotification('Export failed', 'error');
      }
    } catch (error) {
      this.showNotification('Export failed', 'error');
    }
  }

  setupSMSAnalytics() {
    // Load and display SMS statistics
    this.loadSMSStats();
    this.loadRecentActivity();
  }

  async loadSMSStats() {
    try {
      const [registrations, logs] = await Promise.all([
        fetch(`${this.apiBase}/registrations`).then(r => r.json()),
        fetch(`${this.apiBase}/sms-logs`).then(r => r.json())
      ]);

      const today = new Date().toISOString().split('T')[0];
      const smsToday = logs.filter(log => 
        log.direction === 'outbound' && 
        log.timestamp.startsWith(today)
      ).length;

      document.getElementById('total-registrations').textContent = registrations.length;
      document.getElementById('sms-sent-today').textContent = smsToday;
      document.getElementById('active-users').textContent = 
        registrations.filter(r => r.registrationDate && 
          new Date(r.registrationDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;
    } catch (error) {
      console.error('Failed to load SMS stats:', error);
    }
  }

  async loadRecentActivity() {
    try {
      const logs = await fetch(`${this.apiBase}/sms-logs`).then(r => r.json());
      const recent = logs.slice(-10).reverse();
      
      const activityList = document.getElementById('recent-sms-activity');
      if (activityList) {
        activityList.innerHTML = recent.map(log => `
          <div class="sms-activity-item">
            <span class="activity-time">${new Date(log.timestamp).toLocaleTimeString()}</span>
            <span class="activity-direction">${log.direction}</span>
            <span class="activity-phone">${log.from || log.to}</span>
            <span class="activity-message">${log.message.substring(0, 30)}${log.message.length > 30 ? '...' : ''}</span>
          </div>
        `).join('');
      }
    } catch (error) {
      console.error('Failed to load recent activity:', error);
    }
  }

  showBulkSMSModal() {
    document.getElementById('bulk-sms-modal').style.display = 'block';
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Utility methods (compatible with existing script.js)
  getRegistrations() {
    return JSON.parse(localStorage.getItem('sme_registrations') || '[]');
  }

  saveRegistration(data) {
    const regs = this.getRegistrations();
    regs.push({...data, date: new Date().toISOString()});
    localStorage.setItem('sme_registrations', JSON.stringify(regs));
  }

  toCSV(rows) {
    if (!rows.length) return '';
    
    const escapeValue = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const header = Object.keys(rows[0]).join(',');
    const body = rows.map(r => 
      Object.values(r).map(v => escapeValue(v)).join(',')
    ).join('\n');

    return header + '\n' + body;
  }
}

// Initialize SMS Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.smeSMSManager = new SMESMSManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SMESMSManager;
} 