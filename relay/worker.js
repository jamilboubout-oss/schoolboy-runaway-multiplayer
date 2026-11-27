// SchoolBoy Multiplayer relay: hibernatable WebSockets + binary packet relay.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/room\/([0-9]{4,12})$/);
    if (!match) return new Response("SchoolBoy relay OK", { status: 200 });
    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
      return new Response("WebSocket upgrade required", { status: 426 });
    }
    return env.ROOM.get(env.ROOM.idFromName(match[1])).fetch(request);
  },
};

export class Room {
  constructor(state) {
    this.state = state;
  }

  async fetch() {
    return this.state.blockConcurrencyWhile(async () => {
      const live = this.state.getWebSockets("room").filter((socket) => socket.readyState === WebSocket.OPEN);
      if (live.length >= 2) return new Response("FULL", { status: 409 });

      const role = live.length === 0 ? "HOST" : "PEER";
      const pair = new WebSocketPair();
      const client = pair[0];
      const server = pair[1];
      server.serializeAttachment({ role });
      this.state.acceptWebSocket(server, ["room"]);

      try { server.send("ROLE:" + role); } catch (_) {}
      if (live.length === 1) {
        try { live[0].send("PEER_JOINED"); } catch (_) {}
        try { server.send("PEER_JOINED"); } catch (_) {}
      }
      return new Response(null, { status: 101, webSocket: client });
    });
  }

  webSocketMessage(sender, message) {
    if (typeof message === "string") return;
    for (const peer of this.state.getWebSockets("room")) {
      if (peer === sender || peer.readyState !== WebSocket.OPEN) continue;
      try { peer.send(message); } catch (_) {}
    }
  }

  webSocketClose(sender) {
    this.notifyPeerLeft(sender);
  }

  webSocketError(sender) {
    this.notifyPeerLeft(sender);
  }

  notifyPeerLeft(leaving) {
    for (const peer of this.state.getWebSockets("room")) {
      if (peer === leaving || peer.readyState !== WebSocket.OPEN) continue;
      try { peer.send("PEER_LEFT"); } catch (_) {}
    }
  }
}
