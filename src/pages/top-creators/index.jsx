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
import { getLevelDataApi, getQuestionApi } from "@/api/apiRoutes";
import { fetchAllTopCreators } from "@/utils/buildTimeApi";
import { generateStructuredData } from "@/components/SEO/SEOHead";
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
import ShareButton from "@/components/Common/ShareButton";

import Layout from "@/components/Layout/Layout";

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

const TopCreators = ({ initialPopularWorks = [], initialAllWorks = [] }) => {
    const [popularWorks, setPopularWorks] = useState(initialPopularWorks);
    const [allWorks, setAllWorks] = useState(initialAllWorks);
    const [isLoading, setIsLoading] = useState(!initialPopularWorks.length && !initialAllWorks.length);
    const [selectedWork, setSelectedWork] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const selectcurrentLanguage = useSelector(selectCurrentLanguage);
    const selectedCategory = useSelector(getSelectedCategory);
    const selectedSubCategory = useSelector(getSelectedSubCategory);
    const router = useRouter();
    const dispatch = useDispatch();
    const getData = useSelector(selecttempdata);

    // Get Instagram handle from env
    const instagramHandle = "@promptland.in";
    const submissionEmail = process.env.NEXT_PUBLIC_SUBMISSION_EMAIL || "submit@yoursite.com";

    // SEO: Generate dynamic meta information
    const generateMetaData = () => {
        const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://promptland.in';
        const currentUrl = typeof window !== 'undefined' ? window.location.href : `${siteUrl}${router.asPath}`;
        const siteName = "AI Prompt Heroes Gallery"; // Change to your site name

        const totalWorks = popularWorks.length + allWorks.length;
        const title = `Top Creators - ${totalWorks}+ Creators | ${siteName}`;
        const description = `Explore ${totalWorks}+ top creators in the AI community.`;
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
            "name": "Top Creators",
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
                    "description": work.optionb
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
                    "name": "Top Creators",
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
                category_id: 37,
                level: "1",
            });

            if (!popularResponse.error) {
                setPopularWorks(popularResponse.data || []);
            }

            // Fetch All Works (Level 2)
            const allWorksResponse = await getQuestionApi({
                category_id: 37,
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

    const renderMedia = (rawUrl, isCard = false) => {
        if (!rawUrl) return <img src="/images/homeSkeleton.png" alt="Skeleton" className={`w-full h-full ${isCard ? 'object-cover' : 'object-contain'}`} />;

        // Extract URL from HTML wrapper if provided by WYSIWYG editor
        const urlMatch = rawUrl.match(/(https?:\/\/[^\s"<]+)/);
        const url = urlMatch ? urlMatch[0] : rawUrl;

        return (
            <div className={`w-full h-full flex items-center justify-center overflow-hidden ${!isCard ? 'bg-black' : ''}`}>
                <img
                    src={url}
                    alt="Media"
                    className={`w-full h-full ${isCard ? 'object-cover' : 'object-contain'}`}
                    loading="lazy"
                />
            </div>
        );
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
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 relative flex flex-col h-full"
            >
                {/* Image Container */}
                <figure className="relative h-80 overflow-hidden bg-black">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        className="w-full h-full"
                    >
                        {renderMedia( work.image, true)}
                    </motion.div>

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

                    {work.optionb && (
                        <p className="text-sm text-gray-600 line-clamp-2" itemProp="description">
                            {work.optionb}
                        </p>
                    )}

                    {/* Actions Row */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="link"
                            size="sm"
                            onClick={(e) => handleVisitPost(e, work.optiona)}
                            className="text-purple-600 hover:text-purple-700 p-0 h-auto font-semibold flex items-center gap-1"
                        >
                            Visit Account
                            <FiExternalLink className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Hidden metadata for SEO */}
                <meta itemProp="url" content={work.optiona} />
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
                        Top Creators
                    </motion.h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-6">
                        Discover amazing AI-generated creations from our top creators
                    </p>
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
                                        All Creators
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
                                    We are shortlisting the best creators.
                                </p>
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
                            {/* Media Carousel */}
                            <div className="relative w-full h-[50vh] md:h-[60vh] bg-black flex items-center justify-center overflow-hidden">
                                {renderMedia(selectedWork.image, false)}
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div className="flex sm:flex-row flex-col items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                            {selectedWork.question}
                                        </h2>
                                        {selectedWork.optionb && (
                                            <p className="text-base text-gray-600">
                                                {selectedWork.optionb}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex sm:flex-row flex-col h-full gap-3">
                                        <Button
                                            onClick={() => window.open(selectedWork.optiona, '_blank', 'noopener,noreferrer')}
                                            size="lg"
                                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 min-h-10"
                                        >
                                            <FiExternalLink className="mr-2" />
                                            Visit Account
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
                                            <ShareButton showOnTop={true} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </Layout>
    );
};

// SSG: Pre-fetch top creators at build time
export async function getStaticProps() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://promptland.in';

    try {
        console.log('[SSG] Generating static top-creators page...');
        const heroesData = await fetchAllTopCreators();

        const processedHeroes = (heroesData || []).map((data) => ({
            ...data,
            isBookmarked: false,
        }));

        console.log(`[SSG] Generated top-creators page with ${processedHeroes.length} creators`);

        const seoData = {
            title: `Top Creators | ${processedHeroes.length}+ Creative AI Art Works`,
            description: `Discover ${processedHeroes.length}+ stunning creators. Get inspired!`,
            keywords: [
                "Top creators",
                "AI art gallery",
            ],
            canonical: `${siteUrl}/top-creators`,
            image: processedHeroes[0]?.image || `${siteUrl}/og-heroes.jpg`,
            imageAlt: "Top Creators Gallery",
            ogType: "website",
        };

        const seoStructuredData = [
            generateStructuredData.itemList({
                name: "Top Creators",
                items: processedHeroes.slice(0, 20).map((p) => ({
                    name: p.question || "Creator",
                    url: `${siteUrl}/top-creators/${p.id}`,
                })),
            }),
        ];

        return {
            props: {
                initialPopularWorks: processedHeroes.filter(w => w.level === "1"),
                initialAllWorks: processedHeroes.filter(w => w.level === "2" || !w.level),
                seoData,
                seoStructuredData
            },
            revalidate: 3600,
        };
    } catch (error) {
        console.error('[SSG] Error generating top-creators static props:', error);
        return {
            props: {
                initialPopularWorks: [],
                initialAllWorks: [],
                seoData: null,
                seoStructuredData: []
            },
            revalidate: 300,
        };
    }
}

export default withTranslation()(TopCreators);