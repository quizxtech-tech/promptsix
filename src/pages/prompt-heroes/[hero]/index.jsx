"use client";
import React, { useState, useEffect } from "react";
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
import chatGPT from "../../../assets/images/chatgpt.svg"; 
import gemini from "../../../assets/images/gemini.svg"; 
import perplexity from "../../../assets/images/perplexity.svg"; 

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

// AI Models data
const aiModels = [
  { name: "ChatGPT", image: chatGPT, url: "https://chat.openai.com" },
  { name: "Bard", image: gemini, url: "https://bard.google.com" },
  { name: "Claude", image: perplexity, url: "https://claude.ai" },
  // Add more AI models as needed
];

const PromptHeros = () => {
    const selectedSubCategory = useSelector(getSelectedSubCategory);
  const [questionDetails, setQuestionDetails] = useState(selectedSubCategory);
  const [recommendedQuestions, setRecommendedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectcurrentLanguage = useSelector(selectCurrentLanguage);
  const selectedCategory = useSelector(getSelectedCategory);
  const router = useRouter();
  const { catid, subcatid, questionId } = router.query;




   const getQuestionDetails = async () => {
      try {
        const response = await getQuestionApi({
          category_id: 8,
          subcategory_id: subcatid || "",
          level: "1",
        });

        if (!response.error) {
          const question = response.data.find(q => q.id === questionId);
          setQuestionDetails(question);
          
          // Get 4 random questions for recommendations
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
  };

    useEffect(() => {
      if (!router.isReady) return;
      getQuestionDetails();
    }, [router.isReady, questionId, selectcurrentLanguage]);


  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(questionDetails?.optionb);
    toast.success(t("prompt_copied"));
  };

  const handleAiModelClick = (url) => {
    window.open(url, '_blank');
  };

  useEffect(() => {
    if (!router.isReady) return;
    // getQuestionDetails();
    

    // setQuestionDetails(selectedSubCategory);
    console.log(questionDetails,selectedSubCategory);
    

  }, [router.isReady, questionId, selectcurrentLanguage]);

  return (
    <Layout>
      
        <div className="container mb-14">
          {/* Question Details Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {questionDetails?.image && (
              <div className="h-96 overflow-hidden">
                <img
                  src={questionDetails.image}
                  alt={questionDetails.question}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">{questionDetails?.question}</h1>
              <p className="text-gray-600 mb-6">{questionDetails?.optiona}</p>
              
              {/* Prompt Section with Copy Button */}
              <div className="bg-gray-50 p-4 rounded-lg relative mb-8">
                <button
                  onClick={handleCopyPrompt}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-200"
                >
                  <IoCopyOutline size={20} />
                </button>
                <h3 className="font-semibold mb-2">{t("prompt")}:</h3>
                <p className="text-gray-700">{questionDetails?.optionb}</p>
              </div>
            </div>
          </div>

          {/* AI Models Section */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6">{t("try_with_ai_models")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {aiModels.map((model, index) => (
                <div
                  key={index}
                  onClick={() => handleAiModelClick(model.url)}
                  className="bg-white rounded-lg p-4 text-center cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <img
                    src={model.image.src}
                    alt={model.name}
                    className="w-16 h-16 mx-auto mb-2"
                  />
                  <h3 className="font-medium">{model.name}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Questions Section */}
          <div>
            <h2 className="text-xl font-bold mb-6">{t("recommended_prompts")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedQuestions.map((question) => (
                <div
                  key={question.id}
                  onClick={() => router.push({
                    pathname: router.pathname,
                    query: { ...router.query, questionId: question.id },
                  })}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  {question.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={question.image}
                        alt={question.question}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{question.question}</h3>
                    <p className="text-gray-600 line-clamp-2">{question.optiona}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </Layout>
  );
};

export default withTranslation()(PromptHeros);
