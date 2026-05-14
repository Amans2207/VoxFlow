import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'], // Allow polling fallback for stability
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
});

socket.on('connect', () => {
    console.log('%c[Neural Link] Connection Established ⚡', 'color: #10b981; font-weight: bold');
    
    // Heartbeat mechanism
    const heartbeat = setInterval(() => {
        if (socket.connected) {
            socket.emit('ping');
        } else {
            clearInterval(heartbeat);
        }
    }, 15000);
});

socket.on('disconnect', () => {
    console.log('%c[Neural Link] Connection Severed ⚠️', 'color: #ef4444; font-weight: bold');
});

socket.on('connect_error', (err) => {
    // If websocket fails, it will automatically try polling now
    console.warn('[Neural Link] Handshake Alert:', err.message);
});

socket.on('pong', () => {
    // Neural heartbeat received
});
