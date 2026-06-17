const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, World!');
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});