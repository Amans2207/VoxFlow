const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"; // Unified Titan-X Bridge

/**
 * Neural Core: Robust Fetch with Global Error Intercept
 * Prevents "Failed to Fetch" crashes and alerts user of network/routing failures.
 */
export async function robustFetch(endpoint: string, options: RequestInit = {}, retries = 3, backoff = 1000) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.message || `Neural Core: ${response.status} (${response.statusText})`;
                
                // GLOBAL ERROR INTERCEPTOR: Alert user of critical failures
                if (typeof window !== 'undefined') {
                    console.error(`[Neural Link Failure] ${url} -> ${errorMsg}`);
                }
                
                throw new Error(errorMsg);
            }

            return await response.json();
        } catch (err: any) {
            const isLastAttempt = i === retries - 1;
            if (isLastAttempt) {
                if (typeof window !== 'undefined') {
                    // Critical notification for UI
                    const event = new CustomEvent('neural_error', { detail: err.message });
                    window.dispatchEvent(event);
                }
                throw err;
            }
            await new Promise(resolve => setTimeout(resolve, backoff));
            backoff *= 2; 
        }
    }
}

export const api = {
    get: (endpoint: string, options?: RequestInit) => robustFetch(endpoint, { ...options, method: 'GET' }),
    post: (endpoint: string, data: any, options?: RequestInit) => robustFetch(endpoint, { 
        ...options, 
        method: 'POST', 
        body: JSON.stringify(data) 
    }),
    put: (endpoint: string, data: any, options?: RequestInit) => robustFetch(endpoint, { 
        ...options, 
        method: 'PUT', 
        body: JSON.stringify(data) 
    }),
    delete: (endpoint: string, options?: RequestInit) => robustFetch(endpoint, { ...options, method: 'DELETE' }),
};

export default API_BASE;
