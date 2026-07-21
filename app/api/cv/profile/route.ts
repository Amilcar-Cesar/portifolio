import { NextResponse } from "next/server";

export async function GET() {
  const profile = {
    nome: "Amilcar Cesar",
    cargo: "Desenvolvedor Backend",
    localizacao: "RJ, Brasil",
    principaisTecnologias: ["Python", "JavaScript", "TypeScript", "FastAPI", "Flask", "Node.js", "PostgreSQL", "Docker", "MongoDB", "Redis", "RabbitMQ", "LLMs/RAG"],
    redesSociais: {
      github: "https://github.com/Amilcar-Cesar",
      linkedin: "https://linkedin.com/in/amilcar-cesar"
    }
  };

  return NextResponse.json(profile, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    }
  });
}
