# Website Highlight Saver Chrome Extension

A Chrome extension built with React that allows users to highlight text on any webpage and save those highlights for later reference.

## Features

- **Text Selection & Highlighting**: Select any text on a webpage and save it with a single click
- **Persistent Storage**: All highlights are saved locally using Chrome's storage API
- **Popup Interface**: View all saved highlights in a clean, organized popup
- **Quick Actions**: Delete individual highlights or clear all highlights
- **Page Information**: See which page each highlight came from with click-to-visit functionality
- **Summary Feature**: Generate summaries of your saved highlights

## Installation

1. **Build the Extension**:
   ```bash
   npm install
   npm run build:extension
   ```

2. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder

## Usage

### Saving Highlights
1. Visit any webpage
2. Select text you want to highlight
3. Click the "Save Highlight?" popup that appears
4. The text is saved and visually highlighted on the page

### Viewing Highlights
1. Click the extension icon in the Chrome toolbar
2. View all your saved highlights in the popup
3. Click on a page title to revisit the original page
4. Delete individual highlights with the × button

### Managing Highlights
- **Delete Single**: Click the × button next to any highlight
- **Clear All**: Click "Clear All" to remove all highlights
- **Summarize**: Click "Summarize" to generate a summary of all your highlights

## Development

### Project Structure
```
extension/
├── public/
│   └── manifest.json         # Chrome extension manifest
├── src/
│   ├── contentScript.js      # Handles text selection and highlighting
│   ├── contentScript.css     # Styles for content script
│   ├── popup/
│   │   ├── Popup.jsx        # Main popup React component
│   │   └── Popup.css        # Popup styles
│   └── main.jsx             # React entry point
├── index.html               # Popup HTML
├── package.json
└── vite.config.js           # Vite configuration for extension build
```

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:extension` - Build extension with manifest
- `npm run lint` - Run ESLint

### Chrome APIs Used
- `chrome.storage.local` - Store highlights persistently
- `chrome.tabs` - Open pages from highlights
- Content Scripts - Detect text selection on web pages

## Future Enhancements

- **OpenAI Integration**: Connect to OpenAI API for AI-powered summaries
- **Export/Import**: Save highlights to file or import from other sources
- **Categories/Tags**: Organize highlights by topic or category
- **Search**: Find specific highlights quickly
- **Cloud Sync**: Sync highlights across devices

## Technical Details

- Built with React 19 and Vite
- Uses Chrome Extension Manifest V3
- Responsive design optimized for extension popup
- Local storage for data persistence
- Modern ES6+ JavaScript+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
