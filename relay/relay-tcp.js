// Relais TCP SchoolBoy Runaway : code de salon a 4 chiffres, 2 joueurs max.
// Usage : node relay-tcp.js [port]      (defaut 9000)
const net = require('net');
const PORT = parseInt(process.argv[2] || '9000', 10);
const rooms = new Map();

net.createServer((sock) => {
  sock.setNoDelay(true);
  let buf = Buffer.alloc(0);
  let joined = false;
  let room = null;
  let myCode = null;

  sock.on('data', (d) => {
    if (joined) {
      if (room) for (const c of room.clients) if (c !== sock) { try { c.write(d); } catch (e) {} }
      return;
    }
    buf = Buffer.concat([buf, d]);
    const idx = buf.indexOf(10);
    if (idx < 0) { if (buf.length > 256) sock.destroy(); return; }
    const line = buf.slice(0, idx).toString().trim();
    const rest = buf.slice(idx + 1);
    const parts = line.split(/\s+/);
    if (parts[0] !== 'SBMP') { sock.end('BAD\n'); return; }
    const code = (parts[1] || '0000').slice(0, 12);
    let r = rooms.get(code);
    if (!r) { r = { clients: [] }; rooms.set(code, r); }
    if (r.clients.length >= 2) { sock.end('FULL\n'); return; }
    r.clients.push(sock);
    room = r; joined = true; myCode = code;
    const role = r.clients.length === 1 ? 'HOST' : 'PEER';
    try { sock.write(role + '\n'); } catch (e) {}
    console.log(new Date().toISOString(), 'salon', code, '->', role);
    if (rest.length) for (const c of r.clients) if (c !== sock) { try { c.write(rest); } catch (e) {} }
  });

  sock.on('error', () => {});
  sock.on('close', () => {
    if (!room) return;
    room.clients = room.clients.filter((c) => c !== sock);
    if (room.clients.length === 0 && myCode) rooms.delete(myCode);
  });
}).listen(PORT, '0.0.0.0', () => console.log('Relais TCP pret sur le port ' + PORT));
