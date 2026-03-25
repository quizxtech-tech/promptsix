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
  fetchAllCategories,
  fetchPromptsForCategory,
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
  const { catid, subcatid, questionId } = router.query;

  // SEO: Generate dynamic meta information
  const generateMetaData = () => {
    if (!questionDetails) return null;
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://promptland.in";
    const currentUrl = typeof window !== "undefined" ? window.location.href : `${siteUrl}${router.asPath}`;
    const siteName = "AI Prompt Library";
    let title = `${questionDetails.question} | ${siteName}`;
    let description =
      questionDetails.optiona ||
      `Explore ${questionDetails.question} - Professional AI prompts for ChatGPT, Claude, and Bard. Get instant results with our curated prompt library.`;
    let keywords = [
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

    const imageUrl = questionDetails.image || `${siteUrl}/default-og-image.jpg`;

    // Specialized SEO for IPL Section (Category ID 36)
    if (questionDetails.category === 36 || questionDetails.category === "36" || selectedCategory?.id === "36" || selectedCategory?.category_slug === "ipl-ai-photo-editing") {
      title = `${questionDetails.question} - IPL AI Photo Editing | Promptland`;
      description = `Create this viral IPL 2026 AI photo: ${questionDetails.question}. Get realistic 3D cricket avatars with your name on the jersey for CSK, RCB, MI, and all teams. Free 4K IPL prompts inside!`;
      keywords = "IPL AI Photo Editing, IPL 2026 AI Prompts, Gemini IPL Prompt, Bing Image Creator IPL, 3D IPL Avatar Maker, IPL Jersey Name Edit AI, Viral Cricket AI Photo, 3D Boy in IPL Stadium, IPL AI Image Generator Free, Realistic IPL Fan Photo AI, CSK AI Photo Prompt 2026, RCB Jersey Name Editing AI, Mumbai Indians 3D Avatar, KKR 3D Name Art Prompt, Gujarat Titans AI Jersey Edit, Sunrisers Hyderabad AI Prompt, Delhi Capitals AI Photo Maker, Rajasthan Royals 3D Image, LSG New Jersey AI Prompt, Punjab Kings AI Fan Art, Create IPL Jersey with My Name, 3D Name on Cricket Jersey Prompt, Viral IPL Name Art AI, Customize IPL Jersey Number AI, IPL Couple Jersey AI Photo, Boy and Girl IPL AI Prompt, IPL Jersey Name Editor Online, My Name on Virat Kohli Jersey AI, MS Dhoni Style AI Photo with Name, Rohit Sharma 45 Jersey AI Edit, 4K Realistic IPL AI Photo, Cinematic Cricket Stadium AI Art, 8K Ultra HD IPL Prompts, Anime Style IPL Cricket Photo, Cyberpunk IPL Stadium Prompt, IPL Final Match AI Visuals, Trophy Lifting AI Photo Prompt, Cricket World Cup Style IPL Art, Hyper-realistic Sports AI Prompts, Night Stadium Lighting AI Prompt, Best Prompts for Gemini Nano Banana, How to make IPL AI photo in Bing, Midjourney IPL Cricket Prompts, DALL-E 3 IPL Jersey Prompts, AI Photo Editing App for IPL, Promptland IPL Category, Free AI Prompts for Instagram Reels, Trending IPL WhatsApp DP AI, IPL 2026 Schedule AI Image, Viral Cricket Poster AI Prompt";
    }

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
    if (catid && questionId) {
      try {
        const response = await getQuestionApi({
          category_id: catid,
          subcategory_id: subcatid || "",
          level: "1",
        });
        if (!response.error) {
          const question = response.data.find((q) => q.id === questionId);
          setQuestionDetails(question);
          const filtered = response.data.filter((q) => q.id !== questionId);
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
    router.push(`/category/sub-categories/${router.query.subcategories}/promptDetails/${slug}`);
  };

  useEffect(() => {
    if (!router.isReady) return;
    getQuestionDetails();
  }, [router.isReady, questionId, selectcurrentLanguage]);

  // Sync state when navigating between different prompt slugs.
  // Next.js reuses the same component instance for same-layout routes,
  // so useState() initial values don't reset — we must do it manually.
  useEffect(() => {
    if (initialQuestionDetails) {
      setQuestionDetails(initialQuestionDetails);
      setRecommendedQuestions(initialRecommendedQuestions);
      setIsLoading(false);
    }
  }, [initialQuestionDetails?.id]);

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
        showReportButton={true}
        metaData={metaData}
        structuredData={structuredData}
        selectcurrentLanguage={selectcurrentLanguage}
      />
    </Layout>
  );
};

export default withTranslation()(PromptDetails);

// SSG: Generate static paths
export async function getStaticPaths() {
  const categories = await fetchAllCategories();
  const paths = [];
  for (const category of categories) {
    const prompts = await fetchPromptsForCategory(category.id);
    for (const prompt of prompts) {
      paths.push({
        params: {
          subcategories: category.slug,
          promptSlug: createSlug(prompt.question) || prompt.question,
        },
      });
    }
  }
  return {
    paths,
    fallback: process.env.NODE_ENV === "development" ? true : false,
  };
}

export async function getStaticProps({ params }) {
  const { subcategories, promptSlug } = params;
  const categories = await fetchAllCategories();
  const category = categories.find((cat) => cat.slug === subcategories);
  if (!category) return { notFound: true };

  const allPrompts = await fetchPromptsForCategory(category.id);
  let prompt = allPrompts.find(
    (p) => createSlug(p.question) === promptSlug || p.question === promptSlug
  );
  if (!prompt) return { notFound: true };

  return {
    props: {
      initialQuestionDetails: prompt,
      initialRecommendedQuestions: getRecommendedPrompts(allPrompts, prompt.id, 4),
    },
  };
}
