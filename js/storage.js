/*
 * STORAGE.JS
 * ------------------------------------------------------------------
 * Browser-only localStorage layer.
 * Handles:
 *   - Cards
 *   - Topics
 *   - Notes
 *   - Cached stats
 *   - Theme
 *   - Image compression
 *
 * No APIs. No server. No frameworks.
 * ------------------------------------------------------------------
 */

const KEYS = Object.freeze({
  cards: "mimi_cards",
  topics: "mimi_topics",
  notes: "mimi_notes",
  stats: "mimi_stats",
  theme: "mimi_theme"
});

/* =====================================================================
   Generic Storage Helpers
===================================================================== */

/**
 * Safely read JSON from localStorage.
 * Returns fallback if key doesn't exist or parsing fails.
 */
function storeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);

    if (raw === null) {
      return cloneFallback(fallback);
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to read "${key}" from localStorage.`, error);
    return cloneFallback(fallback);
  }
}

/**
 * Safely write JSON to localStorage.
 */
function storeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to write "${key}" to localStorage.`, error);
    return false;
  }
}

/**
 * Prevent accidental mutation of fallback values.
 */
function cloneFallback(value) {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") return { ...value };
  return value;
}

/**
 * Generic collection loader.
 */
function loadCollection(key) {
  return storeGet(key, []);
}

/**
 * Generic collection saver.
 */
function saveCollection(key, collection) {
  return storeSet(key, collection);
}

/**
 * Generic filter helper.
 */
function filterCollection(key, predicate) {
  return loadCollection(key).filter(predicate);
}

/**
 * Generic find helper.
 */
function findInCollection(key, predicate) {
  return loadCollection(key).find(predicate);
}

/**
 * Generic remove helper.
 */
function removeFromCollection(key, predicate) {
  const filtered = loadCollection(key).filter(item => !predicate(item));
  saveCollection(key, filtered);
  return filtered;
}

/**
 * Generic upsert helper.
 * Automatically maintains timestamps.
 */
function upsertCollectionItem(key, item) {
  const collection = loadCollection(key);

  const index = collection.findIndex(entry => entry.id === item.id);

  const now = Date.now();

  if (index >= 0) {
    item.createdAt = collection[index].createdAt || item.createdAt || now;
    item.updatedAt = now;
    collection[index] = item;
  } else {
    item.createdAt = item.createdAt || now;
    item.updatedAt = now;
    collection.push(item);
  }

  saveCollection(key, collection);

  return item;
}

/* =====================================================================
   Cards
===================================================================== */

function getCards() {
  return loadCollection(KEYS.cards);
}

function getCardsByChapter(chapterId) {
  return filterCollection(KEYS.cards, card => card.chapterId === chapterId);
}

function getCardsByTopic(topicId) {
  return filterCollection(KEYS.cards, card => card.topicId === topicId);
}

function saveCard(card) {
  return upsertCollectionItem(KEYS.cards, card);
}

function deleteCard(cardId) {
  removeFromCollection(KEYS.cards, card => card.id === cardId);
}

/**
 * Bulk insert cards.
 * Existing IDs are skipped.
 */
function saveCardsBulk(newCards) {
  const cards = loadCollection(KEYS.cards);

  const ids = new Set(cards.map(card => card.id));

  const now = Date.now();

  let added = 0;

  for (const card of newCards) {
    if (!card || !card.front) continue;
    if (ids.has(card.id)) continue;

    card.createdAt = now;
    card.updatedAt = now;

    cards.push(card);
    ids.add(card.id);

    added++;
  }

  saveCollection(KEYS.cards, cards);

  return added;
}

/* =====================================================================
   Topics
===================================================================== */

function getTopics() {
  return loadCollection(KEYS.topics);
}

function getTopicsByChapter(chapterId) {
  return filterCollection(KEYS.topics, topic => topic.chapterId === chapterId);
}

function saveTopic(topic) {
  const topics = loadCollection(KEYS.topics);

  const index = topics.findIndex(t => t.id === topic.id);

  const now = Date.now();

  if (index >= 0) {
    topic.createdAt = topics[index].createdAt || topic.createdAt || now;
    topics[index] = topic;
  } else {
    topic.createdAt = topic.createdAt || now;
    topics.push(topic);
  }

  saveCollection(KEYS.topics, topics);

  return topic;
}

function deleteTopic(topicId) {
  removeFromCollection(KEYS.topics, topic => topic.id === topicId);
  removeFromCollection(KEYS.cards, card => card.topicId === topicId);
}

/* =====================================================================
   Notes
===================================================================== */

function getNotes() {
  return storeGet(KEYS.notes, {});
}

function getNote(topicId) {
  return getNotes()[topicId] || "";
}

function saveNote(topicId, text) {
  const notes = getNotes();

  notes[topicId] = text;

  storeSet(KEYS.notes, notes);
}

/* =====================================================================
   Stats
===================================================================== */

const DEFAULT_STATS = Object.freeze({
  totalCards: 0,
  highYieldCards: 0,
  lastRefreshed: null
});

function getStats() {
  return storeGet(KEYS.stats, DEFAULT_STATS);
}

function refreshStats() {
  const cards = getCards();

  const stats = {
    totalCards: cards.length,
    highYieldCards: cards.filter(
      card => card.layer >= 1 && card.layer <= 3
    ).length,
    lastRefreshed: Date.now()
  };

  storeSet(KEYS.stats, stats);

  return stats;
}

/* =====================================================================
   Theme
===================================================================== */

function getTheme() {
  try {
    return localStorage.getItem(KEYS.theme) || "white-blue";
  } catch (error) {
    console.error("Failed to load theme.", error);
    return "white-blue";
  }
}

function setTheme(themeId) {
  try {
    localStorage.setItem(KEYS.theme, themeId);
  } catch (error) {
    console.error("Failed to save theme.", error);
  }
}

/* =====================================================================
   Image Compression
===================================================================== */

/**
 * Compress an image using Canvas.
 *
 * @param {File} file
 * @param {number} [maxSize=800]
 * @param {number} [quality=0.6]
 * @returns {Promise<{base64:string,sizeKB:number,width:number,height:number}>}
 */
function compressImage(file, maxSize = 800, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = reject;

    reader.onload = event => {
      const image = new Image();

      image.onerror = reject;

      image.onload = () => {
        let width = image.width;
        let height = image.height;

        if (width > maxSize || height > maxSize) {
          if (width >= height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Canvas 2D context unavailable."));
          return;
        }

        context.drawImage(image, 0, 0, width, height);

        const base64 = canvas.toDataURL("image/jpeg", quality);

        const sizeKB = Math.round((base64.length * 3) / 4 / 1024);

        resolve({
          base64,
          sizeKB,
          width,
          height
        });
      };

      image.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
  }
