import fs from "fs";
import path from "path";

export function getProjectMdxContent(slug: string): string {
  const contentDirectory = path.join(process.cwd(), "content", "projects");
  const filePath = path.join(contentDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Project file not found: ${slug}.mdx`);
  }
  return fs.readFileSync(filePath, "utf8");
}
