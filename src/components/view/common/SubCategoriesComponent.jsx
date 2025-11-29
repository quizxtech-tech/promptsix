import React, { useState } from "react";
import elitePlaceholder from "@/assets/images/Elite Placeholder.svg";
import { FiChevronRight } from "react-icons/fi";
import { t } from "@/utils";
import errorimg from "@/assets/images/error.svg";
import ThemeSvg from "@/components/ThemeSvg";
import ShareButton from "@/components/Common/ShareButton";
import placeholder from '@/assets/images/placeholder.png'

const SubCategoriesComponent = ({ subCategory, handleChangeSubCategory }) => {
  const [showAll, setShowAll] = useState(false);
  // Get either all subcategories or just the first 10
  const visibleSubCategories = subCategory
    ? showAll
      ? subCategory
      : subCategory.slice(0, 12)
    : [];

  return (
    <div className="">
      <div className="quizplay-slider relative px-0">
        <div className="flex justify-center w-full items-center mb-16">
          <div className="bg-[#a6a5a7] p-[1px] w-full opacity-[24%] h-[1px] hidden md:block"></div>
          <h5 className="w-full text-text-color font-[600] text-center max-[1199px]:flex max-[1199px]:p-0 max-[1199px]:w-full max-[1199px]:text-center max-[1199px]:justify-center">
            {t("SubCategories")}
          </h5>
          <div className="bg-[#a6a5a7] p-[1px] w-full opacity-[24%] h-[1px] hidden md:block"></div>
          <div></div>
        </div>

        {subCategory && subCategory?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subCategory.map((elem, key) => {
              return (
                <div
                  key={elem?.id}
                  className="relative"
                  
                ><div className="absolute top-4 right-4 z-10"> <ShareButton isLevel={false} data={elem} /> </div>
                  <div className="" onClick={(e) => {
                    handleChangeSubCategory(elem);
                  }}>
                    
                    <div className="group">
                    <div className="flex-center flex-col p-2 gap-2">
                      <div className="overflow-hidden rounded-[18px]">
                        <img src={elem?.image ||  placeholder.src}  alt="" className="object-cover rounded-[18px] group-hover:scale-105 transition-all duration-500" />
                      </div>
                      <div className="w-full">
                        <h2 className="text-start text-xl font-medium">{elem?.subcategory_name}</h2>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              );
            })}
              
          </div>
        ) : (
          <div className="errorDiv">
            <ThemeSvg
              src={errorimg.src}
              className="!w-[110px] !h-[110px]"
              alt="Error"
              colorMap={{
                "#e03c75": "var(--primary-color)",
                "#551948": "var(--secondary-color)",
                "#3f1239": "var(--secondary-color)",
                "#7b2167": "var(--secondary-color)",
                "#ac5e9f": "var(--primary-light)",
                "url(#linear-gradient)": "url(#linear-gradient)",
              }}
            />
            <p className="text-center text-text-color">
              {t("no_subcat_data_found")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategoriesComponent;
