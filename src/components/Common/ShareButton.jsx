"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoShareSocial } from "react-icons/io5";
import { FaInstagram, FaWhatsapp, FaSnapchatGhost, FaFacebookF } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ShareButton = ({ isSubCat, isLevel, data, shareUrl, title, description, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  // Generate URL based on conditions
  const generateURL = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_WEB_URL || '';
    
    // If data is not provided, return empty string
    if (!data) {
      console.warn('ShareButton: No data provided');
      return '';
    }

    // Case 1: Level page (prompt details)
    if (isLevel && data.category && data.id) {
      return `${baseUrl}/category/sub-categories/${data.category_slug}/promptDetails/?catid=${data.category}&subcatid=${data.subcategory || ''}&questionId=${data.id}`;
    }else{
      return `${baseUrl}/category/sub-categories/${data.category_name}/prompt/?catid=${data.maincat_id}&subcatid=${data.id}&isSubcategory=1`;
    }
    
    // Case 2: Subcategory page (prompts list)
    // if (isSubCat && data.maincat_id && data.id) {
    //   return `${baseUrl}/category/sub-categories/${data.category_name}/prompt/?catid=${data.maincat_id}&subcatid=${data.id}&isSubcategory=1`;
    // }
    
    // // Case 3: Category page
    // if (!isSubCat && !isLevel && data.id) {
    //   return `${baseUrl}/category/?catid=${data.id}`;
    // }

    // // Fallback: return current page URL
    // console.warn('ShareButton: Conditions not met, returning current URL');
    // return typeof window !== 'undefined' ? window.location.href : '';
  };

  // Memoize the final URL
  const finalUrl = useMemo(() => {
    // Priority: shareUrl > generateURL() > current page
    if (shareUrl) return shareUrl;
    
    const generatedUrl = generateURL();
    if (generatedUrl) return generatedUrl;
    
    // Fallback to current page URL
    return typeof window !== 'undefined' ? window.location.href : '';
  }, [shareUrl, data, isSubCat, isLevel]);

  // Generate share message
  const message = useMemo(() => {
    if (title && description) return `${title} - ${description}`;
    if (title) return title;
    if (description) return description;
    return "Check this out!";
  }, [title, description]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return undefined;
    
    const handleOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside, { passive: true });
    
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [isOpen]);

  // Define share platforms
  const shareItems = useMemo(() => {
    const encodedUrl = encodeURIComponent(finalUrl);
    const encodedMessage = encodeURIComponent(message);
    const combinedMessage = encodeURIComponent([message, finalUrl].filter(Boolean).join(" - "));
    
    return [
      {
        key: "whatsapp",
        label: "WhatsApp",
        Icon: FaWhatsapp,
        background: "bg-[#25D366]",
        href: finalUrl ? `https://api.whatsapp.com/send?text=${combinedMessage}` : "",
        textColor: "text-white",
      },
      {
        key: "facebook",
        label: "Facebook",
        Icon: FaFacebookF,
        background: "bg-[#1877F2]",
        href: finalUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` : "",
        textColor: "text-white",
      },
      {
        key: "x",
        label: "X (Twitter)",
        Icon: FaSquareXTwitter,
        background: "bg-black",
        href: finalUrl ? `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMessage}` : "",
        textColor: "text-white",
      },
      {
        key: "instagram",
        label: "Instagram",
        Icon: FaInstagram,
        background: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
        // Note: Instagram doesn't support direct sharing via URL, so we copy to clipboard
        href: finalUrl,
        textColor: "text-white",
        customAction: true,
      },
      {
        key: "snapchat",
        label: "Snapchat",
        Icon: FaSnapchatGhost,
        background: "bg-[#FFFC00]",
        href: finalUrl ? `https://www.snapchat.com/scan?attachmentUrl=${encodedUrl}` : "",
        textColor: "text-black",
      },
    ];
  }, [finalUrl, message]);

  // Handle share action
  const handleShare = async (item) => {
    const { href, customAction, key } = item;
    
    if (!href) {
      console.error('ShareButton: No URL to share');
      return;
    }

    // Instagram special handling (copy to clipboard)
    if (customAction && key === 'instagram') {
      try {
        await navigator.clipboard.writeText(href);
        toast.success('Link copied! Open Instagram and paste it in your story or post.');
      } catch (error) {
        console.error('Failed to copy:', error);
        toast.error('Failed to copy link. Please try again.');
      }
      setIsOpen(false);
      return;
    }

    // Open share link in new window
    if (typeof window !== 'undefined') {
      const width = 600;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      window.open(
        href,
        '_blank',
        `noopener,noreferrer,width=${width},height=${height},left=${left},top=${top}`
      );
    }
    
    setIsOpen(false);
  };

  // Debug logging (remove in production)
  // useEffect(() => {
  //   console.log('ShareButton Debug:', {
  //     isSubCat,
  //     isLevel,
  //     data,
  //     generatedUrl: generateURL(),
  //     finalUrl,
  //   });
  // }, [isSubCat, isLevel, data, finalUrl]);

  return (
    <div ref={containerRef} className={`relative inline-flex ${className}`}>
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Share"
        whileTap={{ scale: 0.92 }}
        animate={{ rotate: isOpen ? 90 : 0 }}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg ring-1 ring-black/5 backdrop-blur hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
      >
        <IoShareSocial className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="share-menu"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 12 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute top-full right-0 z-50 mt-3 origin-top-right rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5"
          >
            <div className="flex gap-2">
              {shareItems.map((item) => {
                const { key, label, Icon, background, href, textColor } = item;
                const disabled = !href;
                
                return (
                  <motion.button
                    key={key}
                    type="button"
                    title={label}
                    whileHover={{ scale: disabled ? 1 : 1.1 }}
                    whileTap={{ scale: disabled ? 1 : 0.95 }}
                    onClick={() => handleShare(item)}
                    disabled={disabled}
                    aria-label={`Share on ${label}`}
                    className={`flex items-center justify-center rounded-xl p-3 text-sm font-semibold transition-all ${background} ${textColor} ${
                      disabled ? "cursor-not-allowed opacity-40" : "hover:brightness-110 hover:shadow-lg"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButton;