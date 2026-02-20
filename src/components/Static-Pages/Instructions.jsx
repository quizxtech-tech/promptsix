'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { withTranslation } from 'react-i18next'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { settingsData } from '@/store/reducers/settingsSlice'
import dynamic from 'next/dynamic'
import { t } from '@/utils'
import { FaSearch, FaMousePointer, FaCopy, FaRobot, FaUpload, FaShareAlt, FaLightbulb, FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa'

const Layout = dynamic(() => import('../Layout/Layout'), { ssr: false })

const Instructions = () => {
  const steps = [
    { icon: FaSearch, title: "Browse Categories", desc: "Explore organized categories for different artistic styles", gradient: "from-purple-600 to-pink-600" },
    { icon: FaMousePointer, title: "Select a Prompt", desc: "Click on the prompt that matches your desired style", gradient: "from-blue-600 to-cyan-600" },
    { icon: FaCopy, title: "Copy the Prompt", desc: "Click copy to save the full prompt to your clipboard", gradient: "from-green-600 to-emerald-600" },
    { icon: FaRobot, title: "Choose AI Model", desc: "Select from recommended AI platforms", gradient: "from-orange-600 to-red-600" },
    { icon: FaUpload, title: "Upload & Generate", desc: "Upload your image and paste the prompt to create", gradient: "from-pink-600 to-rose-600" },
    { icon: FaShareAlt, title: "Share Your Work", desc: "Submit your creation to Prompt Heroes gallery", gradient: "from-indigo-600 to-purple-600" }
  ]

  const tips = [
    "Use high-resolution images for better results",
    "Copy the entire prompt without modifications",
    "Try multiple AI platforms for comparison",
    "Check example images for guidance"
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <Layout>
      <Breadcrumb showBreadcrumb={true} content={t("home")} title="Instructions" contentFour="Instructions" />

      <div className='min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white py-12 sm:py-16 lg:py-20'>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-pink-900/10 to-blue-900/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)] pointer-events-none" />

        <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-6xl mx-auto">

            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-sm mb-6" whileHover={{ scale: 1.05 }}>
                <FaQuestionCircle className="w-4 h-4 text-blue-400" />
                <span className="text-xs sm:text-sm font-medium">How It Works</span>
              </motion.div>

              <motion.h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6" variants={itemVariants}>
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  How to Use Our Platform
                </span>
              </motion.h1>

              <motion.p className="text-xl sm:text-2xl text-gray-300 mb-6 font-medium" variants={itemVariants}>
                Follow these simple steps to transform your images with AI
              </motion.p>
            </motion.div>

            {/* Steps Grid */}
            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" variants={containerVariants}>
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }} className="group">
                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 h-full">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold text-gray-400 mb-2">Step {index + 1}</div>
                      <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-400">{step.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Tips Section */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-8 border border-blue-500/20 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaLightbulb className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold">Pro Tips</h2>
              </div>
              <ul className="grid md:grid-cols-2 gap-4">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* What We Provide Section */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <h3 className="text-xl font-bold mb-4 text-green-400">What We Provide</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Curated, tested prompts</li>
                  <li>• Direct links to AI platforms</li>
                  <li>• Community gallery</li>
                  <li>• Style categorization</li>
                </ul>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20">
                <h3 className="text-xl font-bold mb-4 text-red-400">What We Don't Provide</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Image processing services</li>
                  <li>• AI model hosting</li>
                  <li>• Image storage</li>
                  <li>• Editing software</li>
                </ul>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants} className="text-center mt-12">
              <motion.a href="/category" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full font-semibold" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FaSearch className="w-5 h-5" />
                <span>Explore Prompts</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(Instructions)
