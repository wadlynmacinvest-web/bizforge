const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let filePath;

    // Route requests
    if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
        filePath = path.join(__dirname, 'index.html');
    } else if (parsedUrl.pathname === '/app.js') {
        filePath = path.join(__dirname, 'app.js');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
    }

    // Read and serve files
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error');
            return;
        }

        // Set appropriate content type
        let contentType = 'text/html';
        if (filePath.endsWith('.js')) {
            contentType = 'application/javascript';
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 BizForge server running at http://localhost:${PORT}`);
    console.log(`📂 Open your browser and navigate to http://localhost:${PORT}`);
    console.log(`✨ Press Ctrl+C to stop the server`);
});
