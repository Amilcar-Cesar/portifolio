import { NextResponse } from "next/server";
import { projects } from "@/lib/projects";

export async function GET() {
  const cleanedProjects = projects.map(({ description, coverImage, images, ...rest }) => rest);

  return NextResponse.json(cleanedProjects, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    }
  });
}
