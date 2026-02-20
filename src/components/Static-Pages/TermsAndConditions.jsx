'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { withTranslation } from 'react-i18next'
import { settingsData } from '@/store/reducers/settingsSlice'
import { useSelector } from 'react-redux'
import Breadcrumb from '@/components/Common/Breadcrumb'
import dynamic from 'next/dynamic'
import { t } from '@/utils'
import { FaFileContract, FaShieldAlt, FaBalanceScale, FaCheckCircle } from 'react-icons/fa'

const Layout = dynamic(() => import('../Layout/Layout'), { ssr: false })

const TermAndConditions = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the website."
    },
    {
      title: "2. Service Description",
      content: "Promptland.in provides AI image editing prompts organized by category, links to third-party AI models and platforms, a community platform for sharing user-generated content, and educational resources about AI image editing."
    },
    {
      title: "3. User Responsibilities",
      content: "You agree to use prompts and AI models responsibly and legally, respect intellectual property rights, not use our prompts for illegal or harmful content, ensure you have rights to any images you upload, and follow the terms of service of any AI platforms we link to."
    },
    {
      title: "4. Content Ownership",
      content: "All prompts on our website are owned by Promptland.in unless otherwise stated. When you share your work in the Prompt Heroes section, you retain ownership but grant us a non-exclusive license to display them. We do not claim ownership of images you create using our prompts."
    },
    {
      title: "5. Third-Party Services",
      content: "We provide links to external AI platforms. We are not responsible for their functionality, availability, terms, costs, subscriptions, content generated, or data handling practices."
    },
    {
      title: "6. Disclaimer of Warranties",
      content: "Our website and prompts are provided \"as is\" without warranties. We do not guarantee specific results, uninterrupted service, or the accuracy of our content."
    },
    {
      title: "7. Limitation of Liability",
      content: "Promptland.in shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or prompts."
    },
    {
      title: "8. Content Moderation",
      content: "We reserve the right to remove any user-submitted content without notice, modify or remove prompts at our discretion, and terminate accounts that violate these terms."
    },
    {
      title: "9. Intellectual Property",
      content: "You agree not to copy, redistribute, or resell our prompts without permission, scrape or automatically collect our content, or remove copyright notices or attributions."
    },
    {
      title: "10. Changes to Terms",
      content: "We may update these Terms and Conditions at any time. Continued use of the website after changes constitutes acceptance of the modified terms."
    },
    {
      title: "11. Contact",
      content: "For questions about these Terms and Conditions, please contact us at quizx.texh@gmail.com."
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
      <Breadcrumb showBreadcrumb={true} content={t("home")} title="Terms & Conditions" contentFour="Terms & Conditions" />

      <div className='min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white py-12 sm:py-16 lg:py-20'>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-pink-900/10 to-blue-900/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)] pointer-events-none" />

        <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto">

            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-sm mb-6" whileHover={{ scale: 1.05 }}>
                <FaFileContract className="w-4 h-4 text-indigo-400" />
                <span className="text-xs sm:text-sm font-medium">Legal Agreement</span>
              </motion.div>

              <motion.h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6" variants={itemVariants}>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Terms and Conditions
                </span>
              </motion.h1>

              <motion.p className="text-sm text-gray-400 mb-6" variants={itemVariants}>
                Last Updated: October 26, 2025
              </motion.p>

              <motion.p className="text-base text-gray-400 max-w-2xl mx-auto" variants={itemVariants}>
                Please read these Terms and Conditions carefully before using Promptland.in.
              </motion.p>
            </motion.div>

            {/* Sections */}
            <motion.div className="space-y-6 mb-12" variants={containerVariants}>
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <h2 className="text-lg sm:text-xl font-bold mb-3 text-indigo-300">{section.title}</h2>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{section.content}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Important Notice */}
            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <FaShieldAlt className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold mb-2 text-yellow-400">Important Notice</h3>
                  <p className="text-sm text-gray-300">
                    By using Promptland.in, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. We recommend saving a copy for your records.
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

export default withTranslation()(TermAndConditions)
