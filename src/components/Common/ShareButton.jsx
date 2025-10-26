"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoShareSocial } from "react-icons/io5";
import { FaInstagram, FaWhatsapp, FaSnapchatGhost, FaFacebookF } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const ShareButton = ({ shareUrl, title, description, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const finalUrl = useMemo(() => {
    if (shareUrl) return shareUrl;
    if (typeof window !== "undefined") return window.location.href;
    return "";
  }, [shareUrl]);

  const message = useMemo(() => {
    if (title && description) return `${title} - ${description}`;
    if (title) return title;
    if (description) return description;
    return "";
  }, [title, description]);

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

  const shareItems = useMemo(() => {
    const encodedUrl = encodeURIComponent(finalUrl);
    const encodedMessage = encodeURIComponent(message);
    const combinedMessage = encodeURIComponent([message, finalUrl].filter(Boolean).join(" "));
    return [
      {
        key: "instagram",
        label: "Instagram",
        Icon: FaInstagram,
        background: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
        href: finalUrl ? `https://www.instagram.com/?url=${encodedUrl}` : "",
        textColor: "text-white",
      },
      {
        key: "whatsapp",
        label: "WhatsApp",
        Icon: FaWhatsapp,
        background: "bg-[#25D366]",
        href: finalUrl ? `https://api.whatsapp.com/send?text=${combinedMessage}` : "",
        textColor: "text-white",
      },
      {
        key: "snapchat",
        label: "Snapchat",
        Icon: FaSnapchatGhost,
        background: "bg-[#FFFC00]",
        href: finalUrl ? `https://www.snapchat.com/share?url=${encodedUrl}&text=${encodedMessage}` : "",
        textColor: "text-black",
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
        label: "X",
        Icon: FaSquareXTwitter,
        background: "bg-black",
        href: finalUrl ? `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMessage}` : "",
        textColor: "text-white",
      },
    ];
  }, [finalUrl, message]);

  const handleShare = (href) => {
    if (!href) return;
    if (typeof window !== "undefined") {
      window.open(href, "_blank", "noopener,noreferrer");
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-flex ${className}`}>
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        whileTap={{ scale: 0.92 }}
        animate={{ rotate: isOpen ? 90 : 0 }}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg ring-1 ring-black/5 backdrop-blur hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-color"
      >
        <IoShareSocial className="h-5 w-5" />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="share-menu"
            initial={{ opacity: 0, scale: 0.9, y: 8, x: 8 }}
            animate={{ opacity: 1, scale: 1, y: 12, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8, x: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute top-full right-0 z-50 mt-3 w-48 origin-top-right rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5"
          >
            <div className="flex flex-col gap-2">
              {shareItems.map(({ key, label, Icon, background, href, textColor }) => {
                const disabled = !href;
                return (
                  <motion.button
                    key={key}
                    type="button"
                    whileHover={{ scale: disabled ? 1 : 1.03 }}
                    whileTap={{ scale: disabled ? 1 : 0.97 }}
                    onClick={() => handleShare(href)}
                    disabled={disabled}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${background} ${textColor} ${disabled ? "cursor-not-allowed opacity-40" : "hover:brightness-110"}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
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
