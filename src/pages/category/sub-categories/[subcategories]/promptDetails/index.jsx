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
import { createSlug } from "@/utils/buildTimeApi";
import PromptDetailView from "@/components/Common/PromptDetailView";

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

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