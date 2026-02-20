'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { withTranslation } from 'react-i18next'
import Breadcrumb from '@/components/Common/Breadcrumb'
import dynamic from 'next/dynamic'
import { t } from '@/utils'
import { FaInstagram, FaEnvelope, FaPhone, FaRocket, FaComments } from 'react-icons/fa'

const Layout = dynamic(() => import('../Layout/Layout'), { ssr: false })

const ContactUs = () => {
  const contactMethods = [
    {
      icon: FaInstagram,
      title: "Instagram Community",
      description: "Join our visual journey and DM us for features:",
      contact: "@promptland.in",
      link: "https://instagram.com/promptland.in",
      gradient: "from-purple-600 to-pink-600",
      bgGradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: FaEnvelope,
      title: "Electronic Mail",
      description: "Send your queries directly to our inbox:",
      contact: "quizx.texh@gmail.com",
      link: "mailto:quizx.texh@gmail.com",
      gradient: "from-blue-600 to-cyan-600",
      bgGradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: FaPhone,
      title: "Direct Line",
      description: "Speak to a human:",
      contact: "+91 63546 24441",
      link: "tel:+916354624441",
      gradient: "from-green-600 to-emerald-600",
      bgGradient: "from-green-500/20 to-emerald-500/20"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    hidden: { opacity: 0, scale: 0.9, y: 20 },
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
      <Breadcrumb showBreadcrumb={true} content={t("home")} title="Contact Us" contentFour="Contact Us" />

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
                <FaComments className="w-4 h-4 text-purple-400" />
                <span className="text-xs sm:text-sm font-medium">Get in Touch</span>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
                variants={itemVariants}
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Prompt Us!
                </span>
              </motion.h1>

              <motion.p
                className="text-xl sm:text-2xl text-gray-300 mb-6 font-medium"
                variants={itemVariants}
              >
                Let's generate a conversation.
              </motion.p>

              <motion.div
                className="max-w-3xl mx-auto"
                variants={itemVariants}
              >
                <p className="text-base sm:text-lg text-gray-400 leading-relaxed px-4">
                  Stuck on a creative block? Found a bug in the matrix? Or maybe you just want to share a masterpiece created with our tools? At <span className="text-purple-400 font-semibold">PromptLand</span>, we believe communication is the best algorithm. Reach out to us for collaborations, gallery submissions, or assistance with your AI editing journey.
                </p>
              </motion.div>
            </motion.div>

            {/* Connect with Team Section */}
            <motion.div variants={itemVariants} className="mb-12">
              <motion.h2
                className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12"
                variants={itemVariants}
              >
                <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                  Connect with the Team:
                </span>
              </motion.h2>

              {/* Contact Methods Grid */}
              <motion.div
                className="grid md:grid-cols-3 gap-6 sm:gap-8"
                variants={containerVariants}
              >
                {contactMethods.map((method, index) => {
                  const Icon = method.icon
                  return (
                    <motion.a
                      key={index}
                      href={method.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={cardVariants}
                      whileHover={{
                        y: -10,
                        transition: { duration: 0.3 }
                      }}
                      className="group cursor-pointer block"
                    >
                      <div className={`relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br ${method.bgGradient} backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 h-full`}>
                        {/* Icon */}
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${method.gradient} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>

                        {/* Content */}
                        <div className="text-center">
                          <h3 className="text-lg sm:text-xl font-bold mb-3">{method.title}</h3>
                          <p className="text-sm text-gray-400 mb-4">{method.description}</p>
                          <motion.div
                            className={`text-base sm:text-lg font-semibold bg-gradient-to-r ${method.gradient} bg-clip-text text-transparent break-all`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {method.contact}
                          </motion.div>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${method.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`} />
                      </div>
                    </motion.a>
                  )
                })}
              </motion.div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              variants={itemVariants}
              className="text-center mt-12 sm:mt-16"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaRocket className="w-5 h-5" />
                <span>We're here to help!</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(ContactUs)
