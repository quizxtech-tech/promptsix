"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/router";
import { getLevelDataApi, getQuestionApi } from "@/api/apiRoutes";
import { getSelectedCategory, getSelectedSubCategory, selectedSubCategorySuccess } from "@/store/reducers/tempDataSlice";
import { selecttempdata } from '@/store/reducers/tempDataSlice'
import ShareButton from "@/components/Common/ShareButton";
import placeholder from '@/assets/images/placeholder.jpg'
import { fetchAllTrendingPrompts, createSlug } from "@/utils/buildTimeApi";
import { generateTrendingSEO } from "@/utils/seoUtils";
import { generateStructuredData } from "@/components/SEO/SEOHead";

import Layout from "@/components/Layout/Layout";

const QuestionPrompt = ({ initialQuestions = [] }) => {
    const [questions, setQuestions] = useState(initialQuestions);
    const [isLoading, setIsLoading] = useState(!initialQuestions.length);
    const selectcurrentLanguage = useSelector(selectCurrentLanguage);
    const selectedCategory = useSelector(getSelectedCategory);
    const selectedSubCategory = useSelector(getSelectedSubCategory);
    const router = useRouter();
    const dispatch = useDispatch();
    let getData = useSelector(selecttempdata)

    console.log(getData);

    const getAllData = async () => {

        try {




            // Second API call - Questions (only if Level API succeeded)
            const questionsResponse = await getQuestionApi({
                category_id: 3,
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

                setQuestions(questions.reverse());
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
        const slug = createSlug(question.question);
        router.push({
            pathname: `/trending/prompt/${slug}`,
            query: {
                id: question.id
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
                            <div className="relative">
                                <div className="absolute top-6 right-6 z-10"><ShareButton isLevel={true} data={question} /></div>
                                <div
                                    key={question.id}
                                    onClick={() => handleChangeSubCategory(question)}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4 group cursor-pointer"
                                >

                                    <div className=" overflow-hidden rounded-xl mb-2">
                                        <img
                                            src={question.image || placeholder.src}
                                            alt={question.question}
                                            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-all duration-500"
                                        />
                                    </div>

                                    <div className="">
                                        <h3 className="font-semibold text-lg mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{question.question}</h3>
                                        <p className="text-gray-600">
                                            {truncate(question.optiona)}
                                        </p>
                                    </div>
                                </div></div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

// getStaticProps for Static Site Generation
export async function getStaticProps() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://promptland.in';

    try {
        console.log('[SSG] Generating static trending listing page...');

        // Fetch all trending prompts at build time
        const prompts = await fetchAllTrendingPrompts();

        // Process prompts (add bookmark status, etc.)
        const processedPrompts = prompts.map((data) => {
            return {
                ...data,
                isBookmarked: false, // Will check client-side
                selected_answer: "",
                isAnswered: false,
            };
        }).reverse();

        console.log(`[SSG] Generated trending page with ${processedPrompts.length} prompts`);

        // Generate SEO data
        const seoData = generateTrendingSEO({
            promptCount: processedPrompts.length,
            siteUrl,
        });

        // Generate structured data
        const seoStructuredData = [
            generateStructuredData.itemList({
                name: "Trending AI Prompts",
                items: processedPrompts.slice(0, 20).map((p) => ({
                    name: p.question,
                    url: `${siteUrl}/trending/prompt/${createSlug(p.question)}`,
                })),
            }),
            generateStructuredData.breadcrumb([
                { name: "Home", url: siteUrl },
                { name: "Trending", url: `${siteUrl}/trending` },
            ]),
        ];

        return {
            props: {
                initialQuestions: processedPrompts,
                seoData,
                seoStructuredData,
            },
        };
    } catch (error) {
        console.error('[SSG] Error in getStaticProps:', error);
        const seoData = generateTrendingSEO({ promptCount: 0, siteUrl });
        return {
            props: {
                initialQuestions: [],
                seoData,
                seoStructuredData: [],
            },
        };
    }
}

export default withTranslation()(QuestionPrompt);
