import Head from "next/head";

/**
 * SEO Component - Generates comprehensive, structured metadata for each page
 * 
 * Includes:
 * - Title & Description
 * - Open Graph (Facebook, LinkedIn, etc.)
 * - Twitter Cards
 * - JSON-LD Structured Data
 * - Canonical URLs
 * - Keywords
 */

export default function SEOHead({
    // Basic Meta
    title,
    description,
    keywords = [],

    // URLs
    canonical,

    // Images
    image,
    imageAlt,
    imageWidth = "1200",
    imageHeight = "630",

    // Open Graph
    ogType = "website",
    ogLocale = "en_US",

    // Twitter
    twitterCard = "summary_large_image",
    twitterSite = "@yoursite",
    twitterCreator = "@yourhandle",

    // Article specific (for blog posts, prompts)
    publishedTime,
    modifiedTime,
    author = "AI Prompt Library",
    section,
    tags = [],

    // Structured Data
    structuredData,

    // Additional
    robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    noindex = false,
    nofollow = false,
}) {
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "AI Prompt Library";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";

    // Build robots content
    const robotsContent = noindex || nofollow
        ? `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`
        : robots;

    // Ensure absolute URLs
    const absoluteCanonical = canonical?.startsWith('http') ? canonical : `${siteUrl}${canonical}`;
    const absoluteImage = image?.startsWith('http') ? image : `${siteUrl}${image}`;

    // Clean keywords
    const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

    return (
        <Head>
            {/* ========== PRIMARY META TAGS ========== */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            {keywordsString && <meta name="keywords" content={keywordsString} />}
            <meta name="author" content={author} />
            <meta name="robots" content={robotsContent} />
            <meta name="googlebot" content={robotsContent} />
            {canonical && <link rel="canonical" href={absoluteCanonical} />}

            {/* ========== OPEN GRAPH (Facebook, LinkedIn, etc.) ========== */}
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {canonical && <meta property="og:url" content={absoluteCanonical} />}
            <meta property="og:locale" content={ogLocale} />

            {/* OG Images */}
            {image && (
                <>
                    <meta property="og:image" content={absoluteImage} />
                    <meta property="og:image:secure_url" content={absoluteImage} />
                    <meta property="og:image:width" content={imageWidth} />
                    <meta property="og:image:height" content={imageHeight} />
                    {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
                </>
            )}

            {/* Article specific OG tags */}
            {ogType === 'article' && (
                <>
                    {publishedTime && <meta property="article:published_time" content={publishedTime} />}
                    {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
                    {author && <meta property="article:author" content={author} />}
                    {section && <meta property="article:section" content={section} />}
                    {tags.map((tag, index) => (
                        <meta key={index} property="article:tag" content={tag} />
                    ))}
                </>
            )}

            {/* ========== TWITTER CARD ========== */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:site" content={twitterSite} />
            <meta name="twitter:creator" content={twitterCreator} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={absoluteImage} />}
            {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

            {/* ========== ADDITIONAL META TAGS ========== */}
            <meta name="theme-color" content="#8b5cf6" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content={siteName} />
            <meta name="format-detection" content="telephone=no" />

            {/* ========== STRUCTURED DATA (JSON-LD) ========== */}
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            )}

            {/* ========== PRECONNECT FOR PERFORMANCE ========== */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
            <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        </Head>
    );
}

/**
 * Helper function to generate structured data for different content types
 */
export const generateStructuredData = {
    /**
     * Article/Prompt Schema
     */
    article: ({ title, description, image, url, datePublished, dateModified, author }) => ({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": image,
        "url": url,
        "datePublished": datePublished || new Date().toISOString(),
        "dateModified": dateModified || new Date().toISOString(),
        "author": {
            "@type": "Organization",
            "name": author || "AI Prompt Library"
        },
        "publisher": {
            "@type": "Organization",
            "name": process.env.NEXT_PUBLIC_SITE_NAME || "AI Prompt Library",
            "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/logo.png`
            }
        }
    }),

    /**
     * Breadcrumb Schema
     */
    breadcrumb: (items) => ({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    }),

    /**
     * Q&A Schema (for prompts)
     */
    qaPage: ({ question, questionText, answer }) => ({
        "@context": "https://schema.org",
        "@type": "QAPage",
        "mainEntity": {
            "@type": "Question",
            "name": question,
            "text": questionText,
            "answerCount": 1,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": answer
            }
        }
    }),

    /**
     * How-To Schema (for prompt usage)
     */
    howTo: ({ name, description, steps }) => ({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": name,
        "description": description,
        "step": steps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.name,
            "text": step.text
        }))
    }),

    /**
     * Website/Organization Schema
     */
    website: ({ name, url, description }) => ({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": name,
        "url": url,
        "description": description,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${url}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    }),

    /**
     * ItemList Schema (for listing pages)
     */
    itemList: ({ name, items }) => ({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": name,
        "numberOfItems": items.length,
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": item.url,
            "name": item.name
        }))
    })
};
