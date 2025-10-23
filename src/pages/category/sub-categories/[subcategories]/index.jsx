"use client";
import React, { useState, useEffect, Suspense } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";

import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { isValidSlug } from "@/utils";

import SubCategoriesComponent from "@/components/view/common/SubCategoriesComponent";
import CatCompoSkeleton from "@/components/view/common/CatCompoSkeleton";
import { getSubcategoriesApi } from "@/api/apiRoutes";
import { getSelectedCategory, selectedSubCategorySuccess } from "@/store/reducers/tempDataSlice";
import { useDispatch } from "react-redux";
const Layout = dynamic(() => import("@/components/Layout/Layout"), {
  ssr: false,
});

const QuizZone = () => {
  const [subCategory, setsubCategory] = useState([]);
  const selectcurrentLanguage = useSelector(selectCurrentLanguage);
  const selectedCategory = useSelector(getSelectedCategory);
  const router = useRouter();
  const dispatch = useDispatch();
  const cateSlug = router.query.subcategories;
  console.log(cateSlug);
  

  const getAllData = async () => {
    if (cateSlug) {
      const response = await getSubcategoriesApi({
        category_id: cateSlug,
      });

      if (!response?.error) {
        let subcategories = response.data;
        setsubCategory(subcategories);
      }

      if (response.error) {
        setsubCategory("");
        toast.error(t("no_subcat_data_found"));
      }
    } else {
      setsubCategory("");
      toast.error(t("no_data_found"));
    }
  };

  //handle subcatgory
  const handleChangeSubCategory = (data) => {
    console.log(data);
    
    dispatch(selectedSubCategorySuccess(data));
    const slug = data.slug;
    if (isValidSlug(slug)) {
      router.push({
        pathname: `/category/sub-categories/${cateSlug}/prompt`,
        query: {
          catid: data.maincat_id,
          subcatid: data.id,
          isSubcategory: 1,
        },
      });
    }
  };

  useEffect(() => {
    if (!router.isReady || !cateSlug) return;
    getAllData();
  }, [router.isReady, cateSlug, selectcurrentLanguage]);

  return (
    <Layout>
      <Breadcrumb
        showBreadcrumb={true}
        title={selectedCategory?.category_name}
        content={t("home")}
        // allgames={t("category")}
        contentTwo={t("category")}
        contentThree={selectedCategory?.category_name}
      />
      <div className="container mb-2">
        {/* sub category middle sec */}
        {subCategory.length > 0 ? (
          <SubCategoriesComponent
            subCategory={subCategory}
            handleChangeSubCategory={handleChangeSubCategory}
          />
        ) : (
          <CatCompoSkeleton />
        )}
      </div>
    </Layout>
  );
};
export default withTranslation()(QuizZone);
