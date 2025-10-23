"use client"
import React, { lazy, Suspense, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { getBookmarkData } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { sysConfigdata } from '@/store/reducers/settingsSlice'
import { resultTempDataSuccess, selecttempdata } from '@/store/reducers/tempDataSlice'
import { useRouter } from 'next/router'
import Breadcrumb from '@/components/Common/Breadcrumb'
import dynamic from 'next/dynamic'
import QuestionSkeleton from '@/components/view/common/QuestionSkeleton'
const Question = lazy(() => import('@/components/Common/Question'))
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false })
import { t } from "@/utils";
import { getQuestionApi } from '@/api/apiRoutes'

const DashboardPlay = () => {

  const navigate = useRouter()

  const dispatch = useDispatch()

  let getData = useSelector(selecttempdata)

  const [questions, setQuestions] = useState([{ id: '', isBookmarked: false }])

  const [level, setLevel] = useState(1)

  useEffect(() => {
    if (getData) {
      getNewQuestions(getData.category, getData.subcategory, getData.level)
    }
  }, [])

  const systemconfig = useSelector(sysConfigdata)

  const TIMER_SECONDS = Number(systemconfig.quiz_zone_duration)

  const getNewQuestions = async (category_id, subcategory_id, level) => {
    setLevel(level);
    const questionsResponse = await getQuestionApi({
      category_id: category_id,
      subcategory_id: subcategory_id !== 0 ? subcategory_id : "",
      level: level,
    })
    console.log(questionsResponse);
    
    if(!questionsResponse.error) {
      let bookmark = getBookmarkData();
        let questions_ids = Object.keys(bookmark).map((index) => {
          return bookmark[index].question_id;
        });
        let questions = questionsResponse.data.map((data) => {
          let isBookmark = false;
          if (questions_ids.indexOf(data?.id) >= 0) {
            isBookmark = true;
          } else {
            isBookmark = false;
          }

          let question = data?.question
          let note = data?.note

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
    }
    if (questionsResponse.error) {
      toast.error(t("no_que_found"));
      navigate.push("/quiz-play");
    }

  };;

  const onQuestionEnd = async (questionsLength) => {
    const tempData = {
      totalQuestions: questionsLength,
      currentLevel: level,
      maxLevel: getData.maxLevel,
      querylevel: navigate.query.level,
      showQuestions: true,
      reviewAnswer: true,
      playAgain: true,
      nextlevel: true,
    };

    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await navigate.push("/category/result")
  }

  return (
    <Layout>
      <Breadcrumb title={`${t('quiz')} ${t('play')}`} content="" contentTwo="" />
      <div className='dashboard'>
        <div className='container mb-2'>
              <div className='max-479:pt-0'>
                {(() => {
                  if (questions && questions?.length >= 0) {
                    return (
                      <Suspense fallback={<QuestionSkeleton/>}>
                        <Question
                          questions={questions}
                          timerSeconds={TIMER_SECONDS}
                          onQuestionEnd={onQuestionEnd}
                          showQuestions={true}
                          unlockedLevel={getData.unlockedLevel}
                          currentLevel={getData.level}
                        />
                      </Suspense>
                    )
                  } else {
                    return (
                      <div className='text-center text-white'>
                        <p>{t('no_que_found')}</p>
                      </div>
                    )
                  }
                })()}
              </div>
            </div>
          </div>
    </Layout>
  )
}
export default withTranslation()(DashboardPlay)
