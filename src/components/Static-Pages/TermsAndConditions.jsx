'use client'
import React from 'react'
import { withTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { settingsData } from '@/store/reducers/settingsSlice'
import { useSelector } from 'react-redux'
import Breadcrumb from '@/components/Common/Breadcrumb'
import dynamic from 'next/dynamic'
import { t } from '@/utils'

const Layout = dynamic(() => import('../Layout/Layout'), { ssr: false })

const TermAndConditions = () => {
  const selectdata = useSelector(settingsData)

  const appdata = selectdata && selectdata.filter(item => item.type === 'terms_conditions')

  const data = appdata && appdata[0]?.message

  return (
    <Layout>
      <Breadcrumb showBreadcrumb={true} content={t("home")} title={t('t_c')} contentFour={t('t_c')} />
      <div className='container mx-auto'> 
      <div className='morphisam darkSecondaryColor'>
       <div className="max-w-4xl  px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: October 26, 2025</p>
      
      <p className="text-lg text-gray-700 leading-relaxed mb-8">
        Please read these Terms and Conditions carefully before using [Your Website Name].
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">1. Acceptance of Terms</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-6">
        By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the website.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">2. Service Description</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3">
        [Your Website Name] provides:
      </p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-6 space-y-2 ml-4">
        <li>AI image editing prompts organized by category</li>
        <li>Links to third-party AI models and platforms</li>
        <li>A community platform for sharing user-generated content</li>
        <li>Educational resources about AI image editing</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">3. User Responsibilities</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3 font-medium">You agree to:</p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-6 space-y-2 ml-4">
        <li>Use prompts and AI models responsibly and legally</li>
        <li>Respect intellectual property rights when creating and sharing images</li>
        <li>Not use our prompts for illegal, harmful, or offensive content</li>
        <li>Ensure you have rights to any images you upload to third-party AI platforms</li>
        <li>Follow the terms of service of any AI platforms we link to</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">4. Content Ownership</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3">
        <span className="font-semibold">Prompts:</span> All prompts on our website are owned by [Your Website Name] unless otherwise stated. You may use them for personal and commercial image creation.
      </p>
      <p className="text-base text-gray-700 leading-relaxed mb-3">
        <span className="font-semibold">User Submissions:</span> When you share your work in the Prompt Heroes section, you retain ownership of your images but grant us a non-exclusive license to display them on our platform.
      </p>
      <p className="text-base text-gray-700 leading-relaxed mb-6">
        <span className="font-semibold">Generated Images:</span> We do not claim ownership of images you create using our prompts. Ownership and usage rights are governed by the terms of the AI platform you use.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">5. Third-Party Services</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3">
        We provide links to external AI platforms. We are not responsible for:
      </p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-6 space-y-2 ml-4">
        <li>The functionality, availability, or terms of these platforms</li>
        <li>Any costs, subscriptions, or fees charged by these platforms</li>
        <li>Content generated through these platforms</li>
        <li>Data handling practices of these platforms</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">6. Disclaimer of Warranties</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3">
        Our website and prompts are provided "as is" without warranties of any kind. We do not guarantee:
      </p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-6 space-y-2 ml-4">
        <li>Specific results from using our prompts</li>
        <li>Uninterrupted or error-free service</li>
        <li>The accuracy or completeness of our content</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">7. Limitation of Liability</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-6">
        [Your Website Name] shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or prompts.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">8. Content Moderation</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3">
        We reserve the right to:
      </p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-6 space-y-2 ml-4">
        <li>Remove any user-submitted content without notice</li>
        <li>Modify or remove prompts at our discretion</li>
        <li>Terminate accounts that violate these terms</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">9. Intellectual Property</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3">
        You agree not to:
      </p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-6 space-y-2 ml-4">
        <li>Copy, redistribute, or resell our prompts without permission</li>
        <li>Scrape or automatically collect our content</li>
        <li>Remove copyright notices or attributions</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">10. Changes to Terms</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-6">
        We may update these Terms and Conditions at any time. Continued use of the website after changes constitutes acceptance of the modified terms.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">11. Contact</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-6">
        For questions about these Terms and Conditions, please contact us at [your email address].
      </p>
    </div>
      </div>
      </div>
    </Layout>
  )
}
export default withTranslation()(TermAndConditions)
