"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, 
  Check, 
  FileCode, 
  ChevronDown,
  Loader2,
  Terminal as TerminalIcon,
  Play
} from "lucide-react";

interface EndpointOption {
  label: string;
  url: string;
  path: string;
  description: string;
}

export default function SkillsApiClient() {
  const endpoints: EndpointOption[] = [
    {
      label: "Perfil Profissional",
      url: "amilcar.dev/api/cv/profile",
      path: "/api/cv/profile",
      description: "Retorna informações gerais sobre o desenvolvedor"
    },
    {
      label: "Competências (Skills)",
      url: "amilcar.dev/api/cv/skills",
      path: "/api/cv/skills",
      description: "Retorna as tecnologias organizadas por categorias"
    },
    {
      label: "Projetos",
      url: "amilcar.dev/api/cv/projects",
      path: "/api/cv/projects",
      description: "Retorna a lista de projetos e estudos de caso"
    }
  ];

  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointOption>(endpoints[0]);
  const [responseJson, setResponseJson] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [responseTime, setResponseTime] = useState<number>(28);

  const executeRequest = async (endpoint: EndpointOption = selectedEndpoint) => {
    setLoading(true);
    const startTime = performance.now();
    try {
      const res = await fetch(endpoint.path);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setResponseJson(data);
      const endTime = performance.now();
      setResponseTime(Math.max(12, Math.round(endTime - startTime)));
    } catch (error) {
      setResponseJson({
        error: "Failed to execute request",
        details: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
        setHasExecuted(true);
      }, 300);
    }
  };

  const handleCopyResponse = () => {
    if (!responseJson) return;
    navigator.clipboard.writeText(JSON.stringify(responseJson, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  // Purple/Indigo Theme JSON Syntax Highlighter
  const getHighlightedJson = (obj: any) => {
    if (!obj) return "";
    const jsonStr = JSON.stringify(obj, null, 2);
    
    const escaped = jsonStr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
      
    const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;
    
    return escaped.replace(regex, (match) => {
      let cls = "text-[#e5c07b]"; // string values (warm gold/amber)
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-[#a5b4fc] font-medium"; // JSON keys (indigo/purple)
          return `<span class="${cls}">${match.slice(0, -1)}</span>:`;
        }
      } else if (/true|false/.test(match)) {
        cls = "text-[#f472b6]"; // booleans (soft pink)
      } else if (/null/.test(match)) {
        cls = "text-[#94a3b8]"; // null
      } else {
        cls = "text-[#818cf8]"; // numbers (bright indigo)
      }
      return `<span class="${cls}">${match}</span>`;
    });
  };

  return (
    <div className="w-full space-y-3">
      {/* Sub-header descriptor */}
      <div className="flex items-center justify-between text-xs font-mono text-text-muted px-1">
        <span className="flex items-center gap-1.5">
          <TerminalIcon className="w-3.5 h-3.5 text-accent" />
          <span>Console Interativo da API</span>
        </span>
        <span className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          <span>HTTP 200 OK</span>
        </span>
      </div>

      {/* Main Terminal Window Frame */}
      <div className="w-full h-[460px] rounded-2xl overflow-hidden bg-[#161616] border border-[#2a2a2a] shadow-2xl flex flex-col font-mono text-xs text-slate-200">
        
        {/* Top Window Title Bar */}
        <div className="px-4 py-3 bg-[#1c1c1c] border-b border-[#282828] flex items-center justify-between select-none shrink-0">
          {/* macOS Traffic Lights */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>

          {/* Centered File Title: developer.py */}
          <div className="flex items-center gap-2 text-slate-300 font-mono text-xs font-medium tracking-tight">
            <FileCode className="h-4 w-4 text-[#818cf8]" />
            <span>developer.py</span>
          </div>

          <div className="w-14" /> {/* Equalizer spacer for center alignment */}
        </div>

        {/* Request / Control Bar */}
        <div className="p-3 bg-[#181818] border-b border-[#282828] flex flex-wrap sm:flex-nowrap items-center gap-2.5 z-20 shrink-0">
          
          {/* Method Selector */}
          <div className="flex items-center gap-1.5 bg-[#1e1b4b]/60 border border-[#6366f1]/50 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-[#818cf8] select-none">
            <span>GET</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </div>

          {/* URL Combobox Select Dropdown */}
          <div className="relative flex-1 min-w-[200px]">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between bg-[#111111] border border-[#333333] hover:border-[#444444] rounded-lg px-3.5 py-1.5 text-xs font-mono text-slate-300 transition-colors focus:outline-none"
            >
              <span className="truncate text-slate-300">
                {selectedEndpoint.url}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0 ml-2" />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setDropdownOpen(false)}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 mt-2 z-50 bg-[#1c1c1c] border border-[#333333] rounded-xl shadow-2xl overflow-hidden py-1"
                  >
                    {endpoints.map((ep) => (
                      <button
                        key={ep.path}
                        type="button"
                        onClick={() => {
                          setSelectedEndpoint(ep);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#252525] transition-colors flex flex-col gap-0.5 border-b border-[#282828] last:border-b-0 cursor-pointer ${
                          selectedEndpoint.path === ep.path ? "bg-[#222222]" : ""
                        }`}
                      >
                        <span className="text-xs font-mono font-bold text-slate-200">
                          GET <span className="text-[#818cf8] ml-1.5">{ep.url}</span>
                        </span>
                        <span className="text-[11px] font-sans text-slate-400">
                          {ep.description}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Decorative Copy Icon */}
          <div 
            className="p-2 bg-[#141414] border border-[#333333] rounded-lg text-slate-500 select-none flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <Copy className="h-3.5 w-3.5" />
          </div>

          {/* Execute Button */}
          <button
            onClick={() => executeRequest()}
            disabled={loading}
            type="button"
            className="flex items-center justify-center gap-1.5 px-4 py-1.5 border border-[#6366f1] hover:bg-[#6366f1]/20 text-[#818cf8] font-mono font-semibold text-xs rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Executando...</span>
              </>
            ) : (
              <>
                <span>Execute</span>
              </>
            )}
          </button>
        </div>

        {/* Main Terminal Screen Content Area */}
        <div className="bg-[#121212] p-5 flex-1 overflow-y-auto overflow-x-auto flex flex-col justify-between font-mono relative">
          
          {/* Loader backdrop indicator */}
          {loading && (
            <div className="absolute inset-0 bg-[#121212]/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#818cf8]" />
              <span className="text-xs text-slate-400 animate-pulse">Carregando dados...</span>
            </div>
          )}

          {!hasExecuted ? (
            /* Initial Prompt State */
            <div className="flex-1 flex flex-col justify-start pt-2">
              <div className="flex items-center flex-wrap gap-2 text-slate-300 font-mono text-xs sm:text-sm leading-relaxed">
                <span className="text-[#818cf8] font-bold">$</span>
                <span>Select an endpoint and hit execute to learn more about me...</span>
                <span className="inline-block w-2.5 h-4 bg-[#818cf8] align-middle animate-pulse ml-0.5" />
              </div>
            </div>
          ) : (
            /* Executed State */
            <div className="flex-1 flex flex-col space-y-3">
              {/* Response Status Bar */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">HTTP/1.1</span>
                  <span className="text-[#818cf8] font-bold bg-[#1e1b4b]/60 px-1.5 py-0.5 rounded border border-[#6366f1]/40">
                    200 OK
                  </span>
                  <span className="text-slate-500 text-[11px] ml-2">{responseTime}ms</span>
                </div>

                {/* Copy JSON Button */}
                {responseJson && (
                  <button
                    onClick={handleCopyResponse}
                    type="button"
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                    title="Copiar resposta JSON"
                  >
                    {copiedResponse ? (
                      <>
                        <Check className="h-3 w-3 text-[#818cf8]" />
                        <span className="text-[#818cf8] font-bold">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copiar JSON</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Dotted separator line */}
              <div className="border-b border-dashed border-[#282828] my-1 shrink-0" />

              {/* HTTP Response Headers */}
              <div className="text-[11px] text-slate-400 font-mono leading-relaxed space-y-0.5 select-none shrink-0">
                <div>Content-Type: <span className="text-slate-300">application/json</span></div>
                <div>X-Powered-By: <span className="text-slate-300">Python 3.11 / FastAPI</span></div>
              </div>

              {/* Formatted JSON Output */}
              <div className="mt-3 flex-1 overflow-auto">
                <pre
                  className="font-mono text-xs sm:text-sm leading-relaxed text-left whitespace-pre text-slate-200 select-text"
                  dangerouslySetInnerHTML={{ __html: getHighlightedJson(responseJson) }}
                />
              </div>
            </div>
          )}

          {/* Terminal Bottom Prompt line if executed */}
          {hasExecuted && !loading && (
            <div className="pt-4 mt-4 border-t border-[#202020] flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
              <span className="text-[#818cf8] font-bold">$</span>
              <button 
                onClick={() => setHasExecuted(false)}
                className="hover:text-slate-200 hover:underline cursor-pointer transition-colors"
              >
                clique aqui para limpar o terminal
              </button>
              <span className="inline-block w-2 h-3.5 bg-[#818cf8] align-middle animate-pulse ml-0.5" />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


