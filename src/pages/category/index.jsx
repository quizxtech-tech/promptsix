"use client";
import React, { useState, useEffect, Suspense } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { isValidSlug, scrollhandler } from "@/utils";
import { t } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { updateUserDataInfo } from "@/store/reducers/userSlice";
const MySwal = withReactContent(Swal);
import { useRouter } from "next/router";
import {
  reviewAnswerShowSuccess,
  selectedCategorySuccess,
} from "@/store/reducers/tempDataSlice";
import CategoriesComponent from "@/components/view/common/CategoriesComponent";
import CatCompoSkeleton from "@/components/view/common/CatCompoSkeleton";
import {
  getCategoriesApi,
  getUserCoinsApi,
  setUserCoinScoreApi,
  unlockPremiumCatApi,
} from "@/api/apiRoutes";
import { fetchAllCategories } from "@/utils/buildTimeApi";
import { generateStructuredData } from "@/components/SEO/SEOHead";
import Layout from "@/components/Layout/Layout";

const QuizZone = ({ initialCategories = null }) => {
  const [category, setCategory] = useState({
    all: initialCategories || "",
    selected: initialCategories?.[0] || ""
  });
  const [isLoading, setIsLoading] = useState(!initialCategories);
  const selectcurrentLanguage = useSelector(selectCurrentLanguage);

  const router = useRouter();

  const dispatch = useDispatch();

  const getAllData = async () => {
    setCategory([]);

    const response = await getCategoriesApi({
      type: 1,
    });

    if (!response?.error) {
      let categories = response.data;
      let filteredCategories = categories.filter((cat) => cat.id !== "4" && cat.id !== "3" && cat.id !== "37");


      setCategory({ ...category, all: filteredCategories, selected: filteredCategories[0] });
      setIsLoading(false)
    }

    if (response.error) {
      setIsLoading(false)
      setCategory("");
      toast.error(t("no_data_found"));
    }
  };

  //handle category
  const handleChangeCategory = async (data) => {

    dispatch(selectedCategorySuccess(data));
    // this is for premium category only
    if (data.has_unlocked === "0" && data.is_premium === "1") {
      const getCoinsResponse = await getUserCoinsApi();
      if (!getCoinsResponse.error) {
        if (Number(data.coins) > Number(getCoinsResponse.data.coins)) {
          MySwal.fire({
            text: t("no_enough_coins"),
            icon: "warning",
            showCancelButton: false,
            customClass: {
              confirmButton: "Swal-confirm-buttons",
              cancelButton: "Swal-cancel-buttons",
            },
            confirmButtonText: `OK`,
            allowOutsideClick: false,
          });
        } else {
          MySwal.fire({
            text: t("double_coins_achieve_higher_score"),
            icon: "warning",
            showCancelButton: true,
            customClass: {
              confirmButton: "Swal-confirm-buttons",
              cancelButton: "Swal-cancel-buttons",
            },
            confirmButtonText: `use ${data.coins} coins`,
            allowOutsideClick: false,
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await unlockPremiumCatApi({
                cat_id: data.id,
              });

              if (!response?.error) {
                getAllData();

                const deductCoins = async () => {
                  const response = await setUserCoinScoreApi({
                    coins: "-" + data.coins,
                    title: "quiz_zone_premium_cat",
                  });

                  if (!response?.error) {
                    const getCoinsResponse = await getUserCoinsApi();
                    if (getCoinsResponse) {
                      updateUserDataInfo(getCoinsResponse.data);
                    }
                  }

                  if (response.error) {
                    Swal.fire(t("ops"), t("please "), t("try_again"), "error");
                  }

                  return response;
                };
                deductCoins();
              } else {
                console.log(response);
              }
            }
          });
        }
      } else {
        console.log(getCoinsResponse);
      }
    } else {
      if (data.no_of !== "0") {
        const slug = data.slug;
        if (isValidSlug(slug)) {
          router.push({
            pathname: `/category/sub-categories/${slug}`,
          });
        } else {
          console.log("Invalid slug, not redirecting");
        }
      } else {
        const slug = data.slug;
        const catId = data.id;

        if (isValidSlug(slug)) {
          router.push({
            pathname: `/category/sub-categories/${slug}/prompt`,
            query: {
              catid: catId,
              isSubcategory: 0,
            },
          });
        } else {
          console.log("Invalid slug, not redirecting");
        }
      }
    }
    //mobile device scroll handle
    scrollhandler(500);
  };

  //truncate text
  const truncate = (txtlength) =>
    txtlength?.length > 17 ? `${txtlength.substring(0, 17)}...` : txtlength;

  useEffect(() => {
    getAllData();
    dispatch(reviewAnswerShowSuccess(false));
  }, [selectcurrentLanguage]);

  return (
    <Layout>
      <Breadcrumb
        showBreadcrumb={true}
        title={t("category")}
        content={t("home")}
        // allgames={t("category")}
        contentTwo={t("category")}
      />
      <div className="container  mb-14">
        <ul>
          {isLoading ? (
            <CatCompoSkeleton />
          ) : (
            <CategoriesComponent
              category={category}
              handleChangeCategory={handleChangeCategory}
            />
          )}
        </ul>
      </div>
    </Layout>
  );
};

// SSG: Pre-fetch categories at build time
export async function getStaticProps() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://promptland.in';

  try {
    const categories = await fetchAllCategories();

    // Generate SEO data for category page
    const seoData = {
      title: `AI Prompt Categories | Browse ${categories?.length || 0}+ Categories`,
      description: `Explore ${categories?.length || 0}+ categories of professional AI prompts for ChatGPT, Gemini, Claude, and more. Find the perfect prompt for image generation, writing, coding, and creative projects.`,
      keywords: [
        "AI prompt categories",
        "ChatGPT prompts",
        "Gemini prompts",
        "AI image prompts",
        "prompt library",
        "AI tools",
        "prompt engineering",
        ...(categories || []).slice(0, 10).map(c => c.category_name).filter(Boolean),
      ],
      canonical: `${siteUrl}/category`,
      image: `${siteUrl}/og-category.jpg`,
      imageAlt: "AI Prompt Categories - Browse All Categories",
      ogType: "website",
    };

    // Generate structured data
    const seoStructuredData = [
      generateStructuredData.itemList({
        name: "AI Prompt Categories",
        items: (categories || []).map(c => ({
          name: c.category_name,
          url: `${siteUrl}/category/sub-categories/${c.id}`,
        })),
      }),
      generateStructuredData.breadcrumb([
        { name: "Home", url: siteUrl },
        { name: "Categories", url: `${siteUrl}/category` },
      ]),
    ];

    return {
      props: {
        initialCategories: categories,
        seoData,
        seoStructuredData,
      },
    };
  } catch (error) {
    console.error('[SSG] Error in getStaticProps:', error);
    return {
      props: {
        initialCategories: null,
        seoData: {
          title: "AI Prompt Categories | Browse Prompts",
          description: "Explore categories of professional AI prompts for ChatGPT, Gemini, Claude, and more.",
          canonical: `${siteUrl}/category`,
          ogType: "website",
        },
        seoStructuredData: [],
      },
    };
  }
}

export default withTranslation()(QuizZone);
