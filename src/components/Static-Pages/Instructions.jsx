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
      <div className='container mx-auto'> 
      <div className='mt-6 mb-12 md:my-[60px] mx-0 '>
        <div className='morphisam darkSecondaryColor'>

          <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">How to Use Our Platform</h1>
      <p className="text-xl text-gray-600 mb-12">Follow these simple steps to transform your images with AI</p>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Getting Started</h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600 mb-3">Step 1: Browse Categories</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              Explore our organized categories including Modal, Festival, Anime, Superhero, and more. Each category contains themed prompts for different artistic styles.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600 mb-3">Step 2: Check Trending Prompts</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              Visit the Trending section to see what's popular in the community right now. These prompts are being used by creators worldwide to produce stunning results.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600 mb-3">Step 3: Get Inspired by Prompt Heroes</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              Browse the Prompt Heroes gallery to see real examples of images created using our prompts. This helps you visualize possibilities before creating your own.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Creating Your Edited Image</h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-purple-600 mb-3">Step 1: Select Your Category</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              Click on the category that matches your desired style. Some categories have subcategories for more specific themes.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-purple-600 mb-3">Step 2: Choose a Prompt</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              Browse through the prompt cards and click on the one that appeals to you. Each card shows a preview and brief description.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-purple-600 mb-3">Step 3: View Prompt Details</h2>
            <p className="text-base text-gray-700 leading-relaxed mb-3">
              You'll be redirected to the prompt details page where you can see:
            </p>
            <ul className="list-disc list-inside text-base text-gray-700 space-y-2 ml-4">
              <li>The full prompt text</li>
              <li>Recommended AI models</li>
              <li>Recommended Prompts</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-purple-600 mb-3">Step 4: Copy the Prompt</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              Click the "Copy" button to copy the prompt to your clipboard. Make sure the entire prompt is copied before proceeding.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-purple-600 mb-3">Step 5: Choose an AI Model</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              Click on one of the recommended AI model buttons. We'll redirect you to that platform. Different models may produce different results, so feel free to experiment.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-purple-600 mb-3">Step 6: Generate Your Image</h2>
            <p className="text-base text-gray-700 leading-relaxed mb-3">On the AI platform:</p>
            <ul className="list-disc list-inside text-base text-gray-700 space-y-2 ml-4">
              <li>Upload your original image</li>
              <li>Paste the prompt you copied</li>
              <li>Adjust any platform-specific settings</li>
              <li>Click generate and wait for your edited image</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Sharing Your Creation</h2>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-4 font-medium">Join Prompt Heroes:</p>
        <p className="text-base text-gray-700 leading-relaxed mb-4">
          If you're proud of your creation, share it with our community!
        </p>
        
        <ol className="list-decimal list-inside text-base text-gray-700 space-y-2 ml-4">
          <li>Click "Share Your Work" button</li>
          <li>Upload your edited image</li>
          <li>Credit the prompt you used</li>
          <li>Add a brief description (optional)</li>
          <li>Submit for review</li>
        </ol>
        
        <p className="text-base text-gray-700 leading-relaxed mt-6">
          The best submissions are featured on our homepage and Prompt Heroes gallery.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tips for Best Results</h2>
          <ul className="space-y-3">
            <li className="text-base text-gray-700">
              <span className="font-semibold">Image Quality:</span> Use high-resolution images for better AI processing results.
            </li>
            <li className="text-base text-gray-700">
              <span className="font-semibold">Prompt Accuracy:</span> Copy the entire prompt without modifications unless you understand prompt engineering.
            </li>
            <li className="text-base text-gray-700">
              <span className="font-semibold">Platform Selection:</span> Different AI models excel at different styles. Try multiple platforms for comparison.
            </li>
            <li className="text-base text-gray-700">
              <span className="font-semibold">Face and Details:</span> Some styles work better with specific subject types. Check example images for guidance.
            </li>
            <li className="text-base text-gray-700">
              <span className="font-semibold">Experimentation:</span> Don't hesitate to try different prompts on the same image.
            </li>
          </ul>
        </div>

        <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Troubleshooting</h2>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-base text-gray-900 mb-2">Prompt Not Working?</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                <li>Ensure you copied the complete prompt</li>
                <li>Check if the AI platform has specific format requirements</li>
                <li>Verify your image meets the platform's size requirements</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-base text-gray-900 mb-2">Poor Results?</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                <li>Try a different AI model from our recommendations</li>
                <li>Adjust image quality or composition</li>
                <li>Experiment with similar prompts in the same category</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-base text-gray-900 mb-2">Technical Issues?</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                <li>Clear your browser cache</li>
                <li>Try a different browser</li>
                <li>Check your internet connection</li>
                <li>Contact us if problems persist</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Understanding Our Platform</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-green-600 mb-3">What We Provide:</h2>
            <ul className="list-disc list-inside text-base text-gray-700 space-y-2 ml-4">
              <li>Curated, tested prompts</li>
              <li>Direct links to AI platforms</li>
              <li>Community gallery</li>
              <li>Style categorization</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-600 mb-3">What We Don't Provide:</h2>
            <ul className="list-disc list-inside text-base text-gray-700 space-y-2 ml-4">
              <li>Image processing services</li>
              <li>AI model hosting</li>
              <li>Image storage</li>
              <li>Editing software</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-lg p-8 mb-12 border-l-4 border-yellow-400">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Safety and Ethics</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4 font-semibold">Use Responsibly:</p>
        <ul className="list-disc list-inside text-base text-gray-700 space-y-2 ml-4">
          <li>Respect copyright and intellectual property</li>
          <li>Don't create offensive or harmful content</li>
          <li>Follow AI platform guidelines</li>
          <li>Credit original artists when appropriate</li>
        </ul>
      </div>

      <div className="bg-indigo-50 rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Getting Help</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-4 font-semibold">Need Assistance?</p>
        <ul className="list-disc list-inside text-base text-gray-700 space-y-2 ml-4">
          <li>Check our FAQ section</li>
          <li>Browse community discussions</li>
          <li>Contact support at [your email address]</li>
          <li>Follow us on social media for updates</li>
        </ul>
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Pro Tips</h2>
        <div className="space-y-4">
          <p className="text-base text-gray-700 leading-relaxed">
            <span className="font-semibold">Bookmark Favorites:</span> Save prompts you love for quick access later.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            <span className="font-semibold">Build Collections:</span> Use multiple prompts to create themed image series.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            <span className="font-semibold">Share Feedback:</span> Let us know which prompts work best so we can improve our library.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            <span className="font-semibold">Stay Updated:</span> New prompts are added regularly, so check back often for fresh creative options.
          </p>
        </div>
      </div>
    </div>
        </div>
      </div>
      </div>
    </Layout>
  )
}

export default withTranslation()(Instructions)
