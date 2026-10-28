(function () {
  function getParams() {
    return new URLSearchParams(window.location.search);
  }

  function findSubject() {
    const subjectId = getParams().get('subject');
    if (!subjectId) return null;
    return (window.SUBJECTS || []).find(function (subject) {
      return subject && subject.id === subjectId;
    }) || null;
  }

  function findChapter(subject) {
    const chapterId = getParams().get('chapter');
    if (!subject || !chapterId || !Array.isArray(subject.sections)) return null;

    for (var i = 0; i < subject.sections.length; i++) {
      const section = subject.sections[i];
      if (!Array.isArray(section.chapters)) continue;
      const chapter = section.chapters.find(function (item) {
        return item && item.id === chapterId;
      });
      if (chapter) return chapter;
    }

    return null;
  }

  function buildActivityCards(subjectId, chapterId) {
    const cards = [
      {
        id: 'mcqs',
        title: 'MCQs',
        description: 'Practice concept checks and self-assessment questions.',
        icon: 'fa-solid fa-circle-question',
        href: 'activity.html?subject=' + encodeURIComponent(subjectId) + '&chapter=' + encodeURIComponent(chapterId) + '&activity=mcqs'
      },
      {
        id: 'flashcards',
        title: 'Flashcards',
        description: 'Review high-yield prompts and rapid recall cards.',
        icon: 'fa-solid fa-clone',
        href: 'flashcards.html?subject=' + encodeURIComponent(subjectId) + '&chapter=' + encodeURIComponent(chapterId)
      },
      {
        id: 'clinical-cases',
        title: 'Clinical Cases',
        description: 'Apply theory to realistic patient scenarios.',
        icon: 'fa-solid fa-kit-medical',
        href: 'activity.html?subject=' + encodeURIComponent(subjectId) + '&chapter=' + encodeURIComponent(chapterId) + '&activity=clinical-cases'
      },
      {
        id: 'notes',
        title: 'Notes & Essays',
        description: 'Review concise notes and long-form explanations.',
        icon: 'fa-solid fa-file-lines',
        href: 'activity.html?subject=' + encodeURIComponent(subjectId) + '&chapter=' + encodeURIComponent(chapterId) + '&activity=notes'
      },
      {
        id: 'resources',
        title: 'Additional Resources',
        description: 'Open supporting references and study aids.',
        icon: 'fa-solid fa-book-open-reader',
        href: 'activity.html?subject=' + encodeURIComponent(subjectId) + '&chapter=' + encodeURIComponent(chapterId) + '&activity=resources'
      }
    ];

    return cards.map(function (card) {
      return [
        '<a class="activity-card" href="' + card.href + '">',
        '  <div class="activity-icon"><i class="' + card.icon + '"></i></div>',
        '  <div class="activity-copy">',
        '    <h3>' + card.title + '</h3>',
        '    <p>' + card.description + '</p>',
        '  </div>',
        '  <div class="activity-link"><span>Open</span> <i class="fa-solid fa-arrow-right"></i></div>',
        '</a>'
      ].join('');
    }).join('');
  }

  function renderChapterPage() {
    const root = document.getElementById('chapter-page');
    if (!root) return;

    const subject = findSubject();
    const chapter = subject ? findChapter(subject) : null;

    if (!subject || !chapter) {
      root.innerHTML = [
        '<div class="empty-state">',
        '  <div class="empty-state-icon"><i class="fa-solid fa-circle-xmark"></i></div>',
        '  <h2>Chapter not found</h2>',
        '  <p>The selected chapter does not exist for this subject.</p>',
        '  <div class="empty-state-actions">',
        '    <a class="btn btn-primary" href="index.html"><i class="fa-solid fa-house"></i> Back to dashboard</a>',
        '  </div>',
        '</div>'
      ].join('');
      return;
    }

    const subjectBreadcrumb = document.getElementById('subject-breadcrumb-link');
    if (subjectBreadcrumb) {
      subjectBreadcrumb.innerHTML = '<a href="subject.html?subject=' + encodeURIComponent(subject.id) + '">' + (subject.name || 'Subject') + '</a>';
    }

    const intro = chapter.description || 'This chapter is in the learning roadmap. The content is not yet added, so this page acts as a study placeholder while the topic is developed.';
    const cardMarkup = buildActivityCards(subject.id, chapter.id);

    root.innerHTML = [
      '<div class="page-header">',
      '  <div class="page-header-grid">',
      '    <div>',
      '      <div class="subject-meta">',
      '        <span class="subject-chip">' + (subject.code || 'SUB') + '</span>',
      '        <span class="subject-chip secondary">Chapter ' + (chapter.num || '') + '</span>',
      '      </div>',
      '      <h1>' + (chapter.name || 'Untitled chapter') + '</h1>',
      '      <p class="page-description">' + (subject.name || 'Subject') + ' • chapter overview</p>',
      '    </div>',
      '    <div class="header-actions">',
      '      <a class="btn btn-ghost" href="subject.html?subject=' + encodeURIComponent(subject.id) + '"><i class="fa-solid fa-arrow-left"></i> Back to subject</a>',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="chapter-progress-card">',
      '  <div class="chapter-progress-header">',
      '    <div>',
      '      <p class="chapter-progress-label">Progress</p>',
      '      <h3>Not started</h3>',
      '    </div>',
      '    <span class="status-pill">0% complete</span>',
      '  </div>',
      '  <div class="chapter-progress-bar"><span></span></div>',
      '  <p class="chapter-placeholder-copy">' + intro + '</p>',
      '</div>',
      '<div class="activity-grid">' + cardMarkup + '</div>'
    ].join('');
  }

  document.addEventListener('DOMContentLoaded', renderChapterPage);
})();
