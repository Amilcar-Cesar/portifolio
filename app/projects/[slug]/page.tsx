import { getProjectBySlug, projects } from "@/lib/projects";
import { getProjectMdxContent } from "@/lib/projects-server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import SkillBadge from "@/components/SkillBadge";
import ProjectGallery from "@/components/ProjectGallery";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

const mdxComponents = {
  h1: (props: any) => <h1 className="text-2xl font-bold font-sans mt-10 mb-4 border-b border-border pb-2 tracking-tight" {...props} />,
  h2: (props: any) => <h2 className="text-lg font-semibold font-sans mt-8 mb-3 tracking-tight" {...props} />,
  h3: (props: any) => <h3 className="text-base font-semibold font-sans mt-6 mb-2 tracking-tight" {...props} />,
  p: (props: any) => <p className="text-sm leading-relaxed text-text-muted mb-4 font-sans" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-5 mb-4 text-sm text-text-muted space-y-1.5 font-sans" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-5 mb-4 text-sm text-text-muted space-y-1.5 font-sans" {...props} />,
  li: (props: any) => <li className="pl-1" {...props} />,
  code: (props: any) => <code className="bg-border/20 px-1.5 py-0.5 rounded text-xs font-mono text-accent" {...props} />,
  pre: (props: any) => <pre className="bg-border/10 border border-border p-4 rounded overflow-x-auto text-xs font-mono my-4 text-text leading-relaxed" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-2 border-accent pl-4 my-4 italic text-sm text-text-muted" {...props} />,
  img: (props: any) => (
    <span className="my-6 block overflow-hidden rounded-xl border border-border bg-bg/40">
      <img className="w-full h-auto object-cover" {...props} />
      {props.alt && (
        <span className="block border-t border-border p-2 text-center text-xs text-text-muted font-sans">
          {props.alt}
        </span>
      )}
    </span>
  ),
};

export default async function ProjectCasePage({ params }: PageProps) {
  const resolvedParams = await params;
  const project = getProjectBySlug(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  let mdxContent = "";
  try {
    mdxContent = getProjectMdxContent(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  const components = {
    ...mdxComponents,
    ProjectGallery: (props: any) => (
      <ProjectGallery images={props.images || project.images} />
    ),
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 mx-auto max-w-2xl px-4 py-16">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          back to projects
        </Link>

        {/* Project Header */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-sans">
              {project.title.toLowerCase()}
            </h1>
            <div className="flex items-center gap-4 text-text-muted">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono hover:text-accent transition-colors border border-border px-2 py-1 rounded"
                >
                  <svg className="h-3.5 w-3.5 text-current" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
                  </svg>
                  repository
                </a>
              )}
              {project.deployUrl && (
                <a
                  href={project.deployUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono hover:text-accent transition-colors border border-border px-2 py-1 rounded"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  live deploy
                </a>
              )}
            </div>
          </div>

          <p className="text-base text-text-muted font-sans leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.tags.map((tag) => (
              <SkillBadge key={tag} name={tag} />
            ))}
          </div>
        </div>

        {/* MDX Case Content */}
        <div className="border-t border-border pt-8">
          <article className="prose dark:prose-invert max-w-none">
            <MDXRemote source={mdxContent} components={components} />
          </article>
        </div>
      </main>
      <footer className="w-full border-t border-border bg-bg/50 py-8 mt-auto">
        <div className="mx-auto max-w-4xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-muted">
          <p>© {new Date().getFullYear()} amilcar. all rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-text transition-colors">github</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-text transition-colors">linkedin</a>
          </div>
        </div>
      </footer>
    </>
  );
}
