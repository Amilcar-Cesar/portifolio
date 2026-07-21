"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { ProjectImage } from "@/lib/projects";

interface ProjectGalleryProps {
  images?: ProjectImage[];
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[selectedIndex];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation for Lightbox and image carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  return (
    <div className="my-8 space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-accent">
          <LayoutGrid className="h-4 w-4" />
          <span className="font-semibold tracking-wide uppercase">Telas da Interface ({images.length})</span>
        </div>
        <span className="text-xs font-mono text-text-muted">
          {selectedIndex + 1} de {images.length}
        </span>
      </div>

      {/* Main Image Display Box */}
      <div className="group relative rounded-xl border border-border bg-bg/60 overflow-hidden shadow-xl backdrop-blur-sm">
        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative aspect-[16/9] w-full cursor-zoom-in overflow-hidden bg-black/40"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage.src}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.015]"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Hover Zoom Prompt Badge */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-bg/80 border border-border backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-text flex items-center gap-1.5 shadow-lg">
            <Maximize2 className="h-3.5 w-3.5 text-accent" />
            ampliar tela
          </div>

          {/* Arrow Navigation Overlay */}
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="pointer-events-auto p-2 rounded-full bg-bg/70 border border-border/80 text-text hover:bg-accent hover:text-white hover:border-accent transition-all opacity-0 group-hover:opacity-100 shadow-md"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="pointer-events-auto p-2 rounded-full bg-bg/70 border border-border/80 text-text hover:bg-accent hover:text-white hover:border-accent transition-all opacity-0 group-hover:opacity-100 shadow-md"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Caption Banner */}
        <div className="p-4 border-t border-border bg-bg/90 backdrop-blur-md">
          <h4 className="font-sans text-sm font-bold text-text">
            {currentImage.title}
          </h4>
          {currentImage.description && (
            <p className="mt-1 text-xs text-text-muted leading-relaxed font-sans">
              {currentImage.description}
            </p>
          )}
        </div>
      </div>

      {/* Thumbnails Navigation Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        {images.map((img, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={img.src}
              onClick={() => setSelectedIndex(idx)}
              className={`group relative aspect-[16/10] rounded-lg overflow-hidden border transition-all text-left focus:outline-none ${
                isSelected
                  ? "border-accent ring-2 ring-accent/30 shadow-md"
                  : "border-border/70 hover:border-border opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, 20vw"
                className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
              <div className={`absolute inset-0 transition-colors ${isSelected ? "bg-accent/10" : "bg-black/20 group-hover:bg-transparent"}`} />
              <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-[2px] p-1 px-1.5 text-[10px] font-mono text-white truncate">
                {idx + 1}. {img.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/90 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Lightbox Header */}
            <div className="flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-accent/80 px-2.5 py-1 rounded text-white font-semibold">
                  {selectedIndex + 1} / {images.length}
                </span>
                <span className="text-sm font-sans font-bold tracking-tight">
                  {currentImage.title}
                </span>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 border border-white/20 rounded-full hover:bg-white/20 text-white transition-all focus:outline-none"
                aria-label="Fechar zoom"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Lightbox Center Image */}
            <div 
              className="relative flex-1 my-4 flex items-center justify-center cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Navigation Arrows inside Lightbox */}
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-accent hover:border-accent transition-all"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-accent hover:border-accent transition-all"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Lightbox Footer Caption */}
            <div className="text-center z-10 max-w-2xl mx-auto">
              <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                {currentImage.description}
              </p>
              <p className="text-[11px] font-mono text-gray-500 mt-2">
                Pressione ESC para fechar ou navegue com as setas do teclado
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
