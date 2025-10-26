'use client'
import React from 'react'
import { withTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { settingsData } from '@/store/reducers/settingsSlice'
import { t } from '@/utils'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('../Layout/Layout'), { ssr: false })

const AboutUs = () => {
  const selectdata = useSelector(settingsData)

  const appdata = selectdata && selectdata.filter(item => item.type === 'about_us')

  const data = appdata && appdata[0]?.message

  return (
    <Layout>
      <Breadcrumb showBreadcrumb={true} content={t("home")} title={t('about_us')} contentFour={t('about_us')} />
      <div className='mt-6 my-[60px] mx-0 max-479:mb-8'>
        <div className='container mb-2'>
          {data ? (
            <div className='container mx-auto'> 
            <div className='morphisam darkSecondaryColor'>
              <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
                <p className="text-xl text-gray-600 mb-8">Transforming Your Images with AI-Powered Creativity</p>

                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Welcome to [Your Website Name], your ultimate destination for AI image editing prompts. We're passionate about making advanced AI image transformation accessible to everyone, whether you're a digital artist, content creator, or simply someone who loves experimenting with creative styles.
                </p>

                <h2 className="text-3xl font-semibold text-gray-900 mb-4 mt-10">What We Do</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  We curate and provide high-quality prompts that transform your images into stunning works of art. From Ghibli-style animations to superhero aesthetics, anime transformations to festival-themed creations, our extensive prompt library covers diverse artistic styles and themes.
                </p>

                <h2 className="text-3xl font-semibold text-gray-900 mb-4 mt-10">How We Work</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  We don't edit your images directly. Instead, we provide carefully crafted prompts and direct links to leading AI models, empowering you to create your own masterpieces. Our platform serves as a bridge between your creative vision and AI technology.
                </p>

                <h2 className="text-3xl font-semibold text-gray-900 mb-4 mt-10">Our Community</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  The Prompt Heroes section celebrates our community's creativity. When you use our prompts to create something amazing, you can share your work with thousands of other creators. The best submissions are featured on our platform, inspiring others and showcasing what's possible.
                </p>

                <h2 className="text-3xl font-semibold text-gray-900 mb-4 mt-10">Our Mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  We believe everyone deserves access to cutting-edge creative tools. By organizing and simplifying the prompt creation process, we're democratizing AI-powered image editing and fostering a community of digital artists.
                </p>
              </div>


            </div>
          </div>
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

export default withTranslation()(AboutUs)
