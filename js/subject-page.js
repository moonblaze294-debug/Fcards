(function () {
  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function getSubject() {
    const subjectId = getQueryParam('subject');
    if (!subjectId) return null;
    return (window.SUBJECTS || []).find(function (subject) {
      return subject && subject.id === subjectId;
    }) || null;
  }

  function getChapter(subject) {
    const chapterId = getQueryParam('chapter');
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

  function getActivityMeta(activityId) {
    const activityMap = {
      mcqs: {
        title: 'MCQs',
        description: 'This practice mode is planned for a later milestone. The quiz engine is not implemented in this task.',
        icon: 'fa-solid fa-circle-question'
      },
      flashcards: {
        title: 'Flashcards',
        description: 'The existing flashcards experience remains available and is preserved for this milestone.',
        icon: 'fa-solid fa-clone'
      },
      'clinical-cases': {
        title: 'Clinical cases',
        description: 'Clinical case workflows are part of the next planned feature set for this product.',
        icon: 'fa-solid fa-kit-medical'
      },
      notes: {
        title: 'Notes and essays',
        description: 'Notes and essay content will be added in a later milestone after the content model is complete.',
        icon: 'fa-solid fa-file-lines'
      },
      resources: {
        title: 'Additional resources',
        description: 'Reference and resource cards are planned after the main chapter and topic flow is complete.',
        icon: 'fa-solid fa-book-open-reader'
      }
    };

    return activityMap[activityId] || {
      title: 'Learning activity',
      description: 'This content is not available yet for this chapter.',
      icon: 'fa-solid fa-book-open'
    };
  }

  function renderActivityPage() {
    const root = document.getElementById('activity-page');
    if (!root) return;

    const subject = getSubject();
    const chapter = subject ? getChapter(subject) : null;
    const activityId = getQueryParam('activity') || 'mcqs';
    const activityMeta = getActivityMeta(activityId);

    const subjectName = subject ? subject.name : 'Unknown subject';
    const chapterName = chapter ? chapter.name : 'Unknown chapter';

    const subjectBreadcrumb = document.getElementById('subject-breadcrumb');
    if (subjectBreadcrumb) {
      subjectBreadcrumb.innerHTML = subject ? '<a href="subject.html?subject=' + encodeURIComponent(subject.id) + '">' + subjectName + '</a>' : 'Subject';
    }

    const chapterBreadcrumb = document.getElementById('chapter-breadcrumb');
    if (chapterBreadcrumb) {
      chapterBreadcrumb.innerHTML = chapter ? '<a href="chapter.html?subject=' + encodeURIComponent(subject.id) + '&chapter=' + encodeURIComponent(chapter.id) + '">' + chapterName + '</a>' : 'Chapter';
    }

    if (!subject || !chapter) {
      root.innerHTML = [
        '<div class="empty-state">',
        '  <div class="empty-state-icon"><i class="fa-solid fa-circle-xmark"></i></div>',
        '  <h2>Activity unavailable</h2>',
        '  <p>The selected subject or chapter could not be found.</p>',
        '  <div class="empty-state-actions">',
        '    <a class="btn btn-primary" href="index.html"><i class="fa-solid fa-house"></i> Back to dashboard</a>',
        '  </div>',
        '</div>'
      ].join('');
      return;
    }

    const backHref = 'chapter.html?subject=' + encodeURIComponent(subject.id) + '&chapter=' + encodeURIComponent(chapter.id);

    root.innerHTML = [
      '<div class="page-header">',
      '  <div class="page-header-grid">',
      '    <div>',
      '      <div class="subject-meta">',
      '        <span class="subject-chip">' + (subject.code || 'SUB') + '</span>',
      '        <span class="subject-chip secondary">' + activityMeta.title + '</span>',
      '      </div>',
      '      <h1>' + activityMeta.title + '</h1>',
      '      <p class="page-description">' + chapter.name + ' • ' + subject.name + '</p>',
      '    </div>',
      '    <div class="header-actions">',
      '      <a class="btn btn-ghost" href="' + backHref + '"><i class="fa-solid fa-arrow-left"></i> Back to chapter</a>',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="empty-state placeholder-state">',
      '  <div class="empty-state-icon"><i class="' + activityMeta.icon + '"></i></div>',
      '  <h2>' + activityMeta.title + ' coming soon</h2>',
      '  <p>' + activityMeta.description + '</p>',
      '  <div class="empty-state-actions">',
      '    <a class="btn btn-primary" href="' + backHref + '"><i class="fa-solid fa-arrow-left"></i> Return to chapter</a>',
      '  </div>',
      '</div>'
    ].join('');
  }

  document.addEventListener('DOMContentLoaded', renderActivityPage);
})();
