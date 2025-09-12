// 8 Tailwind templates: 4 with photo, 4 without
// Each template exports a render(html) function that returns printable HTML string

export const templates = {
  1: {
    name: 'Classic Two-Column',
    render: (data) => baseTemplate({ data, variant: 'classic-two', withPhoto: false })
  },
  2: {
    name: 'One-Column Minimalist',
    render: (data) => baseTemplate({ data, variant: 'one-minimal', withPhoto: false })
  },
  3: {
    name: 'Timeline Style',
    render: (data) => baseTemplate({ data, variant: 'timeline', withPhoto: false })
  },
  4: {
    name: 'Header Emphasis',
    render: (data) => baseTemplate({ data, variant: 'header-emphasis', withPhoto: false })
  },
  5: {
    name: 'Modern Grid',
    render: (data) => baseTemplate({ data, variant: 'modern-grid', withPhoto: false })
  },
  6: {
    name: 'Creative Accent Bar',
    render: (data) => baseTemplate({ data, variant: 'accent-bar', withPhoto: false })
  },
  7: {
    name: 'Compact Professional',
    render: (data) => baseTemplate({ data, variant: 'compact', withPhoto: false })
  },
  8: {
    name: 'Photo Layout',
    render: (data) => baseTemplate({ data, variant: 'photo-two', withPhoto: true })
  },
};

export function getDefaultData(templateId) {
  const withPhoto = [2, 4, 6, 8].includes(Number(templateId));
  return defaultData(withPhoto);
}

function baseTemplate({ data, variant = 'classic-two', withPhoto }) {
  const accentColor = '#1E3A8A';
  const sections = normalizeSections(data.sections || [], data);

  // Personal Information header data
  const personal = sections.find(s => (s.title || '').toLowerCase() === 'personal information');
  const pi = personal && Array.isArray(personal.items) && personal.items[0] ? personal.items[0] : {};
  const headerName = pi.name || data.name || '';
  const headerTitle = pi.title || data.title || '';
  const headerEmail = pi.email || data.email || '';
  const headerPhone = pi.phone || data.phone || '';
  const headerLocation = pi.location || data.location || '';
  const headerExtras = Array.isArray(pi.extras) ? pi.extras : [];

  const renderSections = (items, headerStyle = 'underline') => items.map(section => `
    <section class="section">
      ${renderHeader(section.title, headerStyle, accentColor)}
      <div class="section-body">
        ${Array.isArray(section.items) ? section.items.map(item => `<div class="item">${renderItem(item)}</div>`).join('') : ''}
      </div>
    </section>
  `).join('');

  // Do not render Personal Information as a body section; it's used for header only
  const bodySections = sections.filter(s => (s.title || '').toLowerCase() !== 'personal information');

  const { left, right } = partitionSections(bodySections, (variant === 'classic-two' || variant === 'photo-two' || variant === 'header-emphasis') ? 'two' : 'one');

  const content = (
    variant === 'classic-two' ? layoutClassicTwo(left, right, accentColor) :
    variant === 'one-minimal' ? layoutOneMinimal(sections) :
    variant === 'timeline' ? layoutTimeline(sections, accentColor) :
    variant === 'header-emphasis' ? layoutHeaderEmphasis(left, right, accentColor) :
    variant === 'modern-grid' ? layoutModernGrid(sections) :
    variant === 'accent-bar' ? layoutAccentBar(sections, accentColor) :
    variant === 'compact' ? layoutCompact(sections) :
    variant === 'photo-two' ? layoutPhotoTwo(left, right, withPhoto, data.photoUrl) :
    layoutClassicTwo(left, right, accentColor)
  );

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        /* Page sizing & margins */
        @page { size: A4; margin: 22mm 20mm; }
        * { box-sizing: border-box; }
        body { font-family: Inter, Roboto, Lato, system-ui, -apple-system, Segoe UI, Arial; color: #111827; /* gray-900 */ line-height: 1.55; }
        .container { }
        .name { font-size: 22pt; font-weight: 800; color: ${accentColor}; text-align: center; letter-spacing:.02em; }
        .role { font-size: 12pt; color: #374151; text-align: center; margin-top: 2px; }
        .contact { margin-top: 6px; text-align: center; color: #4b5563; font-size: 9.5pt; }
        .contact span { margin: 0 8px; }
        .contact-grid { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px 12px; margin-top: 6px; line-height: 1.4; }
        .contact-item { white-space: nowrap; color: #4b5563; font-size: 9.5pt; display: inline-block; }
        .contact-separator { color: #9ca3af; font-size: 8pt; margin: 0 2px; }
        .social-link { color: #1e3a8a !important; text-decoration: none; transition: all 0.2s ease; font-weight: 500; }
        .social-link:hover { text-decoration: underline; color: #1d4ed8 !important; }
        .social-link:print { color: #1e3a8a !important; text-decoration: none; }
        @media (max-width: 640px) { 
          .contact-grid { gap: 4px 8px; font-size: 9pt; } 
          .contact-item { font-size: 9pt; }
        }
        .muted { font-size: 8.5pt; color: #6b7280; font-style: italic; }
        .section { margin: 16px 0; }
        .section-title { font-size: 13pt; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #374151; }
        .section-underline { border-bottom: 1px solid #d1d5db; padding-bottom: 4px; }
        .section-bar { border-left: 3px solid ${accentColor}; padding-left: 8px; }
        .section-divider { border-bottom: 1px dashed #d1d5db; padding-bottom: 4px; }
        .section-body { margin-top: 8px; }
        .item { margin-bottom: 8px; font-size: 10.5pt; color: #1f2937; }
        .bullets { list-style: disc; padding-left: 18px; margin: 6px 0 0 0; }
        .two-col { display: grid; grid-template-columns: 34% 66%; gap: 16px; }
        .grid-3 { display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .grid-2 { display:grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .header { margin-bottom: 16px; }
        .photo { width: 68px; height: 68px; border-radius: 9999px; object-fit: cover; display:block; margin: 10px auto 0 auto; }
        .title-wrap { text-align: center; }
        .subtle { color:#4b5563; }
        .right-align { text-align:right; }
        .small { font-size: 9pt; }
        .timeline { position:relative; margin-left: 10px; padding-left: 16px; }
        .timeline:before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:#d1d5db; }
        .dot { position:absolute; left:-5px; width:10px; height:10px; border-radius:9999px; background:${accentColor}; margin-top:3px; }
        @media (max-width: 640px) { .two-col, .grid-3, .grid-2 { display:block; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title-wrap">
            <div class="name">${escapeHtml(headerName)}</div>
            <div class="role">${escapeHtml(headerTitle)}</div>
            <div class="contact-grid">
              ${renderContactItem('Email', headerEmail, false, false)}
              <span class="contact-separator">•</span>
              ${renderContactItem('Phone', headerPhone, false, false)}
              <span class="contact-separator">•</span>
              ${renderContactItem('Location', headerLocation, false, false)}
              ${headerExtras && headerExtras.length ? headerExtras.map(ex => `
                <span class="contact-separator">•</span>
                ${renderContactItem(ex.label, ex.value, true, true)}
              `).join('') : ''}
            </div>
            ${withPhoto && data.photoUrl ? `<img src="${data.photoUrl}" alt="photo" class="photo"/>` : ''}
          </div>
        </div>
        ${content}
      </div>
    </body>
  </html>`;
}

function layoutClassicTwo(left, right, accentColor) {
  return `
    <div class="two-col">
      <div>${left.map(s => sectionBlock(s, 'underline', accentColor)).join('')}</div>
      <div>${right.map(s => sectionBlock(s, 'underline', accentColor)).join('')}</div>
    </div>
  `;
}

function layoutOneMinimal(sections) {
  return `${sections.map(s => sectionBlock(s, 'divider')).join('')}`;
}

function layoutTimeline(sections, accentColor) {
  const isTimeline = (t) => ['experience','education'].includes(t.toLowerCase());
  const blocks = sections.map(s => {
    if (!isTimeline(s.title)) return sectionBlock(s, 'underline', accentColor);
    const items = (s.items||[]).map(it => `
      <div style="position:relative; margin-left:8px;">
        <span class="dot"></span>
        <div class="item">${renderItem(it)}</div>
      </div>
    `).join('');
    return `
      <section class="section">
        ${renderHeader(s.title, 'underline', accentColor)}
        <div class="timeline">${items}</div>
      </section>
    `;
  }).join('');
  return blocks;
}

function layoutHeaderEmphasis(left, right, accentColor) {
  return layoutClassicTwo(left, right, accentColor);
}

function layoutModernGrid(sections) {
  const pick = (title) => sections.find(s => s.title.toLowerCase().includes(title));
  const skills = pick('skills');
  const education = pick('education');
  const certs = pick('certifications');
  const others = sections.filter(s => ![skills,education,certs].includes(s));
  return `
    ${others.map(s => sectionBlock(s, 'underline')).join('')}
    <div class="grid-3">
      ${sectionBlock(skills||{title:'Skills',items:[]}, 'underline')}
      ${sectionBlock(education||{title:'Education',items:[]}, 'underline')}
      ${sectionBlock(certs||{title:'Certifications',items:[]}, 'underline')}
    </div>
  `;
}

function layoutAccentBar(sections, accentColor) {
  return `${sections.map(s => sectionBlock(s, 'bar', accentColor)).join('')}`;
}

function layoutCompact(sections) {
  return `${sections.map(s => sectionBlock(s, 'underline')).join('')}`;
}

function layoutPhotoTwo(left, right, withPhoto, photoUrl) {
  return layoutClassicTwo(left, right);
}

function sectionBlock(section, headerStyle = 'underline', accentColor = '#1E3A8A') {
  return `
    <section class="section">
      ${renderHeader(section.title, headerStyle, accentColor)}
      <div class="section-body">
        ${(section.items||[]).map(item => `<div class="item">${renderItem(item)}</div>`).join('')}
      </div>
    </section>
  `;
}

function defaultData(withPhoto) {
  return {
    name: 'John Doe',
    title: 'Software Engineer',
    photoUrl: withPhoto ? 'https://via.placeholder.com/128x128.png?text=Photo' : undefined,
    email: 'john.doe@email.com',
    phone: '+1 555-123-4567',
    location: 'San Francisco, CA',
    sections: [
      {
        id: 'summary',
        title: 'Summary',
        column: 'right',
        items: [
          'Motivated software developer with 3+ years of experience building scalable web applications using Java, Spring Boot, and React. Passionate about clean code, performance, and delivering user-centric solutions.'
        ]
      },
      {
        id: 'experience',
        title: 'Experience',
        column: 'right',
        items: [
          {
            role: 'Software Engineer',
            company: 'XYZ Corp',
            startDate: 'Jun 2020',
            endDate: 'Jul 2023',
            bullets: [
              'Developed and maintained RESTful services with Spring Boot serving 100k+ monthly users',
              'Implemented React components and state management to enhance UX and reduce bounce rate by 15%',
              'Optimized PostgreSQL queries and added indexes, improving key endpoints by 40%'
            ]
          },
          {
            role: 'Backend Developer (Intern)',
            company: 'ABC Solutions',
            startDate: 'Jan 2020',
            endDate: 'May 2020',
            bullets: [
              'Built data processing pipelines in Java and integrated third-party APIs',
              'Wrote unit tests and documentation to improve service reliability'
            ]
          }
        ]
      },
      {
        id: 'education',
        title: 'Education',
        column: 'right',
        items: [
          {
            title: 'B.Tech in Computer Science',
            company: 'ABC University',
            startDate: '2016',
            endDate: '2020',
            bullets: [ 'Graduated with First Class; Coursework: Data Structures, Databases, Algorithms' ]
          }
        ]
      },
      {
        id: 'skills',
        title: 'Skills',
        column: 'left',
        items: [ 'Java, Spring Boot, React.js, TypeScript, PostgreSQL, REST APIs, Git, Problem Solving' ]
      },
      {
        id: 'projects',
        title: 'Projects',
        column: 'right',
        items: [
          {
            title: 'E-commerce Web App',
            company: 'Personal Project',
            bullets: [
              'Built with React and Spring Boot; implemented cart, checkout, and admin dashboard',
              'Deployed on cloud with CI/CD; added payment integration and email notifications'
            ]
          }
        ]
      },
      {
        id: 'certifications',
        title: 'Certifications',
        column: 'left',
        items: [ 'AWS Certified Solutions Architect – Associate' ]
      },
      {
        id: 'hobbies',
        title: 'Hobbies / Interests',
        column: 'left',
        items: [ 'Reading, Traveling, Photography' ]
      }
    ]
  };
}

function renderItem(item) {
  if (!item) return '';
  if (typeof item === 'string') return escapeHtml(item);
  const title = [item.role || item.title, item.company].filter(Boolean).join(' • ');
  const date = [item.startDate, item.endDate].filter(Boolean).join(' - ');
  const bullets = Array.isArray(item.bullets) ? `<ul class="bullets">${item.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : '';
  return `
    <div>
      ${title ? `<div style="font-weight:600">${escapeHtml(title)}</div>` : ''}
      ${date ? `<div class="muted">${escapeHtml(date)}</div>` : ''}
      ${item.description ? `<div>${escapeHtml(item.description)}</div>` : ''}
      ${bullets}
    </div>
  `;
}

function renderHeader(text, style, accentColor) {
  const base = `<div class="section-title">${escapeHtml(text)}</div>`;
  if (style === 'bar') return `<div class="section-title section-bar">${escapeHtml(text)}</div>`;
  if (style === 'divider') return `<div class="section-title section-divider">${escapeHtml(text)}</div>`;
  return `<div class="section-title section-underline">${escapeHtml(text)}</div>`;
}

function renderContactItem(label, value, isLink = false, isSocial = false) {
  const safe = escapeHtml(value || '');
  if (!safe) return '';
  
  if (isLink && isSocial) {
    // For social links, display as "Label: link" in a non-breaking container
    const displayValue = safe.replace(/^https?:\/\/(www\.)?/, ''); // Remove protocol and www
    const href = value.startsWith('http') ? value : `https://${value}`;
    return `<span class="contact-item">${escapeHtml(label)}: <a href="${escapeHtml(href)}" target="_blank" rel="noopener" class="social-link">${escapeHtml(displayValue)}</a></span>`;
  } else if (isLink) {
    // Regular links (email, etc.)
    const href = value.startsWith('http') ? value : `https://${value}`;
    return `<span class="contact-item"><a href="${escapeHtml(href)}" target="_blank" rel="noopener" class="social-link">${safe}</a></span>`;
  }
  
  // Regular contact items (phone, location, etc.)
  return `<span class="contact-item">${safe}</span>`;
}

function normalizeSections(sections, data) {
  // Ensure mandatory defaults exist; preserve order; avoid duplicates by title
  const byKey = (t) => t.toLowerCase().trim();
  const required = [
    { title: 'Personal Information', column: 'right' },
    { title: 'Summary', column: 'right' },
    { title: 'Experience', column: 'right' },
    { title: 'Education', column: 'right' },
    { title: 'Skills', column: 'left' },
    { title: 'Projects', column: 'right' },
    { title: 'Certifications', column: 'left' },
    { title: 'Hobbies / Interests', column: 'left' }
  ];
  const map = new Map();
  sections.forEach(s => { if (s && s.title) map.set(byKey(s.title), s); });
  if (!map.has(byKey('Personal Information'))) {
    map.set(byKey('Personal Information'), {
      id: 'personal-information',
      title: 'Personal Information',
      column: 'right',
      items: [{
        name: data?.name || 'John Doe',
        title: data?.title || 'Software Engineer',
        email: data?.email || 'john.doe@email.com',
        phone: data?.phone || '+1 555-123-4567',
        location: data?.location || 'San Francisco, CA',
        extras: [
          { label: 'LinkedIn', value: 'linkedin.com/in/johndoe', icon: 'linkedin' },
          { label: 'GitHub', value: 'github.com/johndoe', icon: 'github' }
        ]
      }]
    });
  }
  required.forEach(({ title, column }) => {
    if (!map.has(byKey(title))) {
      map.set(byKey(title), { id: byKey(title), title, column, items: [] });
    } else {
      // Ensure existing sections have column info
      const section = map.get(byKey(title));
      if (!section.column) {
        section.column = column;
      }
    }
  });
  
  // Ensure all sections have a column (default to right if not specified)
  return Array.from(map.values()).map(section => ({
    ...section,
    column: section.column || 'right'
  }));
}

function partitionSections(sections, layout) {
  if (layout === 'one') {
    return { oneColumn: true, left: [], right: sections };
  }
  const left = [], right = [];
  sections.forEach(s => {
    if (s.column === 'left') {
      left.push(s);
    } else {
      right.push(s);
    }
  });
  return { oneColumn: false, left, right };
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


