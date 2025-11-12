"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getLevelDataApi, getQuestionApi } from "@/api/apiRoutes";
import { getSelectedCategory, getSelectedSubCategory, selectedSubCategorySuccess } from "@/store/reducers/tempDataSlice";
import { selecttempdata } from '@/store/reducers/tempDataSlice'
import ShareButton from "@/components/Common/ShareButton";
import placeholder from '@/assets/images/placeholder.png'

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const QuestionPrompt = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categorySlug, setCategorySlug] = useState(null); // Add state for category slug
  const selectcurrentLanguage = useSelector(selectCurrentLanguage);
  const selectedCategory = useSelector(getSelectedCategory);  
  const selectedSubCategory = useSelector(getSelectedSubCategory);
  const router = useRouter();
  const { catid, isSubcategory, subcatid, subcategories } = router.query; // Get subcategories from URL
  let getData = useSelector(selecttempdata)
  const dispatch = useDispatch();
  
  console.log('Router query:', router.query);
  console.log('Selected category:', selectedCategory);

  const getAllData = async () => {
    if (catid) {
      try {
        // Second API call - Questions
        const questionsResponse = await getQuestionApi({
          category_id: catid,
          subcategory_id: subcatid || "",
          level: "1",
        });

        if (!questionsResponse.error) {
          let bookmark = getBookmarkData();
          let questions_ids = Object.keys(bookmark).map((index) => {
            return bookmark[index].question_id;
          });

          let questions = questionsResponse.data.map((data) => {
            let isBookmark = questions_ids.indexOf(data?.id) >= 0;

            let question = data?.question;
            let note = data?.note;

            return {
              ...data,
              question: question,
              note: note,
              isBookmarked: isBookmark,
              selected_answer: "",
              isAnswered: false,
            };
          });

          setQuestions(questions);
          setIsLoading(false);
        }

        if (questionsResponse.error) {
          setQuestions([]);
          setIsLoading(false);
          toast.error(t("No Prompt Found."));
          router.push("/category");
        }
      } catch (error) {
        console.error("API Error:", error);
        setQuestions([]);
        setIsLoading(false);
        toast.error(t("something_went_wrong"));
      }
    }
  };

  const getBookmarkData = () => {
    let bookmark = localStorage.getItem("bookmark");
    return bookmark ? JSON.parse(bookmark) : {};
  };

  // truncate text function
  const truncate = (text) => text?.length > 30 ? `${text.substring(0, 30)}...` : text;

  useEffect(() => {
    if (!router.isReady) return;
    
    // Get category slug from URL or Redux
    const slug = subcategories || selectedCategory?.category_slug;
    setCategorySlug(slug);
    
    console.log('Category slug determined:', slug);
    
    getAllData();
  }, [router.isReady, selectcurrentLanguage]);

  const handleChangeCategory = (question) => {
    dispatch(selectedSubCategorySuccess(question));
    
    // Use categorySlug from state (URL) instead of Redux
    const slugToUse = categorySlug || router.query.subcategories || 'category';
    
    console.log('Navigating with slug:', slugToUse);
    
    router.push({
      pathname: `/category/sub-categories/${slugToUse}/promptDetails`,
      query: {
        catid: catid,
        isSubcategory: isSubcategory,
        subcatid: subcatid,
        // subcategories: slugToUse,
        questionId: question.id
      },
    });
  }

  return (
    <Layout>
      <Breadcrumb
        showBreadcrumb={true}
        title={selectedSubCategory?.subcategory_name || selectedCategory?.category_name || categorySlug}
        content={t("home")}
        contentTwo={t("category")}
        contentFour={selectedCategory?.category_name || categorySlug}
      />
      <div className="container mb-14">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {questions.map((question) => (
              <div className="relative" key={question.id}>
                <div className="absolute top-6 right-6 z-10">
                  <ShareButton data={question} isLevel={true} />
                </div>
                <div
                  onClick={() => handleChangeCategory(question)}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4 group cursor-pointer"
                >
                  <div className="overflow-hidden rounded-xl mb-2">
                    <img
                      src={question.image || placeholder.src}
                      alt={question.question}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-all duration-500"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">{question.question}</h3>
                    <p className="text-gray-600">
                      {truncate(question.optiona)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default withTranslation()(QuestionPrompt);