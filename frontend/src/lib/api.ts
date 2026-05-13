const API_BASE = "/api"; // Use relative path for Next.js rewrites proxy

/**
 * VoxFlow Neural Bridge (Standardized Proxy)
 */
export async function neuralFetch(endpoint: string, options: RequestInit = {}) {
    // If endpoint starts with /, it's relative to our proxy
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Neural Error: ${response.status}`);
    }

    return await response.json();
}

export const api = {
    get: (endpoint: string) => neuralFetch(endpoint, { method: 'GET' }),
    post: (endpoint: string, body: any) => neuralFetch(endpoint, { 
        method: 'POST', 
        body: JSON.stringify(body) 
    }),
};

export default API_BASE;
