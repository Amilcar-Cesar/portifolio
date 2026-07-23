"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
  Mail
} from "lucide-react";
import { Project } from "@/lib/projects";
import ProjectCard from "./ProjectCard";
import SkillBadge from "./SkillBadge";
import Navbar from "./Navbar";
import SkillsApiClient from "./SkillsApiClient";
import AnimatedName from "./AnimatedName";
import Image from "next/image";

// Schema for contact form validation
const contactSchema = z.object({
  name: z.string().min(2, "o nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("endereço de e-mail inválido"),
  message: z.string().min(10, "a mensagem deve ter pelo menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
  </svg>
);

interface ProjectCase {
  slug: string;
  content: React.ReactNode;
}

interface PortfolioShellProps {
  projects: Project[];
  projectCases: ProjectCase[];
}

export default function PortfolioShell({ projects, projectCases }: PortfolioShellProps) {
  // Navigation & Scroll Tracking
  const [activeSection, setActiveSection] = useState("inicio");
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(null);

  // Contact Form State
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onContactSubmit = async (data: ContactFormData) => {
    setContactStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar mensagem. Por favor, tente novamente.");
      }

      setContactStatus("success");
      reset();
    } catch (err: any) {
      setContactStatus("error");
      setServerMessage(err.message || "Ocorreu um erro inesperado");
    }
  };

  // Sync URL search params for deep linking to projects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const proj = params.get("project");
    if (proj && projects.some((p) => p.slug === proj)) {
      setActiveProjectSlug(proj);
    }
  }, [projects]);

  // Handle opening project case study
  const openProject = (slug: string) => {
    setActiveProjectSlug(slug);
    window.history.pushState(null, "", `?project=${slug}`);
  };

  // Handle closing project case study
  const closeProject = () => {
    setActiveProjectSlug(null);
    window.history.pushState(null, "", window.location.pathname);
  };

  // Prevent background scroll when project drawer is open
  useEffect(() => {
    if (activeProjectSlug) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProjectSlug]);

  // Escape key listener to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeProject();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // IntersectionObserver / Scroll tracking to update Navbar active indicator
  useEffect(() => {
    const sectionIds = ["inicio", "projetos", "sobre", "contato"];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // offset for sticky navbar
      
      // Bottom edge detection
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
        setActiveSection("contato");
        return;
      }

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    },
  };

  const education = [
    {
      period: "2025 - atual",
      degree: "análise e desenvolvimento de sistemas",
      school: "universidade veiga de almeida",
    },
  ];

  const activeProject = projects.find((p) => p.slug === activeProjectSlug);
  const activeCaseContent = projectCases.find((c) => c.slug === activeProjectSlug)?.content;

  return (
    <>
      <Navbar activeSection={activeSection} />
      
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8 space-y-28 sm:space-y-40 grid-bg">
        
        {/* Section 1: Hero (inicio) */}
        <motion.section
          id="inicio"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionVariants}
          className="pt-16 sm:pt-24 scroll-mt-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Profile Info & Bio */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 px-3 py-1 border border-accent/20 rounded-full bg-accent/5 text-accent text-xs font-mono font-semibold"
                >
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                  disponível para novos projetos
                </motion.div>

                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-sans leading-tight">
                  olá, eu sou o <AnimatedName />
                </h1>
                <div className="text-xs font-mono font-bold tracking-wider text-accent uppercase">
                  desenvolvedor back-end
                </div>
              </div>

              {/* Profile Image */}
              <div className="relative aspect-square w-full max-w-[320px] rounded-2xl overflow-hidden border border-border/80 shadow-lg bg-border/10 group">
                <Image
                  src="/profile.png"
                  alt="Amilcar"
                  width={941}
                  height={941}
                  priority
                  quality={100}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              {/* Biography */}
              <p className="text-sm sm:text-base text-text-muted font-sans font-normal leading-relaxed">
                focado na construção de APIs robustas, arquitetura de sistemas e bancos de dados. desenvolvendo soluções eficientes em <strong className="text-text font-bold">python</strong> e <strong className="text-text font-bold">typescript</strong>/<strong className="text-text font-bold">javascript</strong>, utilizando <strong className="text-text font-bold">fastapi</strong>, <strong className="text-text font-bold">flask</strong>, <strong className="text-text font-bold">node</strong> e banco de dados avançados.
              </p>

              {/* Action Buttons & Links */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#contato"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white hover:bg-accent/90 text-xs font-semibold rounded-xl shadow-md shadow-accent/20 hover:shadow-accent/30 transition-all font-mono cursor-pointer"
                >
                  contato
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://github.com/Amilcar-Cesar"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border text-xs font-semibold rounded-xl hover:bg-border/20 transition-all bg-bg/50 backdrop-blur-sm font-mono cursor-pointer"
                >
                  github
                </a>
                <a
                  href="https://www.linkedin.com/in/amilcar-cesar-6b6918288/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border text-xs font-semibold rounded-xl hover:bg-border/20 transition-all bg-bg/50 backdrop-blur-sm font-mono cursor-pointer"
                >
                  linkedin
                </a>
              </div>
            </div>

            {/* Right Column: Terminal Component */}
            <div className="lg:col-span-7 w-full">
              <SkillsApiClient />
            </div>

          </div>
        </motion.section>


        {/* Section 2: Projects (projetos) */}
        <motion.section
          id="projetos"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
          className="space-y-12 scroll-mt-20 pt-8"
        >
          <div className="space-y-4 border-b border-border pb-6">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-sans">
              projetos.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 pt-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                title={project.title}
                description={project.description}
                tags={project.tags}
                slug={project.slug}
                githubUrl={project.githubUrl}
                deployUrl={project.deployUrl}
                coverImage={project.coverImage}
                onOpen={openProject}
              />
            ))}
          </div>

        </motion.section>

        {/* Section 3: About (sobre) */}
        <motion.section
          id="sobre"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
          className="space-y-12 scroll-mt-20 pt-8"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-sans">
              sobre.
            </h2>
            <p className="text-text-muted font-sans text-base max-w-2xl leading-relaxed">
              sou um desenvolvedor back-end com uma trajetória de estudos ampla e aprofundada em desenvolvimento de sistemas , arquitetura de APIs e engenharia de dados. possuo sólida base em python, typescript e javascript, desenvolvendo projetos práticos com frameworks modernos como fastapi, flask e node.js. além disso, domino a modelagem de bancos de dados relacionais e não-relacionais (postgresql, mysql, mongodb e redis), conteneirização com docker, automação ci/cd e integrações com inteligência artificial (llms, rag e ocr).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
            {/* Education timeline */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-sans">formação acadêmica</h3>
              <div className="space-y-6 pl-4 border-l-2 border-border/80">
                {education.map((edu, index) => (
                  <div key={index} className="space-y-1">
                    <span className="text-xs font-mono text-text-muted">{edu.period}</span>
                    <h4 className="font-semibold text-sm font-sans tracking-tight text-text">
                      {edu.degree}
                    </h4>
                    <p className="text-sm text-text-muted font-sans">{edu.school}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Philosophy */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-sans">filosofia de desenvolvimento</h3>
              <p className="text-sm text-text-muted font-sans leading-relaxed">
                como desenvolvedor entusiasta pelo aprendizado contínuo, priorizo escrever código limpo, testável e bem documentado, aplicando arquitetura mvc e boas práticas de engenharia de software. busco evoluir constantemente minhas habilidades através de projetos desafiadores, conectando sistemas de back-end eficientes com soluções modernas de infraestrutura e ia.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section 4: Contact (contato) */}
        <motion.section
          id="contato"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionVariants}
          className="space-y-8 scroll-mt-20 pt-8"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-sans">
              contato.
            </h2>
            <p className="text-text-muted font-sans text-base leading-relaxed max-w-xl">
              sinta-se à vontade para entrar em contato para colaboração em projetos, consultoria de arquitetura back-end ou apenas para dizer olá. tentarei responder em até 24 horas.
            </p>
          </div>

          <div className="border border-border p-6 rounded-xl bg-bg/40 backdrop-blur-md glow-card max-w-xl">
            {contactStatus === "success" ? (
              <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
                <CheckCircle2 className="h-12 w-12 text-accent" />
                <h3 className="text-lg font-bold font-sans">mensagem recebida.</h3>
                <p className="text-sm text-text-muted max-w-xs font-sans leading-relaxed">
                  obrigado por entrar em contato. vou ler sua mensagem e responderei em breve.
                </p>
                <button
                  onClick={() => setContactStatus("idle")}
                  className="px-4 py-2 border border-border rounded text-xs font-mono hover:bg-border/20 transition-all"
                >
                  enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-6">
                {contactStatus === "error" && (
                  <div className="flex items-start gap-2.5 p-3.5 border border-red-500/20 bg-red-500/5 text-red-500 text-xs font-mono rounded-lg">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{serverMessage}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-mono font-semibold text-text-muted">
                    nome
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    placeholder="joão silva"
                    className="w-full text-sm font-sans px-3.5 py-2.5 border border-border rounded-xl bg-bg/50 text-text focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/40"
                  />
                  {errors.name && (
                    <p className="text-xs font-mono text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-mono font-semibold text-text-muted">
                    e-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="joao@exemplo.com"
                    className="w-full text-sm font-sans px-3.5 py-2.5 border border-border rounded-xl bg-bg/50 text-text focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/40"
                  />
                  {errors.email && (
                    <p className="text-xs font-mono text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-mono font-semibold text-text-muted">
                    mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message")}
                    placeholder="me fale sobre seu projeto ou desafios técnicos..."
                    className="w-full text-sm font-sans px-3.5 py-2.5 border border-border rounded-xl bg-bg/50 text-text focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/40 resize-none"
                  />
                  {errors.message && (
                    <p className="text-xs font-mono text-red-500 mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={contactStatus === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-xl shadow-lg shadow-accent/20 transition-all disabled:opacity-50 font-mono cursor-pointer"
                >
                  {contactStatus === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      enviando...
                    </>
                  ) : (
                    "enviar mensagem"
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.section>

      </main>

      <footer className="w-full border-t border-border bg-bg/50 py-12">
        <div className="mx-auto max-w-6xl px-4 flex flex-col items-center gap-6 text-xs font-mono text-text-muted">
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://www.instagram.com/whoismilc/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-xl hover:bg-border/20 hover:text-text hover:border-accent transition-all text-xs"
            >
              <Instagram className="h-3.5 w-3.5" />
              instagram
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-xl hover:bg-border/20 hover:text-text hover:border-accent transition-all text-xs"
            >
              <Linkedin className="h-3.5 w-3.5" />
              linkedin
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-xl hover:bg-border/20 hover:text-text hover:border-accent transition-all text-xs"
            >
              <Github className="h-3.5 w-3.5" />
              github
            </a>
            <a
              href="mailto:amilcarcesar0@yahoo.com.br"
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-xl hover:bg-border/20 hover:text-text hover:border-accent transition-all text-xs"
            >
              <Mail className="h-3.5 w-3.5" />
              email
            </a>
          </div>
          <p>© {new Date().getFullYear()} amilcar. todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Case Study Sliding Drawer Overlay */}
      <AnimatePresence>
        {activeProjectSlug && activeProject && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProject}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm cursor-pointer"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-bg border-l border-border shadow-2xl flex flex-col h-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg sticky top-0 z-10">
                <div className="flex items-center gap-1 text-xs font-mono text-text-muted">
                  <a
                    href="#projetos"
                    onClick={(e) => {
                      e.preventDefault();
                      closeProject();
                    }}
                    className="hover:text-accent transition-colors"
                  >
                    projetos
                  </a>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-text font-medium truncate max-w-[150px] sm:max-w-[300px]">
                    {activeProject.title.toLowerCase()}
                  </span>
                </div>
                
                <button
                  onClick={closeProject}
                  className="p-1.5 border border-border rounded hover:bg-border/20 transition-all text-text-muted hover:text-text focus:outline-none"
                  aria-label="Fechar painel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Content Container */}
              <div className="flex-1 overflow-y-auto px-6 py-8">
                {/* Project Header details inside drawer */}
                <div className="space-y-4 mb-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-sans">
                      {activeProject.title.toLowerCase()}
                    </h2>
                    <div className="flex items-center gap-3 text-text-muted">
                      {activeProject.githubUrl && (
                        <a
                          href={activeProject.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono hover:text-accent transition-colors border border-border px-2.5 py-1 rounded-lg"
                        >
                          <svg className="h-3.5 w-3.5 text-current" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
                          </svg>
                          repositório
                        </a>
                      )}
                      {activeProject.deployUrl && (
                        <a
                          href={activeProject.deployUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono hover:text-accent transition-colors border border-border px-2.5 py-1 rounded-lg"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          deploy online
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-base text-text-muted font-sans leading-relaxed">
                    {activeProject.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {activeProject.tags.map((tag) => (
                      <SkillBadge key={tag} name={tag} />
                    ))}
                  </div>
                </div>

                {/* Case Study Content */}
                <div className="border-t border-border pt-8">
                  <article className="prose dark:prose-invert max-w-none">
                    {activeCaseContent}
                  </article>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
