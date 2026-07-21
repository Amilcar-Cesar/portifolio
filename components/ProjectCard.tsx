"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import SkillBadge from "./SkillBadge";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  slug: string;
  githubUrl?: string;
  deployUrl?: string;
  coverImage?: string;
  onOpen?: (slug: string) => void;
}

export default function ProjectCard({
  title,
  description,
  tags,
  slug,
  githubUrl,
  deployUrl,
  coverImage,
  onOpen,
}: ProjectCardProps) {
  const handleOpenClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onOpen) {
      e.preventDefault();
      onOpen(slug);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between border border-border p-6 rounded-xl bg-bg/40 backdrop-blur-md glow-card cursor-pointer focus-within:ring-2 focus-within:ring-accent focus-within:outline-none"
    >
      <div>
        {coverImage && (
          <div className="relative aspect-[16/9] w-full mb-5 rounded-lg overflow-hidden border border-border/60 bg-border/10">
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
          </div>
        )}
        <div className="flex items-start justify-between">
          <Link href={`/projects/${slug}`} onClick={handleOpenClick} className="focus:outline-none">
            <h3 className="font-sans text-lg font-bold tracking-tight group-hover:text-accent transition-colors">
              {title.toLowerCase()}
            </h3>
          </Link>
          <div className="flex items-center gap-3 text-text-muted">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent transition-colors p-1"
                aria-label={`repositório do github para ${title}`}
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="h-4.5 w-4.5 text-current" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
                </svg>
              </a>
            )}
            {deployUrl && (
              <a
                href={deployUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent transition-colors p-1"
                aria-label={`deploy online para ${title}`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4.5 w-4.5" />
              </a>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm text-text-muted font-sans leading-relaxed">
          {description}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <SkillBadge key={tag} name={tag} />
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center">
        <Link
          href={`/projects/${slug}`}
          onClick={handleOpenClick}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent hover:gap-2.5 transition-all"
        >
          ver detalhes
          <ArrowRight className="h-3 w-3 mt-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}

