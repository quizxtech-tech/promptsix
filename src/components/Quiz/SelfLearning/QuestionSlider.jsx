import React, { Fragment, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { sysConfigdata } from "@/store/reducers/settingsSlice";
import { t } from "@/utils";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const QuestionSlider = ({ onClick, activeIndex }) => {
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const toggleShowAllQuestions = () => {
    setShowAllQuestions(!showAllQuestions);
  };

  const systemconfig = useSelector(sysConfigdata);

  const self_challange_max_questions = Number(
    systemconfig.self_challenge_max_questions
  );

  const limit = self_challange_max_questions;

  let arr = [];
  if (limit >= 5) {
    for (let i = 0; i <= limit; i++) {
      if (i % 5 == 0) {
        if (i != 0) {
          arr.push(i);
        }
      }
    }
  } else {
    arr.push(limit);
  }

  return (
    <Fragment>
      <div className="bg-[#f5f5f5] p-5 rounded-[8px] ">
        {/* Select number of questions */}
        <div className="flex justify-between">
          <p className="capitalize font-bold text-lg">
            {t("select_num_of_que")}
          </p>
          <p
            className="capitalize font-bold text-md text-primary-color"
            onClick={toggleShowAllQuestions}
            style={{ cursor: "pointer" }}
          >
            {arr.length >= 8 ? (
              <>{showAllQuestions ? t("see_less") : t("see_more")}</>
            ) : null}
          </p>
        </div>

        <div className="pt-6  ">
          {showAllQuestions ? (
            <div className=" grid grid-cols-2 grid-rows-1 gap-4 lg:grid-cols-4 md:grid-cols-3">
              {arr.map((data, key) => (
                <div
                  onClick={() => onClick(data)}
                  className={` relative bgcolor group p-[30px_12px_18px] border-none rounded-[8px] cursor-pointer overflow-hidden darkSecondaryColor   ${
                    activeIndex === data && "!bg-primary-color text-white   dark:border-solid dark:border-[2px] dark:border-[#30D143]"
                  }`}
                  key={key}
                >
                  {activeIndex === data && (
                    <span className=" absolute text-[#30D143] rtl:-right-[10px] ltr:right-[10px] top-[10px] text-[25px] hidden dark:block">
                      <IoMdCheckmarkCircleOutline />
                    </span>
                  )}
                  <div className="bgWave">
                    <div className="m-auto">
                      <p className="text-center m-auto block text-2xl font-bold">
                        {data}
                      </p>
                      <p className="text-center m-auto block text-sm font-normal relative top-0 transition-[top] duration-500 ease-in-out group-hover:top-3">
                        {t("number")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 grid-rows-1 gap-4 lg:grid-cols-4 md:grid-cols-3">
              {arr.slice(0, 8).map((data, key) => (
                <div
                  onClick={() => onClick(data)}
                  className={`relative bgcolor group p-[30px_12px_18px] border-none rounded-[8px] cursor-pointer overflow-hidden darkSecondaryColor  ${
                    activeIndex === data && "!bg-primary-color text-white   dark:border-solid dark:border-[2px] dark:border-[#30D143]"
                  } `}
                  key={key}
                >
                  {activeIndex === data && (
                    <span className=" absolute text-[#30D143] rtl:-right-[10px] ltr:right-[10px] top-[10px] text-[25px] hidden dark:block">
                      <IoMdCheckmarkCircleOutline />
                    </span>
                  )}
                  <div className="bgWave">
                    <div className="m-auto">
                      <p className="text-center m-auto block text-2xl font-bold">
                        {data}
                      </p>
                      <p className="text-center m-auto block text-sm font-normal relative top-0 transition-[top] duration-500 ease-in-out group-hover:top-3">
                        {t("number")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default withTranslation()(QuestionSlider);
