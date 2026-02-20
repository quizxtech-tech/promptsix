/**
 * SEO Utilities - Helper functions for generating SEO metadata
 */

/**
 * Generate unique page metadata for prompts/questions
 */
export function generatePromptSEO({ prompt, categoryName, subcategoryName, siteUrl }) {
    const title = `${prompt.question} | ${categoryName || 'AI Prompts'}`;
    const description = prompt.optiona || `Explore ${prompt.question} - Professional AI prompt for ChatGPT, Gemini, and other AI models. Copy and use instantly.`;
    const canonical = `${siteUrl}/trending/prompt/${createSlug(prompt.question)}`;
    const image = prompt.image || `${siteUrl}/default-og-image.jpg`;

    const keywords = [
        prompt.question,
        "AI prompts",
        "ChatGPT prompts",
        "Gemini prompts",
        "AI image generation",
        categoryName,
        subcategoryName,
        "prompt engineering",
        "AI tools"
    ].filter(Boolean);

    return {
        title,
        description,
        keywords,
        canonical,
        image,
        imageAlt: `${prompt.question} - AI Prompt Preview`,
        ogType: 'article',
        publishedTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        section: categoryName,
        tags: keywords,
    };
}

/**
 * Generate metadata for category listing pages
 */
export function generateCategoryListingSEO({ categoryName, promptCount, siteUrl }) {
    const title = `${categoryName} AI Prompts | Browse ${promptCount}+ Prompts`;
    const description = `Discover ${promptCount}+ professional ${categoryName} AI prompts for ChatGPT, Gemini, and other AI models. Copy and use instantly.`;
    const canonical = `${siteUrl}/category/${createSlug(categoryName)}`;

    const keywords = [
        `${categoryName} prompts`,
        "AI prompts",
        "ChatGPT prompts",
        "Gemini prompts",
        "prompt library",
        "AI tools"
    ];

    return {
        title,
        description,
        keywords,
        canonical,
        image: `${siteUrl}/og-category-${createSlug(categoryName)}.jpg`,
        imageAlt: `${categoryName} AI Prompts Collection`,
        ogType: 'website',
    };
}

/**
 * Generate metadata for trending page
 */
export function generateTrendingSEO({ promptCount, siteUrl }) {
    const title = `Trending AI Prompts | ${promptCount}+ Popular Prompts`;
    const description = `Explore ${promptCount}+ trending AI prompts used by thousands. Professional prompts for ChatGPT, Gemini, Claude, and more. Updated daily.`;
    const canonical = `${siteUrl}/trending`;

    const keywords = [
        "trending AI prompts",
        "popular prompts",
        "ChatGPT trending",
        "AI prompt library",
        "best AI prompts",
        "prompt engineering"
    ];

    return {
        title,
        description,
        keywords,
        canonical,
        image: `${siteUrl}/og-trending.jpg`,
        imageAlt: "Trending AI Prompts Collection",
        ogType: 'website',
    };
}

/**
 * Generate metadata for home page
 */
export function generateHomeSEO({ siteUrl }) {
    const title = "AI Prompt Library | 1000+ ChatGPT, Gemini & AI Prompts";
    const description = "Discover the largest library of professional AI prompts for ChatGPT, Gemini, Claude, and more. Browse categories, trending prompts, and instant-use templates.";
    const canonical = siteUrl;

    const keywords = [
        "AI prompts",
        "ChatGPT prompts",
        "Gemini prompts",
        "Claude prompts",
        "prompt library",
        "AI tools",
        "prompt engineering",
        "AI assistant prompts"
    ];

    return {
        title,
        description,
        keywords,
        canonical,
        image: `${siteUrl}/og-home.jpg`,
        imageAlt: "AI Prompt Library - Professional Prompts for All AI Models",
        ogType: 'website',
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
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

/**
 * Truncate text for descriptions
 */
export function truncateText(text, maxLength = 160) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}
