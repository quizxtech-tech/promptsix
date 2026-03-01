import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout/Layout';
import { withTranslation } from 'react-i18next';
import fs from 'fs';
import path from 'path';
import BlogCard from '@/components/BlogCard/BlogCard';

// Load initial data at build time for pure SSG & SEO benefits
export async function getStaticProps() {
    const filePath = path.join(process.cwd(), 'src/data/blog.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const blogs = JSON.parse(jsonData);

    // Extract unique categories for the filter
    const categories = ['All', ...new Set(blogs.map((b) => b.blog_cat))];

    return {
        props: {
            blogs,
            categories,
        },
    };
}

const BlogIndex = ({ blogs, categories, t }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredBlogs = selectedCategory === 'All'
        ? blogs
        : blogs.filter((blog) => blog.blog_cat === selectedCategory);

    return (
        <Layout>
            <Head>
                <title key="title">PromptLand | Our Blog &amp; Resources</title>
                <meta name="description" content="Read the latest news, updates, tutorials and deep dives from the PromptLand blog. Optimized for SEO." key="desc" />
                <meta name="keywords" content="blog, promptland blog, ai tutorials, prompt guides, seo nextjs" key="keywords" />
                <meta property="og:title" content="PromptLand | Our Blog &amp; Resources" key="ogtitle" />
                <meta property="og:description" content="Read the latest news, updates, tutorials and deep dives from the PromptLand blog. Optimized for SEO." key="ogdesc" />
            </Head>

            <div className="min-h-screen bg-white dark:bg-[#090029]">
                {/* Hero Header */}
                <div className="w-full pt-24 pb-16 px-4 text-center relative overflow-hidden">
                    {/* Decorative blur blobs */}
                    <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full opacity-10 dark:opacity-20 blur-3xl bg-[#0090FF] pointer-events-none" />
                    <div className="absolute top-20 right-1/4 w-48 h-48 rounded-full opacity-10 dark:opacity-15 blur-3xl bg-[#00C6FF] pointer-events-none" />

                    <div className="relative z-10">
                        <span className="inline-block bg-[#0090FF]/10 dark:bg-[#0090FF]/20 text-[#0060CC] dark:text-[#60BCFF] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
                            Blog &amp; Resources
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-slate-900 dark:text-white leading-tight">
                            Our Latest <span className="text-[#0090FF]">Thoughts</span>
                        </h1>
                        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                            Deep dives, news, and guides carefully crafted by our team.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 pb-20">
                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${selectedCategory === cat
                                        ? 'bg-[#0090FF] text-white border-[#0090FF] shadow-md shadow-[#0090FF]/30'
                                        : 'bg-white dark:bg-[#0d1a2d] text-slate-700 dark:text-gray-200 border-slate-300 dark:border-[#1a3a5c] hover:border-[#0090FF] hover:text-[#0090FF] dark:hover:border-[#0090FF] dark:hover:text-[#60BCFF]'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Blog Listing Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                        {filteredBlogs.length === 0 && (
                            <div className="col-span-full text-center py-16 text-slate-500 dark:text-slate-400 text-base">
                                No blogs found in this category.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default withTranslation()(BlogIndex);
