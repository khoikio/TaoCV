// ============================================================
// templates.js - 5 CV template renderers
// ============================================================

const Templates = {
    // Helper: escape HTML
    esc(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    },

    // Helper: nl2br
    nl2br(str) {
        if (!str) return '';
        return this.esc(str).replace(/\n/g, '<br>');
    },

    // Helper: render skill level dots (white, for dark sidebar)
    skillDots(level) {
        const levels = { 'Cơ bản': 1, 'Tốt': 2, 'Khá': 2, 'Giỏi': 3, 'Thành thạo': 4, 'Chuyên gia': 5 };
        const filled = levels[level] || 3;
        let html = '<span class="skill-dots">';
        for (let i = 1; i <= 5; i++) {
            html += `<span class="dot" style="background:${i <= filled ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)'}"></span>`;
        }
        html += '</span>';
        return html;
    },

    // Helper: render skill level dots (colored, for light templates)
    skillDotsLight(level) {
        const levels = { 'Cơ bản': 1, 'Tốt': 2, 'Khá': 2, 'Giỏi': 3, 'Thành thạo': 4, 'Chuyên gia': 5 };
        const filled = levels[level] || 3;
        let html = '<span class="skill-dots">';
        for (let i = 1; i <= 5; i++) {
            html += `<span class="dot" style="background:${i <= filled ? 'var(--cv-color, #1a73e8)' : '#ddd'}"></span>`;
        }
        html += '</span>';
        return html;
    },

    // Helper: render research block (shared across templates)
    researchBlock(research, cls) {
        const list = (research || []).filter(r => r.title || r.description);
        if (!list.length) return '';
        const { wrap, title, name, meta, desc } = cls;
        return `
        <div class="${wrap}">
          <div class="${title}">NGHIÊN CỨU KHOA HỌC</div>
          ${list.map(r => `
            <div style="margin-bottom:12px">
              <div class="${name}">${this.esc(r.title)}</div>
              ${(r.role || r.year) ? `<div class="${meta}">${r.role ? this.esc(r.role) : ''}${r.role && r.year ? ' · ' : ''}${r.year ? this.esc(r.year) : ''}</div>` : ''}
              ${r.description ? `<div class="${desc}">${this.nl2br(r.description)}</div>` : ''}
            </div>
          `).join('')}
        </div>`;
    },

    // ============================================================
    // TEMPLATE 1: Classic Sidebar (TopCV style)
    // Dark left sidebar + Light right content
    // ============================================================
    render1(d) {
        const p = d.personal || {};
        const exp = d.experience || [];
        const edu = d.education || [];
        const skills = d.skills || [];
        const certs = d.certificates || [];
        const acts = d.activities || [];
        const research = d.research || [];

        return `
    <div class="cv-template t1">
      <div class="t1-sidebar">
        <div class="t1-avatar-wrap">
          ${p.avatar ? `<img src="${p.avatar}" class="t1-avatar" alt="avatar">` : `<div class="t1-avatar-placeholder"><svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg></div>`}
        </div>
        <div class="t1-name">${this.esc(p.name) || 'Họ và Tên'}</div>
        <div class="t1-title">${this.esc(p.title) || 'Vị trí ứng tuyển'}</div>

        <div class="t1-section-title">LIÊN HỆ</div>
        <div class="t1-contact-list">
          ${p.phone ? `<div class="t1-contact-item"><svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg><span>${this.esc(p.phone)}</span></div>` : ''}
          ${p.email ? `<div class="t1-contact-item"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><span>${this.esc(p.email)}</span></div>` : ''}
          ${p.address ? `<div class="t1-contact-item"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg><span>${this.esc(p.address)}</span></div>` : ''}
          ${p.dob ? `<div class="t1-contact-item"><svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg><span>${this.esc(p.dob)}</span></div>` : ''}
          ${p.linkedin ? `<div class="t1-contact-item"><svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg><span>${this.esc(p.linkedin)}</span></div>` : ''}
        </div>

        ${edu.length ? `
        <div class="t1-section-title">GIÁO DỤC</div>
        ${edu.map(e => `
          <div class="t1-edu-item">
            <div class="t1-edu-year">${this.esc(e.startYear)}${e.startYear && e.endYear ? ' – ' : ''}${this.esc(e.endYear)}</div>
            <div class="t1-edu-major">${this.esc(e.major)}</div>
            <div class="t1-edu-school">${this.esc(e.school)}</div>
            ${e.grade ? `<div class="t1-edu-grade">Loại: ${this.esc(e.grade)}</div>` : ''}
          </div>
        `).join('')}
        ` : ''}

        ${skills.length ? `
        <div class="t1-section-title">KỸ NĂNG</div>
        ${skills.map(s => `
          <div class="t1-skill-item">
            <span class="t1-skill-name">${this.esc(s.name)}</span>
            ${this.skillDots(s.level)}
          </div>
        `).join('')}
        ` : ''}

        ${certs.length ? `
        <div class="t1-section-title">BẰNG CẤP</div>
        <ul class="t1-list">
          ${certs.map(c => `<li>${this.esc(c.name)}</li>`).join('')}
        </ul>
        ` : ''}
      </div>

      <div class="t1-main">
        ${d.objective ? `
        <div class="t1-main-section">
          <div class="t1-main-section-title">MỤC TIÊU NGHỀ NGHIỆP</div>
          <p class="t1-objective">${this.nl2br(d.objective)}</p>
        </div>
        ` : ''}

        ${exp.length ? `
        <div class="t1-main-section">
          <div class="t1-main-section-title">KINH NGHIỆM LÀM VIỆC</div>
          ${exp.map(e => `
            <div class="t1-exp-item">
              <div class="t1-exp-header">
                <div>
                  <div class="t1-exp-company">${this.esc(e.company)}</div>
                  <div class="t1-exp-position">${this.esc(e.position)}</div>
                </div>
                <div class="t1-exp-date">${this.esc(e.startDate)}${e.startDate || e.endDate ? ' – ' : ''}${e.current ? 'Hiện tại' : this.esc(e.endDate)}</div>
              </div>
              ${e.description ? `<div class="t1-exp-desc">${this.nl2br(e.description)}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${acts.length ? `
        <div class="t1-main-section">
          <div class="t1-main-section-title">HOẠT ĐỘNG</div>
          ${acts.map(a => `
            <div class="t1-act-item">
              <div class="t1-act-name">${this.esc(a.name)}</div>
              ${a.description ? `<div class="t1-act-desc">${this.nl2br(a.description)}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${this.researchBlock(research, {
            wrap: 't1-main-section',
            title: 't1-main-section-title',
            name: 't1-exp-company',
            meta: 't1-exp-position',
            desc: 't1-exp-desc'
        })}
      </div>
    </div>`;
    },

    // ============================================================
    // TEMPLATE 2: Modern Minimal (Single column, color accent)
    // ============================================================
    render2(d) {
        const p = d.personal || {};
        const exp = d.experience || [];
        const edu = d.education || [];
        const skills = d.skills || [];
        const certs = d.certificates || [];
        const acts = d.activities || [];
        const research = d.research || [];

        return `
    <div class="cv-template t2">
      <div class="t2-header">
        <div class="t2-header-left">
          ${p.avatar ? `<img src="${p.avatar}" class="t2-avatar" alt="avatar">` : '<div class="t2-avatar-placeholder"></div>'}
        </div>
        <div class="t2-header-right">
          <h1 class="t2-name">${this.esc(p.name) || 'Họ và Tên'}</h1>
          <div class="t2-title">${this.esc(p.title) || 'Vị trí ứng tuyển'}</div>
          <div class="t2-contact-row">
            ${p.phone ? `<span>📞 ${this.esc(p.phone)}</span>` : ''}
            ${p.email ? `<span>✉ ${this.esc(p.email)}</span>` : ''}
            ${p.address ? `<span>📍 ${this.esc(p.address)}</span>` : ''}
            ${p.dob ? `<span>🎂 ${this.esc(p.dob)}</span>` : ''}
          </div>
        </div>
      </div>

      <div class="t2-body">
        ${d.objective ? `
        <div class="t2-section">
          <div class="t2-section-title">MỤC TIÊU NGHỀ NGHIỆP</div>
          <div class="t2-divider"></div>
          <p class="t2-text">${this.nl2br(d.objective)}</p>
        </div>
        ` : ''}

        ${exp.length ? `
        <div class="t2-section">
          <div class="t2-section-title">KINH NGHIỆM LÀM VIỆC</div>
          <div class="t2-divider"></div>
          ${exp.map(e => `
            <div class="t2-exp-item">
              <div class="t2-exp-dot"></div>
              <div class="t2-exp-content">
                <div class="t2-exp-top">
                  <span class="t2-exp-company">${this.esc(e.company)}</span>
                  <span class="t2-exp-date">${this.esc(e.startDate)}${e.startDate || e.endDate ? ' – ' : ''}${e.current ? 'Hiện tại' : this.esc(e.endDate)}</span>
                </div>
                <div class="t2-exp-position">${this.esc(e.position)}</div>
                ${e.description ? `<div class="t2-text t2-exp-desc">${this.nl2br(e.description)}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <div class="t2-two-col">
          ${edu.length ? `
          <div class="t2-section">
            <div class="t2-section-title">GIÁO DỤC</div>
            <div class="t2-divider"></div>
            ${edu.map(e => `
              <div class="t2-edu-item">
                <div class="t2-edu-school">${this.esc(e.school)}</div>
                <div class="t2-edu-major">${this.esc(e.major)}</div>
                <div class="t2-edu-meta">${this.esc(e.startYear)}${e.startYear && e.endYear ? ' – ' : ''}${this.esc(e.endYear)}${e.grade ? ' | ' + this.esc(e.grade) : ''}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${skills.length ? `
          <div class="t2-section">
            <div class="t2-section-title">KỸ NĂNG</div>
            <div class="t2-divider"></div>
            ${skills.map(s => `
              <div class="t2-skill-item">
                <span class="t2-skill-name">${this.esc(s.name)}</span>
                ${this.skillDotsLight(s.level)}
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>

        ${certs.length || acts.length ? `
        <div class="t2-two-col">
          ${certs.length ? `
          <div class="t2-section">
            <div class="t2-section-title">CHỨNG CHỈ &amp; BẰNG CẤP</div>
            <div class="t2-divider"></div>
            <ul class="t2-list">${certs.map(c => `<li>${this.esc(c.name)}</li>`).join('')}</ul>
          </div>
          ` : ''}
          ${acts.length ? `
          <div class="t2-section">
            <div class="t2-section-title">HOẠT ĐỘNG</div>
            <div class="t2-divider"></div>
            ${acts.map(a => `
              <div class="t2-act-item">
                <div class="t2-act-name">${this.esc(a.name)}</div>
                ${a.description ? `<div class="t2-text">${this.nl2br(a.description)}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
        ` : ''}

        ${this.researchBlock(research, {
            wrap: 't2-section',
            title: 't2-section-title',
            name: 't2-exp-company',
            meta: 't2-exp-position',
            desc: 't2-text'
        })}
        ${research.filter(r => r.title || r.description).length ? '<div class="t2-divider" style="margin-bottom:0"></div>' : ''}
      </div>
    </div>`;
    },

    // ============================================================
    // TEMPLATE 3: Two-Column Professional (Color header, equal cols)
    // ============================================================
    render3(d) {
        const p = d.personal || {};
        const exp = d.experience || [];
        const edu = d.education || [];
        const skills = d.skills || [];
        const certs = d.certificates || [];
        const acts = d.activities || [];
        const research = d.research || [];

        return `
    <div class="cv-template t3">
      <div class="t3-header">
        <div class="t3-header-inner">
          ${p.avatar ? `<img src="${p.avatar}" class="t3-avatar" alt="avatar">` : '<div class="t3-avatar-placeholder"></div>'}
          <div class="t3-header-info">
            <h1 class="t3-name">${this.esc(p.name) || 'Họ và Tên'}</h1>
            <div class="t3-title">${this.esc(p.title) || 'Vị trí ứng tuyển'}</div>
          </div>
        </div>
        <div class="t3-contact-bar">
          ${p.phone ? `<span><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg> ${this.esc(p.phone)}</span>` : ''}
          ${p.email ? `<span><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg> ${this.esc(p.email)}</span>` : ''}
          ${p.address ? `<span><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg> ${this.esc(p.address)}</span>` : ''}
          ${p.dob ? `<span><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg> ${this.esc(p.dob)}</span>` : ''}
        </div>
      </div>

      <div class="t3-body">
        <div class="t3-left">
          ${skills.length ? `
          <div class="t3-section">
            <div class="t3-section-title">KỸ NĂNG</div>
            ${skills.map(s => `
              <div class="t3-skill-item">
                <div class="t3-skill-name">${this.esc(s.name)}</div>
                <div class="t3-skill-bar-wrap"><div class="t3-skill-bar" style="width:${{ 'Cơ bản': 20, 'Tốt': 40, 'Khá': 40, 'Giỏi': 60, 'Thành thạo': 80, 'Chuyên gia': 100 }[s.level] || 60}%"></div></div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${edu.length ? `
          <div class="t3-section">
            <div class="t3-section-title">GIÁO DỤC</div>
            ${edu.map(e => `
              <div class="t3-edu-item">
                <div class="t3-edu-school">${this.esc(e.school)}</div>
                <div class="t3-edu-major">${this.esc(e.major)}</div>
                <div class="t3-edu-meta">${this.esc(e.startYear)}${e.startYear && e.endYear ? ' – ' : ''}${this.esc(e.endYear)}${e.grade ? ' | ' + this.esc(e.grade) : ''}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${certs.length ? `
          <div class="t3-section">
            <div class="t3-section-title">CHỨNG CHỈ</div>
            <ul class="t3-list">${certs.map(c => `<li>${this.esc(c.name)}</li>`).join('')}</ul>
          </div>
          ` : ''}
        </div>

        <div class="t3-right">
          ${d.objective ? `
          <div class="t3-section">
            <div class="t3-section-title">MỤC TIÊU</div>
            <p class="t3-text">${this.nl2br(d.objective)}</p>
          </div>
          ` : ''}

          ${exp.length ? `
          <div class="t3-section">
            <div class="t3-section-title">KINH NGHIỆM</div>
            ${exp.map(e => `
              <div class="t3-exp-item">
                <div class="t3-exp-header">
                  <div class="t3-exp-company">${this.esc(e.company)}</div>
                  <div class="t3-exp-date">${this.esc(e.startDate)}${e.startDate || e.endDate ? ' – ' : ''}${e.current ? 'Hiện tại' : this.esc(e.endDate)}</div>
                </div>
                <div class="t3-exp-position">${this.esc(e.position)}</div>
                ${e.description ? `<div class="t3-text">${this.nl2br(e.description)}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${acts.length ? `
          <div class="t3-section">
            <div class="t3-section-title">HOẠT ĐỘNG</div>
            ${acts.map(a => `
              <div class="t3-act-item">
                <div class="t3-act-name">${this.esc(a.name)}</div>
                ${a.description ? `<div class="t3-text">${this.nl2br(a.description)}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${this.researchBlock(research, {
            wrap: 't3-section',
            title: 't3-section-title',
            name: 't3-exp-company',
            meta: 't3-exp-position',
            desc: 't3-text'
        })}
        </div>
      </div>
    </div>`;
    },

    // ============================================================
    // TEMPLATE 4: Creative Bold (Color gradient header)
    // ============================================================
    render4(d) {
        const p = d.personal || {};
        const exp = d.experience || [];
        const edu = d.education || [];
        const skills = d.skills || [];
        const certs = d.certificates || [];
        const acts = d.activities || [];
        const research = d.research || [];

        return `
    <div class="cv-template t4">
      <div class="t4-header">
        <div class="t4-header-content">
          ${p.avatar ? `<img src="${p.avatar}" class="t4-avatar" alt="avatar">` : '<div class="t4-avatar-placeholder"></div>'}
          <div class="t4-header-text">
            <h1 class="t4-name">${this.esc(p.name) || 'Họ và Tên'}</h1>
            <div class="t4-title">${this.esc(p.title) || 'Vị trí ứng tuyển'}</div>
          </div>
        </div>
        <div class="t4-contact-chips">
          ${p.phone ? `<div class="t4-chip">${this.esc(p.phone)}</div>` : ''}
          ${p.email ? `<div class="t4-chip">${this.esc(p.email)}</div>` : ''}
          ${p.address ? `<div class="t4-chip">${this.esc(p.address)}</div>` : ''}
          ${p.dob ? `<div class="t4-chip">${this.esc(p.dob)}</div>` : ''}
        </div>
      </div>

      <div class="t4-body">
        ${d.objective ? `
        <div class="t4-objective-box">
          <p>${this.nl2br(d.objective)}</p>
        </div>
        ` : ''}

        <div class="t4-columns">
          <div class="t4-left">
            ${skills.length ? `
            <div class="t4-section">
              <div class="t4-section-title"><span class="t4-accent-bar"></span>KỸ NĂNG</div>
              ${skills.map(s => `
                <div class="t4-skill-item">
                  <span>${this.esc(s.name)}</span>
                  <span class="t4-tag">${this.esc(s.level)}</span>
                </div>
              `).join('')}
            </div>
            ` : ''}

            ${edu.length ? `
            <div class="t4-section">
              <div class="t4-section-title"><span class="t4-accent-bar"></span>GIÁO DỤC</div>
              ${edu.map(e => `
                <div class="t4-edu-item">
                  <div class="t4-edu-school">${this.esc(e.school)}</div>
                  <div class="t4-edu-major">${this.esc(e.major)}</div>
                  <div class="t4-edu-meta">${this.esc(e.startYear)}${e.startYear && e.endYear ? '–' : ''}${this.esc(e.endYear)}${e.grade ? ' · ' + this.esc(e.grade) : ''}</div>
                </div>
              `).join('')}
            </div>
            ` : ''}

            ${certs.length ? `
            <div class="t4-section">
              <div class="t4-section-title"><span class="t4-accent-bar"></span>CHỨNG CHỈ</div>
              <ul class="t4-list">${certs.map(c => `<li>${this.esc(c.name)}</li>`).join('')}</ul>
            </div>
            ` : ''}
          </div>

          <div class="t4-right">
            ${exp.length ? `
            <div class="t4-section">
              <div class="t4-section-title"><span class="t4-accent-bar"></span>KINH NGHIỆM</div>
              ${exp.map(e => `
                <div class="t4-exp-item">
                  <div class="t4-exp-timeline-dot"></div>
                  <div class="t4-exp-content">
                    <div class="t4-exp-company">${this.esc(e.company)}</div>
                    <div class="t4-exp-position-date">
                      <span class="t4-exp-position">${this.esc(e.position)}</span>
                      <span class="t4-exp-date">${this.esc(e.startDate)}${e.startDate || e.endDate ? ' – ' : ''}${e.current ? 'Hiện tại' : this.esc(e.endDate)}</span>
                    </div>
                    ${e.description ? `<div class="t4-exp-desc">${this.nl2br(e.description)}</div>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
            ` : ''}

            ${acts.length ? `
            <div class="t4-section">
              <div class="t4-section-title"><span class="t4-accent-bar"></span>HOẠT ĐỘNG</div>
              ${acts.map(a => `
                <div class="t4-act-item">
                  <div class="t4-act-name">${this.esc(a.name)}</div>
                  ${a.description ? `<div class="t4-act-desc">${this.nl2br(a.description)}</div>` : ''}
                </div>
              `).join('')}
            </div>
            ` : ''}

            ${research.filter(r => r.title || r.description).length ? `
            <div class="t4-section">
              <div class="t4-section-title"><span class="t4-accent-bar"></span>NGHIÊN CỨU KHOA HỌC</div>
              ${research.filter(r => r.title || r.description).map(r => `
                <div class="t4-exp-item">
                  <div class="t4-exp-timeline-dot"></div>
                  <div class="t4-exp-content">
                    <div class="t4-exp-company">${this.esc(r.title)}</div>
                    <div class="t4-exp-position-date">
                      ${r.role ? `<span class="t4-exp-position">${this.esc(r.role)}</span>` : ''}
                      ${r.year ? `<span class="t4-exp-date">${this.esc(r.year)}</span>` : ''}
                    </div>
                    ${r.description ? `<div class="t4-exp-desc">${this.nl2br(r.description)}</div>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>`;
    },

    // ============================================================
    // TEMPLATE 5: Executive Dark (Black header, accent color)
    // ============================================================
    render5(d) {
        const p = d.personal || {};
        const exp = d.experience || [];
        const edu = d.education || [];
        const skills = d.skills || [];
        const certs = d.certificates || [];
        const acts = d.activities || [];
        const research = d.research || [];

        return `
    <div class="cv-template t5">
      <div class="t5-header">
        <div class="t5-header-main">
          ${p.avatar ? `<img src="${p.avatar}" class="t5-avatar" alt="avatar">` : '<div class="t5-avatar-placeholder"></div>'}
          <div class="t5-header-text">
            <h1 class="t5-name">${this.esc(p.name) || 'HỌ VÀ TÊN'}</h1>
            <div class="t5-title-bar"><div class="t5-title-line"></div><span class="t5-title">${this.esc(p.title) || 'Vị trí ứng tuyển'}</span><div class="t5-title-line"></div></div>
          </div>
        </div>
        <div class="t5-contact-row">
          ${p.phone ? `<span>${this.esc(p.phone)}</span>` : ''}
          ${p.email ? `<span>${this.esc(p.email)}</span>` : ''}
          ${p.address ? `<span>${this.esc(p.address)}</span>` : ''}
          ${p.dob ? `<span>${this.esc(p.dob)}</span>` : ''}
        </div>
      </div>

      <div class="t5-body">
        <div class="t5-left">
          ${d.objective ? `
          <div class="t5-section">
            <div class="t5-section-title">MỤC TIÊU</div>
            <p class="t5-text">${this.nl2br(d.objective)}</p>
          </div>
          ` : ''}

          ${exp.length ? `
          <div class="t5-section">
            <div class="t5-section-title">KINH NGHIỆM LÀM VIỆC</div>
            ${exp.map(e => `
              <div class="t5-exp-item">
                <div class="t5-exp-header">
                  <div class="t5-exp-company">${this.esc(e.company)}</div>
                  <div class="t5-exp-date">${this.esc(e.startDate)}${e.startDate || e.endDate ? ' – ' : ''}${e.current ? 'Hiện tại' : this.esc(e.endDate)}</div>
                </div>
                <div class="t5-exp-position">${this.esc(e.position)}</div>
                ${e.description ? `<div class="t5-text">${this.nl2br(e.description)}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${acts.length ? `
          <div class="t5-section">
            <div class="t5-section-title">HOẠT ĐỘNG</div>
            ${acts.map(a => `
              <div class="t5-exp-item">
                <div class="t5-exp-company">${this.esc(a.name)}</div>
                ${a.description ? `<div class="t5-text">${this.nl2br(a.description)}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${this.researchBlock(research, {
            wrap: 't5-section',
            title: 't5-section-title',
            name: 't5-exp-company',
            meta: 't5-exp-position',
            desc: 't5-text'
        })}
        </div>

        <div class="t5-right">
          ${edu.length ? `
          <div class="t5-section">
            <div class="t5-section-title">GIÁO DỤC</div>
            ${edu.map(e => `
              <div class="t5-edu-item">
                <div class="t5-edu-school">${this.esc(e.school)}</div>
                <div class="t5-edu-major">${this.esc(e.major)}</div>
                <div class="t5-edu-meta">${this.esc(e.startYear)}${e.startYear && e.endYear ? ' – ' : ''}${this.esc(e.endYear)}${e.grade ? ' | ' + this.esc(e.grade) : ''}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${skills.length ? `
          <div class="t5-section">
            <div class="t5-section-title">KỸ NĂNG</div>
            ${skills.map(s => `
              <div class="t5-skill-item">
                <span class="t5-skill-name">${this.esc(s.name)}</span>
                <span class="t5-skill-level">${this.esc(s.level)}</span>
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${certs.length ? `
          <div class="t5-section">
            <div class="t5-section-title">CHỨNG CHỈ &amp; BẰNG CẤP</div>
            <ul class="t5-list">${certs.map(c => `<li>${this.esc(c.name)}</li>`).join('')}</ul>
          </div>
          ` : ''}
        </div>
      </div>
    </div>`;
    },

    render(id, data, color) {
        const renderers = {
            1: (d) => this.render1(d),
            2: (d) => this.render2(d),
            3: (d) => this.render3(d),
            4: (d) => this.render4(d),
            5: (d) => this.render5(d),
        };
        const fn = renderers[id];
        return fn ? fn(data) : this.render1(data);
    }
};
