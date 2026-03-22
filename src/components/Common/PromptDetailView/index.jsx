"use client";
import React, { useState, useMemo } from "react";
import Head from "next/head";
import { reportQuestion, t } from "@/utils";
import { IoCopyOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmarkCircle, IoSparkles, IoArrowForward, IoWarningOutline } from "react-icons/io5";
import placeholder from "@/assets/images/placeholder.jpg";
import chatGPT from "@/assets/images/chatgpt.svg";
import gemini from "@/assets/images/gemini.svg";
import qwen from "@/assets/images/qwen.jpeg";
import adobe from "@/assets/images/adobe.png";
import freepik from "@/assets/images/freepik.png";
import canva from "@/assets/images/canva.jpeg";
import krea from "@/assets/images/krea.webp";
import ShareButton from "@/components/Common/ShareButton";
import toast from "react-hot-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// AI Models data
const aiModels = [
    { name: "nano banana", image: gemini, url: "https://bard.google.com", description: "Google's AI assistant" },
    { name: "ChatGPT", image: chatGPT, url: "https://chat.openai.com", description: "OpenAI's conversational AI" },
    { name: "krea", image: krea, url: "https://www.krea.ai/features/ai-image-generator", description: "Anthropic's AI assistant" },
    { name: "freepik", image: freepik, url: "https://www.freepik.com/ai/image-generator", description: "Anthropic's AI assistant" },
    { name: "Qwen-Image-Edit", image: qwen, url: "https://qwenimageedit.run/", description: "Qwen-Image-Edit provides a free chat-style image editor for long and precise visual edits using advanced prompt processing." },
    { name: "Adobe Firefly", image: adobe, url: "https://firefly.adobe.com", description: "Adobe's free Firefly web editor supports prompt-based editing, generative fill, style transfer, and precise visual refinements for creative professionals." },
    { name: "canva", image: canva, url: "https://www.canva.com/ai-image-generator/", description: "Anthropic's AI assistant" },
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12,
        },
    },
};

const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
        scale: 1.03,
        y: -8,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 17,
        },
    },
};

const imageVariants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.43, 0.13, 0.23, 0.96],
        },
    },
};

/**
 * Shared UI component for all prompt detail pages.
 *
 * Props:
 *  - questionDetails      : the prompt object (question, optiona, optionb, image, id)
 *  - recommendedQuestions : array of recommended prompt objects
 *  - isLoading            : boolean – show skeleton while true
 *  - copied               : boolean – copy button state
 *  - onCopyPrompt         : () => void  – called when copy button is clicked
 *  - onRecommendedClick   : (question) => void – called when a recommended card is clicked
 *  - showReportButton     : boolean (default true) – show/hide the "Report" button
 *  - metaData             : object returned from generateMetaData()
 *  - structuredData       : object returned from generateStructuredData()
 *  - selectcurrentLanguage: current language string (for og:locale)
 */
const PromptDetailView = ({
    questionDetails,
    recommendedQuestions = [],
    isLoading,
    copied,
    onCopyPrompt,
    onRecommendedClick,
    showReportButton = true,
    metaData,
    structuredData,
    selectcurrentLanguage,
}) => {
    const handleAiModelClick = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };
    console.log(questionDetails);
    // ─── Category 36: Dynamic Input System ──────────────────────────────────────
    const isCategory36 =
        questionDetails?.category === 36 ||
        questionDetails?.category === "36";

    const IPL_TEAMS = [
        "Mumbai Indians (MI)",
        "Chennai Super Kings (CSK)",
        "Royal Challengers Bengaluru (RCB)",
        "Kolkata Knight Riders (KKR)",
        "Delhi Capitals (DC)",
        "Punjab Kings (PBKS)",
        "Rajasthan Royals (RR)",
        "Sunrisers Hyderabad (SRH)",
        "Lucknow Super Giants (LSG)",
        "Gujarat Titans (GT)",
    ];

    const ALL_PLACEHOLDERS = ["name", "number", "player", "team"];

    const detectedPlaceholders = useMemo(() => {
        if (!isCategory36 || !questionDetails?.optionb) return [];
        return ALL_PLACEHOLDERS.filter((p) =>
            questionDetails.optionb.includes(`{{${p}}}`)
        );
    }, [isCategory36, questionDetails?.optionb]);

    const [userInputs, setUserInputs] = useState({
        name: "",
        number: "",
        player: "",
        team: "",
    });
    const [otherDetails, setOtherDetails] = useState("");
    const [copiedInternal, setCopiedInternal] = useState(false);

    const computedPrompt = useMemo(() => {
        if (!isCategory36 || !questionDetails?.optionb)
            return questionDetails?.optionb || "";
        let prompt = questionDetails.optionb;
        Object.entries(userInputs).forEach(([key, value]) => {
            if (value) prompt = prompt.replaceAll(`{{${key}}}`, value);
        });
        if (otherDetails.trim()) prompt += "\n\n" + otherDetails.trim();
        return prompt;
    }, [isCategory36, userInputs, otherDetails, questionDetails?.optionb]);

    /** Renders the prompt as React spans, highlighting filled placeholders with blue text + bg.
     *  Also appends otherDetails live at the end of the preview. */
    const renderHighlightedPrompt = () => {
        const text = questionDetails?.optionb || "";
        const parts = text.split(/({{[^}]+}})/g);
        const rendered = parts.map((part, i) => {
            const match = part.match(/^{{(\w+)}}$/);
            if (match) {
                const key = match[1];
                const value = userInputs[key];
                return value ? (
                    <span
                        key={i}
                        style={{
                            color: "#1d4ed8",
                            fontWeight: "700",
                            backgroundColor: "rgba(59,130,246,0.18)",
                            padding: "1px 6px",
                            borderRadius: "5px",
                            border: "1px solid rgba(59,130,246,0.35)",
                        }}
                    >
                        {value}
                    </span>
                ) : (
                    <span
                        key={i}
                        style={{
                            color: "#94a3b8",
                            fontStyle: "italic",
                            backgroundColor: "rgba(148,163,184,0.12)",
                            padding: "1px 6px",
                            borderRadius: "5px",
                        }}
                    >
                        {part}
                    </span>
                );
            }
            return <span key={i}>{part}</span>;
        });

        // Append "Other Details" live in the preview
        if (otherDetails.trim()) {
            rendered.push(
                <span key="other-sep" className="block mt-3" />,
                <span
                    key="other-value"
                    style={{
                        display: "block",
                        marginTop: "8px",
                        color: "#1d4ed8",
                        fontWeight: "600",
                        backgroundColor: "rgba(59,130,246,0.13)",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "1px solid rgba(59,130,246,0.25)",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {otherDetails}
                </span>
            );
        }

        return rendered;
    };

    const handleCopyForCat36 = () => {
        navigator.clipboard.writeText(computedPrompt);
        setCopiedInternal(true);
        toast.success(t("prompt_copied"));
        setTimeout(() => setCopiedInternal(false), 2000);
    };

    /** Unified copy handler — uses internal state for cat36, prop for everything else */
    const handleCopy = isCategory36 ? handleCopyForCat36 : onCopyPrompt;
    /** Unified copied flag */
    const isCopied = isCategory36 ? copiedInternal : copied;
    // ────────────────────────────────────────────────────────────────────────────

    return (
        <>
            {/* SEO: Dynamic Head with comprehensive meta tags */}
            {metaData && (
                <Head>
                    {/* Primary Meta Tags */}
                    <title>{metaData.title}</title>
                    <meta name="title" content={metaData.title} />
                    <meta name="description" content={metaData.description} />
                    <meta name="keywords" content={metaData.keywords} />
                    <meta name="author" content={metaData.siteName} />
                    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                    <meta name="googlebot" content="index, follow" />
                    <link rel="canonical" href={metaData.currentUrl} />

                    {/* Open Graph / Facebook */}
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content={metaData.currentUrl} />
                    <meta property="og:title" content={metaData.title} />
                    <meta property="og:description" content={metaData.description} />
                    <meta property="og:image" content={metaData.imageUrl} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta property="og:site_name" content={metaData.siteName} />
                    <meta property="og:locale" content={selectcurrentLanguage || "en_US"} />

                    {/* Twitter Card */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:url" content={metaData.currentUrl} />
                    <meta name="twitter:title" content={metaData.title} />
                    <meta name="twitter:description" content={metaData.description} />
                    <meta name="twitter:image" content={metaData.imageUrl} />
                    <meta name="twitter:creator" content="@yourhandle" />

                    {/* Additional SEO Meta Tags */}
                    <meta name="theme-color" content="#8b5cf6" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

                    {/* Structured Data - JSON-LD */}
                    {structuredData && (
                        <>
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.articleSchema) }}
                            />
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumbSchema) }}
                            />
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.qaSchema) }}
                            />
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.howToSchema) }}
                            />
                        </>
                    )}

                    {/* Preconnect for Performance */}
                    <link rel="preconnect" href="https://chat.openai.com" />
                    <link rel="preconnect" href="https://bard.google.com" />
                    <link rel="preconnect" href="https://claude.ai" />
                    <link rel="dns-prefetch" href="https://chat.openai.com" />
                    <link rel="dns-prefetch" href="https://bard.google.com" />
                    <link rel="dns-prefetch" href="https://claude.ai" />
                </Head>
            )}

            {isLoading ? (
                <div className="container px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl"
                                role="status"
                                aria-label="Loading content"
                            />
                        ))}
                    </motion.div>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="container px-3 sm:px-6 lg:px-8 py-4 sm:py-8 mb-14"
                >
                    {/* SEO: Semantic HTML structure with proper heading hierarchy */}
                    <article itemScope itemType="https://schema.org/Article">
                        {/* Question Details Section */}
                        <motion.section
                            variants={itemVariants}
                            className="relative overflow-hidden rounded-3xl bg-white shadow-2xl mb-6 sm:mb-12"
                            aria-labelledby="prompt-title"
                        >
                            {/* Background Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 opacity-50" aria-hidden="true" />

                            <motion.div
                                variants={imageVariants}
                                className="relative h-full sm:h-72 lg:h-96 xl:h-[40rem] overflow-hidden p-6 flex sm:flex-row flex-col gap-6"
                            >
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    src={questionDetails.image || placeholder.src}
                                    alt={`Visual representation of ${questionDetails.question} - AI prompt template`}
                                    className="w-full h-full object-contain rounded-xl"
                                    loading="eager"
                                    itemProp="image"
                                />
                                {/* Title with Icon */}
                                <div className="w-full">
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex items-start gap-3 mb-4 sm:mb-6"
                                    >
                                        <motion.div
                                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                            aria-hidden="true"
                                        >
                                            <IoSparkles className="text-2xl sm:text-3xl text-purple-600 flex-shrink-0 mt-1" />
                                        </motion.div>
                                        <h1
                                            id="prompt-title"
                                            className="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent leading-tight"
                                            itemProp="headline"
                                        >
                                            {questionDetails?.question}
                                        </h1>
                                    </motion.div>

                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-sm sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed"
                                        itemProp="description"
                                    >
                                        {questionDetails?.optiona}
                                    </motion.p>
                                </div>
                            </motion.div>

                            <div className="relative p-4 sm:p-8 lg:p-10">

                                {/* ── Category 36: Dynamic Input Fields ── */}
                                {isCategory36 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="mb-5 rounded-2xl overflow-hidden"
                                        style={{
                                            background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff0f9 100%)",
                                            border: "1.5px solid rgba(139,92,246,0.18)",
                                            boxShadow: "0 4px 24px 0 rgba(139,92,246,0.08)",
                                        }}
                                    >
                                        {/* Card Header */}
                                        <div
                                            className="px-5 py-3 flex items-center gap-2"
                                            style={{ background: "linear-gradient(90deg,rgba(139,92,246,0.1),rgba(59,130,246,0.08))" }}
                                        >
                                            <IoSparkles className="text-purple-500 text-base" />
                                            <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                                Customize Your Prompt
                                            </span>
                                        </div>

                                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Name input */}
                                            {detectedPlaceholders.includes("name") && (
                                                <div className="flex flex-col gap-1">
                                                    <label className="flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-widest">
                                                        <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter name…"
                                                        value={userInputs.name}
                                                        onChange={(e) =>
                                                            setUserInputs((prev) => ({ ...prev, name: e.target.value }))
                                                        }
                                                        className="w-full px-4 py-2.5 rounded-xl text-sm text-gray-800 bg-white transition-all duration-200"
                                                        style={{
                                                            border: userInputs.name
                                                                ? "1.5px solid rgba(59,130,246,0.7)"
                                                                : "1.5px solid rgba(139,92,246,0.2)",
                                                            boxShadow: userInputs.name
                                                                ? "0 0 0 3px rgba(59,130,246,0.1)"
                                                                : "none",
                                                            outline: "none",
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Number input */}
                                            {detectedPlaceholders.includes("number") && (
                                                <div className="flex flex-col gap-1">
                                                    <label className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest">
                                                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                                                        Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter number…"
                                                        value={userInputs.number}
                                                        onChange={(e) =>
                                                            setUserInputs((prev) => ({ ...prev, number: e.target.value }))
                                                        }
                                                        className="w-full px-4 py-2.5 rounded-xl text-sm text-gray-800 bg-white transition-all duration-200"
                                                        style={{
                                                            border: userInputs.number
                                                                ? "1.5px solid rgba(59,130,246,0.7)"
                                                                : "1.5px solid rgba(59,130,246,0.2)",
                                                            boxShadow: userInputs.number
                                                                ? "0 0 0 3px rgba(59,130,246,0.1)"
                                                                : "none",
                                                            outline: "none",
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Player input */}
                                            {detectedPlaceholders.includes("player") && (
                                                <div className="flex flex-col gap-1">
                                                    <label className="flex items-center gap-1.5 text-xs font-bold text-pink-600 uppercase tracking-widest">
                                                        <span className="w-2 h-2 rounded-full bg-pink-500 inline-block" />
                                                        Player
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter player name…"
                                                        value={userInputs.player}
                                                        onChange={(e) =>
                                                            setUserInputs((prev) => ({ ...prev, player: e.target.value }))
                                                        }
                                                        className="w-full px-4 py-2.5 rounded-xl text-sm text-gray-800 bg-white transition-all duration-200"
                                                        style={{
                                                            border: userInputs.player
                                                                ? "1.5px solid rgba(236,72,153,0.7)"
                                                                : "1.5px solid rgba(236,72,153,0.2)",
                                                            boxShadow: userInputs.player
                                                                ? "0 0 0 3px rgba(236,72,153,0.1)"
                                                                : "none",
                                                            outline: "none",
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Team select (IPL teams) */}
                                            {detectedPlaceholders.includes("team") && (
                                                <div className="flex flex-col gap-1">
                                                    <label className="flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-widest">
                                                        <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                                                        IPL Team
                                                    </label>
                                                    <Select
                                                        value={userInputs.team}
                                                        onValueChange={(val) =>
                                                            setUserInputs((prev) => ({ ...prev, team: val }))
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            className="w-full rounded-xl text-sm text-gray-800 bg-white"
                                                            style={{
                                                                border: userInputs.team
                                                                    ? "1.5px solid rgba(234,88,12,0.7)"
                                                                    : "1.5px solid rgba(234,88,12,0.2)",
                                                                boxShadow: userInputs.team
                                                                    ? "0 0 0 3px rgba(234,88,12,0.1)"
                                                                    : "none",
                                                                height: "42px",
                                                            }}
                                                        >
                                                            <SelectValue placeholder="Select a team…" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {IPL_TEAMS.map((team) => (
                                                                <SelectItem key={team} value={team}>
                                                                    {team}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            {/* Other Details — spans full width, always shown */}
                                            <div className="flex flex-col gap-1 sm:col-span-2">
                                                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                    <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                                                    Other Details
                                                    <span className="text-[10px] font-normal normal-case text-gray-400 ml-1">(appended to prompt)</span>
                                                </label>
                                                <textarea
                                                    placeholder="Add any extra context to append to the prompt…"
                                                    value={otherDetails}
                                                    onChange={(e) => setOtherDetails(e.target.value)}
                                                    rows={2}
                                                    className="w-full px-4 py-2.5 rounded-xl text-sm text-gray-800 bg-white resize-none transition-all duration-200"
                                                    style={{
                                                        border: otherDetails
                                                            ? "1.5px solid rgba(100,116,139,0.6)"
                                                            : "1.5px solid rgba(100,116,139,0.2)",
                                                        boxShadow: otherDetails
                                                            ? "0 0 0 3px rgba(100,116,139,0.08)"
                                                            : "none",
                                                        outline: "none",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Prompt Section */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl overflow-hidden group"
                                    role="region"
                                    aria-label="AI Prompt Content"
                                >
                                    {/* Animated Background Pattern */}
                                    <motion.div
                                        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                                        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                                        className="absolute inset-0 opacity-10"
                                        style={{
                                            backgroundImage:
                                                "linear-gradient(45deg, #8b5cf6 25%, transparent 25%, transparent 75%, #8b5cf6 75%, #8b5cf6), linear-gradient(45deg, #8b5cf6 25%, transparent 25%, transparent 75%, #8b5cf6 75%, #8b5cf6)",
                                            backgroundSize: "20px 20px",
                                            backgroundPosition: "0 0, 10px 10px",
                                        }}
                                        aria-hidden="true"
                                    />

                                    <motion.button
                                        onClick={handleCopy}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group z-10"
                                        aria-label={isCopied ? "Prompt copied to clipboard" : "Copy prompt to clipboard"}
                                    >
                                        <AnimatePresence mode="wait">
                                            {isCopied ? (
                                                <motion.div
                                                    key="check"
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    exit={{ scale: 0, rotate: 180 }}
                                                >
                                                    <IoCheckmarkCircle className="text-lg sm:text-xl text-green-400" aria-hidden="true" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="copy"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                >
                                                    <IoCopyOutline className="text-lg sm:text-xl text-white" aria-hidden="true" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                    <div className="absolute top-3 right-19 sm:top-4 sm:right-20">
                                        <ShareButton />
                                    </div>

                                    <h2 className="text-sm sm:text-base font-semibold text-purple-400 mb-3 sm:mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 sm:h-6 bg-purple-500 rounded-full" aria-hidden="true" />
                                        {t("prompt")}
                                    </h2>
                                    <p
                                        className="text-xs sm:text-base text-gray-100 leading-relaxed pr-8 sm:pr-12 font-mono"
                                        itemProp="text"
                                    >
                                        {isCategory36 ? renderHighlightedPrompt() : questionDetails?.optionb}
                                    </p>
                                </motion.div>

                                {showReportButton && (
                                    <div className="mt-8 flex justify-center">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            title="Report Question"
                                            onClick={() => reportQuestion(questionDetails?.id)}
                                            className="group flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                                                       bg-[#3c3555] text-gray-300
                                                       border border-gray-200 dark:border-gray-600 shadow-sm
                                                       hover:border-red-200 hover:bg-red-50 hover:text-red-500
                                                       dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                        >
                                            <IoWarningOutline className="text-lg opacity-70 group-hover:opacity-100 transition-opacity" />
                                            <span>{t("tell_us_about_prompt")}</span>
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                        </motion.section>
                    </article>

                    {/* AI Models Section */}
                    <motion.section
                        variants={itemVariants}
                        className="mb-8 sm:mb-16"
                        aria-labelledby="ai-models-title"
                    >
                        <motion.h2
                            id="ai-models-title"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-lg sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        >
                            {t("Try with Ai models")}
                        </motion.h2>
                        <nav
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6"
                            aria-label="AI model selection"
                        >
                            {aiModels.map((model, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover="hover"
                                    initial="rest"
                                    animate="rest"
                                    onClick={() => handleAiModelClick(model.url)}
                                    className="relative group cursor-pointer"
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Open ${model.name} - ${model.description}`}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            handleAiModelClick(model.url);
                                        }
                                    }}
                                >
                                    <motion.div
                                        variants={cardHoverVariants}
                                        className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                                    >
                                        {/* Gradient Background on Hover */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                            className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 rounded-2xl sm:rounded-3xl"
                                            aria-hidden="true"
                                        />
                                        <motion.div
                                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                            transition={{ duration: 0.5 }}
                                            className="relative"
                                        >
                                            <img
                                                src={model.image.src || placeholder.src}
                                                alt={`${model.name} logo - AI assistant for prompt execution`}
                                                className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 rounded-full shadow-md"
                                                loading="lazy"
                                            />
                                        </motion.div>
                                        <h3 className="relative font-semibold text-xs sm:text-base text-gray-800">
                                            {model.name}
                                        </h3>

                                        {/* Arrow Icon on Hover */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            whileHover={{ opacity: 1, x: 0 }}
                                            className="absolute top-3 right-3 sm:top-4 sm:right-4"
                                            aria-hidden="true"
                                        >
                                            <IoArrowForward className="text-purple-600 text-sm sm:text-base" />
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </nav>
                    </motion.section>

                    {/* Recommended Questions Section */}
                    <motion.section variants={itemVariants} aria-labelledby="recommended-title">
                        <motion.h2
                            id="recommended-title"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-lg sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
                        >
                            Recommended Prompts
                        </motion.h2>
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                            role="list"
                            aria-label="Recommended AI prompts"
                        >
                            {recommendedQuestions.map((question, index) => (
                                <motion.article
                                    key={question.id}
                                    variants={itemVariants}
                                    whileHover="hover"
                                    initial="rest"
                                    animate="rest"
                                    custom={index}
                                    onClick={() => onRecommendedClick(question)}
                                    className="cursor-pointer group"
                                    role="listitem"
                                    itemScope
                                    itemType="https://schema.org/Article"
                                >
                                    <motion.div
                                        variants={cardHoverVariants}
                                        className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 h-full"
                                    >
                                        <div className="relative h-[85%] sm:h-56 overflow-hidden p-3">
                                            <motion.img
                                                transition={{ duration: 0.6 }}
                                                src={question.image && question.image !== "" ? question.image : placeholder.src}
                                                alt={`${question.question} - AI prompt template preview`}
                                                className="w-full h-full object-cover rounded-xl"
                                                loading="lazy"
                                                itemProp="image"
                                            />
                                        </div>
                                        <div className="p-3 sm:p-6">
                                            <h3
                                                className="font-bold text-sm sm:text-lg mb-2 text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300"
                                                itemProp="headline"
                                            >
                                                {question.question}
                                            </h3>
                                            <p
                                                className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed"
                                                itemProp="description"
                                            >
                                                {question.optiona}
                                            </p>

                                            {/* Read More Arrow */}
                                            <motion.div
                                                initial={{ x: 0, opacity: 0 }}
                                                whileHover={{ x: 5, opacity: 1 }}
                                                className="mt-3 flex items-center gap-2 text-purple-600 font-medium text-xs sm:text-sm"
                                                aria-label="View prompt details"
                                            >
                                                <span>View Details</span>
                                                <IoArrowForward aria-hidden="true" />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </motion.article>
                            ))}
                        </div>
                    </motion.section>
                </motion.div>
            )}
        </>
    );
};

export default PromptDetailView;
