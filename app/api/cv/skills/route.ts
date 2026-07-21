import { NextResponse } from "next/server";

export async function GET() {
  const skills = {
    linguagens: [
      "Python",
      "SQL",
      "TypeScript",
      "JavaScript"
    ],
    backendData: [
      "FastAPI",
      "Flask",
      "Pydantic",
      "SQLAlchemy",
      "Pandas",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "Node.js",
      "Express",
      "SQLite"
    ],
    cloudDevOps: [
      "Docker",
      "Docker Compose",
      "CI/CD",
      "Git",
      "GitHub Actions"
    ],
    ai: [
      "Retrieval-Augmented Generation (RAG)",
      "LLMs",
      "OCR",
      "AI-Integration"
    ]
  };

  return NextResponse.json(skills, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    }
  });
}
