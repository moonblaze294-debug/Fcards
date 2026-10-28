(function () {
  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function flattenChapters(subject) {
    if (!subject || !Array.isArray(subject.sections)) return [];
    const chapters = [];
    subject.sections.forEach(function (section) {
      if (Array.isArray(section.chapters)) {
        section.chapters.forEach(function (chapter) {
          chapters.push(chapter);
        });
      }
    });
    return chapters;
  }

  function getSubjectAndChapter() {
    const subjectId = getQueryParam('subject');
    const chapterId = getQueryParam('chapter');
    const subject = (window.SUBJECTS || []).find(function (item) {
      return item && item.id === subjectId;
    }) || null;

    const chapters = flattenChapters(subject);
    const chapter = chapters.find(function (item) {
      return item && item.id === chapterId;
    }) || null;

    return { subject, chapter, subjectId, chapterId };
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
        href: 'flashcards.html'
      },
      {
        id: 'clinical-cases',
        title: 'Clinical cases',
        description: 'Apply theory to realistic patient scenarios.',
        icon: 'fa-solid fa-kit-medical',
        href: 'activity.html?subject=' + encodeURIComponent(subjectId) + '&chapter=' + encodeURIComponent(chapterId) + '&activity=clinical-cases'
      },
      {
        id: 'notes',
        title: 'Notes and essays',
        description: 'Review concise notes and long-form explanations.',
        icon: 'fa-solid fa-file-lines',
        href: 'activity.html?subject=' + encodeURIComponent(subjectId) + '&chapter=' + encodeURIComponent(chapterId) + '&activity=notes'
      },
      {
        id: 'resources',
        title: 'Additional resources',
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

    const { subject, chapter, subjectId, chapterId } = getSubjectAndChapter();

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
      '      <p class="page-description">' + (subject.name || 'Subject') + ' • learning activity hub</p>',
      '    </div>',
      '    <div class="header-actions">',
      '      <a class="btn btn-ghost" href="subject.html?subject=' + encodeURIComponent(subject.id) + '"><i class="fa-solid fa-arrow-left"></i> Back to subject</a>',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="activity-grid">' + cardMarkup + '</div>'
    ].join('');
  }

  document.addEventListener('DOMContentLoaded', renderChapterPage);
})();
