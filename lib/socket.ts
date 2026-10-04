"use client";

import { io, Socket } from "socket.io-client";

declare global {
  var pulseSocket: Socket | undefined;
}

export const socket =
  global.pulseSocket ??
  io("http://localhost:5000", {
    autoConnect: false,
    transports: ["websocket"],
  });

if (process.env.NODE_ENV !== "production") {
  global.pulseSocket = socket;
}