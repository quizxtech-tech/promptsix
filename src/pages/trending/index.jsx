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


const Layout = dynamic(() => import("@/components/Layout/Layout"), {
    ssr: false,
});

const QuestionPrompt = () => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const selectcurrentLanguage = useSelector(selectCurrentLanguage);
    const selectedCategory = useSelector(getSelectedCategory);
    const selectedSubCategory = useSelector(getSelectedSubCategory);
    const router = useRouter();
    const dispatch = useDispatch();
    let getData = useSelector(selecttempdata)

    console.log(getData);

    const getAllData = async () => {

        try {
            // First API call - Level Data
            const LevelResponse = await getLevelDataApi({
                category_id: 8,
                level: "1",
            });



            // Second API call - Questions (only if Level API succeeded)
            const questionsResponse = await getQuestionApi({
                category_id: 8,
                level: "1",
            });

            console.log(questionsResponse);

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
                toast.error(t("no_que_found"));
            }
        } catch (error) {
            console.error("API Error:", error);
            setQuestions([]);
            setIsLoading(false);
            toast.error(t("something_went_wrong"));
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
        getAllData();
    }, [router.isReady, selectcurrentLanguage]);

    const handleChangeSubCategory = (question) => {
        router.push({
            pathname: `${router.pathname}/promptDetails`,
            query: {
                ...router.query,
                questionId: question.id
            },
        })
        dispatch(selectedSubCategorySuccess(question));


    };

    return (
        <Layout>
            <Breadcrumb
                showBreadcrumb={true}
                title={selectedSubCategory?.subcategory_name || selectedCategory?.category_name}
                content={t("home")}
                // contentTwo={t("category")}
                // contentThree={selectedCategory?.category_name}
                contentFour={"Trending"}
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
                            <div
                                key={question.id}
                                onClick={() => handleChangeSubCategory(question)}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4 group cursor-pointer"
                            >

                                <div className=" overflow-hidden rounded-xl mb-2">
                                    <img
                                        src={question.image || "/images/homeSkeleton.png "}
                                        alt={question.question}
                                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-all duration-500"
                                    />
                                </div>

                                <div className="">
                                    <h3 className="font-semibold text-lg mb-2">{question.question}</h3>
                                    <p className="text-gray-600">
                                        {truncate(question.optiona)}
                                    </p>
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
