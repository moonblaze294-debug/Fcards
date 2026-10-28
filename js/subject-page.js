(function () {
  function getSubjectFromQuery() {
    const subjectId = new URLSearchParams(window.location.search).get('subject');
    if (!subjectId) return null;
    return (window.SUBJECTS || []).find(function (subject) {
      return subject && subject.id === subjectId;
    }) || null;
  }

  function countChapters(subject) {
    if (!subject || !Array.isArray(subject.sections)) return 0;
    return subject.sections.reduce(function (total, section) {
      return total + (Array.isArray(section.chapters) ? section.chapters.length : 0);
    }, 0);
  }

  function renderSubjectPage() {
    const root = document.getElementById('subject-page');
    if (!root) return;

    const subject = getSubjectFromQuery();

    if (!subject) {
      root.innerHTML = [
        '<div class="empty-state">',
        '  <div class="empty-state-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>',
        '  <h2>Subject not found</h2>',
        '  <p>The selected subject could not be located. Please return to the dashboard and choose a valid subject.</p>',
        '  <div class="empty-state-actions">',
        '    <a class="btn btn-primary" href="index.html"><i class="fa-solid fa-house"></i> Back to dashboard</a>',
        '  </div>',
        '</div>'
      ].join('');
      return;
    }

    const chapterCount = countChapters(subject);
    const subjectCode = subject.code || 'SUB';

    const sectionsHtml = (subject.sections || []).map(function (section) {
      const cardsHtml = (section.chapters || []).map(function (chapter) {
        return [
          '<button class="chapter-card" type="button" data-subject="' + encodeURIComponent(subject.id) + '" data-chapter="' + encodeURIComponent(chapter.id) + '">',
          '  <span class="chapter-num">' + (chapter.num || '') + '</span>',
          '  <span class="chapter-info">',
          '    <h4>' + (chapter.name || 'Untitled chapter') + '</h4>',
          '    <span class="chapter-count">Open chapter</span>',
          '  </span>',
          '</button>'
        ].join('');
      }).join('');

      return [
        '<div class="subject-section">',
        '  <div class="section-divider">' + (section.name || 'General') + '</div>',
        '  <div class="chapter-grid">' + cardsHtml + '</div>',
        '</div>'
      ].join('');
    }).join('');

    root.innerHTML = [
      '<div class="page-header">',
      '  <div class="page-header-grid">',
      '    <div>',
      '      <div class="subject-meta">',
      '        <span class="subject-chip">' + subjectCode + '</span>',
      '        <span class="subject-chip secondary">' + chapterCount + ' chapters</span>',
      '      </div>',
      '      <h1>' + (subject.name || 'Untitled subject') + '</h1>',
      '      <p class="page-description">Select a chapter to continue your learning path.</p>',
      '    </div>',
      '    <div class="header-actions">',
      '      <a class="btn btn-ghost" href="index.html"><i class="fa-solid fa-arrow-left"></i> Dashboard</a>',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="toolbar">',
      '  <div class="search-wrap">',
      '    <i class="fa-solid fa-magnifying-glass"></i>',
      '    <input id="chapter-search" class="input search-input" type="search" placeholder="Search chapters..." aria-label="Search chapters">',
      '  </div>',
      '</div>',
      '<div id="subject-chapters">' + sectionsHtml + '</div>'
    ].join('');

    const searchInput = document.getElementById('chapter-search');
    const chapterCards = Array.prototype.slice.call(document.querySelectorAll('.chapter-card'));

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim().toLowerCase();
        const sections = Array.prototype.slice.call(document.querySelectorAll('.subject-section'));

        sections.forEach(function (section) {
          const cards = Array.prototype.slice.call(section.querySelectorAll('.chapter-card'));
          let visible = 0;

          cards.forEach(function (card) {
            const chapterTitle = (card.querySelector('h4') || {}).textContent || '';
            const shouldShow = !query || chapterTitle.toLowerCase().indexOf(query) !== -1;
            card.style.display = shouldShow ? '' : 'none';
            if (shouldShow) visible++;
          });

          const divider = section.querySelector('.section-divider');
          if (divider) {
            divider.style.display = visible > 0 ? '' : 'none';
          }
        });
      });
    }

    chapterCards.forEach(function (card) {
      card.addEventListener('click', function () {
        const subjectValue = card.getAttribute('data-subject');
        const chapterValue = card.getAttribute('data-chapter');
        window.location.href = 'chapter.html?subject=' + subjectValue + '&chapter=' + chapterValue;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', renderSubjectPage);
})();
