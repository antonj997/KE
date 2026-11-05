const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const allowed = new Set(['index.html','styles.css','app.js','assets/kragsta-elektriska.svg','assets/kragsta-icon.svg']);
const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/, '') || 'index.html';
  if (!allowed.has(relative)) {res.writeHead(404);res.end('Not found');return;}
  fs.readFile(path.join(root,relative),(error,contents)=>{
    if(error){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(relative)],'Cache-Control':'no-store'});res.end(contents);
  });
});
server.listen(4173,'127.0.0.1',()=>console.log('Preview ready at http://127.0.0.1:4173'));
