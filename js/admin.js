/*
 * ADMIN.JS
 * Handles parsing TSV data and pushing it to Firebase.
 */

window.processImport = async function() {
  const rawText = document.getElementById('import-text').value.trim();
  
  if (!rawText) {
    window.showToast('Please paste data into the text box first.', 'error');
    return;
  }

  const rows = rawText.split('\n');
  const cardsToSave = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].trim();
    if (!row) continue; 

    const separator = row.includes('\t') ? '\t' : '|';
    let cols = row.split(separator).map(col => col.trim());

    if (separator === '|') {
      cols = cols.filter(col => col !== '');
    }
    if (cols.length < 3) continue;

    const id = cols[0];
    const front = cols[1];
    const back = cols[2];
    
    const rawTags = cols[3] || "";
    const tags = rawTags.split(',').map(tag => tag.trim().replace(/`/g, '')).filter(tag => tag !== "");
    const layer = cols[4] ? parseInt(cols[4], 10) : 1;

    const idParts = id.split('-');
    if (idParts.length < 2) continue;

    const subjectCode = idParts[0].toLowerCase();
    const chapterId = `${idParts[0]}-${idParts[1]}`;
    
    let subjectId = "unknown";
    if (subjectCode === 'fm') subjectId = 'forensic';
    if (subjectCode === 'cm') subjectId = 'community';

    cardsToSave.push({
      id: id,
      chapterId: chapterId,
      subjectId: subjectId,
      layer: isNaN(layer) ? 1 : layer,
      front: front,
      back: back,
      tags: tags
    });
  }

  if (cardsToSave.length === 0) {
    window.showToast('No valid cards found. Check your formatting.', 'error');
    return;
  }

  // UPDATE UI FOR CLOUD UPLOAD
  document.getElementById('import-status').textContent = 'Uploading to cloud...';
  document.getElementById('import-status').style.color = 'var(--warning)';

  try {
    // THIS PUSHES TO FIREBASE
    const addedCount = await window.saveCardsBulkFirebase(cardsToSave);

    document.getElementById('import-text').value = '';
    document.getElementById('import-status').style.color = 'var(--success)';
    document.getElementById('import-status').textContent = `Success! Added ${addedCount} new cards.`;
    window.showToast(`Successfully saved ${addedCount} cards to database.`, 'success');
    
  } catch (error) {
    console.error("Upload failed: ", error);
    window.showToast('Database error. Check console.', 'error');
    document.getElementById('import-status').style.color = 'var(--danger)';
    document.getElementById('import-status').textContent = 'Upload failed.';
  }
}

window.showToast = function(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
