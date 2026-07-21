import { projects } from "@/lib/projects";
import { getProjectMdxContent } from "@/lib/projects-server";
import { MDXRemote } from "next-mdx-remote/rsc";
import PortfolioShell from "@/components/PortfolioShell";
import ProjectGallery from "@/components/ProjectGallery";

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

export default function Home() {
  const projectCases = projects.map((project) => {
    const mdxContent = getProjectMdxContent(project.slug);
    const components = {
      ...mdxComponents,
      ProjectGallery: (props: any) => (
        <ProjectGallery images={props.images || project.images} />
      ),
    };

    return {
      slug: project.slug,
      content: <MDXRemote source={mdxContent} components={components} />,
    };
  });

  return <PortfolioShell projects={projects} projectCases={projectCases} />;
}
