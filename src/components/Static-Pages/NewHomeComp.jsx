import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, Users, ArrowRight, Copy, Wand2, ImagePlus, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getQuestionApi } from '@/api/apiRoutes';
import toast from 'react-hot-toast';
import { t } from '@/utils';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const dummyTrendingPrompts = [
    {
      title: "Ghibli Studio Magic",
      description: "Transform your photos into Studio Ghibli masterpieces",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop",
      uses: "12.5K",
      tag: "Hot"
    },
    {
      title: "Anime Portrait Pro",
      description: "Professional anime-style character portraits",
      image: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400&h=300&fit=crop",
      uses: "10.2K",
      tag: "Trending"
    },
    {
      title: "Superhero Transform",
      description: "Become your favorite superhero with AI power",
      image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=300&fit=crop",
      uses: "8.9K",
      tag: "Popular"
    }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  const [trendingPrompts, setTrendingPrompts] = useState([]);
  console.log("Trending Prompts Data:", trendingPrompts);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const router = useRouter();

  const heroSlides = [
    {
      title: "Transform Your Images with AI Magic",
      subtitle: "Turn ordinary photos into extraordinary Ghibli art, anime style, and more",
      image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&h=600&fit=crop",
      gradient: "from-purple-600 via-pink-600 to-blue-600"
    },
    {
      title: "Unleash Creative Superpowers",
      subtitle: "Transform into superheroes, explore anime worlds, and celebrate festivals",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&h=600&fit=crop",
      gradient: "from-blue-600 via-cyan-600 to-teal-600"
    },
    {
      title: "Join the Prompt Revolution",
      subtitle: "Discover trending prompts and share your masterpieces with our community",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
      gradient: "from-orange-600 via-red-600 to-pink-600"
    }
  ];

  const categories = [
    { name: "Anime Style", icon: "🎨", color: "from-pink-500 to-rose-500", count: "500+" },
    { name: "Ghibli Art", icon: "🌸", color: "from-green-500 to-emerald-500", count: "300+" },
    { name: "Superhero", icon: "⚡", color: "from-blue-500 to-cyan-500", count: "250+" },
    { name: "Festival", icon: "🎉", color: "from-purple-500 to-violet-500", count: "180+" },
    { name: "Portrait", icon: "👤", color: "from-orange-500 to-amber-500", count: "400+" },
    { name: "Fantasy", icon: "🧙", color: "from-indigo-500 to-blue-500", count: "350+" }
  ];

  

  const promptHeroes = [
    {
      username: "@artistic_soul",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
      likes: "2.4K",
      prompt: "Cyberpunk Neon"
    },
    {
      username: "@creative_mind",
      image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&h=400&fit=crop",
      likes: "1.8K",
      prompt: "Fantasy Realm"
    },
    {
      username: "@art_wizard",
      image: "https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=400&h=400&fit=crop",
      likes: "2.1K",
      prompt: "Anime Dreams"
    },
    {
      username: "@pixel_master",
      image: "https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?w=400&h=400&fit=crop",
      likes: "1.5K",
      prompt: "Retro Wave"
    }
  ];
   const getAllData = async () => {
    try {
        // Second API call - Questions (only if Level API succeeded)
        const questionsResponse = await getQuestionApi({
            category_id: 8,
            level: "1",
        });

        console.log(questionsResponse);

        if (!questionsResponse.error) {
           

           

            // Transform API data to trending prompts format
            const transformedTrendingPrompts = questionsResponse.data.map((data) => {
                // Generate random uses if optionc is empty
                const getRandomUses = () => {
                    const randomNum = (Math.random() * 15 + 5).toFixed(1); // Random between 5K - 20K
                    return `${randomNum}K`;
                };

                // Generate random tag if optiond is empty
                const getRandomTag = () => {
                    const tags = ["Hot", "Trending", "Popular", "New", "Featured"];
                    return tags[Math.floor(Math.random() * tags.length)];
                };

                return {
                    title: data?.question || "Untitled Prompt",
                    description: data?.optiona || "No description available",
                    image: data?.image || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop",
                    uses: data?.optionc && data.optionc.trim() !== "" ? data.optionc : getRandomUses(),
                    tag: data?.optiond && data.optiond.trim() !== "" ? data.optiond : getRandomTag(),
                    prompt: data?.optionb || "", // Store the actual prompt
                    id: data?.id // Store ID for reference
                };
            });

            // Update the state with transformed data
            setTrendingPrompts(transformedTrendingPrompts);

            console.log("Transformed Trending Prompts:", transformedTrendingPrompts);
        }

    } catch (error) {
        console.error("API Error:", error);
        // Keep dummy data on error
        setTrendingPrompts(dummyTrendingPrompts);
    }
};

  useEffect(() => {
    getAllData();
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePromptClick = async (prompt) => {
    console.log(`Clicked on prompt with ID: ${prompt}`);
    router.push(`/trending/promptDetails/?questionId=${prompt.id}`);
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Hero Section with Slider */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
              animate={{
                y: [null, Math.random() * -100 - 50],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1 text-center lg:text-left"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm mb-6"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs sm:text-sm font-medium">AI-Powered Image Transformation</span>
                  </motion.div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                    <span className={`bg-gradient-to-r ${heroSlides[currentSlide].gradient} bg-clip-text text-transparent`}>
                      {heroSlides[currentSlide].title}
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-4 lg:px-0">
                    {heroSlides[currentSlide].subtitle}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start px-4 lg:px-0">
                    <motion.a
                      href={`${process.env.NEXT_PUBLIC_APP_WEB_URL}/category`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
                    >
                      <Wand2 className="w-5 h-5" />
                      Explore Prompts
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                    
                    <motion.a
                      href={`${process.env.NEXT_PUBLIC_APP_WEB_URL}/trending`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md rounded-full font-semibold flex items-center justify-center gap-2 border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <TrendingUp className="w-5 h-5" />
                      View Trending
                    </motion.a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Image Slider */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Glass Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-8 rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={heroSlides[currentSlide].image}
                      alt={heroSlides[currentSlide].title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-tr ${heroSlides[currentSlide].gradient} opacity-30 mix-blend-overlay`} />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'w-8 bg-purple-500' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1 h-2 bg-white rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div> */}
      </section>

      {/* Explore Prompts Section */}
      <section className="py-8 sm:py-10 lg:py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-sm mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <ImagePlus className="w-4 h-4 text-blue-400" />
              <span className="text-xs sm:text-sm font-medium">Explore Categories</span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Discover AI Prompts
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
              Choose from our curated collection of AI prompts to transform your images
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-12">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group cursor-pointer"
              >
                <div className="relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300 `} />
                  
                  <div className="relative z-10 flex-center flex-col">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{category.icon}</div>
                    <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">{category.name}</h3>
                    <p className="text-xs text-gray-400">{category.count} prompts</p>
                  </div>

                  <div className={`absolute -inset-1 bg-gradient-to-r ${category.color} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10`} />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.a
              href={`${process.env.NEXT_PUBLIC_APP_WEB_URL}/category`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
            >
              View All Categories
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-8 sm:py-10 lg:py-16 relative bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 backdrop-blur-sm mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span className="text-xs sm:text-sm font-medium">What's Hot</span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                Trending Prompts
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
              Most popular AI prompts used by our community this week
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12">
            {trendingPrompts.map((prompt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={prompt.image}
                      alt={prompt.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Tag */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-xs font-bold">
                      {prompt.tag}
                    </div>

                    {/* Uses Count */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span>{prompt.uses} uses</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">{prompt.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{prompt.description}</p>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePromptClick(prompt)}
                      className="w-full py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all text-sm sm:text-base"
                    >
                      <Copy className="w-4 h-4" />
                      Try This Prompt
                    </motion.button>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-300 -z-10" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.a
              href={`${process.env.NEXT_PUBLIC_APP_WEB_URL}/trending`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-full font-semibold hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300"
            >
              Explore All Trending
              <TrendingUp className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Prompt Heroes Section */}
      <section className="py-8 sm:py-10 lg:py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 backdrop-blur-sm mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="w-4 h-4 text-yellow-400" />
              <span className="text-xs sm:text-sm font-medium">Community Showcase</span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Prompt Heroes
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
              Masterpieces created by our talented community members
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-12">
            {promptHeroes.map((hero, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-yellow-500/50 transition-all duration-300">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={hero.image}
                      alt={hero.username}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    
                    {/* Likes */}
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs">{hero.likes}</span>
                    </div>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black to-transparent">
                    <p className="text-xs font-semibold text-purple-400 mb-1">{hero.prompt}</p>
                    <p className="text-xs sm:text-sm font-medium">{hero.username}</p>
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300 -z-10" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <motion.a
              href={`${process.env.NEXT_PUBLIC_APP_WEB_URL}/prompt-heroes`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full font-semibold hover:shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300"
            >
              View Gallery
              <Users className="w-5 h-5" />
            </motion.a>

            <div className="text-sm sm:text-base text-gray-400">
              <p>Share your masterpiece and get featured!</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-10 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-blue-900/20" />
        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400" />
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Transform Your Images?
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-12 px-4">
              Join thousands of creators using AI to bring their imagination to life
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <motion.a
                href={`${process.env.NEXT_PUBLIC_APP_WEB_URL}/category`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
              >
                Start Creating Now
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;