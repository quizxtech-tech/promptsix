import React from 'react';
import { generateStructuredData } from '@/components/SEO/SEOHead';
import { generateHomeSEO } from '@/utils/seoUtils';
import HomeComp from '@/components/Static-Pages/NewHomeComp';
import { fetchAllTrendingPrompts, fetchAllPromptHeroes } from '@/utils/buildTimeApi';
import trendingData from '@/data/trending.js';
import promptHeroes from '@/data/promptHeroes.js';
import Layout from '@/components/Layout/Layout';

const Home = ({ initialTrendingPrompts, initialPromptHeroes }) => {
  // Data is passed via props and accessible in browser via hydration
  return (
    <Layout>
      <HomeComp
        initialTrendingPrompts={initialTrendingPrompts}
        initialPromptHeroes={initialPromptHeroes}
      />
    </Layout>
  )
}

// Enable static generation and pass SEO data through pageProps
export async function getStaticProps() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://promptland.in';

  // Generate home page SEO data
  const seoData = generateHomeSEO({ siteUrl });

  // Generate structured data for home page
  const seoStructuredData = [
    // Website Schema
    generateStructuredData.website({
      name: process.env.NEXT_PUBLIC_SITE_NAME || "AI Prompt Library",
      url: siteUrl,
      description: "The largest library of professional AI prompts for ChatGPT, Gemini, Claude, and more"
    }),

    // Organization Schema
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": process.env.NEXT_PUBLIC_SITE_NAME || "AI Prompt Library",
      "url": siteUrl,
      "logo": `${siteUrl}/logo.png`,
      "description": "Professional AI prompts for image generation, text transformation, and creative workflows",
      "sameAs": [
        // Add your social media links here
      ]
    }
  ];

  // Fetch API data at build time
  let trendingPrompts = [];
  let promptHeroesData = [];

  try {
    // Fetch trending prompts (category 3)
    const apiTrendingPrompts = await fetchAllTrendingPrompts();

    if (apiTrendingPrompts && apiTrendingPrompts.length > 0) {
      // Transform API data to match expected format
      trendingPrompts = apiTrendingPrompts.map((data) => {
        const getRandomUses = () => {
          const randomNum = (Math.random() * 15 + 5).toFixed(1);
          return `${randomNum}K`;
        };

        const getRandomTag = () => {
          const tags = ["Hot", "Trending", "Popular", "New", "Featured"];
          return tags[Math.floor(Math.random() * tags.length)];
        };

        return {
          title: data?.question || "Untitled Prompt",
          description: data?.optiona || "No description available",
          image: data?.image || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop",
          uses: data?.optionc && data.optionc.trim() !== "" ? data.optionc : getRandomUses(),
          tag: data?.optiond && data.optiond.trim() !== "" ? data.optiond : getRandomTag(),
          prompt: data?.optionb || "",
          id: data?.id
        };
      }).reverse();

      console.log(`[Build Time] Transformed ${trendingPrompts.length} trending prompts for home page`);
    } else {
      // Fallback to static data
      console.log('[Build Time] Using fallback trending data');
      trendingPrompts = trendingData.reverse();
    }

    // Fetch prompt heroes (category 4)
    const apiPromptHeroes = await fetchAllPromptHeroes();

    if (apiPromptHeroes && apiPromptHeroes.length > 0) {
      promptHeroesData = apiPromptHeroes.reverse();
      console.log(`[Build Time] Fetched ${promptHeroesData.length} prompt heroes for home page`);
    } else {
      // Fallback to static data
      console.log('[Build Time] Using fallback prompt heroes data');
      promptHeroesData = promptHeroes.reverse();
    }

  } catch (error) {
    console.error('[Build Time] Error fetching home page data:', error);
    // Use fallback data
    trendingPrompts = trendingData.reverse();
    promptHeroesData = promptHeroes.reverse();
  }

  return {
    props: {
      seoData,
      seoStructuredData,
      initialTrendingPrompts: trendingPrompts,
      initialPromptHeroes: promptHeroesData
    },
  };
}

export default Home
