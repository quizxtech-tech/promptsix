import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '@/components/Layout/Layout';
import fs from 'fs';
import path from 'path';
import BlogCard from '@/components/BlogCard/BlogCard';
import toast from 'react-hot-toast';
import { FiShare2, FiLink, FiTwitter, FiFacebook, FiLinkedin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

// This function gets called at build time to define the paths to be pre-rendered
export async function getStaticPaths() {
    const filePath = path.join(process.cwd(), 'src/data/blog.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const blogs = JSON.parse(jsonData);

    const paths = blogs.map((blog) => ({
        params: { id: blog.id.toString() },
    }));

    return { paths, fallback: false };
}

// This function gets called at build time on server-side.
export async function getStaticProps({ params }) {
    const filePath = path.join(process.cwd(), 'src/data/blog.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const blogs = JSON.parse(jsonData);

    const blog = blogs.find((b) => b.id.toString() === params.id) || null;
    const relatedBlogs = blogs.filter(b => blog?.related_blog?.includes(b.id)) || [];

    return { props: { blog, relatedBlogs } };
}

/* ── Share Button with Popover ── */
const ShareButton = ({ blog }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getUrl = () =>
        typeof window !== 'undefined'
            ? `${window.location.origin}/blog/${blog.id}`
            : '';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getUrl());
            toast.success('Link copied to clipboard!');
            setOpen(false);
        } catch {
            toast.error('Failed to copy link.');
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: blog.discripiton,
                    url: getUrl(),
                });
                setOpen(false);
            } catch (err) {
                if (err.name !== 'AbortError') handleCopy();
            }
        } else {
            setOpen((prev) => !prev);
        }
    };

    const shareOptions = [
        {
            label: 'Twitter / X',
            icon: <FiTwitter className="w-4 h-4" />,
            color: 'hover:bg-black/5 dark:hover:bg-white/10',
            onClick: () => {
                window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(getUrl())}`,
                    '_blank'
                );
                setOpen(false);
            },
        },
        {
            label: 'Facebook',
            icon: <FiFacebook className="w-4 h-4" />,
            color: 'hover:bg-blue-50 dark:hover:bg-white/10',
            onClick: () => {
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
                    '_blank'
                );
                setOpen(false);
            },
        },
        {
            label: 'LinkedIn',
            icon: <FiLinkedin className="w-4 h-4" />,
            color: 'hover:bg-blue-50 dark:hover:bg-white/10',
            onClick: () => {
                window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`,
                    '_blank'
                );
                setOpen(false);
            },
        },
        {
            label: 'WhatsApp',
            icon: <FaWhatsapp className="w-4 h-4" />,
            color: 'hover:bg-green-50 dark:hover:bg-white/10',
            onClick: () => {
                window.open(
                    `https://wa.me/?text=${encodeURIComponent(blog.title + ' ' + getUrl())}`,
                    '_blank'
                );
                setOpen(false);
            },
        },
        {
            label: 'Copy Link',
            icon: <FiLink className="w-4 h-4" />,
            color: 'hover:bg-[#0090FF]/10 dark:hover:bg-white/10',
            onClick: handleCopy,
        },
    ];

    return (
        <div className="relative inline-block" ref={ref}>
            <button
                onClick={handleNativeShare}
                className="flex items-center gap-2 bg-[#0090FF] text-[#0060CC] text-white font-semibold px-5 py-2.5 rounded-xl sm:text-lg text-base transition-all duration-200 border border-[#0090FF]/30  group"
            >
                <FiShare2 className="w-4 h-4" />
                Share
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl z-50
                                bg-white dark:bg-[#0d1a2d]
                                border border-[#C2DEFF] dark:border-[#1a3a5c]
                                overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-4 pt-3 pb-1">
                        Share via
                    </p>
                    {shareOptions.map((opt) => (
                        <button
                            key={opt.label}
                            onClick={opt.onClick}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors ${opt.color}`}
                        >
                            <span className="text-[#0090FF]">{opt.icon}</span>
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const BlogDetail = ({ blog, relatedBlogs }) => {
    if (!blog) return <div>Blog not found</div>;

    return (
        <Layout>
            <Head>
                <title key="title">{blog.meta_title}</title>
                <meta name="description" content={blog.meta_discription} key="desc" />
                <meta name="keywords" content={blog.meta_keywords} key="keywords" />
                <meta property="og:title" content={blog.meta_title} key="ogtitle" />
                <meta property="og:description" content={blog.meta_discription} key="ogdesc" />
                <meta property="og:image" content={blog.image} key="ogimage" />
                <meta property="og:type" content="article" key="ogtype" />
            </Head>

            <div className="min-h-screen bg-white dark:bg-[#090029]">
                {/* Full-width centered wrapper */}
                <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

                    {/* Blog Header */}
                    <div className="mb-10 text-center">
                        <div className="inline-block bg-[#0090FF]/15 dark:bg-[#0090FF]/20 text-[#0060CC] dark:text-[#60BCFF] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
                            {blog.blog_cat}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
                            {blog.title}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-6">
                            {blog.discripiton}
                        </p>
                        
                    </div>

                    {/* Hero Image */}
                    <div className="relative w-full rounded-2xl  mb-14 shadow-2xl border border-[#C2DEFF] dark:border-[#1a3a5c]">
                        <Image
                            src={blog.image}
                            alt={blog.title}
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain',borderRadius: '1rem' }}
                            priority
                        />
                        {/* Share overlay — covers Gemini watermark at bottom-right */}
                        <div className="absolute bottom-3 right-3 z-10">
                            <ShareButton blog={blog} />
                        </div>
                    </div>

                    {/* Blog Content */}
                    <article className="prose prose-lg dark:prose-invert max-w-none mb-12
                                        bg-[#EBF5FF] dark:bg-[#0d1a2d]
                                        border border-[#C2DEFF] dark:border-[#1a3a5c]
                                        p-8 md:p-12 rounded-2xl shadow-sm">
                        <div
                            dangerouslySetInnerHTML={{ __html: blog.blog_details }}
                            className="text-slate-800 dark:text-slate-200 leading-relaxed lg:text-xl sm:text-lg text-base" 
                        />
                    </article>

                    

                    {/* Related Blogs Section */}
                    {relatedBlogs && relatedBlogs.length > 0 && (
                        <div className="border-t border-[#C2DEFF] dark:border-[#1a3a5c] pt-14 mt-4">
                            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900 dark:text-white">
                                Read Next
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedBlogs.map((relatedBlog) => (
                                    <BlogCard key={relatedBlog.id} blog={relatedBlog} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default BlogDetail;
