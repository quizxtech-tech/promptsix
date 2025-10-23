'use client'
import React from 'react'
import { withTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { settingsData } from '@/store/reducers/settingsSlice'
import dynamic from 'next/dynamic'
import { t } from '@/utils'
const Layout = dynamic(() => import('../Layout/Layout'), { ssr: false })

const Instructions = () => {
  const selectdata = useSelector(settingsData)

  const appdata = selectdata && selectdata.filter(item => item.type === 'instructions')
  const data = appdata && appdata[0]?.message
  return (
    <Layout>
      <Breadcrumb showBreadcrumb={true} content={t("home")} title={t('instruction')} contentFour={t('instruction')} />
      <div className='mt-6 mb-12 md:my-[60px] mx-0 '>
        <div className='container mb-2'>
            {data ? (
              // Check if data is not empty after sanitization
              data !== '' ? (
                <div className='morphisam darkSecondaryColor' dangerouslySetInnerHTML={{ __html: data }}></div>
              ) : (
                <p>{t('no_data_found')}</p>
              )
            ) : (
              <div className='text-center text-white'>
                <Skeleton count={5} />
              </div>
            )}
        </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(Instructions)
