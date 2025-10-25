"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { t } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/reducers/languageSlice";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getLevelDataApi, getQuestionApi } from "@/api/apiRoutes";
import { getSelectedCategory, getSelectedSubCategory, selectedSubCategorySuccess } from "@/store/reducers/tempDataSlice";
import { selecttempdata } from '@/store/reducers/tempDataSlice';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IoHeart, IoShareSocial, IoClose, IoSend, IoLogoInstagram } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";

const Layout = dynamic(() => import("@/components/Layout/Layout"), {
    ssr: false,
});

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
        scale: 1.02,
        y: -8,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 17
        }
    }
};

const heartPulseVariants = {
    pulse: {
        scale: [1, 1.2, 1],
        transition: {
            duration: 0.3
        }
    }
};

const PromptHeroes = () => {
    const [popularWorks, setPopularWorks] = useState([]);
    const [allWorks, setAllWorks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedWork, setSelectedWork] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
    
    const selectcurrentLanguage = useSelector(selectCurrentLanguage);
    const selectedCategory = useSelector(getSelectedCategory);
    const selectedSubCategory = useSelector(getSelectedSubCategory);
    const router = useRouter();
    const dispatch = useDispatch();
    const getData = useSelector(selecttempdata);

    // Get Instagram handle from env
    const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "@yourinstagram";
    const submissionEmail = process.env.NEXT_PUBLIC_SUBMISSION_EMAIL || "submit@yoursite.com";

    // SEO: Generate dynamic meta information
    const generateMetaData = () => {
        const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com';
        const currentUrl = typeof window !== 'undefined' ? window.location.href : `${siteUrl}${router.asPath}`;
        const siteName = "AI Prompt Heroes Gallery"; // Change to your site name
        
        const totalWorks = popularWorks.length + allWorks.length;
        const title = `Prompt Heroes - ${totalWorks}+ Community Creations | ${siteName}`;
        const description = `Explore ${totalWorks}+ amazing AI-generated artworks created by our community using ChatGPT, Midjourney, DALL-E and more. Get inspired and share your own creations!`;
        const imageUrl = popularWorks[0]?.image || `${siteUrl}/default-gallery-image.jpg`;
        
        const keywords = [
            "AI art gallery",
            "community creations",
            "AI generated art",
            "ChatGPT creations",
            "Midjourney gallery",
            "DALL-E artworks",
            "AI prompt examples",
            "user submitted art",
            "AI community",
            "prompt engineering showcase"
        ].join(", ");

        return { title, description, imageUrl, currentUrl, keywords, siteName, totalWorks };
    };

    // SEO: Generate JSON-LD structured data
    const generateStructuredData = () => {
        const metaData = generateMetaData();
        
        // ImageGallery Schema
        const gallerySchema = {
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Prompt Heroes Gallery",
            "description": metaData.description,
            "url": metaData.currentUrl,
            "numberOfItems": metaData.totalWorks,
            "image": [...popularWorks, ...allWorks].map(work => work.image).filter(Boolean)
        };

        // CollectionPage Schema
        const collectionSchema = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Community AI Creations",
            "description": "Showcase of amazing AI-generated artworks from our community",
            "url": metaData.currentUrl,
            "isPartOf": {
                "@type": "WebSite",
                "name": metaData.siteName,
                "url": metaData.currentUrl.split('/').slice(0, 3).join('/')
            }
        };

        // ItemList Schema for popular works
        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Most Popular AI Creations",
            "numberOfItems": popularWorks.length,
            "itemListElement": popularWorks.slice(0, 20).map((work, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "CreativeWork",
                    "name": work.question,
                    "image": work.image,
                    "url": work.optiona,
                    "interactionStatistic": {
                        "@type": "InteractionCounter",
                        "interactionType": "https://schema.org/LikeAction",
                        "userInteractionCount": work.optionb
                    }
                }
            }))
        };

        // BreadcrumbList Schema
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": metaData.currentUrl.split('/').slice(0, 3).join('/')
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Prompt Heroes",
                    "item": metaData.currentUrl
                }
            ]
        };

        return { gallerySchema, collectionSchema, itemListSchema, breadcrumbSchema };
    };

    const getAllData = async () => {
        try {
            // Fetch Most Popular (Level 1)
            const popularResponse = await getQuestionApi({
                category_id: 9,
                level: "1",
            });

            if (!popularResponse.error) {
                setPopularWorks(popularResponse.data || []);
            }

            // Fetch All Works (Level 2)
            const allWorksResponse = await getQuestionApi({
                category_id: 9,
                level: "2",
            });

            if (!allWorksResponse.error) {
                let bookmark = getBookmarkData();
                let questions_ids = Object.keys(bookmark).map((index) => {
                    return bookmark[index].question_id;
                });

                let works = allWorksResponse.data.map((data) => {
                    let isBookmark = questions_ids.indexOf(data?.id) >= 0;

                    return {
                        ...data,
                        isBookmarked: isBookmark,
                    };
                });

                setAllWorks(works);
            }

            setIsLoading(false);

            if (popularResponse.error && allWorksResponse.error) {
                toast.error(t("No works found"));
            }
        } catch (error) {
            console.error("API Error:", error);
            setIsLoading(false);
            toast.error(t("something_went_wrong"));
        }
    };

    const getBookmarkData = () => {
        if (typeof window === 'undefined') return {};
        let bookmark = localStorage.getItem("bookmark");
        return bookmark ? JSON.parse(bookmark) : {};
    };

    useEffect(() => {
        if (!router.isReady) return;
        getAllData();
    }, [router.isReady, selectcurrentLanguage]);

    const handleWorkClick = (work) => {
        setSelectedWork(work);
        setIsDialogOpen(true);
    };

    const handleVisitPost = (e, url) => {
        e.stopPropagation();
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    // Work Card Component
    const WorkCard = ({ work, index }) => (
        <motion.article
            variants={itemVariants}
            whileHover="hover"
            initial="rest"
            animate="rest"
            custom={index}
            onClick={() => handleWorkClick(work)}
            className="cursor-pointer group"
            itemScope
            itemType="https://schema.org/CreativeWork"
        >
            <motion.div
                variants={cardHoverVariants}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 relative"
            >
                {/* Image Container */}
                <figure className="relative h-64 overflow-hidden">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        src={work.image || "/images/homeSkeleton.png"}
                        alt={`${work.question} - AI generated artwork`}
                        className="w-full h-full object-cover"
                        loading={index < 8 ? "eager" : "lazy"}
                        itemProp="image"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <Button
                            variant="secondary"
                            size="lg"
                            className="bg-white/90 hover:bg-white text-gray-900 font-semibold"
                        >
                            View Details
                        </Button>
                    </motion.div>
                </figure>

                {/* Content */}
                <div className="p-4 space-y-3">
                    <h3 
                        className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors"
                        itemProp="name"
                    >
                        {work.question}
                    </h3>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="link"
                            size="sm"
                            onClick={(e) => handleVisitPost(e, work.optiona)}
                            className="text-purple-600 hover:text-purple-700 p-0 h-auto font-semibold flex items-center gap-1"
                        >
                            Visit Post
                            <FiExternalLink className="w-4 h-4" />
                        </Button>

                        <motion.div
                            whileHover="pulse"
                            variants={heartPulseVariants}
                            className="flex items-center gap-1.5 text-red-500"
                        >
                            <IoHeart className="w-5 h-5" />
                            <span className="font-semibold text-sm">
                                {work.optionb || 0}
                            </span>
                        </motion.div>
                    </div>
                </div>

                {/* Hidden metadata for SEO */}
                <meta itemProp="url" content={work.optiona} />
                <meta itemProp="interactionCount" content={`${work.optionb} likes`} />
            </motion.div>
        </motion.article>
    );

    const metaData = generateMetaData();
    const structuredData = generateStructuredData();

    return (
        <Layout>
            {/* SEO: Dynamic Head with comprehensive meta tags */}
            {metaData && (
                <Head>
                    {/* Primary Meta Tags */}
                    <title>{metaData.title}</title>
                    <meta name="title" content={metaData.title} />
                    <meta name="description" content={metaData.description} />
                    <meta name="keywords" content={metaData.keywords} />
                    <meta name="author" content={metaData.siteName} />
                    <meta name="robots" content="index, follow, max-image-preview:large" />
                    <link rel="canonical" href={metaData.currentUrl} />

                    {/* Open Graph / Facebook */}
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={metaData.currentUrl} />
                    <meta property="og:title" content={metaData.title} />
                    <meta property="og:description" content={metaData.description} />
                    <meta property="og:image" content={metaData.imageUrl} />
                    <meta property="og:site_name" content={metaData.siteName} />

                    {/* Twitter Card */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={metaData.title} />
                    <meta name="twitter:description" content={metaData.description} />
                    <meta name="twitter:image" content={metaData.imageUrl} />

                    {/* Structured Data */}
                    {structuredData && (
                        <>
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.gallerySchema) }}
                            />
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.collectionSchema) }}
                            />
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.itemListSchema) }}
                            />
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumbSchema) }}
                            />
                        </>
                    )}
                </Head>
            )}

            {/* Main Content */}
            <main className="container px-4 sm:px-6 lg:px-8 py-8 mb-14">
                {/* Hero Section */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-4xl mx-auto mb-12"
                >
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Prompt Heroes Gallery
                    </motion.h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-6">
                        Discover amazing AI-generated creations from our talented community
                    </p>
                    <Button
                        onClick={() => setIsSubmitDialogOpen(true)}
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg"
                    >
                        <IoSend className="mr-2" />
                        Submit Your Work
                    </Button>
                </motion.header>

                {isLoading ? (
                    // Loading State
                    <div className="space-y-12">
                        {[1, 2].map((section) => (
                            <div key={section} className="space-y-6">
                                <div className="h-10 bg-gray-200 rounded-lg w-64 animate-pulse" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {[1, 2, 3, 4].map((item) => (
                                        <motion.div
                                            key={item}
                                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="bg-gray-200 rounded-2xl h-80"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Most Popular Section */}
                        {popularWorks.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="flex items-center gap-3 mb-8"
                                >
                                    <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                                        Most Popular
                                    </h2>
                                    <div className="h-1 flex-1 bg-gradient-to-r from-pink-600 to-transparent rounded-full" />
                                </motion.div>

                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                                >
                                    {popularWorks.map((work, index) => (
                                        <WorkCard key={work.id} work={work} index={index} />
                                    ))}
                                </motion.div>
                            </motion.section>
                        )}

                        {/* All Community Works Section */}
                        {allWorks.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="flex items-center gap-3 mb-8"
                                >
                                    <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                                        Community Creations
                                    </h2>
                                    <div className="h-1 flex-1 bg-gradient-to-r from-purple-600 to-transparent rounded-full" />
                                </motion.div>

                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                                >
                                    {allWorks.map((work, index) => (
                                        <WorkCard key={work.id} work={work} index={index} />
                                    ))}
                                </motion.div>
                            </motion.section>
                        )}

                        {/* Empty State */}
                        {popularWorks.length === 0 && allWorks.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20"
                            >
                                <div className="text-6xl mb-4">🎨</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    No works yet
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Be the first to share your amazing AI creations!
                                </p>
                                <Button
                                    onClick={() => setIsSubmitDialogOpen(true)}
                                    size="lg"
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    Submit Your Work
                                </Button>
                            </motion.div>
                        )}
                    </div>
                )}
            </main>

            {/* Work Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    <Button
                        onClick={() => setIsDialogOpen(false)}
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white rounded-full"
                    >
                        <IoClose className="w-6 h-6" />
                    </Button>

                    {selectedWork && (
                        <div className="relative">
                            {/* Image */}
                            <div className="relative w-full h-[60vh] bg-gray-100">
                                <img
                                    src={selectedWork.image}
                                    alt={selectedWork.question}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                            {selectedWork.question}
                                        </h2>
                                        
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <IoHeart className="w-5 h-5 text-red-500" />
                                                <span className="font-semibold">{selectedWork.optionb || 0} likes</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => setIsSubmitDialogOpen(true)}
                                        variant="outline"
                                        className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                                    >
                                        <IoSend className="mr-2" />
                                        Submit Your Work
                                    </Button>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => window.open(selectedWork.optiona, '_blank', 'noopener,noreferrer')}
                                        size="lg"
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                    >
                                        <FiExternalLink className="mr-2" />
                                        Visit Original Post
                                    </Button>
                                    
                                    <Button
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: selectedWork.question,
                                                    url: selectedWork.optiona
                                                });
                                            }
                                        }}
                                        variant="outline"
                                        size="lg"
                                    >
                                        <IoShareSocial className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Submit Work Dialog */}
            <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Submit Your Work
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            Share your amazing AI creations with our community and get featured!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Instructions */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 space-y-4">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <span className="text-2xl">📸</span>
                                How to Submit
                            </h3>
                            
                            <ol className="space-y-3 text-gray-700">
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        1
                                    </span>
                                    <span>Upload your AI-generated artwork to any social media platform (Instagram, Twitter, Facebook, etc.)</span>
                                </li>
                                
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        2
                                    </span>
                                    <div>
                                        <span>Tag our account: </span>
                                        <a 
                                            href={`https://instagram.com/${instagramHandle.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
                                        >
                                            <IoLogoInstagram className="w-5 h-5" />
                                            {instagramHandle}
                                        </a>
                                    </div>
                                </li>
                                
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        3
                                    </span>
                                    <div>
                                        <span>Send us an email at </span>
                                        <a 
                                            href={`mailto:${submissionEmail}`}
                                            className="font-bold text-purple-600 hover:text-purple-700"
                                        >
                                            {submissionEmail}
                                        </a>
                                        <span> with:</span>
                                        <ul className="mt-2 ml-4 space-y-1 text-sm">
                                            <li>• Your name</li>
                                            <li>• Link to your post</li>
                                            <li>• Brief description of your work</li>
                                        </ul>
                                    </div>
                                </li>
                                
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        4
                                    </span>
                                    <span>We'll review your submission and feature it on our gallery!</span>
                                </li>
                            </ol>
                        </div>

                        {/* Quick Contact Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button
                                onClick={() => window.open(`https://instagram.com/${instagramHandle.replace('@', '')}`, '_blank')}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                size="lg"
                            >
                                <IoLogoInstagram className="mr-2 w-5 h-5" />
                                Follow on Instagram
                            </Button>
                            
                            <Button
                                onClick={() => window.location.href = `mailto:${submissionEmail}`}
                                variant="outline"
                                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                                size="lg"
                            >
                                <IoSend className="mr-2" />
                                Send Email
                            </Button>
                        </div>

                        {/* Guidelines */}
                        <div className="text-xs text-gray-500 space-y-1">
                            <p className="font-semibold">Guidelines:</p>
                            <ul className="ml-4 space-y-0.5">
                                <li>• Only submit your original AI-generated work</li>
                                <li>• Ensure content is appropriate for all audiences</li>
                                <li>• By submitting, you agree to showcase your work in our gallery</li>
                            </ul>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default withTranslation()(PromptHeroes);