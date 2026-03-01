import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiShare2, FiLink, FiTwitter, FiFacebook, FiLinkedin } from "react-icons/fi";
import { FiArrowUpRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const BlogCard = ({ blog }) => {
    const [shareOpen, setShareOpen] = useState(false);
    const shareRef = useRef(null);

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (shareRef.current && !shareRef.current.contains(e.target)) {
                setShareOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getUrl = () =>
        typeof window !== "undefined"
            ? `${window.location.origin}/blog/${blog.id}`
            : "";

    const handleShare = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // On mobile (native share supported), open system share sheet directly
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: blog.discripiton,
                    url: getUrl(),
                });
            } catch (err) {
                if (err.name !== "AbortError") setShareOpen((prev) => !prev);
            }
        } else {
            // Desktop: toggle dropdown
            setShareOpen((prev) => !prev);
        }
    };

    const handleCopy = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(getUrl());
            toast.success("Link copied to clipboard!");
        } catch {
            toast.error("Failed to copy link.");
        }
        setShareOpen(false);
    };

    const openInNew = (url, e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(url, "_blank");
        setShareOpen(false);
    };

    const shareOptions = [
        {
            label: "Twitter / X",
            icon: <FiTwitter className="w-4 h-4" />,
            hoverBg: "hover:bg-black/5 dark:hover:bg-white/10",
            onClick: (e) =>
                openInNew(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(getUrl())}`,
                    e
                ),
        },
        {
            label: "Facebook",
            icon: <FiFacebook className="w-4 h-4" />,
            hoverBg: "hover:bg-blue-50 dark:hover:bg-white/10",
            onClick: (e) =>
                openInNew(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
                    e
                ),
        },
        {
            label: "LinkedIn",
            icon: <FiLinkedin className="w-4 h-4" />,
            hoverBg: "hover:bg-blue-50 dark:hover:bg-white/10",
            onClick: (e) =>
                openInNew(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`,
                    e
                ),
        },
        {
            label: "WhatsApp",
            icon: <FaWhatsapp className="w-4 h-4" />,
            hoverBg: "hover:bg-green-50 dark:hover:bg-white/10",
            onClick: (e) =>
                openInNew(
                    `https://wa.me/?text=${encodeURIComponent(blog.title + " " + getUrl())}`,
                    e
                ),
        },
        {
            label: "Copy Link",
            icon: <FiLink className="w-4 h-4" />,
            hoverBg: "hover:bg-[#0090FF]/10 dark:hover:bg-white/10",
            onClick: handleCopy,
        },
    ];

    return (
        <Link
            href={`/blog/${blog.id}`}
            className="flex flex-col rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer group shadow-md
                       bg-[#EBF5FF] dark:bg-[#0d1a2d]
                       border border-[#C2DEFF] dark:border-[#1a3a5c]"
        >
            {/* Image */}
            <div className="relative w-full h-56 md:h-64 overflow-hidden ">
                <Image
                    src={blog.image}
                    alt={blog.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 p-3 rounded-[30px]"
                />
                {/* Share Button with Popover */}
                <div
                    className="absolute bottom-3 right-3 z-10"
                    ref={shareRef}
                    onClick={(e) => e.preventDefault()}
                >
                    <button
                        onClick={handleShare}
                        className="bg-white dark:bg-[#0d1a2d] hover:bg-[#0090FF] group/share-btn text-gray-700 dark:text-gray-200 hover:text-white shadow-lg rounded-full py-2 px-4 flex items-center gap-2 font-semibold text-sm transition-all duration-200 border border-[#C2DEFF] dark:border-[#1a3a5c]"
                        aria-label="Share this blog post"
                    >
                        <FiShare2 className="w-4 h-4 text-[#0090FF] group-hover/share-btn:text-white transition-colors" />
                        <span>Share</span>
                    </button>

                    {/* Share Options Dropdown */}
                    {shareOpen && (
                        <div className="absolute bottom-full right-0 mb-2 w-52 rounded-2xl shadow-2xl
                                        bg-white dark:bg-[#0d1a2d]
                                        border border-[#C2DEFF] dark:border-[#1a3a5c]
                                        overflow-hidden">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-4 pt-3 pb-1">
                                Share via
                            </p>
                            {shareOptions.map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={opt.onClick}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors ${opt.hoverBg}`}
                                >
                                    <span className="text-[#0090FF]">{opt.icon}</span>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-10 flex flex-col flex-grow">
                {/* Category Tag */}
                <div className="mb-3">
                    <span className="inline-block bg-[#0090FF]/15 dark:bg-[#0090FF]/20 text-[#0060CC] dark:text-[#60BCFF] text-xs font-bold px-3 py-1 rounded-md uppercase tracking-widest">
                        {blog.blog_cat}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white leading-tight">
                    {blog.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 text-sm md:text-[15px] line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {blog.discripiton}
                </p>

                {/* CTA Button */}
                <div className="mt-auto">
                    <div className="w-full bg-[#0090FF] hover:bg-[#007AE0] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200">
                        <span className="text-sm tracking-wide">SEE DETAILS</span>
                        <FiArrowUpRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
