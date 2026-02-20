'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { withTranslation } from 'react-i18next'
import Breadcrumb from '@/components/Common/Breadcrumb'
import { t } from '@/utils'
import dynamic from 'next/dynamic'
import { FaPalette, FaRocket, FaUsers, FaBullseye, FaLightbulb, FaStar } from 'react-icons/fa'

const Layout = dynamic(() => import('../Layout/Layout'), { ssr: false })

const AboutUs = () => {
  const features = [
    {
      icon: FaPalette,
      title: "What We Do",
      description: "We curate and provide high-quality prompts that transform your images into stunning works of art. From Ghibli-style animations to superhero aesthetics, anime transformations to festival-themed creations, our extensive prompt library covers diverse artistic styles and themes.",
      gradient: "from-purple-600 to-pink-600",
      bgGradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: FaLightbulb,
      title: "How We Work",
      description: "We don't edit your images directly. Instead, we provide carefully crafted prompts and direct links to leading AI models, empowering you to create your own masterpieces. Our platform serves as a bridge between your creative vision and AI technology.",
      gradient: "from-blue-600 to-cyan-600",
      bgGradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: FaUsers,
      title: "Our Community",
      description: "The Prompt Heroes section celebrates our community's creativity. When you use our prompts to create something amazing, you can share your work with thousands of other creators. The best submissions are featured on our platform, inspiring others and showcasing what's possible.",
      gradient: "from-green-600 to-emerald-600",
      bgGradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: FaBullseye,
      title: "Our Mission",
      description: "We believe everyone deserves access to cutting-edge creative tools. By organizing and simplifying the prompt creation process, we're democratizing AI-powered image editing and fostering a community of digital artists.",
      gradient: "from-orange-600 to-red-600",
      bgGradient: "from-orange-500/20 to-red-500/20"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <Layout>
      <Breadcrumb showBreadcrumb={true} content={t("home")} title="About Us" contentFour="About Us" />

      <div className='min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white py-12 sm:py-16 lg:py-20'>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-pink-900/10 to-blue-900/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)] pointer-events-none" />

        <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-6xl mx-auto"
          >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <FaStar className="w-4 h-4 text-purple-400" />
                <span className="text-xs sm:text-sm font-medium">About PromptLand</span>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
                variants={itemVariants}
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  About Us
                </span>
              </motion.h1>

              <motion.p
                className="text-xl sm:text-2xl text-gray-300 mb-6 font-medium"
                variants={itemVariants}
              >
                Transforming Your Images with AI-Powered Creativity
              </motion.p>

              <motion.div
                className="max-w-3xl mx-auto"
                variants={itemVariants}
              >
                <p className="text-base sm:text-lg text-gray-400 leading-relaxed px-4">
                  Welcome to <span className="text-purple-400 font-semibold">Promptland.in</span>, your ultimate destination for AI image editing prompts. We're passionate about making advanced AI image transformation accessible to everyone, whether you're a digital artist, content creator, or simply someone who loves experimenting with creative styles.
                </p>
              </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12"
              variants={containerVariants}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover={{
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    className="group"
                  >
                    <div className={`relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 h-full`}>
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-4">{feature.title}</h3>
                        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>

                      {/* Hover Glow Effect */}
                      <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`} />
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* CTA Section */}
            <motion.div
              variants={itemVariants}
              className="text-center mt-12 sm:mt-16"
            >
              <motion.a
                href="/category"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaRocket className="w-5 h-5" />
                <span>Start Creating Today!</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(AboutUs)
