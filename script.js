(function () {
  'use strict';

  const form = document.getElementById('resume-form');
  const preview = document.getElementById('resume-content');
  const printBtn = document.getElementById('print-btn');

  // Industry-specific sections
  const industrySections = document.querySelectorAll('.industry-section');
  const industryRadios = document.querySelectorAll('input[name="industry"]');

  // Clone nodes for add more
  const educationList = document.getElementById('education-list');
  const experienceList = document.getElementById('experience-list');
  const projectsList = document.getElementById('projects-list');

  const educationTemplate = educationList.querySelector('.education-item').cloneNode(true);
  const experienceTemplate = experienceList.querySelector('.experience-item').cloneNode(true);
  const projectTemplate = projectsList.querySelector('.project-item').cloneNode(true);

  function clearInputs(container) {
    container.querySelectorAll('input, textarea').forEach(function (el) {
      if (el.type === 'radio' || el.type === 'checkbox') return;
      el.value = '';
    });
  }

  function showIndustrySections(industry) {
    industrySections.forEach(function (section) {
      const allowed = section.getAttribute('data-industry') || '';
      const visible = allowed.split(',').map(s => s.trim()).includes(industry);
      section.classList.toggle('visible', visible);
    });
  }

  industryRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      showIndustrySections(this.value);
      updatePreview();
    });
  });

  // Initial industry sections
  const checkedIndustry = document.querySelector('input[name="industry"]:checked');
  if (checkedIndustry) showIndustrySections(checkedIndustry.value);

  document.getElementById('add-education').addEventListener('click', function () {
    const clone = educationTemplate.cloneNode(true);
    clearInputs(clone);
    clone.querySelectorAll('.btn-remove').forEach(btn => {
      btn.onclick = function () { clone.remove(); updatePreview(); };
    });
    educationList.appendChild(clone);
    updatePreview();
  });

  document.getElementById('add-experience').addEventListener('click', function () {
    const clone = experienceTemplate.cloneNode(true);
    clearInputs(clone);
    clone.querySelectorAll('.btn-remove').forEach(btn => {
      btn.onclick = function () { clone.remove(); updatePreview(); };
    });
    experienceList.appendChild(clone);
    updatePreview();
  });

  document.getElementById('add-project').addEventListener('click', function () {
    const clone = projectTemplate.cloneNode(true);
    clearInputs(clone);
    clone.querySelectorAll('.btn-remove').forEach(btn => {
      btn.onclick = function () { clone.remove(); updatePreview(); };
    });
    projectsList.appendChild(clone);
    updatePreview();
  });

  educationList.addEventListener('click', delegateRemove);
  experienceList.addEventListener('click', delegateRemove);
  projectsList.addEventListener('click', delegateRemove);

  function delegateRemove(e) {
    const btn = e.target.closest('.btn-remove');
    if (!btn) return;
    const block = btn.closest('.repeatable');
    if (block) {
      block.remove();
      updatePreview();
    }
  }

  function getFormData() {
    const data = {
      industry: (document.querySelector('input[name="industry"]:checked') || {}).value || 'cs',
      fullname: (form.querySelector('#fullname') || {}).value || '',
      email: (form.querySelector('#email') || {}).value || '',
      phone: (form.querySelector('#phone') || {}).value || '',
      address: (form.querySelector('#address') || {}).value || '',
      linkedin: (form.querySelector('#linkedin') || {}).value || '',
      portfolio: (form.querySelector('#portfolio') || {}).value || '',
      github: (form.querySelector('#github') || {}).value || '',
      languages: (form.querySelector('#languages') || {}).value || '',
      summary: (form.querySelector('#summary') || {}).value || '',
      skills: (form.querySelector('#skills') || {}).value || '',
      certifications: (form.querySelector('#certifications') || {}).value || '',
      farm_exp: (form.querySelector('#farm_exp') || {}).value || '',
      leadership: (form.querySelector('#leadership') || {}).value || '',
      ref_available: (form.querySelector('#ref_available') || {}).checked || false,
      references: (form.querySelector('#references') || {}).value || '',
      education: [],
      experience: [],
      projects: []
    };

    educationList.querySelectorAll('.education-item').forEach(function (item) {
      const degree = (item.querySelector('input[name="edu_degree[]"]') || {}).value;
      const institution = (item.querySelector('input[name="edu_institution[]"]') || {}).value;
      const year = (item.querySelector('input[name="edu_year[]"]') || {}).value;
      const grade = (item.querySelector('input[name="edu_grade[]"]') || {}).value;
      if (degree || institution) {
        data.education.push({ degree, institution, year, grade });
      }
    });

    experienceList.querySelectorAll('.experience-item').forEach(function (item) {
      const title = (item.querySelector('input[name="exp_title[]"]') || {}).value;
      const company = (item.querySelector('input[name="exp_company[]"]') || {}).value;
      const duration = (item.querySelector('input[name="exp_duration[]"]') || {}).value;
      const location = (item.querySelector('input[name="exp_location[]"]') || {}).value;
      const desc = (item.querySelector('textarea[name="exp_desc[]"]') || {}).value;
      if (title || company) {
        data.experience.push({ title, company, duration, location, desc });
      }
    });

    projectsList.querySelectorAll('.project-item').forEach(function (item) {
      const name = (item.querySelector('input[name="proj_name[]"]') || {}).value;
      const desc = (item.querySelector('input[name="proj_desc[]"]') || {}).value;
      if (name || desc) {
        data.projects.push({ name, desc });
      }
    });

    return data;
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function buildPreviewHtml(d) {
    const industry = d.industry || 'general';
    const templateClass = 'template-' + industry;

    function ensureUrl(val) {
      if (!val || !String(val).trim()) return '';
      val = String(val).trim();
      if (!/^https?:\/\//i.test(val)) val = 'https://' + val;
      return val;
    }
    var contactParts = [];
    if (d.email) contactParts.push(escapeHtml(d.email));
    if (d.phone) contactParts.push(escapeHtml(d.phone));
    if (d.address) contactParts.push(escapeHtml(d.address));
    if (d.linkedin) contactParts.push('<a href="' + escapeHtml(ensureUrl(d.linkedin)) + '" target="_blank">LinkedIn</a>');
    if (d.portfolio) contactParts.push('<a href="' + escapeHtml(ensureUrl(d.portfolio)) + '" target="_blank">Portfolio</a>');
    if ((industry === 'cs' || industry === 'engineering') && d.github) contactParts.push('<a href="' + escapeHtml(ensureUrl(d.github)) + '" target="_blank">GitHub</a>');
    var contactHtml = contactParts.join(' <span>•</span> ');

    var html = '<div class="resume-paper-inner ' + templateClass + '">';
    html += '<div class="resume-name">' + escapeHtml(d.fullname || 'Your Name') + '</div>';
    html += '<div class="resume-contact">' + contactHtml + '</div>';

    if (d.summary) {
      html += '<div class="resume-section"><div class="resume-section-title">Summary</div>';
      html += '<div class="resume-summary">' + escapeHtml(d.summary) + '</div></div>';
    }

    if (d.languages) {
      var langList = d.languages.split(',').map(function (l) { return l.trim(); }).filter(Boolean);
      if (langList.length) {
        html += '<div class="resume-section"><div class="resume-section-title">Languages</div>';
        html += '<div class="resume-item-desc">' + langList.map(function (l) { return escapeHtml(l); }).join(' • ') + '</div></div>';
      }
    }

    if (d.education && d.education.length) {
      html += '<div class="resume-section"><div class="resume-section-title">Education</div>';
      d.education.forEach(function (edu) {
        html += '<div class="resume-item">';
        html += '<div class="resume-item-title">' + escapeHtml(edu.degree) + '</div>';
        html += '<div class="resume-item-meta">' + escapeHtml(edu.institution) + (edu.year ? ' | ' + escapeHtml(edu.year) : '') + (edu.grade ? ' | ' + escapeHtml(edu.grade) : '') + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }

    if (d.experience && d.experience.length) {
      html += '<div class="resume-section"><div class="resume-section-title">Experience / Internships</div>';
      d.experience.forEach(function (exp) {
        html += '<div class="resume-item">';
        html += '<div class="resume-item-title">' + escapeHtml(exp.title) + (exp.company ? ' — ' + escapeHtml(exp.company) : '') + '</div>';
        var meta = [exp.duration, exp.location].filter(Boolean).map(escapeHtml).join(' | ');
        if (meta) html += '<div class="resume-item-meta">' + meta + '</div>';
        if (exp.desc) html += '<div class="resume-item-desc">' + escapeHtml(exp.desc) + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }

    if (d.skills) {
      var skillList = d.skills.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      if (skillList.length) {
        html += '<div class="resume-section"><div class="resume-section-title">Skills</div>';
        html += '<div class="resume-skills">';
        skillList.forEach(function (s) {
          html += '<span>' + escapeHtml(s) + '</span>';
        });
        html += '</div></div>';
      }
    }

    if ((industry === 'cs' || industry === 'engineering') && d.projects && d.projects.length) {
      html += '<div class="resume-section"><div class="resume-section-title">Projects</div>';
      d.projects.forEach(function (p) {
        html += '<div class="resume-item">';
        html += '<div class="resume-item-title">' + escapeHtml(p.name) + '</div>';
        if (p.desc) html += '<div class="resume-item-desc">' + escapeHtml(p.desc) + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }

    if (d.certifications) {
      var certList = d.certifications.split(',').map(function (c) { return c.trim(); }).filter(Boolean);
      if (certList.length) {
        html += '<div class="resume-section"><div class="resume-section-title">Certifications</div>';
        html += '<div class="resume-item-desc">' + certList.map(function (c) { return escapeHtml(c); }).join(' • ') + '</div></div>';
      }
    }

    if (industry === 'agriculture' && d.farm_exp) {
      html += '<div class="resume-section"><div class="resume-section-title">Farm / Field Experience</div>';
      html += '<div class="resume-summary">' + escapeHtml(d.farm_exp) + '</div></div>';
    }

    if (industry === 'management' && d.leadership) {
      html += '<div class="resume-section"><div class="resume-section-title">Leadership / Achievements</div>';
      html += '<div class="resume-summary">' + escapeHtml(d.leadership) + '</div></div>';
    }

    if (d.ref_available || (d.references && d.references.trim())) {
      html += '<div class="resume-section"><div class="resume-section-title">References</div>';
      if (d.references && d.references.trim()) html += '<div class="resume-item-desc">' + escapeHtml(d.references) + '</div>';
      else html += '<div class="resume-item-desc">References available on request.</div>';
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  function updatePreview() {
    var data = getFormData();
    preview.className = 'resume-paper template-' + (data.industry || 'general');
    preview.innerHTML = buildPreviewHtml(data);
  }

  form.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input', updatePreview);
    el.addEventListener('change', updatePreview);
  });

  printBtn.addEventListener('click', function () {
    window.print();
  });

  updatePreview();
})();
