/*
 * STORAGE.JS - Firebase Cloud + Local Cache Hybrid
 * ------------------------------------------------------------------
 * Uses Cloud Firestore for permanent cross-device storage,
 * but maintains localStorage caching so the app stays lightning fast.
 * ------------------------------------------------------------------
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  writeBatch 
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// Your exact Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDITAgKE4iVb14OTvZ8MIiT7NddxloZGzU",
  authDomain: "fcards-63e5a.firebaseapp.com",
  projectId: "fcards-63e5a",
  storageBucket: "fcards-63e5a.firebasestorage.app",
  messagingSenderId: "910533920343",
  appId: "1:910533920343:web:0ab4f05a815831e669c512"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const KEYS = Object.freeze({
  cards: "mimi_cards",
  topics: "mimi_topics",
  notes: "mimi_notes",
  stats: "mimi_stats",
  theme: "mimi_theme"
});

/* =====================================================================
   Generic Local Storage Helpers
===================================================================== */
function storeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return cloneFallback(fallback);
    return JSON.parse(raw);
  } catch (error) {
    return cloneFallback(fallback);
  }
}

function storeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function cloneFallback(value) {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") return { ...value };
  return value;
}

function loadCollection(key) { return storeGet(key, []); }
function saveCollection(key, collection) { return storeSet(key, collection); }

/* =====================================================================
   Firebase Cloud Sync Functions
===================================================================== */

// Pulls all cards from Firebase and saves them to local storage
window.syncCardsFromCloud = async function() {
  try {
    const cardsCol = collection(db, 'cards');
    const cardSnapshot = await getDocs(cardsCol);
    const cloudCards = cardSnapshot.docs.map(doc => doc.data());
    
    saveCollection(KEYS.cards, cloudCards);
    window.refreshStats();
    return cloudCards;
  } catch (error) {
    console.error("Failed to sync from cloud:", error);
    return window.getCards(); // Fallback to whatever is local
  }
};

// Uploads bulk cards to Firebase, then updates local storage
window.saveCardsBulkFirebase = async function(newCards) {
  const batch = writeBatch(db);
  let added = 0;
  const now = Date.now();

  newCards.forEach(card => {
    if (!card || !card.front) return;
    card.createdAt = now;
    card.updatedAt = now;

    // Use card ID as the database document ID
    const cardRef = doc(db, "cards", card.id);
    batch.set(cardRef, card, { merge: true });
    added++;
  });

  await batch.commit();
  await window.syncCardsFromCloud(); // Update local cache after upload
  return added;
};

/* =====================================================================
   Standard Local App Functions (Exposed to Window)
===================================================================== */

window.getCards = function() { return loadCollection(KEYS.cards); };
window.getTopics = function() { return loadCollection(KEYS.topics); };
window.getNotes = function() { return storeGet(KEYS.notes, {}); };

const DEFAULT_STATS = Object.freeze({
  totalCards: 0,
  highYieldCards: 0,
  lastRefreshed: null
});

window.getStats = function() {
  return storeGet(KEYS.stats, DEFAULT_STATS);
};

window.refreshStats = function() {
  const cards = window.getCards();
  const stats = {
    totalCards: cards.length,
    highYieldCards: cards.filter(c => c.layer >= 1 && c.layer <= 3).length,
    lastRefreshed: Date.now()
  };
  storeSet(KEYS.stats, stats);
  return stats;
};

window.getTheme = function() {
  try { return localStorage.getItem(KEYS.theme) || "white-blue"; } 
  catch (e) { return "white-blue"; }
};

window.setTheme = function(themeId) {
  try { localStorage.setItem(KEYS.theme, themeId); } 
  catch (e) {}
};
  
