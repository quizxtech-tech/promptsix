"use client"
import React from 'react'
import { withTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import { settingsData } from '@/store/reducers/settingsSlice'
import Breadcrumb from '@/components/Common/Breadcrumb'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('../Layout/Layout'), { ssr: false })
import { t } from "@/utils";

const PrivacyPolicy = () => {
    const selectdata = useSelector(settingsData)

    const appdata = selectdata && selectdata.filter(item => item.type === 'privacy_policy')

    const data = appdata && appdata[0]?.message

    return (
        <Layout>
            <Breadcrumb showBreadcrumb={true} content={t("home")} title={t('privacy_policy')} contentFour={t('privacy_policy')} />
            <div className='container mx-auto'> 
            <div className='morphisam darkSecondaryColor'>

                <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: October 26, 2025</p>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">1. Introduction</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-6">
        [Your Website Name] respects your privacy. This Privacy Policy explains how we collect, use, and protect your information.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">2. Information We Collect</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3 font-medium">Information You Provide:</p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-4 space-y-2 ml-4">
        <li>Account registration details (if applicable)</li>
        <li>Images submitted to Prompt Heroes section</li>
        <li>Contact information for inquiries</li>
      </ul>
      <p className="text-base text-gray-700 leading-relaxed mb-3 font-medium">Automatically Collected Information:</p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-6 space-y-2 ml-4">
        <li>IP address and device information</li>
        <li>Browser type and version</li>
        <li>Pages visited and time spent</li>
        <li>Referring website addresses</li>
        <li>Cookies and similar tracking technologies</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">3. How We Use Your Information</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3">
        We use collected information to:
      </p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-6 space-y-2 ml-4">
        <li>Provide and improve our services</li>
        <li>Display user submissions in Prompt Heroes section</li>
        <li>Respond to inquiries and support requests</li>
        <li>Analyze website usage and trends</li>
        <li>Prevent fraud and enhance security</li>
        <li>Send service updates (with your consent)</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">4. Information Sharing</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3 font-semibold">
        We do not sell your personal information.
      </p>
      <p className="text-base text-gray-700 leading-relaxed mb-3">
        We may share information with:
      </p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-6 space-y-2 ml-4">
        <li>Service providers who help operate our website</li>
        <li>Legal authorities when required by law</li>
        <li>Third parties with your explicit consent</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">5. Third-Party Platforms</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3">
        When you click links to AI platforms, you leave our website. We are not responsible for:
      </p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-4 space-y-2 ml-4">
        <li>Privacy practices of these platforms</li>
        <li>How they handle your images or data</li>
        <li>Their data collection or usage policies</li>
      </ul>
      <p className="text-base text-gray-700 leading-relaxed mb-6 font-medium bg-yellow-50 border-l-4 border-yellow-400 p-4">
        Important: Review the privacy policies of AI platforms before uploading your images.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">6. User-Generated Content</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3">
        When you submit images to Prompt Heroes:
      </p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-6 space-y-2 ml-4">
        <li>Your username or watermark may be displayed</li>
        <li>Images become publicly visible on our platform</li>
        <li>You can request removal at any time</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">7. Cookies and Tracking</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3">
        We use cookies to:
      </p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-4 space-y-2 ml-4">
        <li>Remember your preferences</li>
        <li>Analyze website traffic</li>
        <li>Improve user experience</li>
      </ul>
      <p className="text-base text-gray-700 leading-relaxed mb-6">
        You can disable cookies in your browser settings, though some features may not work properly.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">8. Data Security</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3">
        We implement reasonable security measures to protect your information, including:
      </p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-4 space-y-2 ml-4">
        <li>Secure server infrastructure</li>
        <li>Encryption for data transmission</li>
        <li>Regular security audits</li>
      </ul>
      <p className="text-base text-gray-700 leading-relaxed mb-6">
        However, no method of transmission over the internet is 100% secure.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">9. Your Rights</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-3">
        You have the right to:
      </p>
      <ul className="list-disc list-inside text-base text-gray-700 mb-6 space-y-2 ml-4">
        <li>Access your personal information</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Opt out of marketing communications</li>
        <li>Withdraw consent for data processing</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">10. Children's Privacy</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-6">
        Our website is not intended for children under 13. We do not knowingly collect information from children.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">11. International Users</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-6">
        Your information may be transferred to and processed in countries other than your own. By using our website, you consent to such transfers.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">12. Changes to Privacy Policy</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-6">
        We may update this Privacy Policy periodically. We will notify users of significant changes through website announcements.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-10">13. Contact Us</h2>
      <p className="text-base text-gray-700 leading-relaxed mb-6">
        For privacy-related questions or requests, contact us at [your email address].
      </p>
    </div>
            </div>
            </div>
        </Layout>
    )
}
export default withTranslation()(PrivacyPolicy)
