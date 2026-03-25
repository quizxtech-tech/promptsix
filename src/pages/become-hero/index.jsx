import React, { useState } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
    Globe,
    ShieldCheck,
    TrendingUp,
    PieChart,
    Instagram,
    Code,
    Award
} from "lucide-react";

const Layout = dynamic(() => import("@/components/Layout/Layout"), { ssr: false });

const translations = {
    en: {
        heroTag: "Premium Selection",
        heroTitle: "PROMPT HERO",
        heroSubHeadline1: "Stop Posting for 24 Hours.",
        heroSubHeadline2: "Start Ranking Forever.",
        heroDesc: "Instagram content dies in a day. Promptland builds your digital legacy by indexing your work on Google Search.",
        joinBtn: "Join the Elite",
        advantageTitle: "UNFAIR ADVANTAGE",
        advantageSub: "Why joining the Prompt Hero founding batch is the best career move for an AI Creator.",
        advantages: [
            {
                icon: <Globe className="w-8 h-8 text-purple-400" />,
                title: "Permanent SEO Legacy",
                description: 'The Instagram algorithm buries your hard work in 24 hours. We will rank you on Google Search. Your name will appear at the top when people search for "AI Creator".'
            },
            {
                icon: <ShieldCheck className="w-8 h-8 text-blue-400" />,
                title: 'The "Blue Tick" of Trust',
                description: 'Becoming a Promptland Hero is official validation. When you show clients your profile, your authority increases 10x.'
            },
            {
                icon: <TrendingUp className="w-8 h-8 text-pink-400" />,
                title: "High-Ticket Client Funnel",
                description: "Businesses and tech-founders visiting our site will hire you directly from your 'Hero Profile'."
            },
            {
                icon: <PieChart className="w-8 h-8 text-orange-400" />,
                title: "Phase 2: Global Revenue Share",
                description: "The founding batch will receive lifetime platform fee discounts and priority listings in our upcoming 'Premium Prompt Marketplace'."
            },
            {
                icon: <Instagram className="w-8 h-8 text-fuchsia-400" />,
                title: "Direct Instagram Bridge",
                description: "We don't just provide a link; we show an interactive preview of your content that converts our organic traffic directly into your follower count."
            },
            {
                icon: <Code className="w-8 h-8 text-cyan-400" />,
                title: "Developer Ecosystem",
                description: "You will get support from our tech team to create custom AI workflows for your own brand."
            },
            {
                icon: <Award className="w-8 h-8 text-yellow-400" />,
                title: "Featured Case Studies",
                description: "Every month, we spotlight a Hero in our global newsletter."
            }
        ],
        roadmapTitle: "The Selection Roadmap",
        roadmap: [
            { num: "01", title: "Original Creation", desc: "Generate a unique AI image/reel on Promptland. Freshness is mandatory.", highlight: false },
            { num: "02", title: "Quality Vetting", desc: 'Submit your work via Instagram DM. Our founding team manually reviews every piece for "Hero Grade" quality.', highlight: false },
            { num: "03", title: "Technical Sync", desc: "Post on your feed, tag us, and send a Collaborator Invite. (Note: A standard tag is not enough for our database sync).", highlight: true },
            { num: "04", title: "Global Deployment", desc: "Once approved, we build and deploy your dedicated SEO-optimized URL within 2-5 working days.", highlight: false }
        ],
        checklistTitle: "Submission Checklist",
        checklistSub: "Everything we need from you to build your live profile.",
        checklist: [
            { label: "Display Name", desc: "How you want to be known globally.", icon: "👤" },
            { label: "Source Link", desc: "Direct link to your Instagram post.", icon: "🔗" },
            { label: "Master File", desc: "Original high-res image or reel.", icon: "🖼️" },
            { label: "Creative Title", desc: "A powerful name for your specific creation.", icon: "✨" }
        ],
        faqTitle: "Frequently Asked",
        faq: [
            { q: "Why is this better than just posting on Instagram?", a: 'Instagram limits your reach to a 24-hour algorithmic cycle. Promptland acts as a professional portfolio that allows creators to charge 3x more for their services because they are "Platform Verified" and indexed globally on Google Search.' },
            { q: "What is the cost for the Founding Batch?", a: "Currently, there is $0 cost for selected creators in our Founding Batch. We invest in the technology, hosting, and SEO infrastructure; you simply provide the elite talent." },
            { q: "What happens after I send a Collaborator Invite?", a: "Once your post is verified and matches our quality standards, we accept the invite and our development team starts building your dedicated SEO-optimized URL. You will see it live in 2-5 working days." }
        ],
        bottomTitle: "Ready for the 1%?"
    },
    hi: {
        heroTag: "प्रीमियम चयन",
        heroTitle: "PROMPT HERO",
        heroSubHeadline1: "24 घंटे के लिए पोस्ट करना बंद करें।",
        heroSubHeadline2: "हमेशा के लिए रैंक करना शुरू करें।",
        heroDesc: "Instagram कंटेंट एक दिन में खत्म हो जाता है। Promptland आपके काम को Google Search पर इंडेक्स करके आपकी डिजिटल लेगेसी बनाता है।",
        joinBtn: "एलीट ग्रुप से जुड़ें",
        advantageTitle: "UNFAIR ADVANTAGE",
        advantageSub: "Prompt Hero के फाउंडिंग बैच में शामिल होना एक AI क्रिएटर के लिए सबसे अच्छा करियर मूव क्यों है।",
        advantages: [
            {
                icon: <Globe className="w-8 h-8 text-purple-400" />,
                title: "स्थायी SEO लेगेसी",
                description: 'Instagram का एल्गोरिदम आपकी मेहनत को 24 घंटे में दफन कर देता है। हम आपको Google Search पर रैंक करवाएंगे। "AI Creator" सर्च करने पर आपका नाम सबसे ऊपर आएगा।'
            },
            {
                icon: <ShieldCheck className="w-8 h-8 text-blue-400" />,
                title: "भरोसे का 'ब्लू टिक'",
                description: 'Promptland Hero बनना एक ऑफिशियल वैलिडेशन है। जब आप किसी क्लाइंट को अपनी प्रोफाइल दिखाएंगे, तो आपकी अथॉरिटी 10 गुना बढ़ जाएगी।'
            },
            {
                icon: <TrendingUp className="w-8 h-8 text-pink-400" />,
                title: "हाई-टिकट क्लाइंट फनल",
                description: "हमारी वेबसाइट पर आने वाले बिज़नेस और टेक-फाउंडर्स सीधे आपकी 'Hero Profile' से आपको काम पर रखेंगे।"
            },
            {
                icon: <PieChart className="w-8 h-8 text-orange-400" />,
                title: "फेज 2: ग्लोबल रेवेन्यू शेयर",
                description: "फाउंडिंग बैच को हमारे आने वाले 'Premium Prompt Marketplace' में लाइफटाइम प्लेटफॉर्म फीस डिस्काउंट और प्रायोरिटी लिस्टिंग मिलेगी।"
            },
            {
                icon: <Instagram className="w-8 h-8 text-fuchsia-400" />,
                title: "डायरेक्ट Instagram ब्रिज",
                description: "हम सिर्फ लिंक नहीं देते, हम आपके कंटेंट का इंटरैक्टिव प्रीव्यू दिखाते हैं जो हमारे ऑर्गेनिक ट्रैफिक को सीधे आपके फॉलोअर्स में बदल देता है।"
            },
            {
                icon: <Code className="w-8 h-8 text-cyan-400" />,
                title: "डेवलपर इकोसिस्टम",
                description: "आपको अपने खुद के ब्रांड के लिए कस्टम AI वर्कफ्लो बनाने के लिए हमारी टेक टीम का पूरा सपोर्ट मिलेगा।"
            },
            {
                icon: <Award className="w-8 h-8 text-yellow-400" />,
                title: "फीचर्ड केस स्टडीज़",
                description: "हम हर महीने अपनी ग्लोबल न्यूज़लेटर में एक Hero को स्पॉटलाइट करते हैं।"
            }
        ],
        roadmapTitle: "सिलेक्शन ब्लूप्रिंट",
        roadmap: [
            { num: "01", title: "ओरिजिनल क्रिएशन", desc: "Promptland टूल का उपयोग करके एक नई AI इमेज या रील बनाएं। फ्रेशनेस अनिवार्य है।", highlight: false },
            { num: "02", title: "क्वालिटी वेटिंग", desc: "अपना काम Instagram DM के जरिए सबमिट करें। हमारी फाउंडिंग टीम 'Hero Grade' क्वालिटी के लिए हर सबमिशन का मैन्युअल रिव्यू करती है।", highlight: false },
            { num: "03", title: "टेक्निकल सिंक", desc: "अपनी फीड पर पोस्ट करें, हमें टैग करें और एक Collaborator Invite भेजें। (ध्यान दें: केवल टैग करना हमारी डेटाबेस सिंक के लिए पर्याप्त नहीं है)।", highlight: true },
            { num: "04", title: "ग्लोबल डिप्लॉयमेंट", desc: "स्वीकृत होने के बाद, हम 2-5 कार्य दिवसों के भीतर आपका समर्पित SEO-ऑप्टिमाइज़्ड URL बनाते और डिप्लॉय करते हैं।", highlight: false }
        ],
        checklistTitle: "सबमिशन चेकलिस्ट",
        checklistSub: "आपकी लाइव प्रोफाइल बनाने के लिए हमें आपसे यह जानकारी चाहिए।",
        checklist: [
            { label: "डिस्प्ले नाम", desc: "आप विश्व स्तर पर किस नाम से जाने जाना चाहते हैं।", icon: "👤" },
            { label: "सोर्स लिंक", desc: "आपकी Instagram पोस्ट का डायरेक्ट लिंक।", icon: "🔗" },
            { label: "मास्टर फाइल", desc: "ओरिजिनल हाई-रेस इमेज या रील फ़ाइल।", icon: "🖼️" },
            { label: "क्रिएटिव टाइटल", desc: "आपकी विशिष्ट क्रिएशन के लिए एक शक्तिशाली नाम।", icon: "✨" }
        ],
        faqTitle: "आपके सवाल, हमारे जवाब",
        faq: [
            { q: "यह Instagram पर पोस्ट करने से बेहतर क्यों है?", a: "Instagram आपकी पहुंच को 24-घंटे के एल्गोरिथम चक्र तक सीमित कर देता है। Promptland एक पेशेवर पोर्टफोलियो के रूप में काम करता है जो क्रिएटर्स को अपनी सेवाओं के लिए 3x अधिक चार्ज करने की अनुमति देता है क्योंकि वे 'Platform Verified' होते हैं और Google Search पर ग्लोबली इंडेक्स होते हैं।" },
            { q: "फाउंडिंग बैच के लिए क्या लागत है?", a: "वर्तमान में, हमारे फाउंडिंग बैच में चयनित क्रिएटर्स के लिए लागत $0 है। हम प्रौद्योगिकी, होस्टिंग और SEO बुनियादी ढांचे में निवेश करते हैं; आप बस अपना विशिष्ट टैलेंट प्रदान करते हैं।" },
            { q: "Collaborator Invite भेजने के बाद क्या होता है?", a: "एक बार आपकी पोस्ट सत्यापित हो जाने पर और हमारे गुणवत्ता मानकों से मेल खाने के बाद, हम आमंत्रण स्वीकार करते हैं और हमारी विकास टीम आपका समर्पित SEO-अनुकूलित URL बनाना शुरू कर देती है। आप इसे 2-5 कार्य दिवसों में लाइव देखेंगे।" }
        ],
        bottomTitle: "क्या आप टॉप 1% में शामिल होने के लिए तैयार हैं?"
    }
};

const FadeIn = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden mb-4 transition-all duration-300 hover:border-white/20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
            >
                <span className="font-semibold text-white text-lg md:text-xl pr-4">{question}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-pink-400 text-2xl flex-shrink-0"
                >
                    ↓
                </motion.span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 text-gray-300 leading-relaxed text-base md:text-lg">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function BecomeHero() {
    const [lang, setLang] = useState("en");
    const t = translations[lang];

    return (
        <Layout>
            <Head>
                <title>Become a Prompt Hero | Top 1% AI Creators | Promptland.in</title>
                <meta
                    name="description"
                    content="Join the elite 1% of AI Creators. Build your digital legacy, rank on Google Search, and command 3x more for your freelance services. Apply to be a Prompt Hero today."
                />
                <meta
                    name="keywords"
                    content="become AI creator, AI prompt engineer, best prompt engineers, midjourney prompts expert, chatgpt prompts creator, promptland hero, how to sell ai art, ai artist portfolio, ai creator program, rank google ai artist, best ai creators in india, freelance ai artist, generative ai portfolio, stable diffusion prompt engineer, ai design portfolio, top ai artists, prompt writing expert, ai image generation, promptland community"
                />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://promptland.in/become-hero" />
                <meta property="og:title" content="Become a Prompt Hero | Top 1% AI Creators" />
                <meta property="og:description" content="Join the elite 1% of AI Creators. Build your digital legacy, rank on Google Search, and command 3x more for your freelance services." />
                <meta property="og:image" content="https://promptland.in/images/seo/prompt-hero-bg.png" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://promptland.in/become-hero" />
                <meta property="twitter:title" content="Become a Prompt Hero | Top 1% AI Creators" />
                <meta property="twitter:description" content="Stop posting for 24 hours. Start ranking forever. Join the elite AI creators network." />
                <meta property="twitter:image" content="https://promptland.in/images/seo/prompt-hero-bg.png" />

                {/* Canonical Link */}
                <link rel="canonical" href="https://promptland.in/become-hero" />

                {/* Structured Data / JSON-LD */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Become a Prompt Hero",
                        "description": "Premium selection program for top AI Creators to build their digital legacy and rank on Google.",
                        "url": "https://promptland.in/become-hero",
                        "publisher": {
                            "@type": "Organization",
                            "name": "Promptland",
                            "url": "https://promptland.in"
                        }
                    })
                }} />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden pt-20 pb-24 relative">

                {/* STICKY LANGUAGE TOGGLE */}
                <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] bg-black/60 backdrop-blur-xl border border-white/20 rounded-full p-1.5 flex items-center shadow-2xl">
                    <button
                        onClick={() => setLang("en")}
                        className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${lang === 'en' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.5)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => setLang("hi")}
                        className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${lang === 'hi' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.5)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        HI
                    </button>
                </div>

                {/* Animated Background Gradients & Particles */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none" />

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => {
                        const seed1 = ((i * 137 + 43) % 100) / 100;
                        const seed2 = ((i * 269 + 71) % 100) / 100;
                        const seed3 = ((i * 373 + 29) % 100) / 100;
                        const seed4 = ((i * 491 + 13) % 100) / 100;
                        return (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-purple-400 rounded-full"
                                initial={{
                                    x: seed1 * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                                    y: seed2 * (typeof window !== 'undefined' ? window.innerHeight : 1080)
                                }}
                                animate={{
                                    y: [null, seed3 * -100 - 50],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: seed4 * 3 + 2,
                                    repeat: Infinity,
                                    delay: seed1 * 2
                                }}
                            />
                        );
                    })}
                </div>

                {/* Content Wrapper */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

                    {/* HERO SECTION */}
                    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center pt-12 pb-16">
                        <FadeIn>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm mb-6 text-purple-300 font-semibold tracking-wide text-xs md:text-sm uppercase">
                                <StarIcon className="w-4 h-4 text-purple-400" />
                                {t.heroTag}
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.1}>
                            <h1 className="text-6xl md:text-[8rem] font-black leading-none tracking-tighter mb-4 text-white drop-shadow-2xl select-none">
                                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                    {t.heroTitle}
                                </span>
                            </h1>
                        </FadeIn>

                        <FadeIn delay={0.2} className="max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
                                {t.heroSubHeadline1}<br className="hidden md:block" /> {t.heroSubHeadline2}
                            </h2>
                            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                                {t.heroDesc}
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <motion.a
                                href="https://instagram.com/promptland.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:shadow-[0_0_30px_rgba(219,39,119,0.5)] transition-shadow"
                            >
                                {t.joinBtn}
                            </motion.a>
                        </FadeIn>
                    </section>

                    {/* UNFAIR ADVANTAGE SECTION */}
                    <section className="py-20">
                        <FadeIn>
                            <div className="text-center mb-16">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                        {t.advantageTitle}
                                    </span>
                                </h2>
                                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                                    {t.advantageSub}
                                </p>
                            </div>
                        </FadeIn>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center">
                            {t.advantages.map((item, index) => (
                                <FadeIn key={index} delay={index * 0.1}>
                                    <div className={`group cursor-pointer h-full ${index === 6 ? 'lg:col-start-2' : ''}`}>
                                        <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 p-8 flex flex-col">
                                            <div className="mb-6 inline-block p-4 rounded-full bg-white/5 border border-white/10 w-fit">
                                                {item.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                                            <p className="text-gray-300 leading-relaxed flex-grow text-[15px]">{item.description}</p>

                                            {/* Neon Hover Glow */}
                                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10" />
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </section>

                    {/* THE SELECTION ROADMAP */}
                    <section className="py-20 mt-10">
                        <FadeIn>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                {t.roadmapTitle}
                            </h2>
                        </FadeIn>

                        <div className="flex flex-col md:flex-row relative gap-8 md:gap-4">
                            {t.roadmap.map((step, index) => (
                                <FadeIn key={index} delay={index * 0.15} className="flex-1 flex flex-col relative z-20">
                                    <div className={`
                    h-full relative overflow-hidden rounded-3xl p-8 transition-all duration-300 group
                    ${step.highlight
                                            ? 'border border-pink-500/50 bg-pink-900/10'
                                            : 'border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm'}
                  `}>
                                        <div className={`text-5xl font-black mb-4 ${step.highlight ? 'text-pink-400 opacity-60' : 'text-white opacity-20'}`}>
                                            {step.num}
                                        </div>
                                        <h3 className={`text-xl font-bold mb-3 ${step.highlight ? 'text-pink-300' : 'text-white'}`}>
                                            {step.title}
                                        </h3>
                                        <p className={`${step.highlight ? 'text-pink-100' : 'text-gray-300'} leading-relaxed text-[15px]`}>
                                            {step.desc}
                                        </p>
                                        {/* Hover Glow */}
                                        <div className={`absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10 ${step.highlight ? 'bg-pink-600' : 'bg-purple-600'}`} />
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </section>

                    {/* SUBMISSION CHECKLIST */}
                    <section className="py-20">
                        <FadeIn>
                            <div className="max-w-4xl mx-auto bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-[2.5rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10" />

                                <div className="text-center mb-10">
                                    <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                                        {t.checklistTitle}
                                    </h2>
                                    <p className="text-gray-400 text-lg">{t.checklistSub}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                    {t.checklist.map((item, idx) => (
                                        <div key={idx} className="flex items-start bg-black/40 border border-white/5 rounded-2xl p-6 hover:bg-black/60 transition-colors">
                                            <div className="text-3xl mr-4">{item.icon}</div>
                                            <div>
                                                <h4 className="text-white font-bold text-lg mb-1">{item.label}</h4>
                                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    </section>

                    {/* FAQ */}
                    <section className="py-20 max-w-3xl mx-auto">
                        <FadeIn>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-10 text-center text-white">
                                {t.faqTitle}
                            </h2>
                        </FadeIn>
                        {t.faq.map((item, idx) => (
                            <FadeIn key={idx} delay={0.1 * (idx + 1)}>
                                <FAQItem question={item.q} answer={item.a} />
                            </FadeIn>
                        ))}
                    </section>

                    {/* FINAL CTA BOTTOM */}
                    <section className="py-24 text-center">
                        <FadeIn>
                            <h2 className="text-4xl md:text-6xl font-black mb-8 text-white">{t.bottomTitle}</h2>
                            <motion.a
                                href="https://instagram.com/promptland.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:shadow-[0_0_40px_rgba(219,39,119,0.5)] transition-shadow"
                            >
                                {t.joinBtn}
                            </motion.a>
                        </FadeIn>
                    </section>

                </div>
            </div>
        </Layout>
    );
}

const StarIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
    </svg>
);

export async function getStaticProps() {
    return {
        props: {},
    };
}
