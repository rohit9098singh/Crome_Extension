# Chrome Extension Installation Guide

## How to Install the Website Highlight Saver Extension

### Step 1: Build the Extension
```bash
npm install
npm run build:extension
```

### Step 2: Load Extension in Chrome

1. **Open Chrome Extensions Page**
   - Type `chrome://extensions/` in your address bar
   - OR: Chrome menu → More tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Navigate to your project folder
   - Select the `dist` folder (not the project root)
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "Website Highlight Saver" in your extensions list
   - The extension icon should appear in your Chrome toolbar

### Step 3: Test the Extension

1. **Test Text Highlighting**
   - Visit any website (try Wikipedia or a news site)
   - Select some text
   - Click "Save Highlight?" when it appears
   - The text should be highlighted in yellow

2. **Test Popup Interface**
   - Click the extension icon in the toolbar
   - You should see your saved highlight in the popup
   - Try deleting it or using the "Summarize" feature

### Troubleshooting

**Extension not showing up?**
- Make sure you selected the `dist` folder, not the project root
- Check that all files are present in the dist folder
- Try refreshing the extensions page

**Popup not working?**
- Check the Chrome DevTools console for errors
- Make sure you built the extension with `npm run build:extension`

**Content script not working?**
- Verify that contentScript.js and contentScript.css are in the dist folder
- Try refreshing the webpage after installing the extension

**Chrome APIs not working?**
- These only work when the extension is properly loaded as an unpacked extension
- The `chrome` object is not available in regular web development

### Development Workflow

1. Make changes to source files
2. Run `npm run build:extension`
3. Go to `chrome://extensions/`
4. Click the refresh button on your extension card
5. Test your changes

### File Structure in dist/
```
dist/
├── assets/
│   ├── index-[hash].css    # Bundled popup styles
│   └── index-[hash].js     # Bundled React popup
├── contentScript.css       # Content script styles
├── contentScript.js        # Content script logic
├── index.html             # Popup HTML
└── manifest.json          # Extension manifest
```
