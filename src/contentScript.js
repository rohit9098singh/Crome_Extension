/* global chrome */

// Content script for detecting text selection and showing highlight popup
let highlightPopup = null;
let selectedText = '';
let selectedRange = null;

// Function to show the highlight popup
function showHighlightPopup() {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  
  if (text.length === 0) {
    hideHighlightPopup();
    return;
  }
  
  selectedText = text;
  selectedRange = selection.getRangeAt(0).cloneRange();
  
  // Remove existing popup
  hideHighlightPopup();
  
  // Create new popup
  highlightPopup = document.createElement('div');
  highlightPopup.className = 'highlight-popup';
  highlightPopup.textContent = 'Save Highlight?';
  
  // Position popup near the selection
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  highlightPopup.style.left = `${rect.left + window.scrollX}px`;
  highlightPopup.style.top = `${rect.bottom + window.scrollY + 5}px`;
  
  // Add click handler
  highlightPopup.addEventListener('click', saveHighlight);
  
  document.body.appendChild(highlightPopup);
  
  // Hide popup after 5 seconds
  setTimeout(() => {
    hideHighlightPopup();
  }, 5000);
}

// Function to hide the highlight popup
function hideHighlightPopup() {
  if (highlightPopup) {
    highlightPopup.remove();
    highlightPopup = null;
  }
}

// Function to save the highlight
async function saveHighlight() {
  if (!selectedText || !selectedRange) return;
  
  try {
    // Check if chrome.storage is available
    if (typeof chrome === 'undefined' || !chrome.storage) {
      console.error('Chrome storage API not available');
      return;
    }

    // Get existing highlights
    const result = await chrome.storage.local.get(['highlights']);
    const highlights = result.highlights || [];
    
    // Create new highlight object
    const newHighlight = {
      id: Date.now().toString(),
      text: selectedText,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      pageTitle: document.title
    };
    
    // Add to highlights array
    highlights.push(newHighlight);
    
    // Save to storage
    await chrome.storage.local.set({ highlights });
    
    // Add visual highlight to the page
    addVisualHighlight();
    
    // Hide popup
    hideHighlightPopup();
    
    // Clear selection
    window.getSelection().removeAllRanges();
    
    console.log('Highlight saved:', newHighlight);
  } catch (error) {
    console.error('Error saving highlight:', error);
    // Show user-friendly error message
    if (highlightPopup) {
      highlightPopup.textContent = 'Error saving highlight';
      highlightPopup.style.background = '#f44336';
      setTimeout(() => {
        hideHighlightPopup();
      }, 2000);
    }
  }
}

// Function to add visual highlight to the selected text
function addVisualHighlight() {
  if (!selectedRange) return;
  
  try {
    const span = document.createElement('span');
    span.className = 'saved-highlight';
    span.title = 'Saved highlight';
    
    selectedRange.surroundContents(span);
  } catch (error) {
    // If we can't surround the contents (e.g., selection spans multiple elements),
    // we'll skip the visual highlight
    console.log('Could not add visual highlight:', error);
  }
}

// Event listeners
document.addEventListener('mouseup', () => {
  // Small delay to ensure selection is complete
  setTimeout(() => {
    showHighlightPopup();
  }, 10);
});

document.addEventListener('mousedown', (event) => {
  // Hide popup when clicking elsewhere
  if (highlightPopup && !highlightPopup.contains(event.target)) {
    hideHighlightPopup();
  }
});

document.addEventListener('keydown', (event) => {
  // Hide popup on escape key
  if (event.key === 'Escape') {
    hideHighlightPopup();
  }
});

// Load and display existing highlights when page loads
document.addEventListener('DOMContentLoaded', loadExistingHighlights);

async function loadExistingHighlights() {
  try {
    // Check if chrome.storage is available
    if (typeof chrome === 'undefined' || !chrome.storage) {
      console.log('Chrome storage API not available - running in development mode');
      return;
    }

    const result = await chrome.storage.local.get(['highlights']);
    const highlights = result.highlights || [];
    
    // Filter highlights for current page
    const pageHighlights = highlights.filter(h => h.url === window.location.href);
    
    console.log(`Loaded ${pageHighlights.length} highlights for this page`);
  } catch (error) {
    console.error('Error loading highlights:', error);
  }
}
