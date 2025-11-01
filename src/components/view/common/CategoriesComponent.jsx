import React, { useEffect, useState } from "react";
import elitePlaceholder from "@/assets/images/Elite Placeholder.svg";
import { FiChevronRight } from "react-icons/fi";
import { t } from "@/utils";
import premium from '@/assets/images/premium_icon.svg'
import { resetremainingSecond } from "@/store/reducers/showRemainingSeconds";
import { useDispatch } from "react-redux";
import ThemeSvg from "@/components/ThemeSvg";
import errorimg from "@/assets/images/error.svg";
import ShareButton from "@/components/Common/ShareButton";
import placeholder from '@/assets/images/placeholder.png'

const CategoriesComponent = ({ category, handleChangeCategory }) => {
  const [showAll, setShowAll] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  //truncate text
  const visibleCategories = category?.all 
    ? (showAll ? category.all : category.all.slice(0, 12))
    : [];
    

  const truncate = (txtlength) =>
    txtlength?.length > 17 ? `${txtlength.substring(0, 17)}...` : txtlength;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetremainingSecond(0));
  }, []);
  return (
    <>
      <div className="flex justify-center w-full items-center gap-[10px] mb-16">
        <div className="bg-[#a6a5a7] p-[1px] w-full opacity-[24%] h-[1px] hidden md:block"></div>
        <h5 className="w-full text-lg font-semibold text-center max-[1199px]:flex max-[1199px]:p-0 max-[1199px]:w-full max-[1199px]:text-center max-[1199px]:justify-center">
          {t("Categories")}
        </h5>
        <div className="bg-[#a6a5a7] p-[1px] w-full opacity-[24%] h-[1px] hidden md:block"></div>
        <div></div>
      </div>
      {category?.all ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {visibleCategories.map((data, key) => {
              const imageToShow =
                data?.has_unlocked === "0" && data?.is_premium === "1";
              return (
                <div className="relative" key={key}>
                  

                        {/* <div className="absolute top-4 right-4 z-10"> <ShareButton/> </div> */}
                  <li onClick={(e) => handleChangeCategory(data)} className="group">
                    <div className="flex-center flex-col p-2 gap-2">
                      <div className="overflow-hidden rounded-[18px] relative">
                        <img src={data?.image || placeholder.src}  alt="" className="object-cover rounded-[18px] group-hover:scale-105 transition-all duration-500" />
                      </div>
                      <div className="w-full">
                        <h2 className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 font-bold text-3xl bg-clip-text text-transparent text-center">{data?.category_name}</h2>
                      </div>
                    </div>
                  </li>
                  {/* </Link> */}
                </div>
              );
            })}
          </div>
          
          {/* Show More/Less button */}
          {category.all.length > 12 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-2 bg-primary-color text-white rounded-md hover:bg-primary-dark transition-colors shadowBtn"
              >
                {showAll ? t("show_less") : t("show_more")}
              </button>
            </div>
          )}
        </>
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
          <p className="text-center text-text-color">{t("no_cat_data_found")}</p>
        </div>
      )}
    </>
  );
};

export default CategoriesComponent;
