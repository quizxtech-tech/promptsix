'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { withTranslation } from 'react-i18next'
import Breadcrumb from '@/components/Common/Breadcrumb'
import dynamic from 'next/dynamic'
import { t } from '@/utils'
import { FaShieldAlt, FaLock, FaUserShield, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa'

const Layout = dynamic(() => import('../Layout/Layout'), { ssr: false })

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Introduction",
      content: "Promptland.in respects your privacy. This Privacy Policy explains how we collect, use, and protect your information.",
      icon: FaInfoCircle,
      color: "blue"
    },
    {
      title: "2. Information We Collect",
      content: "We collect information you provide (account details, images submitted to Prompt Heroes, contact information) and automatically collected information (IP address, browser type, pages visited, cookies).",
      icon: FaUserShield,
      color: "purple"
    },
    {
      title: "3. How We Use Your Information",
      content: "We use collected information to provide and improve our services, display user submissions, respond to inquiries, analyze usage trends, prevent fraud, and send service updates with your consent.",
      icon: FaLock,
      color: "green"
    },
    {
      title: "4. Information Sharing",
      content: "We do not sell your personal information. We may share information with service providers who help operate our website, legal authorities when required by law, and third parties with your explicit consent.",
      icon: FaShieldAlt,
      color: "red"
    },
    {
      title: "5. Third-Party Platforms",
      content: "When you click links to AI platforms, you leave our website. We are not responsible for their privacy practices, how they handle your images or data, or their data collection policies. Review the privacy policies of AI platforms before uploading your images.",
      icon: FaExclamationTriangle,
      color: "yellow"
    },
    {
      title: "6. User-Generated Content",
      content: "When you submit images to Prompt Heroes, your username or watermark may be displayed, images become publicly visible, and you can request removal at any time.",
      icon: FaUserShield,
      color: "indigo"
    },
    {
      title: "7. Cookies and Tracking",
      content: "We use cookies to remember your preferences, analyze website traffic, and improve user experience. You can disable cookies in your browser settings, though some features may not work properly.",
      icon: FaInfoCircle,
      color: "pink"
    },
    {
      title: "8. Data Security",
      content: "We implement reasonable security measures including secure server infrastructure, encryption for data transmission, and regular security audits. However, no method of transmission over the internet is 100% secure.",
      icon: FaLock,
      color: "cyan"
    },
    {
      title: "9. Your Rights",
      content: "You have the right to access your personal information, request correction of inaccurate data, request deletion of your data, opt out of marketing communications, and withdraw consent for data processing.",
      icon: FaShieldAlt,
      color: "teal"
    },
    {
      title: "10. Children's Privacy",
      content: "Our website is not intended for children under 13. We do not knowingly collect information from children.",
      icon: FaUserShield,
      color: "orange"
    },
    {
      title: "11. International Users",
      content: "Your information may be transferred to and processed in countries other than your own. By using our website, you consent to such transfers.",
      icon: FaInfoCircle,
      color: "violet"
    },
    {
      title: "12. Changes to Privacy Policy",
      content: "We may update this Privacy Policy periodically. We will notify users of significant changes through website announcements.",
      icon: FaExclamationTriangle,
      color: "rose"
    },
    {
      title: "13. Contact Us",
      content: "For privacy-related questions or requests, contact us at quizx.texh@gmail.com.",
      icon: FaInfoCircle,
      color: "emerald"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <Layout>
      <Breadcrumb showBreadcrumb={true} content={t("home")} title="Privacy Policy" contentFour="Privacy Policy" />

      <div className='min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white py-12 sm:py-16 lg:py-20'>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-pink-900/10 to-blue-900/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)] pointer-events-none" />

        <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto">

            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm mb-6" whileHover={{ scale: 1.05 }}>
                <FaShieldAlt className="w-4 h-4 text-green-400" />
                <span className="text-xs sm:text-sm font-medium">Privacy & Security</span>
              </motion.div>

              <motion.h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6" variants={itemVariants}>
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Privacy Policy
                </span>
              </motion.h1>

              <motion.p className="text-sm text-gray-400 mb-6" variants={itemVariants}>
                Last Updated: October 26, 2025
              </motion.p>

              <motion.p className="text-base text-gray-400 max-w-2xl mx-auto" variants={itemVariants}>
                Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
              </motion.p>
            </motion.div>

            {/* Sections */}
            <motion.div className="space-y-6 mb-12" variants={containerVariants}>
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${section.color}-500 to-${section.color}-600 flex items-center justify-center flex-shrink-0 mt-1`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg sm:text-xl font-bold mb-3 text-green-300">{section.title}</h2>
                        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{section.content}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Important Notice */}
            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold mb-2 text-yellow-400">Important Reminder</h3>
                  <p className="text-sm text-gray-300">
                    By using Promptland.in, you acknowledge that you have read and understood this Privacy Policy. We are committed to protecting your privacy and handling your data responsibly.
                  </p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(PrivacyPolicy)
