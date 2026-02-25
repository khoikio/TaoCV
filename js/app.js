// ============================================================
// app.js - Main application logic
// ============================================================

let currentTemplate = 1;
let debounceTimer = null;
const DEBOUNCE_MS = 300;

// ─── Data Model ──────────────────────────────────────────────
function getDefaultData() {
  return {
    personal: { name: '', title: '', email: '', phone: '', address: '', dob: '', avatar: '', linkedin: '' },
    objective: '',
    experience: [{ company: '', position: '', startDate: '', endDate: '', current: false, description: '' }],
    education: [{ school: '', major: '', startYear: '', endYear: '', grade: '' }],
    skills: [{ name: '', level: 'Tốt' }],
    certificates: [{ name: '' }],
    activities: [{ name: '', description: '' }],
    research: [{ title: '', role: '', year: '', description: '' }]
  };
}

// Per-template color map (default colors matching each template's primary accent)
const DEFAULT_COLORS = {
  1: '#2c3e50',
  2: '#1a73e8',
  3: '#34495e',
  4: '#6c63ff',
  5: '#c9a84c'
};
let templateColors = { ...DEFAULT_COLORS };

let cvData = getDefaultData();

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  bindFormEvents();
  bindAvatarUpload();
  bindTemplateSwitch();
  bindColorPicker();
  bindExportBtn();
  bindClearBtn();
  renderDynamicSections();
  updatePreview();
});

// ─── Storage ─────────────────────────────────────────────────
function loadFromStorage() {
  const saved = Storage.load();
  if (saved) {
    cvData = saved;
    // Ensure research array exists in older saved data
    if (!cvData.research) cvData.research = [{ title: '', role: '', year: '', description: '' }];
    currentTemplate = Storage.loadTemplate();
    const savedColors = Storage.loadColors();
    if (savedColors) templateColors = { ...DEFAULT_COLORS, ...savedColors };
    populateForm();
  }
  updateTemplateActive();
  applyColorToPreview();
}

function saveToStorage() {
  Storage.save(cvData);
  Storage.saveTemplate(currentTemplate);
  Storage.saveColors(templateColors);
}

// ─── Form Binding ─────────────────────────────────────────────
function bindFormEvents() {
  // Personal fields
  const personalFields = ['name', 'title', 'email', 'phone', 'address', 'dob', 'linkedin'];
  personalFields.forEach(field => {
    const el = document.getElementById(`p_${field}`);
    if (el) {
      el.addEventListener('input', () => {
        cvData.personal[field] = el.value;
        scheduleUpdate();
      });
    }
  });

  // Objective
  const objEl = document.getElementById('objective');
  if (objEl) {
    objEl.addEventListener('input', () => {
      cvData.objective = objEl.value;
      scheduleUpdate();
    });
  }
}

// ─── Avatar Upload ────────────────────────────────────────────
function bindAvatarUpload() {
  const input = document.getElementById('avatar-input');
  const preview = document.getElementById('avatar-preview');
  const dropzone = document.getElementById('avatar-dropzone');

  if (!input) return;

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleAvatarFile(file);
  });

  // click dropzone
  if (dropzone) {
    dropzone.addEventListener('click', () => input.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleAvatarFile(file);
    });
  }

  // Remove avatar button
  const removeBtn = document.getElementById('avatar-remove');
  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cvData.personal.avatar = '';
      updateAvatarPreview('');
      scheduleUpdate();
    });
  }
}

function handleAvatarFile(file) {
  if (!file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result;
    cvData.personal.avatar = base64;
    updateAvatarPreview(base64);
    scheduleUpdate();
  };
  reader.readAsDataURL(file);
}

function updateAvatarPreview(src) {
  const preview = document.getElementById('avatar-preview');
  const removeBtn = document.getElementById('avatar-remove');
  const dropText = document.getElementById('drop-text');
  if (preview) {
    if (src) {
      preview.src = src;
      preview.style.display = 'block';
      if (removeBtn) removeBtn.style.display = 'flex';
      if (dropText) dropText.style.display = 'none';
    } else {
      preview.style.display = 'none';
      if (removeBtn) removeBtn.style.display = 'none';
      if (dropText) dropText.style.display = 'block';
    }
  }
}

// ─── Dynamic Sections ─────────────────────────────────────────
function renderDynamicSections() {
  renderExperience();
  renderEducation();
  renderSkills();
  renderCertificates();
  renderActivities();
  renderResearch();
}

function renderResearch() {
  const container = document.getElementById('research-list');
  if (!container) return;
  const list = cvData.research || [];
  container.innerHTML = list.map((r, i) => `
    <div class="dynamic-item" data-index="${i}">
      <div class="dynamic-item-header">
        <span class="item-number">Nghiên cứu #${i + 1}</span>
        <button class="btn-remove-item" onclick="removeItem('research', ${i})">✕</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Tên đề tài</label>
          <input type="text" value="${escVal(r.title)}" oninput="updateItem('research', ${i}, 'title', this.value)" placeholder="Nghiên cứu về...">
        </div>
        <div class="form-group">
          <label>Vai trò</label>
          <input type="text" value="${escVal(r.role)}" oninput="updateItem('research', ${i}, 'role', this.value)" placeholder="Trưởng nhóm, Thành viên...">
        </div>
      </div>
      <div class="form-group">
        <label>Năm / Thời gian</label>
        <input type="text" value="${escVal(r.year)}" oninput="updateItem('research', ${i}, 'year', this.value)" placeholder="2023 hoặc 01/2023 – 06/2023">
      </div>
      <div class="form-group">
        <label>Mô tả / Kết quả</label>
        <textarea rows="3" oninput="updateItem('research', ${i}, 'description', this.value)" placeholder="Mô tả nội dung, kết quả, giải thưởng...">${escTextarea(r.description)}</textarea>
      </div>
    </div>
  `).join('');
}

function renderExperience() {
  const container = document.getElementById('exp-list');
  if (!container) return;
  container.innerHTML = cvData.experience.map((e, i) => `
    <div class="dynamic-item" data-index="${i}">
      <div class="dynamic-item-header">
        <span class="item-number">Kinh nghiệm #${i + 1}</span>
        <button class="btn-remove-item" onclick="removeItem('experience', ${i})">✕</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Tên công ty</label>
          <input type="text" value="${escVal(e.company)}" oninput="updateItem('experience', ${i}, 'company', this.value)" placeholder="Tên công ty / tổ chức">
        </div>
        <div class="form-group">
          <label>Vị trí</label>
          <input type="text" value="${escVal(e.position)}" oninput="updateItem('experience', ${i}, 'position', this.value)" placeholder="Kỹ sư phần mềm, Designer...">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Từ tháng/năm</label>
          <input type="text" value="${escVal(e.startDate)}" oninput="updateItem('experience', ${i}, 'startDate', this.value)" placeholder="01/2023">
        </div>
        <div class="form-group">
          <label>Đến tháng/năm</label>
          <input type="text" value="${escVal(e.endDate)}" oninput="updateItem('experience', ${i}, 'endDate', this.value)" placeholder="12/2024" ${e.current ? 'disabled' : ''}>
        </div>
      </div>
      <div class="form-group checkbox-group">
        <label><input type="checkbox" ${e.current ? 'checked' : ''} onchange="updateItemBool('experience', ${i}, 'current', this.checked)"> Đang làm việc tại đây</label>
      </div>
      <div class="form-group">
        <label>Mô tả công việc</label>
        <textarea rows="4" oninput="updateItem('experience', ${i}, 'description', this.value)" placeholder="- Mô tả các nhiệm vụ, thành tích&#10;- Mỗi dòng một điểm">${escTextarea(e.description)}</textarea>
      </div>
    </div>
  `).join('');
}

function renderEducation() {
  const container = document.getElementById('edu-list');
  if (!container) return;
  container.innerHTML = cvData.education.map((e, i) => `
    <div class="dynamic-item" data-index="${i}">
      <div class="dynamic-item-header">
        <span class="item-number">Học vấn #${i + 1}</span>
        <button class="btn-remove-item" onclick="removeItem('education', ${i})">✕</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Trường học</label>
          <input type="text" value="${escVal(e.school)}" oninput="updateItem('education', ${i}, 'school', this.value)" placeholder="Đại học Bách Khoa...">
        </div>
        <div class="form-group">
          <label>Ngành học</label>
          <input type="text" value="${escVal(e.major)}" oninput="updateItem('education', ${i}, 'major', this.value)" placeholder="Công nghệ thông tin...">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Năm bắt đầu</label>
          <input type="text" value="${escVal(e.startYear)}" oninput="updateItem('education', ${i}, 'startYear', this.value)" placeholder="2019">
        </div>
        <div class="form-group">
          <label>Năm kết thúc</label>
          <input type="text" value="${escVal(e.endYear)}" oninput="updateItem('education', ${i}, 'endYear', this.value)" placeholder="2023">
        </div>
        <div class="form-group">
          <label>Xếp loại</label>
          <input type="text" value="${escVal(e.grade)}" oninput="updateItem('education', ${i}, 'grade', this.value)" placeholder="Giỏi, Khá...">
        </div>
      </div>
    </div>
  `).join('');
}

function renderSkills() {
  const container = document.getElementById('skill-list');
  if (!container) return;
  const levels = ['Cơ bản', 'Tốt', 'Khá', 'Giỏi', 'Thành thạo', 'Chuyên gia'];
  container.innerHTML = cvData.skills.map((s, i) => `
    <div class="dynamic-item skill-item" data-index="${i}">
      <div class="form-row form-row-tight">
        <div class="form-group flex-2">
          <input type="text" value="${escVal(s.name)}" oninput="updateItem('skills', ${i}, 'name', this.value)" placeholder="Kỹ năng (VD: Photoshop, Python...)">
        </div>
        <div class="form-group flex-1">
          <select onchange="updateItem('skills', ${i}, 'level', this.value)">
            ${levels.map(l => `<option value="${l}" ${s.level === l ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </div>
        <button class="btn-remove-item btn-remove-inline" onclick="removeItem('skills', ${i})">✕</button>
      </div>
    </div>
  `).join('');
}

function renderCertificates() {
  const container = document.getElementById('cert-list');
  if (!container) return;
  container.innerHTML = cvData.certificates.map((c, i) => `
    <div class="dynamic-item skill-item" data-index="${i}">
      <div class="form-row form-row-tight">
        <div class="form-group flex-2">
          <input type="text" value="${escVal(c.name)}" oninput="updateItem('certificates', ${i}, 'name', this.value)" placeholder="VD: IELTS 7.0, AWS Certified...">
        </div>
        <button class="btn-remove-item btn-remove-inline" onclick="removeItem('certificates', ${i})">✕</button>
      </div>
    </div>
  `).join('');
}

function renderActivities() {
  const container = document.getElementById('act-list');
  if (!container) return;
  container.innerHTML = cvData.activities.map((a, i) => `
    <div class="dynamic-item" data-index="${i}">
      <div class="dynamic-item-header">
        <span class="item-number">Hoạt động #${i + 1}</span>
        <button class="btn-remove-item" onclick="removeItem('activities', ${i})">✕</button>
      </div>
      <div class="form-group">
        <label>Tên hoạt động</label>
        <input type="text" value="${escVal(a.name)}" oninput="updateItem('activities', ${i}, 'name', this.value)" placeholder="Tình nguyện viên, CLB...">
      </div>
      <div class="form-group">
        <label>Mô tả</label>
        <textarea rows="3" oninput="updateItem('activities', ${i}, 'description', this.value)" placeholder="Mô tả hoạt động...">${escTextarea(a.description)}</textarea>
      </div>
    </div>
  `).join('');
}

// ─── Item helpers ────────────────────────────────────────────
function updateItem(section, index, field, value) {
  cvData[section][index][field] = value;
  scheduleUpdate();
}

function updateItemBool(section, index, field, value) {
  cvData[section][index][field] = value;
  renderExperience(); // re-render to toggle disabled
  scheduleUpdate();
}

function removeItem(section, index) {
  if (cvData[section].length <= 1) return;
  cvData[section].splice(index, 1);
  renderSection(section);
  scheduleUpdate();
}

function renderSection(section) {
  const map = {
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    certificates: renderCertificates,
    activities: renderActivities,
    research: renderResearch,
  };
  if (map[section]) map[section]();
}

// Add item buttons
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  const section = btn.dataset.add;
  const defaults = {
    experience: { company: '', position: '', startDate: '', endDate: '', current: false, description: '' },
    education: { school: '', major: '', startYear: '', endYear: '', grade: '' },
    skills: { name: '', level: 'Tốt' },
    certificates: { name: '' },
    activities: { name: '', description: '' },
    research: { title: '', role: '', year: '', description: '' },
  };
  if (defaults[section]) {
    if (!cvData[section]) cvData[section] = [];
    cvData[section].push({ ...defaults[section] });
    renderSection(section);
    scheduleUpdate();
  }
});

// ─── Template Switching ───────────────────────────────────────
function bindTemplateSwitch() {
  document.querySelectorAll('.template-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      currentTemplate = parseInt(thumb.dataset.template, 10);
      updateTemplateActive();
      applyColorToPreview();
      syncColorPickerUI();
      updatePreview();
      saveToStorage();
    });
  });
}

function updateTemplateActive() {
  document.querySelectorAll('.template-thumb').forEach(thumb => {
    thumb.classList.toggle('active', parseInt(thumb.dataset.template, 10) === currentTemplate);
  });
}

// ─── Color Picker ─────────────────────────────────────────────
function bindColorPicker() {
  const picker = document.getElementById('template-color-picker');
  const resetBtn = document.getElementById('color-reset-btn');
  const swatches = document.querySelectorAll('.color-swatch');

  if (picker) {
    picker.addEventListener('input', (e) => {
      templateColors[currentTemplate] = e.target.value;
      applyColorToPreview();
      saveToStorage();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      templateColors[currentTemplate] = DEFAULT_COLORS[currentTemplate];
      syncColorPickerUI();
      applyColorToPreview();
      saveToStorage();
      updatePreview();
    });
  }

  swatches.forEach(sw => {
    sw.addEventListener('click', () => {
      const color = sw.dataset.color;
      templateColors[currentTemplate] = color;
      syncColorPickerUI();
      applyColorToPreview();
      saveToStorage();
      updatePreview();
    });
  });

  syncColorPickerUI();
}

function syncColorPickerUI() {
  const picker = document.getElementById('template-color-picker');
  if (picker) picker.value = templateColors[currentTemplate] || DEFAULT_COLORS[currentTemplate];
}

function applyColorToPreview() {
  const preview = document.getElementById('cv-preview');
  if (!preview) return;
  const color = templateColors[currentTemplate] || DEFAULT_COLORS[currentTemplate];
  preview.style.setProperty('--cv-color', color);
  // Generate a lighter version for backgrounds
  preview.style.setProperty('--cv-color-light', hexToRgba(color, 0.1));
  preview.style.setProperty('--cv-color-mid', hexToRgba(color, 0.15));
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── Preview ──────────────────────────────────────────────────
function scheduleUpdate() {
  saveToStorage();
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(updatePreview, DEBOUNCE_MS);
}

function updatePreview() {
  const container = document.getElementById('cv-preview');
  if (!container) return;
  const color = templateColors[currentTemplate] || DEFAULT_COLORS[currentTemplate];
  container.innerHTML = Templates.render(currentTemplate, cvData, color);
  applyColorToPreview();
}

// ─── Export ───────────────────────────────────────────────────
function bindExportBtn() {
  const btn = document.getElementById('btn-export');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const container = document.getElementById('cv-preview');
    const name = cvData.personal.name || 'my-cv';
    PDFExporter.export(container, `CV-${name.replace(/\s+/g, '-')}.pdf`);
  });
}

// ─── Clear Data ───────────────────────────────────────────────
function bindClearBtn() {
  const btn = document.getElementById('btn-clear');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (!confirm('Xóa toàn bộ dữ liệu CV? Hành động này không thể hoàn tác.')) return;
    Storage.clear();
    cvData = getDefaultData();
    currentTemplate = 1;
    templateColors = { ...DEFAULT_COLORS };
    syncColorPickerUI();
    populateForm();
    renderDynamicSections();
    updateTemplateActive();
    applyColorToPreview();
    updatePreview();
  });
}

// ─── Populate form from data (khi load từ storage) ───────────
function populateForm() {
  const p = cvData.personal || {};
  ['name', 'title', 'email', 'phone', 'address', 'dob', 'linkedin'].forEach(f => {
    const el = document.getElementById(`p_${f}`);
    if (el) el.value = p[f] || '';
  });
  const obj = document.getElementById('objective');
  if (obj) obj.value = cvData.objective || '';
  if (p.avatar) updateAvatarPreview(p.avatar);
}

// ─── Utils ───────────────────────────────────────────────────
// For input value= attributes (escape HTML but keep quotes safe)
function escVal(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// For textarea innerHTML (only escape < and & to prevent XSS, newlines are preserved)
function escTextarea(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Mobile Support ───────────────────────────────────────────

// Switch between Form and Preview panels on mobile
function switchMobileTab(tab) {
  const formPanel = document.getElementById('panel-form');
  const previewPanel = document.getElementById('panel-preview');
  const tabForm = document.getElementById('tab-form');
  const tabPreview = document.getElementById('tab-preview');
  if (!formPanel || !previewPanel) return;

  if (tab === 'form') {
    formPanel.classList.remove('mobile-hidden');
    previewPanel.classList.add('mobile-hidden');
    tabForm.classList.add('active');
    tabPreview.classList.remove('active');
  } else {
    formPanel.classList.add('mobile-hidden');
    previewPanel.classList.remove('mobile-hidden');
    tabPreview.classList.add('active');
    tabForm.classList.remove('active');
    // Recalc scale each time user switches to preview
    applyMobileScale();
  }
}

// Dynamically scale the CV preview to fit screen width on mobile
function applyMobileScale() {
  if (window.innerWidth > 768) return;
  const preview = document.getElementById('cv-preview');
  if (!preview) return;
  const padding = 16; // 8px each side from preview-scroll padding
  const availableWidth = window.innerWidth - padding * 2;
  const cvWidth = 794; // A4 width in px
  const scale = Math.min(1, availableWidth / cvWidth);
  preview.style.setProperty('--mobile-scale', scale);
  // Correct container height so the page scrolls properly
  preview.style.marginBottom = `${(scale - 1) * 1123}px`;
}

// Run on load and resize
window.addEventListener('resize', applyMobileScale);
applyMobileScale();

