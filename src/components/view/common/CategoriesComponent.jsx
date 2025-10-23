import React, { useEffect, useState } from "react";
import elitePlaceholder from "@/assets/images/Elite Placeholder.svg";
import { FiChevronRight } from "react-icons/fi";
import { t } from "@/utils";
import premium from '@/assets/images/premium_icon.svg'
import { resetremainingSecond } from "@/store/reducers/showRemainingSeconds";
import { useDispatch } from "react-redux";
import ThemeSvg from "@/components/ThemeSvg";
import errorimg from "@/assets/images/error.svg";

const CategoriesComponent = ({ category, handleChangeCategory }) => {
  const [showAll, setShowAll] = useState(false);
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
                <div className="" key={key}>
                  {/* <Link href={`/quiz-zone/${data.slug}`} > */}
                  {/* <li
                    className="flex hover:cursor-pointer group:"
                    onClick={(e) => handleChangeCategory(data)}
                  >
                    <div
                      className={`group w-full flex rounded-[15px] items-start flex-col px-[30px] pb-5 bg-[var(--background-2)] darkSecondaryColor relative transition-all duration-300 ease-in-out overflow-hidden bordercolor
                          bgWave 
                          ${
                            category.selected && category.selected.id === data?.id
                              ? "active-one"
                              : "unactive-one"
                          }`}
                    >
                      <div className="flex justify-start items-center gap-4 w-full h-[80px] border-b-[0.5px] border-[#d3d3d3] dark:border-[#FFFFFF16]">
                        <span className="ml-[10px] flex justify-center items-center z-1 text-white">
                          <img
                            className={`w-[45px] h-[45px] object-contain max-w-[100%] max-h-[100%] rounded-[5px] ${process.env.NEXT_PUBLIC_SHOW_ICON_WHITE_IN_DARK_MODE === "true" && !data?.image && 'dark:filter dark:brightness-0 dark:invert'}`}
                            src={data?.image ? data?.image : `${elitePlaceholder.src}`}
                            alt="image"
                          />
                        </span>
                        <div className="flex justify-center items-baseline flex-col">
                          <p className="text-base leading-[18px] font-bold text-text-color text-start mb-2 ">
                            {truncate(data?.category_name)}
                          </p>
                          {data?.no_of !== "0" && data?.no_of !== "" ? (
                            <p className="text-[13px] font-normal leading-4 text-text-color mb-[-5px] dark:opacity-85">
                              {t("SubCategories")} : {data?.no_of}
                            </p>
                          ) : null}
                        </div>
                        <span className="absolute rtl:left-[22px]  ltr:right-[22px] top-[22px] text-text-color text-xl hidden transition-all duration-300 ease-in-out group-hover:block group-hover:transition-all group-hover:duration-2000 group-hover:ease-in-out">
                          <FiChevronRight className="rtl:rotate-180" />
                        </span>
                      </div>
                      <div className="mt-4 flex items-center w-full justify-between flex-wrap">
                        <div className="flex gap-5">
                          {data?.maxlevel !== "0" && (
                            <span className="text-sm font-normal leading-[17px] text-text-color dark:opacity-65">
                              {t("total") + " " + t("level") + ": "}
                              {data?.maxlevel}
                            </span>
                          )}
                          <span className="text-sm font-normal leading-4 text-text-color dark:opacity-65">
                            {data?.no_of_que <= 1
                              ? t("Question")
                              : t("questions")}{" "}
                            : {data?.no_of_que}
                          </span>
                        </div>
                        {imageToShow ? (
                          <img
                            className="absolute rtl:left-4 ltr:right-4"
                            src={premium.src}
                            alt="premium"
                            width={30}
                            height={30}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </li> */}

                  <li onClick={(e) => handleChangeCategory(data)} className="group">
                    <div className="flex-center flex-col p-2 gap-2">
                      <div className="overflow-hidden rounded-[18px]">
                        <img src={data?.image || "/images/homeSkeleton.png"}  alt="" className="object-cover rounded-[18px] group-hover:scale-105 transition-all duration-500" />
                      </div>
                      <div className="w-full">
                        <h2 className="text-start text-xl font-medium">{data?.category_name}</h2>
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
