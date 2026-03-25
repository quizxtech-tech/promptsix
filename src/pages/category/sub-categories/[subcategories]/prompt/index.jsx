"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
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
import placeholder from '@/assets/images/placeholder.jpg'
import { fetchAllCategories, fetchPromptsForCategory, createSlug } from "@/utils/buildTimeApi";

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const QuestionPrompt = ({ initialQuestions = null, seoData = null }) => {
  const [questions, setQuestions] = useState(initialQuestions || []);
  const [isLoading, setIsLoading] = useState(!initialQuestions);
  const [categorySlug, setCategorySlug] = useState(null); // Add state for category slug
  const selectcurrentLanguage = useSelector(selectCurrentLanguage);
  const selectedCategory = useSelector(getSelectedCategory);
  const selectedSubCategory = useSelector(getSelectedSubCategory);
  const router = useRouter();
  const { catid, isSubcategory, subcatid, subcategories } = router.query; // Get subcategories from URL
  let getData = useSelector(selecttempdata)
  const dispatch = useDispatch();


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

          setQuestions(questions.reverse());
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
  ``
  const handleChangeCategory = (question) => {
    dispatch(selectedSubCategorySuccess(question));

    // Use categorySlug from state (URL) instead of Redux
    const slugToUse = categorySlug || router.query.subcategories || 'category';
    const promptSlug = createSlug(question.question);

    console.log('Navigating with category slug:', slugToUse, 'prompt slug:', promptSlug);

    router.push({
      pathname: `/category/sub-categories/${slugToUse}/promptDetails/${promptSlug}`,
      query: {
        id: question.id
      },
    });
  }

  return (
    <Layout>
      {seoData && (
        <Head>
          <title key="title">{seoData.title}</title>
          <meta name="description" content={seoData.description} key="desc" />
          <meta name="keywords" content={seoData.keywords} key="keywords" />
          <meta property="og:title" content={seoData.title} key="ogtitle" />
          <meta property="og:description" content={seoData.description} key="ogdesc" />
          <meta property="og:type" content="website" key="ogtype" />
        </Head>
      )}
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

// SSG: Generate paths for all category/subcategory combinations
export async function getStaticPaths() {
  try {
    console.log('[SSG] Generating static paths for category prompts...');

    const categories = await fetchAllCategories();
    const paths = [];

    for (const category of categories) {
      paths.push({
        params: {
          subcategories: category.slug
        }
      });
    }

    console.log(`[SSG] Generated ${paths.length} paths for category prompts`);

    return {
      paths,
      fallback: process.env.NODE_ENV === 'development' ? true : false,
    };
  } catch (error) {
    console.error('[SSG] Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: process.env.NODE_ENV === 'development' ? true : false,
    };
  }
}

// SSG: Fetch prompts for each category at build time
export async function getStaticProps({ params }) {
  try {
    const { subcategories } = params;

    // Find the category by slug
    const categories = await fetchAllCategories();
    const category = categories.find(cat => cat.slug === subcategories);

    if (!category) {
      return { notFound: true };
    }

    // Fetch prompts for this category
    const prompts = await fetchPromptsForCategory(category.id);

    // Specialized SEO for IPL Section (Category ID 36)
    let seoData = null;
    if (category.id === "36" || category.slug === "ipl-ai-photo-editing" || category.category_name?.toLowerCase().includes("ipl")) {
      seoData = {
        title: "IPL AI Photo Editing: Create 3D Jersey with Your Name | Promptland",
        description: "Get the viral IPL 2026 AI photo editing prompts for Gemini and Bing. Create realistic 3D cricket avatars with your name on the jersey for CSK, RCB, MI, and all teams. Free 4K IPL prompts inside!",
        keywords: "IPL AI Photo Editing, IPL 2026 AI Prompts, Gemini IPL Prompt, Bing Image Creator IPL, 3D IPL Avatar Maker, IPL Jersey Name Edit AI, Viral Cricket AI Photo, 3D Boy in IPL Stadium, IPL AI Image Generator Free, Realistic IPL Fan Photo AI, CSK AI Photo Prompt 2026, RCB Jersey Name Editing AI, Mumbai Indians 3D Avatar, KKR 3D Name Art Prompt, Gujarat Titans AI Jersey Edit, Sunrisers Hyderabad AI Prompt, Delhi Capitals AI Photo Maker, Rajasthan Royals 3D Image, LSG New Jersey AI Prompt, Punjab Kings AI Fan Art, Create IPL Jersey with My Name, 3D Name on Cricket Jersey Prompt, Viral IPL Name Art AI, Customize IPL Jersey Number AI, IPL Couple Jersey AI Photo, Boy and Girl IPL AI Prompt, IPL Jersey Name Editor Online, My Name on Virat Kohli Jersey AI, MS Dhoni Style AI Photo with Name, Rohit Sharma 45 Jersey AI Edit, 4K Realistic IPL AI Photo, Cinematic Cricket Stadium AI Art, 8K Ultra HD IPL Prompts, Anime Style IPL Cricket Photo, Cyberpunk IPL Stadium Prompt, IPL Final Match AI Visuals, Trophy Lifting AI Photo Prompt, Cricket World Cup Style IPL Art, Hyper-realistic Sports AI Prompts, Night Stadium Lighting AI Prompt, Best Prompts for Gemini Nano Banana, How to make IPL AI photo in Bing, Midjourney IPL Cricket Prompts, DALL-E 3 IPL Jersey Prompts, AI Photo Editing App for IPL, Promptland IPL Category, Free AI Prompts for Instagram Reels, Trending IPL WhatsApp DP AI, IPL 2026 Schedule AI Image, Viral Cricket Poster AI Prompt"
      };
    }

    return {
      props: {
        initialQuestions: prompts,
        seoData,
      },
    };
  } catch (error) {
    console.error('[SSG] Error in getStaticProps:', error);
    return {
      props: {
        initialQuestions: null,
      },
    };
  }
}

export default withTranslation()(QuestionPrompt);