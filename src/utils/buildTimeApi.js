/**
 * Build-Time API Utilities
 * 
 * These functions are used during Next.js static generation (getStaticProps/getStaticPaths)
 * to fetch data from the API at build time.
 * 
 * IMPORTANT: This runs on the server during build, not in the browser.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://admin.promptland.in';
const API_ENDPOINT = process.env.NEXT_PUBLIC_END_POINT || '/api/';
const DEFAULT_LANGUAGE_ID = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE_CODE || '14';

/**
 * Get authentication headers for API calls
 * 
 * Note: For build-time calls, we need a system token.
 * If you have a dedicated build token, add it to .env as NEXT_PUBLIC_BUILD_API_TOKEN
 * Otherwise, this will attempt to use a long-lived token.
 */
function getAuthHeaders() {
    // Option 1: Use dedicated build token from environment
    const buildToken = process.env.NEXT_PUBLIC_BUILD_API_TOKEN;

    if (buildToken) {
        return {
            'Authorization': `Bearer ${buildToken}`,
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
        };
    }

    // Option 2: For now, we'll make the API call without auth for build time
    // The API endpoint might be public for reading prompts
    return {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
    };
}

/**
 * Create URL-safe slug from text
 */
export function createSlug(text) {
    if (!text) return '';

    return text
        .toString()
        .toLowerCase()
        .trim()
        // Replace spaces with hyphens
        .replace(/\s+/g, '-')
        // Remove special characters
        .replace(/[^\w\-]+/g, '')
        // Replace multiple hyphens with single hyphen
        .replace(/\-\-+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

/**
 * Fetch all trending prompts at build time
 * 
 * @returns {Promise<Array>} Array of prompt objects
 */
export async function fetchAllTrendingPrompts() {
    try {
        const url = `${API_BASE_URL}${API_ENDPOINT}get_questions_by_level`;

        // Create FormData for the API request
        const formData = new FormData();
        formData.append('category', '3'); // Category 3 is for trending
        formData.append('language_id', DEFAULT_LANGUAGE_ID);
        formData.append('level', '1');

        console.log('[Build Time] Fetching all trending prompts from:', url);

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            // Note: Remove headers for FormData - fetch will set them automatically
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            console.error('[Build Time] API Error:', data.message);
            return [];
        }

        console.log(`[Build Time] Successfully fetched ${data.data?.length || 0} trending prompts`);
        return data.data || [];

    } catch (error) {
        console.error('[Build Time] Error fetching trending prompts:', error);
        // Return empty array instead of crashing the build
        return [];
    }
}

/**
 * Fetch all prompt heroes at build time (category 4)
 * 
 * @returns {Promise<Array>} Array of prompt hero objects
 */
export async function fetchAllPromptHeroes() {
    try {
        const url = `${API_BASE_URL}${API_ENDPOINT}get_questions_by_level`;

        // Create FormData for the API request
        const formData = new FormData();
        formData.append('category', '4'); // Category 4 is for prompt heroes
        formData.append('language_id', DEFAULT_LANGUAGE_ID);
        formData.append('level', '1');

        console.log('[Build Time] Fetching all prompt heroes from:', url);

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            console.error('[Build Time] API Error:', data.message);
            return [];
        }

        console.log(`[Build Time] Successfully fetched ${data.data?.length || 0} prompt heroes`);
        return data.data || [];

    } catch (error) {
        console.error('[Build Time] Error fetching prompt heroes:', error);
        // Return empty array instead of crashing the build
        return [];
    }
}

/**
 * Fetch a specific prompt by ID at build time
 * 
 * @param {string} promptId - The ID of the prompt to fetch
 * @returns {Promise<Object|null>} Prompt object or null if not found
 */
export async function fetchPromptById(promptId) {
    try {
        // Fetch all prompts (we can optimize this later if needed)
        const allPrompts = await fetchAllTrendingPrompts();

        // Find the specific prompt
        const prompt = allPrompts.find(p => p.id === promptId);

        if (!prompt) {
            console.warn(`[Build Time] Prompt with ID ${promptId} not found`);
            return null;
        }

        console.log(`[Build Time] Found prompt:`, prompt.question);
        return prompt;

    } catch (error) {
        console.error(`[Build Time] Error fetching prompt ${promptId}:`, error);
        return null;
    }
}

/**
 * Get recommended prompts (random selection excluding the current one)
 * 
 * @param {Array} allPrompts - All available prompts
 * @param {string} currentPromptId - ID of current prompt to exclude
 * @param {number} count - Number of recommendations to return
 * @returns {Array} Array of recommended prompts
 */
export function getRecommendedPrompts(allPrompts, currentPromptId, count = 4) {
    const filtered = allPrompts.filter(p => p.id !== currentPromptId);

    // Shuffle and take first 'count' items
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

/**
 * Build-time test function - can be removed after testing
 */
export async function testBuildTimeAPI() {
    console.log('=== Testing Build Time API ===');
    const prompts = await fetchAllTrendingPrompts();
    console.log(`Fetched ${prompts.length} prompts`);

    if (prompts.length > 0) {
        console.log('Sample prompt:', {
            id: prompts[0].id,
            question: prompts[0].question,
            slug: createSlug(prompts[0].question)
        });
    }

    return prompts;
}

/**
 * ==========================================
 * CATEGORY SECTION - Build Time Functions
 * ==========================================
 */

/**
 * Fetch all categories (excluding trending and specific IDs)
 * @returns {Promise<Array>} Array of category objects
 */
export async function fetchAllCategories() {
    try {
        const url = `${API_BASE_URL}${API_ENDPOINT}get_categories`;

        const formData = new FormData();
        formData.append('type', '1'); // Type 1 for main categories
        formData.append('language_id', DEFAULT_LANGUAGE_ID);

        console.log('[Build Time] Fetching all categories from:', url);

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            console.error('[Build Time] API Error:', data.message);
            return [];
        }

        // Filter out trending (id=3) and other excluded categories (id=4)
        const filteredCategories = data.data?.filter(cat => cat.id !== "3" && cat.id !== "4") || [];

        console.log(`[Build Time] Successfully fetched ${filteredCategories.length} categories`);
        return filteredCategories;

    } catch (error) {
        console.error('[Build Time] Error fetching categories:', error);
        return [];
    }
}

/**
 * Fetch all prompts for a specific category
 * @param {string} categoryId - Category ID
 * @param {string} subcategoryId - Subcategory ID (optional)
 * @returns {Promise<Array>} Array of prompt objects
 */
export async function fetchPromptsForCategory(categoryId, subcategoryId = '') {
    try {
        const url = `${API_BASE_URL}${API_ENDPOINT}get_questions_by_level`;

        const formData = new FormData();
        formData.append('category', categoryId);
        formData.append('language_id', DEFAULT_LANGUAGE_ID);
        formData.append('level', '1');
        if (subcategoryId) {
            formData.append('subcategory', subcategoryId);
        }

        console.log(`[Build Time] Fetching prompts for category ${categoryId}, subcategory ${subcategoryId || 'none'}`);

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            console.error('[Build Time] API Error:', data.message);
            return [];
        }

        console.log(`[Build Time] Successfully fetched ${data.data?.length || 0} prompts for category ${categoryId}`);
        return data.data || [];

    } catch (error) {
        console.error(`[Build Time] Error fetching prompts for category ${categoryId}:`, error);
        return [];
    }
}

/**
 * Fetch all prompts across all categories
 * @returns {Promise<Array>} Array of objects with category info and prompts
 */
export async function fetchAllCategoryPrompts() {
    try {
        const categories = await fetchAllCategories();
        const allPrompts = [];

        for (const category of categories) {
            const prompts = await fetchPromptsForCategory(category.id);
            allPrompts.push({
                category,
                prompts
            });
        }

        const totalPrompts = allPrompts.reduce((sum, item) => sum + item.prompts.length, 0);
        console.log(`[Build Time] Fetched ${totalPrompts} total prompts across ${categories.length} categories`);

        return allPrompts;

    } catch (error) {
        console.error('[Build Time] Error fetching all category prompts:', error);
        return [];
    }
}

