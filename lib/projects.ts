export interface ProjectImage {
  src: string;
  alt: string;
  title: string;
  description?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  deployUrl?: string;
  featured: boolean;
  coverImage?: string;
  images?: ProjectImage[];
}

export const projects: Project[] = [
  {
    slug: "fisiovita",
    title: "Sistema Fisiovita",
    description: "Sistema SaaS projetado para gerenciar consultas, faturamento e prontuários eletrônicos de pacientes (PEP) para clínicas de fisioterapia, com alertas de reserva em tempo real.",
    tags: ["fastapi", "vite", "react", "supabase"],
    githubUrl: "https://github.com/Amilcar-Cesar/fisiovita",
    deployUrl: "https://fisiovita-demo.vercel.app",
    featured: false,
    coverImage: "/projects/fisiovita/dashboard-recepcao.png",
    images: [
      {
        src: "/projects/fisiovita/dashboard-recepcao.png",
        alt: "Painel da Recepção Fisiovita",
        title: "Painel da Recepção",
        description: "Visão consolidada de pacientes cadastrados, atendimentos do dia e dados de presença na clínica.",
      },
      {
        src: "/projects/fisiovita/painel-fisioterapeutico.png",
        alt: "Painel Fisioterapêutico Fisiovita",
        title: "Painel Fisioterapêutico",
        description: "Registro de anamnese inicial, diagnósticos fisioterapêuticos com CID, histórico de atendimentos e evolução por sessão.",
      },
      {
        src: "/projects/fisiovita/buscar-pacientes.png",
        alt: "Gestão e Busca de Pacientes",
        title: "Busca & Atendimento de Pacientes",
        description: "Procure pacientes por nome, CPF ou ID com ações de marcação de presença e chamada direta para atendimento.",
      },
      {
        src: "/projects/fisiovita/gestao-administrativa.png",
        alt: "Central de Gestão Administrativa Vita Admin",
        title: "Central de Gestão Administrativa",
        description: "Seleção de clínicas, gestão de perfis de acesso (Profissional, Staff, Manager) e administração de especialidades.",
      },
      {
        src: "/projects/fisiovita/cadastro-especialidades.png",
        alt: "Catálogo de Especialidades",
        title: "Catálogo de Especialidades",
        description: "Gerenciamento e cadastro global de especialidades clínicas (Fisioterapia, Densitometria, Raio X, etc).",
      },
    ],
  },
  {
    slug: "e-commerce",
    title: "Loja Máximo Respeito",
    description: "E-commerce de roupas construído em arquitetura Monorepo com React, TanStack Query, API Express Serverless e banco de dados Supabase PostgreSQL.",
    tags: ["typescript", "react", "vite", "express", "supabase", "tanstack query", "netlify"],
    githubUrl: "https://github.com/Amilcar-Cesar/maximo_respeito",
    deployUrl: "https://maximorespeito.netlify.app/",
    featured: true,
    coverImage: "/projects/maximo-respeito/catalogo-produtos.png",
    images: [
      {
        src: "/projects/maximo-respeito/catalogo-produtos.png",
        alt: "Catálogo de Produtos Loja Máximo Respeito",
        title: "Catálogo de Produtos",
        description: "Visualização completa do catálogo de roupas com navegação por categorias (Camisetas, Calças, Jaquetas, etc.).",
      },
      {
        src: "/projects/maximo-respeito/detalhes-produto.png",
        alt: "Detalhes do Produto e Seleção de Variações",
        title: "Detalhes do Produto",
        description: "Página de produto detalhada com galeria de imagens, seletor de cor/tamanho e cálculo de desconto via PIX.",
      },
      {
        src: "/projects/maximo-respeito/carrinho-checkout.png",
        alt: "Carrinho de Compras e Resumo de Pedido",
        title: "Carrinho de Compras",
        description: "Interface da sacola de compras com alteração de quantidades em tempo real e fluxo guiado para checkout.",
      },
    ],
  },
  {
    slug: "api-bancaria",
    title: "API bancária",
    description: "O objetivo principal é demonstrar organização em arquitetura MVC, clareza no design de código e a capacidade de implementar operações bancárias básicas (criação de contas, listagem, saques e extratos) usando MySQL como persistência principal.",
    tags: ["flask", "python", "mysql", "docker", "mvc", "sqlalchemy"],
    githubUrl: "https://github.com/Amilcar-Cesar/banco_api_mvc",
    featured: false,
  },
  {
    slug: "delivery-api",
    title: "API de Entregas",
    description: "Este projeto é um exercício prático para demonstrar princípios de arquitetura limpa, autenticação segura com JWT, e boas práticas voltadas para escalabilidade e manutenibilidade.",
    tags: ["flask", "jwt", "mvc", "sqlite"],
    githubUrl: "https://github.com/Amilcar-Cesar/delivery_api",
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
