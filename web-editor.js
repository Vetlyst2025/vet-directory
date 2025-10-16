const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3002;
const PROJECT_DIR = __dirname;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve the editor UI
  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(getEditorHTML());
    return;
  }

  // API: List files
  if (pathname === '/api/files') {
    try {
      const files = listFiles(PROJECT_DIR, '', 0);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(files));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // API: Read file
  if (pathname === '/api/read') {
    const filePath = query.path;
    if (!filePath) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing path parameter' }));
      return;
    }

    const fullPath = path.join(PROJECT_DIR, filePath);
    if (!fullPath.startsWith(PROJECT_DIR)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Access denied' }));
      return;
    }

    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ content }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // API: Write file
  if (pathname === '/api/write' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { path: filePath, content } = JSON.parse(body);
        if (!filePath) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing path' }));
          return;
        }

        const fullPath = path.join(PROJECT_DIR, filePath);
        if (!fullPath.startsWith(PROJECT_DIR)) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Access denied' }));
          return;
        }

        fs.writeFileSync(fullPath, content, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

function listFiles(dir, prefix, depth) {
  if (depth > 3) return [];
  
  const ignore = ['node_modules', '.next', '.git', 'dist', 'build', '.env'];
  const files = [];

  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (ignore.includes(item)) continue;
      
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      const relativePath = prefix ? `${prefix}/${item}` : item;

      if (stat.isDirectory()) {
        files.push({ name: item, path: relativePath, type: 'folder', children: listFiles(fullPath, relativePath, depth + 1) });
      } else {
        files.push({ name: item, path: relativePath, type: 'file' });
      }
    }
  } catch (err) {
    console.error('Error listing files:', err);
  }

  return files;
}

function getEditorHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vet Directory - Web Editor</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #1e1e1e; color: #e0e0e0; }
    .container { display: flex; height: 100vh; }
    .sidebar { width: 250px; background: #252526; border-right: 1px solid #3e3e42; overflow-y: auto; padding: 10px; }
    .editor-area { flex: 1; display: flex; flex-direction: column; }
    .tabs { display: flex; background: #2d2d30; border-bottom: 1px solid #3e3e42; overflow-x: auto; }
    .tab { padding: 10px 15px; cursor: pointer; border-right: 1px solid #3e3e42; white-space: nowrap; }
    .tab.active { background: #1e1e1e; border-bottom: 2px solid #007acc; }
    .tab:hover { background: #2d2d30; }
    .tab-close { margin-left: 10px; cursor: pointer; }
    .editor-content { flex: 1; display: flex; }
    textarea { flex: 1; background: #1e1e1e; color: #d4d4d4; border: none; padding: 15px; font-family: 'Courier New', monospace; font-size: 14px; resize: none; }
    .file-tree { font-size: 13px; }
    .file-item { padding: 5px 10px; cursor: pointer; user-select: none; }
    .file-item:hover { background: #3e3e42; }
    .file-item.folder { font-weight: bold; }
    .file-item.file { padding-left: 25px; }
    .file-item.open > .folder-icon::before { content: '▼ '; }
    .file-item.open > .folder-icon::before { content: '▼ '; }
    .folder-icon::before { content: '▶ '; }
    .children { display: none; }
    .file-item.open .children { display: block; }
    .save-btn { padding: 10px 20px; background: #007acc; color: white; border: none; cursor: pointer; margin: 10px; border-radius: 4px; }
    .save-btn:hover { background: #005a9e; }
    .status { padding: 10px; background: #2d2d30; border-top: 1px solid #3e3e42; font-size: 12px; }
    .status.success { color: #4ec9b0; }
    .status.error { color: #f48771; }
  </style>
</head>
<body>
  <div class="container">
    <div class="sidebar">
      <h3 style="margin-bottom: 10px;">Files</h3>
      <div class="file-tree" id="fileTree"></div>
    </div>
    <div class="editor-area">
      <div class="tabs" id="tabs"></div>
      <div class="editor-content">
        <textarea id="editor" placeholder="Select a file to edit..."></textarea>
      </div>
      <button class="save-btn" onclick="saveFile()">💾 Save</button>
      <div class="status" id="status"></div>
    </div>
  </div>

  <script>
    let openFiles = {};
    let currentFile = null;

    async function loadFiles() {
      try {
        const res = await fetch('/api/files');
        const files = await res.json();
        renderFileTree(files, document.getElementById('fileTree'));
      } catch (err) {
        console.error('Error loading files:', err);
      }
    }

    function renderFileTree(files, container) {
      container.innerHTML = '';
      for (const file of files) {
        const div = document.createElement('div');
        div.className = \`file-item \${file.type}\`;
        
        if (file.type === 'folder') {
          div.innerHTML = \`<span class="folder-icon"></span>\${file.name}\`;
          div.onclick = (e) => {
            e.stopPropagation();
            div.classList.toggle('open');
          };
          const childrenDiv = document.createElement('div');
          childrenDiv.className = 'children';
          renderFileTree(file.children || [], childrenDiv);
          div.appendChild(childrenDiv);
        } else {
          div.textContent = file.name;
          div.onclick = () => openFile(file.path, file.name);
        }
        container.appendChild(div);
      }
    }

    async function openFile(filePath, fileName) {
      try {
        const res = await fetch(\`/api/read?path=\${encodeURIComponent(filePath)}\`);
        const data = await res.json();
        
        if (data.error) {
          showStatus('Error: ' + data.error, 'error');
          return;
        }

        openFiles[filePath] = data.content;
        currentFile = filePath;
        
        // Update tabs
        updateTabs();
        
        // Update editor
        document.getElementById('editor').value = data.content;
        showStatus(\`Opened: \${fileName}\`, 'success');
      } catch (err) {
        showStatus('Error: ' + err.message, 'error');
      }
    }

    function updateTabs() {
      const tabsDiv = document.getElementById('tabs');
      tabsDiv.innerHTML = '';
      
      for (const filePath in openFiles) {
        const tab = document.createElement('div');
        tab.className = 'tab' + (filePath === currentFile ? ' active' : '');
        const fileName = filePath.split('/').pop();
        tab.innerHTML = \`\${fileName} <span class="tab-close" onclick="closeFile('\${filePath}')">✕</span>\`;
        tab.onclick = () => {
          currentFile = filePath;
          document.getElementById('editor').value = openFiles[filePath];
          updateTabs();
        };
        tabsDiv.appendChild(tab);
      }
    }

    function closeFile(filePath) {
      delete openFiles[filePath];
      if (currentFile === filePath) {
        currentFile = Object.keys(openFiles)[0] || null;
        if (currentFile) {
          document.getElementById('editor').value = openFiles[currentFile];
        } else {
          document.getElementById('editor').value = '';
        }
      }
      updateTabs();
    }

    async function saveFile() {
      if (!currentFile) {
        showStatus('No file selected', 'error');
        return;
      }

      const content = document.getElementById('editor').value;
      try {
        const res = await fetch('/api/write', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: currentFile, content })
        });
        const data = await res.json();
        
        if (data.error) {
          showStatus('Error: ' + data.error, 'error');
        } else {
          openFiles[currentFile] = content;
          showStatus('✓ Saved: ' + currentFile, 'success');
        }
      } catch (err) {
        showStatus('Error: ' + err.message, 'error');
      }
    }

    function showStatus(msg, type) {
      const status = document.getElementById('status');
      status.textContent = msg;
      status.className = 'status ' + type;
      setTimeout(() => status.textContent = '', 3000);
    }

    // Load files on startup
    loadFiles();
  </script>
</body>
</html>
  `;
}

server.listen(PORT, () => {
  console.log(`Web Editor running at http://localhost:${PORT}`);
});
