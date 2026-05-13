/**
 * NEURAL BRIDGE API (v16.2)
 * Centralized fetch utility for VoxFlow AI Production Core.
 * Communicates with Flask backend (localhost:5001) via Next.js Proxy.
 */

const API_BASE = "/api";

export async function neuralFetch(endpoint: string, options: RequestInit = {}) {
    // 1. Construct URL (Relative path to hit Next.js Proxy)
    const url = endpoint.startsWith('http') 
        ? endpoint 
        : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    // 2. Default Headers
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    // 3. Execution
    const response = await fetch(url, {
        ...options,
        headers,
    });

    // 4. Robust Response Handling
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Neural Error: ${response.status}`;
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (e) {
            errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return await response.json();
}

export const api = {
    get: (endpoint: string) => neuralFetch(endpoint, { method: 'GET' }),
    post: (endpoint: string, body: any) => neuralFetch(endpoint, { 
        method: 'POST', 
        body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    put: (endpoint: string, body: any) => neuralFetch(endpoint, { 
        method: 'PUT', 
        body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
    delete: (endpoint: string) => neuralFetch(endpoint, { method: 'DELETE' }),
};

export default api;
