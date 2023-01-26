import { io } from "socket.io-client";

class SocketioService {
  socket;
  constructor() {}

  setupSocketConnection() {
    this.socket = io("http://localhost:3000");

    // this.socket.on("order", (data) => {
    //   console.log("order", data);
    // });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  order(key, msg) {
    this.socket.emit(`order`, msg);
  }

  fetchReceive(key) {
    return new Promise((resolve) => {
      this.socket.on(`${key}-receive`, (msg) => {
        resolve(msg);
      });
    });
  }

  fetchOrder() {
    return new Promise((resolve) => {
      this.socket.on(`order`, (msg) => {
        resolve(msg);
      });
    });
  }
}

export default new SocketioService();
