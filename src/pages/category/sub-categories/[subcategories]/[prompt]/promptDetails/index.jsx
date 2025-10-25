"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getQuestionApi } from "@/api/apiRoutes";
import { getSelectedCategory, getSelectedSubCategory } from "@/store/reducers/tempDataSlice";
import { IoCopyOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmarkCircle, IoSparkles, IoArrowForward } from "react-icons/io5";

import chatGPT from "../../../../../../assets/images/chatgpt.svg"; 
import gemini from "../../../../../../assets/images/gemini.svg"; 
import perplexity from "../../../../../../assets/images/perplexity.svg"; 

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

// AI Models data
const aiModels = [
  { name: "ChatGPT", image: chatGPT, url: "https://chat.openai.com", description: "OpenAI's conversational AI" },
  { name: "Bard", image: gemini, url: "https://bard.google.com", description: "Google's AI assistant" },
  { name: "Claude", image: perplexity, url: "https://claude.ai", description: "Anthropic's AI assistant" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const cardHoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.03,
    y: -8,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  }
};

const imageVariants = {
  hidden: { scale: 1.2, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

const PromptDetails = () => {
  const [questionDetails, setQuestionDetails] = useState(null);
  const [recommendedQuestions, setRecommendedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const selectcurrentLanguage = useSelector(selectCurrentLanguage);
  const selectedCategory = useSelector(getSelectedCategory);
  const selectedSubCategory = useSelector(getSelectedSubCategory);
  const router = useRouter();
  const { catid, subcatid, questionId } = router.query;

  // SEO: Generate dynamic meta information
  const generateMetaData = () => {
    if (!questionDetails) return null;

    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : `${siteUrl}${router.asPath}`;
    const siteName = "AI Prompt Library"; // Change to your site name
    
    const title = `${questionDetails.question} | ${siteName}`;
    const description = questionDetails.optiona || `Explore ${questionDetails.question} - Professional AI prompts for ChatGPT, Claude, and Bard. Get instant results with our curated prompt library.`;
    const imageUrl = questionDetails.image || `${siteUrl}/default-og-image.jpg`;
    
    // Generate keywords from question and category
    const keywords = [
      questionDetails.question,
      "AI prompts",
      "ChatGPT prompts",
      "Claude AI",
      "Bard prompts",
      selectedCategory?.category_name,
      selectedSubCategory?.subcategory_name,
      "AI assistant",
      "prompt engineering",
      "AI tools"
    ].filter(Boolean).join(", ");

    return { title, description, imageUrl, currentUrl, keywords, siteName };
  };

  // SEO: Generate JSON-LD structured data
  const generateStructuredData = () => {
    if (!questionDetails) return null;

    const metaData = generateMetaData();
    
    // Article Schema
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": questionDetails.question,
      "description": questionDetails.optiona,
      "image": questionDetails.image,
      "author": {
        "@type": "Organization",
        "name": metaData.siteName
      },
      "publisher": {
        "@type": "Organization",
        "name": metaData.siteName,
        "logo": {
          "@type": "ImageObject",
          "url": `${metaData.currentUrl.split('/').slice(0, 3).join('/')}/logo.png`
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString()
    };

    // BreadcrumbList Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": metaData.currentUrl.split('/').slice(0, 3).join('/')
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": selectedCategory?.category_name || "Category",
          "item": `${metaData.currentUrl.split('/').slice(0, 3).join('/')}/category/${catid}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": questionDetails.question,
          "item": metaData.currentUrl
        }
      ]
    };

    // Q&A Schema
    const qaSchema = {
      "@context": "https://schema.org",
      "@type": "QAPage",
      "mainEntity": {
        "@type": "Question",
        "name": questionDetails.question,
        "text": questionDetails.optiona,
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": questionDetails.optionb
        }
      }
    };

    // HowTo Schema for prompt usage
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `How to use: ${questionDetails.question}`,
      "description": questionDetails.optiona,
      "step": [
        {
          "@type": "HowToStep",
          "name": "Copy the prompt",
          "text": "Click the copy button to copy the AI prompt to your clipboard"
        },
        {
          "@type": "HowToStep",
          "name": "Choose an AI model",
          "text": "Select from ChatGPT, Bard, or Claude AI models"
        },
        {
          "@type": "HowToStep",
          "name": "Paste and generate",
          "text": "Paste the prompt into your chosen AI model and get results"
        }
      ]
    };

    return { articleSchema, breadcrumbSchema, qaSchema, howToSchema };
  };

  const getQuestionDetails = async () => {
    if (catid && questionId) {
      try {
        const response = await getQuestionApi({
          category_id: catid,
          subcategory_id: subcatid || "",
          level: "1",
        });

        if (!response.error) {
          const question = response.data.find(q => q.id === questionId);
          setQuestionDetails(question);
          
          const filtered = response.data.filter(q => q.id !== questionId);
          const randomQuestions = filtered.sort(() => 0.5 - Math.random()).slice(0, 4);
          setRecommendedQuestions(randomQuestions);
        }
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        toast.error(t("something_went_wrong"));
        setIsLoading(false);
      }
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(questionDetails?.optionb);
    setCopied(true);
    toast.success(t("prompt_copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAiModelClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!router.isReady) return;
    getQuestionDetails();
  }, [router.isReady, questionId, selectcurrentLanguage]);

  const metaData = generateMetaData();
  const structuredData = generateStructuredData();

  return (
    <Layout>
      {/* SEO: Dynamic Head with comprehensive meta tags */}
      {metaData && (
        <Head>
          {/* Primary Meta Tags */}
          <title>{metaData.title}</title>
          <meta name="title" content={metaData.title} />
          <meta name="description" content={metaData.description} />
          <meta name="keywords" content={metaData.keywords} />
          <meta name="author" content={metaData.siteName} />
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow" />
          <link rel="canonical" href={metaData.currentUrl} />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="article" />
          <meta property="og:url" content={metaData.currentUrl} />
          <meta property="og:title" content={metaData.title} />
          <meta property="og:description" content={metaData.description} />
          <meta property="og:image" content={metaData.imageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:site_name" content={metaData.siteName} />
          <meta property="og:locale" content={selectcurrentLanguage || "en_US"} />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={metaData.currentUrl} />
          <meta name="twitter:title" content={metaData.title} />
          <meta name="twitter:description" content={metaData.description} />
          <meta name="twitter:image" content={metaData.imageUrl} />
          <meta name="twitter:creator" content="@yourhandle" />

          {/* Additional SEO Meta Tags */}
          <meta name="theme-color" content="#8b5cf6" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          
          {/* Structured Data - JSON-LD */}
          {structuredData && (
            <>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.articleSchema) }}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumbSchema) }}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.qaSchema) }}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howToSchema) }}
              />
            </>
          )}

          {/* Preconnect for Performance */}
          <link rel="preconnect" href="https://chat.openai.com" />
          <link rel="preconnect" href="https://bard.google.com" />
          <link rel="preconnect" href="https://claude.ai" />
          <link rel="dns-prefetch" href="https://chat.openai.com" />
          <link rel="dns-prefetch" href="https://bard.google.com" />
          <link rel="dns-prefetch" href="https://claude.ai" />
        </Head>
      )}

      {isLoading ? (
        <div className="container px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl"
                role="status"
                aria-label="Loading content"
              />
            ))}
          </motion.div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container px-3 sm:px-6 lg:px-8 py-4 sm:py-8 mb-14"
        >
          {/* SEO: Semantic HTML structure with proper heading hierarchy */}
          <article itemScope itemType="https://schema.org/Article">
            {/* Question Details Section */}
            <motion.section
              variants={itemVariants}
              className="relative overflow-hidden rounded-3xl bg-white shadow-2xl mb-6 sm:mb-12"
              aria-labelledby="prompt-title"
            >
              {/* Background Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 opacity-50" aria-hidden="true" />
              
              {questionDetails?.image && (
                <motion.div
                  variants={imageVariants}
                  className="relative h-full sm:h-72 lg:h-96 xl:h-[40rem] overflow-hidden p-6 flex sm:flex-row flex-col gap-6"
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    src={questionDetails.image}
                    alt={`Visual representation of ${questionDetails.question} - AI prompt template`}
                    className="w-full h-full object-cover rounded-xl"
                    loading="eager"
                    itemProp="image"
                  />
                  {/* Title with Icon */}
                  <div className="w-full">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-start gap-3 mb-4 sm:mb-6"
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                        aria-hidden="true"
                      >
                        <IoSparkles className="text-2xl sm:text-3xl text-purple-600 flex-shrink-0 mt-1" />
                      </motion.div>
                      <h1 
                        id="prompt-title"
                        className="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent leading-tight"
                        itemProp="headline"
                      >
                        {questionDetails?.question}
                      </h1>
                    </motion.div>

                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed"
                      itemProp="description"
                    >
                      {questionDetails?.optiona}
                    </motion.p>
                  </div>
                </motion.div>
              )}
              
              <div className="relative p-4 sm:p-8 lg:p-10">
                {/* Prompt Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl overflow-hidden group"
                  role="region"
                  aria-label="AI Prompt Content"
                >
                  {/* Animated Background Pattern */}
                  <motion.div
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: "linear-gradient(45deg, #8b5cf6 25%, transparent 25%, transparent 75%, #8b5cf6 75%, #8b5cf6), linear-gradient(45deg, #8b5cf6 25%, transparent 25%, transparent 75%, #8b5cf6 75%, #8b5cf6)",
                      backgroundSize: "20px 20px",
                      backgroundPosition: "0 0, 10px 10px"
                    }}
                    aria-hidden="true"
                  />

                  <motion.button
                    onClick={handleCopyPrompt}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group z-10"
                    aria-label={copied ? "Prompt copied to clipboard" : "Copy prompt to clipboard"}
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                        >
                          <IoCheckmarkCircle className="text-lg sm:text-xl text-green-400" aria-hidden="true" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <IoCopyOutline className="text-lg sm:text-xl text-white" aria-hidden="true" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <h2 className="text-sm sm:text-base font-semibold text-purple-400 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 sm:h-6 bg-purple-500 rounded-full" aria-hidden="true" />
                    {t("prompt")}
                  </h2>
                  <p 
                    className="text-xs sm:text-base text-gray-100 leading-relaxed pr-8 sm:pr-12 font-mono"
                    itemProp="text"
                  >
                    {questionDetails?.optionb}
                  </p>
                </motion.div>
              </div>
            </motion.section>
          </article>

          {/* AI Models Section */}
          <motion.section 
            variants={itemVariants} 
            className="mb-8 sm:mb-16"
            aria-labelledby="ai-models-title"
          >
            <motion.h2
              id="ai-models-title"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-lg sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {t("Try with Ai models")}
            </motion.h2>
            <nav 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6"
              aria-label="AI model selection"
            >
              {aiModels.map((model, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  onClick={() => handleAiModelClick(model.url)}
                  className="relative group cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${model.name} - ${model.description}`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleAiModelClick(model.url);
                    }
                  }}
                >
                  <motion.div
                    variants={cardHoverVariants}
                    className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Gradient Background on Hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 rounded-2xl sm:rounded-3xl"
                      aria-hidden="true"
                    />
                    
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      <img
                        src={model.image.src}
                        alt={`${model.name} logo - AI assistant for prompt execution`}
                        className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 rounded-full shadow-md"
                        loading="lazy"
                      />
                    </motion.div>
                    <h3 className="relative font-semibold text-xs sm:text-base text-gray-800">
                      {model.name}
                    </h3>
                    
                    {/* Arrow Icon on Hover */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="absolute top-3 right-3 sm:top-4 sm:right-4"
                      aria-hidden="true"
                    >
                      <IoArrowForward className="text-purple-600 text-sm sm:text-base" />
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </nav>
          </motion.section>

          {/* Recommended Questions Section */}
          <motion.section 
            variants={itemVariants}
            aria-labelledby="recommended-title"
          >
            <motion.h2
              id="recommended-title"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-lg sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
            >
              R                                                                                                                                                                                                   ecommended Prompts
            </motion.h2>
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              role="list"
              aria-label="Recommended AI prompts"
            >
              {recommendedQuestions.map((question, index) => (
                <motion.article
                  key={question.id}
                  variants={itemVariants}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  custom={index}
                  onClick={() => router.push({
                    pathname: router.pathname,
                    query: { ...router.query, questionId: question.id },
                  })}
                  className="cursor-pointer group"
                  role="listitem"
                  itemScope
                  itemType="https://schema.org/Article"
                >
                  <motion.div
                    variants={cardHoverVariants}
                    className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 h-full"
                  >
                    {question.image && (
                      <div className="relative h-[85%] sm:h-56 overflow-hidden p-3">
                        <motion.img
                          // whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          src={question.image}
                          alt={`${question.question} - AI prompt template preview`}
                          className="w-full h-full object-cover rounded-xl"
                          loading="lazy"
                          itemProp="image"
                        />
                      </div>
                    )}
                    <div className="p-3 sm:p-6">
                      <h3 
                        className="font-bold text-sm sm:text-lg mb-2 text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300"
                        itemProp="headline"
                      >
                        {question.question}
                      </h3>
                      <p 
                        className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed"
                        itemProp="description"
                      >
                        {question.optiona}
                      </p>
                      
                      {/* Read More Arrow */}
                      <motion.div
                        initial={{ x: 0, opacity: 0 }}
                        whileHover={{ x: 5, opacity: 1 }}
                        className="mt-3 flex items-center gap-2 text-purple-600 font-medium text-xs sm:text-sm"
                        aria-label="View prompt details"
                      >
                        <span>View Details</span>
                        <IoArrowForward aria-hidden="true" />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        </motion.div>
      )}
    </Layout>
  );
};

// SEO: Static generation for better SEO and performance
export async function getStaticPaths() {
  // This would fetch all question IDs from your API
  // For now, return fallback: 'blocking' to generate pages on-demand
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  // This would fetch the question data server-side
  // For client-side data fetching, you can remove this
  return {
    props: {},
    revalidate: 3600, // Revalidate every hour
  };
}

export default withTranslation()(PromptDetails);