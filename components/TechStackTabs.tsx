"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Database, 
  Layers,
  ChevronRight
} from "lucide-react";

interface TechItem {
  name: string;
  desc: string;
}

interface CategoryData {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  items: TechItem[];
}

export default function TechStackTabs() {
  const [activeTab, setActiveTab] = useState("backend");

  const categories: CategoryData[] = [
    {
      id: "linguagens",
      label: "linguagens",
      icon: Code2,
      items: [
        { name: "Python", desc: "desenvolvimento de scripts robustos e APIs assíncronas de alta performance." },
        { name: "SQL", desc: "modelagem de dados relacional, transações seguras e indexação avançada." },
        { name: "TypeScript", desc: "tipagem estática, interfaces e sistemas robustos no backend e frontend." },
        { name: "JavaScript", desc: "lógica de eventos assíncronos e integrações dinâmicas de API." },
      ],
    },
    {
      id: "backend",
      label: "backend & dados",
      icon: Database,
      items: [
        { name: "FastAPI / Flask", desc: "APIs altamente tipadas com validações automáticas do Pydantic." },
        { name: "Pydantic", desc: "comunicação binária inter-serviços rápida com esquemas tipados." },
        { name: "Pandas", desc: "bliblioteca para manipulação e tratamento de dados." },
        { name: "PostgreSQL", desc: "procedures em PL/pgSQL, isolamento de transações e bloqueio pessimista." },
        { name: "MongoDB", desc: "banco de dados NoSQL para armazenamento de dados não estruturados." },
        { name: "Redis", desc: "camadas de cache distribuído em memória e controle de rate-limiting." },
        { name: "RabbitMQ", desc: "arquitetura orientada a eventos usando filas e mensageria assíncrona." },
        { name: "Node.js / Express", desc: "aplicações de backend orientadas a eventos de alta concorrência." },
      ],
    },
    {
      id: "infra",
      label: "infraestrutura & nuvem",
      icon: Layers,
      items: [
        { name: "Docker", desc: "conteinerização completa de serviços garantindo consistência dev-to-prod." },
        { name: "CI / CD", desc: "automação de build, testes integrados e deploy via GitHub Actions." },
        { name: "Git", desc: "controle de versão distribuído, branches estratégicos e boas práticas de pull request." },
      ],
    },
  ];

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <div className="space-y-8 w-full">
      {/* Tabs list with sliding indicator */}
      <div className="flex border border-border rounded-xl p-1 bg-bg/50 backdrop-blur-md max-w-lg mx-auto sm:mx-0">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className="relative flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-mono font-semibold rounded-lg transition-colors focus:outline-none cursor-pointer z-10"
              style={{
                color: isActive ? "var(--text)" : "var(--text-muted)",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-bg border border-border shadow-sm rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`h-3.5 w-3.5 ${isActive ? "text-accent" : "text-text-muted"}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tech Cards Grid */}
      <motion.div
        layout
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2"
      >
        <AnimatePresence mode="popLayout">
          {currentCategory.items.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="border border-border rounded-xl p-4 bg-bg/30 backdrop-blur-md glow-card flex flex-col justify-between"
            >
              <div>
                <h4 className="font-mono text-sm font-bold tracking-tight text-text flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  {item.name}
                </h4>
                <p className="text-xs text-text-muted font-sans mt-2.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="flex items-center text-[10px] font-mono text-accent/80 mt-4">
                <span>aplicação prática</span>
                <ChevronRight className="h-3 w-3 mt-0.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
