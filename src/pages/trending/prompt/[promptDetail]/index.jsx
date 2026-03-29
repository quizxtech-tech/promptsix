"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getQuestionApi } from "@/api/apiRoutes";
import { getSelectedCategory, getSelectedSubCategory } from "@/store/reducers/tempDataSlice";
import {
  fetchAllTrendingPrompts,
  fetchPromptById,
  getRecommendedPrompts,
  createSlug,
} from "@/utils/buildTimeApi";
import PromptDetailView from "@/components/Common/PromptDetailView";

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const PromptDetails = ({ initialQuestionDetails = null, initialRecommendedQuestions = [] }) => {
  const [questionDetails, setQuestionDetails] = useState(initialQuestionDetails);
  const [recommendedQuestions, setRecommendedQuestions] = useState(initialRecommendedQuestions);
  const [isLoading, setIsLoading] = useState(!initialQuestionDetails);
  const [copied, setCopied] = useState(false);

  const selectcurrentLanguage = useSelector(selectCurrentLanguage);
  const selectedCategory = useSelector(getSelectedCategory);
  const selectedSubCategory = useSelector(getSelectedSubCategory);
  const router = useRouter();
  const { catid, subcatid, id, promptDetail } = router.query;

  // Sync state when navigating between different trending prompts via recommended cards.
  // Next.js reuses the same component instance for same-layout routes,
  // so useState() initial values don't reset — we must do it manually.
  useEffect(() => {
    if (initialQuestionDetails) {
      setQuestionDetails(initialQuestionDetails);
      setRecommendedQuestions(initialRecommendedQuestions);
      setIsLoading(false);
    }
  }, [initialQuestionDetails?.id]);

  // Redirect old URLs with spaces to slugified URLs.
  // IMPORTANT: skip this when initialQuestionDetails is present — SSG already
  // guarantees the slug in the URL matches the prompt, so redirecting would
  // cause an infinite loop when navigating between recommended prompts.
  useEffect(() => {
    if (!router.isReady) return;
    if (initialQuestionDetails) return; // URL already correct from SSG
    const currentSlug = router.query.promptDetail;
    if (currentSlug && questionDetails) {
      const correctSlug = createSlug(questionDetails.question);
      if (currentSlug !== correctSlug) {
        router.replace({
          pathname: `/trending/prompt/${correctSlug}`,
          query: { id: questionDetails.id },
        });
      }
    }
  }, [router.isReady, questionDetails, router.query.promptDetail]);

  // Handle fallback state in dev mode (when fallback: true)
  if (router.isFallback) {
    return (
      <Layout>
        <div className="container px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="text-center py-8">Loading prompt details...</div>
        </div>
      </Layout>
    );
  }

  // SEO: Generate dynamic meta information
  const generateMetaData = () => {
    if (!questionDetails) return null;
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://promptland.in";
    const currentUrl = typeof window !== "undefined" ? window.location.href : `${siteUrl}${router.asPath}`;
    const siteName = "AI Prompt Library";
    const title = `${questionDetails.question} | ${siteName}`;
    const description =
      questionDetails.optiona ||
      `Explore ${questionDetails.question} - Professional AI prompts for ChatGPT, Claude, and Bard. Get instant results with our curated prompt library.`;
    const imageUrl = questionDetails.image || `${siteUrl}/default-og-image.jpg`;
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
      "AI tools",
    ]
      .filter(Boolean)
      .join(", ");
    return { title, description, imageUrl, currentUrl, keywords, siteName };
  };

  // SEO: Generate JSON-LD structured data
  const generateStructuredData = () => {
    if (!questionDetails) return null;
    const metaData = generateMetaData();
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: questionDetails.question,
      description: questionDetails.optiona,
      image: questionDetails.image,
      author: { "@type": "Organization", name: metaData.siteName },
      publisher: {
        "@type": "Organization",
        name: metaData.siteName,
        logo: { "@type": "ImageObject", url: `${metaData.currentUrl.split("/").slice(0, 3).join("/")}/logo.png` },
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    };
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: metaData.currentUrl.split("/").slice(0, 3).join("/") },
        {
          "@type": "ListItem",
          position: 2,
          name: selectedCategory?.category_name || "Category",
          item: `${metaData.currentUrl.split("/").slice(0, 3).join("/")}/category/${catid}`,
        },
        { "@type": "ListItem", position: 3, name: questionDetails.question, item: metaData.currentUrl },
      ],
    };
    const qaSchema = {
      "@context": "https://schema.org",
      "@type": "QAPage",
      mainEntity: {
        "@type": "Question",
        name: questionDetails.question,
        text: questionDetails.optiona,
        answerCount: 1,
        acceptedAnswer: { "@type": "Answer", text: questionDetails.optionb },
      },
    };
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `How to use: ${questionDetails.question}`,
      description: questionDetails.optiona,
      step: [
        { "@type": "HowToStep", name: "Copy the prompt", text: "Click the copy button to copy the AI prompt to your clipboard" },
        { "@type": "HowToStep", name: "Choose an AI model", text: "Select from ChatGPT, Bard, or Claude AI models" },
        { "@type": "HowToStep", name: "Paste and generate", text: "Paste the prompt into your chosen AI model and get results" },
      ],
    };
    return { articleSchema, breadcrumbSchema, qaSchema, howToSchema };
  };

  const getQuestionDetails = async () => {
    if (id) {
      try {
        const response = await getQuestionApi({
          category_id: 3,
          subcategory_id: subcatid || "",
          level: "1",
        });
        if (!response.error) {
          const question = response.data.find((q) => q.id === id);
          setQuestionDetails(question);
          const filtered = response.data.filter((q) => q.id !== id);
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

  const handleRecommendedClick = (question) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const slug = createSlug(question.question);
    router.push({
      pathname: `/trending/prompt/${slug}`,
      query: { id: question.id },
    });
  };

  useEffect(() => {
    if (!router.isReady) return;
    getQuestionDetails();
  }, [router.isReady, id, selectcurrentLanguage]);

  const metaData = generateMetaData();
  const structuredData = generateStructuredData();

  return (
    <Layout>
      <PromptDetailView
        questionDetails={questionDetails}
        recommendedQuestions={recommendedQuestions}
        isLoading={isLoading}
        copied={copied}
        onCopyPrompt={handleCopyPrompt}
        onRecommendedClick={handleRecommendedClick}
        showReportButton={false}
        metaData={metaData}
        structuredData={structuredData}
        selectcurrentLanguage={selectcurrentLanguage}
      />
    </Layout>
  );
};

export default withTranslation()(PromptDetails);

// SSG: Generate static paths - Generate all prompt pages at build time
export async function getStaticPaths() {
  try {
    console.log("[SSG] Generating static paths for all trending prompts...");
    const allPrompts = await fetchAllTrendingPrompts();
    const paths = [];
    const seen = new Set();
    allPrompts.forEach((prompt) => {
      const slug = createSlug(prompt.question) || `prompt-${prompt.id}`;
      // Add slugified version (new format - SEO friendly)
      if (!seen.has(slug)) {
        seen.add(slug);
        paths.push({ params: { promptDetail: slug } });
      }
      // Add original question text (old format - for existing bookmarks/links)
      // Only add if it differs from the slug to avoid duplicate paths
      if (prompt.question !== slug && !seen.has(prompt.question)) {
        seen.add(prompt.question);
        paths.push({ params: { promptDetail: prompt.question } });
      }
    });

    console.log(`[SSG] Generated ${paths.length} unique static paths for ${allPrompts.length} prompts`);
    return {
      paths: [{ params: { promptDetail: '__prompt_shell__' } }, ...paths],
      fallback: false,
    };
  } catch (error) {
    console.error("[SSG] Error in getStaticPaths:", error);
    return { paths: [{ params: { promptDetail: '__prompt_shell__' } }], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  try {
    const { promptDetail } = params;
    console.log(`[SSG] Generating static page for: ${promptDetail}`);

    // Handle shell page generation (used as fallback for new admin-added prompts)
    if (promptDetail === '__prompt_shell__') {
      return {
        props: {
          initialQuestionDetails: null,
          initialRecommendedQuestions: [],
        },
      };
    }

    const allPrompts = await fetchAllTrendingPrompts();

    let promptData = null;
    for (const prompt of allPrompts) {
      const slug = createSlug(prompt.question);
      if (slug === promptDetail || prompt.question === promptDetail) {
        promptData = prompt;
        break;
      }
    }

    if (!promptData) {
      console.warn(`[SSG] Prompt not found for slug: ${promptDetail}`);
      return { notFound: true };
    }

    const recommended = getRecommendedPrompts(allPrompts, promptData.id, 4);
    console.log(`[SSG] Generated page for prompt: ${promptData.question}`);

    return {
      props: {
        initialQuestionDetails: promptData,
        initialRecommendedQuestions: recommended,
      },
    };
  } catch (error) {
    console.error("[SSG] Error in getStaticProps:", error);
    return { notFound: true };
  }
}