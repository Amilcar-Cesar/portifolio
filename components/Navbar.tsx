"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

interface NavbarProps {
  activeSection?: string;
}

export default function Navbar({ activeSection }: NavbarProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const { scrollYProgress } = useScroll();
  const rawScaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const scaleX = useTransform(rawScaleX, (v) => Math.min(Math.max(v, 0), 1));

  useEffect(() => {
    // Sync state with DOM class set by our inline script
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  const navItems = [
    { name: "início", path: "/#inicio", id: "inicio" },
    { name: "projetos", path: "/#projetos", id: "projetos" },
    { name: "sobre", path: "/#sobre", id: "sobre" },
    { name: "contato", path: "/#contato", id: "contato" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `/#${id}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/85 backdrop-blur-md">
      {/* Scroll Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden pointer-events-none z-50">
        <motion.div
          className="h-full w-full bg-accent origin-left"
          style={{ scaleX }}
        />
      </div>
      
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link
          href="/#inicio"
          onClick={(e) => handleNavClick(e, "/#inicio", "inicio")}
          className="font-mono text-base font-bold tracking-tight hover:text-accent transition-colors"
        >
          amilcar.dev
        </Link>

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4 sm:gap-6">
            {navItems.map((item) => {
              const isHome = pathname === "/";
              const isActive = isHome
                ? activeSection === item.id
                : pathname.startsWith(item.path.split("#")[0]);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item.path, item.id)}
                  className={clsx(
                    "text-sm font-medium transition-colors hover:text-accent font-sans",
                    isActive ? "text-accent" : "text-text-muted"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={toggleTheme}
            className="p-2 border border-border rounded hover:bg-border/20 transition-all focus:outline-none"
            aria-label="Alternar tema"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 text-text" />
            ) : (
              <Sun className="h-4 w-4 text-text" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
