/*
 * ADMIN.JS
 * Handles bulk importing of TSV data directly into localStorage.
 */

function processImport() {
  const rawText = document.getElementById('import-text').value.trim();
  
  if (!rawText) {
    showToast('Please paste data into the text box first.', 'error');
    return;
  }

  // Split by newlines to get rows
  const rows = rawText.split('\n');
  const cardsToSave = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].trim();
    if (!row) continue; // Skip empty lines

    // Split by tab (\t) or pipe (|) to support both TSV and raw Markdown tables
    const separator = row.includes('\t') ? '\t' : '|';
    let cols = row.split(separator).map(col => col.trim());

    // If it's a markdown table, remove the empty strings at the start/end from the pipes
    if (separator === '|') {
      cols = cols.filter(col => col !== '');
    }

    // Minimum required columns: ID, Front, Back
    if (cols.length < 3) continue;

    const id = cols[0];
    const front = cols[1];
    const back = cols[2];
    
    // Parse tags if provided
    const rawTags = cols[3] || "";
    const tags = rawTags.split(',').map(tag => tag.trim().replace(/`/g, '')).filter(tag => tag !== "");

    // Parse layer if provided, default to 1 (High Yield)
    const layer = cols[4] ? parseInt(cols[4], 10) : 1;

    // Deduce Chapter and Subject from the ID (e.g., "fm-01-001")
    const idParts = id.split('-');
    if (idParts.length < 2) continue; // Invalid ID format

    const subjectCode = idParts[0].toLowerCase(); // "fm"
    const chapterId = `${idParts[0]}-${idParts[1]}`; // "fm-01"
    
    let subjectId = "unknown";
    if (subjectCode === 'fm') subjectId = 'forensic';
    if (subjectCode === 'cm') subjectId = 'community';

    // Build the card object matching storage.js expectations
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
    showToast('No valid cards found. Check your formatting.', 'error');
    return;
  }

  // Save via storage.js
  const addedCount = saveCardsBulk(cardsToSave);

  // Update UI
  document.getElementById('import-text').value = '';
  document.getElementById('import-status').textContent = `Success! Added ${addedCount} new cards.`;
  showToast(`Successfully imported ${addedCount} cards.`, 'success');
  
  // Refresh global stats so the dashboard updates
  refreshStats();
}

function showToast(msg, type = 'info') {
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

