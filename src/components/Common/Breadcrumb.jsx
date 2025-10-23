"use client";
import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import {
  getSelectedCategory,
  getSelectedSubCategory,
} from "@/store/reducers/tempDataSlice";
import { useSelector } from "react-redux";

const Breadcrumb = ({
  showBreadcrumb,
  title,
  content,
  contentTwo,
  contentThree,
  contentFour,
  allgames,
  contentFive,
}) => {
  // Get all data from Redux store
  const selectedCategory = useSelector(getSelectedCategory);
  const selectedSubCategory = useSelector(getSelectedSubCategory);

  // Build the category URL based on the type of page
  const getCategoryUrl = () => {
    
    switch (contentTwo) {
      case "Quiz Zone":
        return `/quiz-zone`;
      case "Guess The Word":
        return `/guess-the-word`;
      case "Fun & Learn":
        return `/fun-and-learn`;
      case "Self Challenge":
        return `/self-learning`;
      case "Audio Questions":
        return `/audio-questions`;
      case "Math Mania":
        return `/math-mania`;
      case "Multi Match":
        return `/multi-match-questions`;
      case "Contest Play":
        return `/contest-play`;
      case "Exam":
        return `/exam-module`;
        case "category":
        return `/category`;
      default:
        return `/quiz-play`;
    }
  };

  const getSubcategoryUrl = () => {
    if (selectedCategory.no_of == "0") {
      return `#`;
    }
    // in guess the word subcat url is with => subcategories (it is diffrent then other )
    if (contentTwo === "Guess The Word") {
      return `${getCategoryUrl()}/subcategories/${selectedCategory.slug}/`;
    } else {
      return `${getCategoryUrl()}/sub-categories/${selectedCategory.slug}/`;
    }
  };

  const showSubcategoryLink = () => {
    return contentThree && selectedSubCategory?.slug;
  };

  return (
    <React.Fragment>
      {showBreadcrumb && (
        <div className="overflow-hidden ">
          <div className="flex flex-wrap">
            <div className="flex justify-center items-center flex-col relative container my-14">
              <div className="">
                <h1 className="mb-3 md:mb-5 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-snug tracking-normal capitalize text-text-color max-767:text-inherit">
                  {title}
                </h1>
              </div>
              <div className="breadcrumb__inner">
                <ul className="py-2 px-0 bg-transparent mb-0 flex items-center flex-wrap sm:flex-nowrap justify-center">
                  {/* Home */}
                  <li>
                    <Link
                      className="text-primary-color relative block font-semibold text-base sm:text-lg md:text-xl lg:text-2xl hover:text-text-color dark:hover:text-white transition-colors"
                      href={"/"}
                    >
                      {content}
                    </Link>
                  </li>

                  {/* Quiz Zone or All Games */}
                  {allgames && (
                    <li className="before:mx-1 sm:before:mx-2 md:before:mx-3 before:content-['/'] before:text-[calc(0.875rem+0.125vw)] sm:before:text-[calc(1rem+0.125vw)] md:before:text-[calc(1.125rem+0.125vw)] lg:before:text-[calc(1.25rem+0.125vw)] before:text-black dark:before:text-white">
                      <Link
                        className="text-text-color font-semibold text-base sm:text-lg md:text-xl lg:text-2xl transition-colors hover:text-primary-color"
                        href={"/quiz-play"}
                      >
                        {allgames}
                      </Link>
                    </li>
                  )}

                  {/* Category */}
                  {contentTwo && (
                    <li className="before:mx-1 sm:before:mx-2 md:before:mx-3 before:content-['/'] before:text-[calc(0.875rem+0.125vw)] sm:before:text-[calc(1rem+0.125vw)] md:before:text-[calc(1.125rem+0.125vw)] lg:before:text-[calc(1.25rem+0.125vw)] before:text-black dark:before:text-white">
                      <Link
                        className="text-text-color font-semibold text-base sm:text-lg md:text-xl lg:text-2xl hover:text-primary-color transition-colors"
                        href={getCategoryUrl()}
                      >
                        {contentTwo}
                      </Link>
                    </li>
                  )}

                  {/* Subcategory - only show if data is available */}
                  {contentThree && (
                    <li className="before:mx-1 sm:before:mx-2 md:before:mx-3 before:content-['/'] before:text-[calc(0.875rem+0.125vw)] sm:before:text-[calc(1rem+0.125vw)] md:before:text-[calc(1.125rem+0.125vw)] lg:before:text-[calc(1.25rem+0.125vw)] before:text-black dark:before:text-white">
                      <Link
                        className="text-text-color font-semibold text-base sm:text-lg md:text-xl lg:text-2xl hover:text-primary-color transition-colors"
                        href={getSubcategoryUrl()}
                      >
                        {contentThree}
                      </Link>
                    </li>
                  )}

                  {/* Fourth level (if needed) */}
                  {contentFour && (
                    <li className="before:mx-1 sm:before:mx-2 md:before:mx-3 before:content-['/'] before:text-[calc(0.875rem+0.125vw)] sm:before:text-[calc(1rem+0.125vw)] md:before:text-[calc(1.125rem+0.125vw)] lg:before:text-[calc(1.25rem+0.125vw)] before:text-black dark:before:text-white">
                      <Link
                        className="text-text-color font-semibold text-base sm:text-lg md:text-xl lg:text-2xl hover:text-primary-color transition-colors"
                        href={"#"}
                      >
                        {contentFour}
                      </Link>
                    </li>
                  )}
                   {contentFive && (
                    <li className="before:mx-1 sm:before:mx-2 md:before:mx-3 before:content-['/'] before:text-[calc(0.875rem+0.125vw)] sm:before:text-[calc(1rem+0.125vw)] md:before:text-[calc(1.125rem+0.125vw)] lg:before:text-[calc(1.25rem+0.125vw)] before:text-black dark:before:text-white">
                      <Link
                        className="text-text-color font-semibold text-base sm:text-lg md:text-xl lg:text-2xl hover:text-primary-color transition-colors"
                        href={`/profile`}
                      >
                        {contentFive}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

Breadcrumb.propTypes = {
  showBreadcrumb: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string,
  contentTwo: PropTypes.string,
  contentThree: PropTypes.string,
  contentFour: PropTypes.string,
  contentFive: PropTypes.string,
  allgames: PropTypes.string,
};

export default Breadcrumb;
