"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import { ShieldCheck, Activity, Clock } from "lucide-react";

interface CounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}

function Counter({ value, duration = 1.5, suffix = "", decimals = 0 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      const node = ref.current;
      if (!node) return;

      const controls = animate(0, value, {
        duration,
        ease: [0.16, 1, 0.3, 1], // ease-out custom
        onUpdate(latest) {
          node.textContent = latest.toFixed(decimals) + suffix;
        },
      });

      return () => controls.stop();
    }
  }, [inView, value, duration, suffix, decimals]);

  return <span ref={ref} className="font-mono">0{suffix}</span>;
}

export default function AnimatedMetrics() {
  const metrics = [
    {
      label: "disponibilidade (uptime)",
      value: 99.99,
      decimals: 2,
      suffix: "%",
      icon: ShieldCheck,
      desc: "acordo de nível de serviço (SLA) visado na infraestrutura",
      color: "text-emerald-500",
      bgGlow: "rgba(16, 185, 129, 0.08)",
    },
    {
      label: "vazão de requisições",
      value: 10000,
      decimals: 0,
      suffix: "+ /s",
      icon: Activity,
      desc: "capacidade de processamento sob testes de estresse",
      color: "text-indigo-500",
      bgGlow: "rgba(99, 102, 241, 0.08)",
    },
    {
      label: "tempo de resposta médio",
      value: 12,
      decimals: 0,
      suffix: " ms",
      icon: Clock,
      desc: "latência em endpoints otimizados com cache em memória",
      color: "text-pink-500",
      bgGlow: "rgba(236, 72, 153, 0.08)",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-3 w-full">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="border border-border rounded-xl p-5 bg-bg/40 backdrop-blur-md glow-card flex flex-col justify-between space-y-4"
            style={{
              boxShadow: `inset 0 0 12px 1px ${m.bgGlow}`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-tight text-text-muted">{m.label}</span>
              <Icon className={`h-5 w-5 ${m.color}`} />
            </div>

            <div className="text-3xl font-extrabold font-mono tracking-tight text-text">
              <Counter value={m.value} decimals={m.decimals} suffix={m.suffix} />
            </div>

            <p className="text-xs text-text-muted font-sans leading-relaxed">
              {m.desc}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
