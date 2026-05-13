const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/**
 * VoxFlow Neural Bridge (Standardized)
 */
export async function neuralFetch(endpoint: string, options: RequestInit = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    
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
