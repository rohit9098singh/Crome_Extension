/* global chrome */

import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {
  const [highlights, setHighlights] = useState([]);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Load highlights on component mount
  useEffect(() => {
    loadHighlights();
  }, []);

  const loadHighlights = async () => {
    try {
      // Check if chrome.storage is available
      if (typeof chrome === 'undefined' || !chrome.storage) {
        console.error('Chrome storage API not available');
        setHighlights([]);
        return;
      }

      const result = await chrome.storage.local.get(['highlights']);
      const savedHighlights = result.highlights || [];
      setHighlights(savedHighlights.reverse()); // Show newest first
    } catch (error) {
      console.error('Error loading highlights:', error);
      setHighlights([]);
    }
  };

  const deleteHighlight = async (id) => {
    try {
      // Check if chrome.storage is available
      if (typeof chrome === 'undefined' || !chrome.storage) {
        console.error('Chrome storage API not available');
        return;
      }

      const updatedHighlights = highlights.filter(h => h.id !== id);
      await chrome.storage.local.set({ highlights: updatedHighlights.reverse() });
      setHighlights(updatedHighlights);
    } catch (error) {
      console.error('Error deleting highlight:', error);
    }
  };

  const clearAllHighlights = async () => {
    if (window.confirm('Are you sure you want to delete all highlights?')) {
      try {
        // Check if chrome.storage is available
        if (typeof chrome === 'undefined' || !chrome.storage) {
          console.error('Chrome storage API not available');
          return;
        }

        await chrome.storage.local.set({ highlights: [] });
        setHighlights([]);
      } catch (error) {
        console.error('Error clearing highlights:', error);
      }
    }
  };

  const summarizeHighlights = async () => {
    if (highlights.length === 0) {
      alert('No highlights to summarize!');
      return;
    }

    setIsLoading(true);
    setShowSummary(true);

    try {
      // For now, create a simple summary without API call
      // You can replace this with actual OpenAI API integration
      const highlightTexts = highlights.map(h => h.text).join('\n\n');
      const wordCount = highlightTexts.split(' ').length;
      
      // Create a more detailed summary with full highlight texts
      let detailedSummary = `Summary of ${highlights.length} highlight${highlights.length !== 1 ? 's' : ''} (${wordCount} words total):\n\n`;
      
      if (highlights.length === 1) {
        detailedSummary += `Your highlight:\n"${highlights[0].text}"\n\nFrom: ${highlights[0].pageTitle || 'Unknown Page'}`;
      } else {
        detailedSummary += `Your highlights cover various topics from different webpages:\n\n`;
        highlights.slice(0, 5).forEach((highlight, index) => {
          detailedSummary += `${index + 1}. "${highlight.text}"\n   Source: ${highlight.pageTitle || 'Unknown Page'}\n\n`;
        });
        
        if (highlights.length > 5) {
          detailedSummary += `... and ${highlights.length - 5} more highlight${highlights.length - 5 !== 1 ? 's' : ''}.`;
        }
      }
      
      setSummary(detailedSummary);
    } catch (error) {
      console.error('Error creating summary:', error);
      setSummary('Error creating summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openUrl = (url) => {
    try {
      // Check if chrome.tabs is available
      if (typeof chrome === 'undefined' || !chrome.tabs) {
        // Fallback to opening in same tab
        window.open(url, '_blank');
        return;
      }
      chrome.tabs.create({ url });
    } catch (error) {
      console.error('Error opening URL:', error);
      // Fallback to opening in same tab
      window.open(url, '_blank');
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h2>Highlight Saver</h2>
        <div className="header-buttons">
          {highlights.length > 0 && (
            <>
              <button 
                className="summarize-btn"
                onClick={summarizeHighlights}
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Summarize'}
              </button>
              <button 
                className="clear-btn"
                onClick={clearAllHighlights}
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {showSummary && (
        <div className="summary-section">
          <h3>Smart Summary</h3>
          <div className="summary-content">
            {isLoading ? (
              <div className="loading">Generating your personalized summary...</div>
            ) : (
              <p>{summary}</p>
            )}
          </div>
          <button 
            className="close-summary-btn"
            onClick={() => setShowSummary(false)}
          >
            Close Summary
          </button>
        </div>
      )}

      <div className="highlights-container">
        {highlights.length === 0 ? (
          <div className="empty-state">
            <p>No highlights saved yet!</p>
            <p className="empty-hint">
              Select text on any webpage and click "Save Highlight?" to start building your knowledge collection.
            </p>
          </div>
        ) : (
          <div className="highlights-list">
            {highlights.map((highlight) => (
              <div key={highlight.id} className="highlight-item">
                <div className="highlight-content">
                  <div className="highlight-text">
                    "{highlight.text}"
                  </div>
                  <div className="highlight-meta">
                    <div 
                      className="highlight-source"
                      onClick={() => openUrl(highlight.url)}
                      title="Click to open page"
                    >
                      {highlight.pageTitle || 'Unknown Page'}
                    </div>
                    <div className="highlight-date">
                      {formatDate(highlight.timestamp)}
                    </div>
                  </div>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => deleteHighlight(highlight.id)}
                  title="Delete highlight"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="popup-footer">
        <div className="highlight-count">
          {highlights.length} highlight{highlights.length !== 1 ? 's' : ''} in your collection
        </div>
      </div>
    </div>
  );
};

export default Popup;
