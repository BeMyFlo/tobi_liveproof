const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { WebSocketServer } = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const wss = new WebSocketServer({ noServer: true });

  // Map to track connections: key -> page -> count
  const connections = new Map();

  wss.on('connection', (ws, req) => {
    const { query } = parse(req.url, true);
    const { key, page } = query;

    if (!key || !page) {
      ws.close();
      return;
    }

    // Initialize tracking for this key and page
    if (!connections.has(key)) connections.set(key, new Map());
    const keyPages = connections.get(key);
    if (!keyPages.has(page)) keyPages.set(page, new Set());
    const pageClients = keyPages.get(page);

    pageClients.add(ws);

    const broadcast = () => {
      let count = pageClients.size;
      
      const message = JSON.stringify({ type: 'update', count });
      pageClients.forEach(client => {
        if (client.readyState === 1) client.send(message);
      });
    };

    broadcast();

    ws.on('close', () => {
      pageClients.delete(ws);
      broadcast();
    });

    ws.on('error', () => {
      pageClients.delete(ws);
      broadcast();
    });
  });

  server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url);

    if (pathname === '/api/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
