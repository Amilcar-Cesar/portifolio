---
trigger: always_on
---

# Skill: Design Criativo, Interativo e Responsivo para Portfolio

## Objetivo
Elevar o portfolio além do "template bonito": criar momentos de interação que demonstrem raciocínio de engenharia através da própria interface, mantendo performance e responsividade em qualquer dispositivo.

---

## 1. Princípios de interação criativa

- **Toda interação deve ter propósito.** Não anime por animar — cada movimento deve guiar atenção, dar feedback ou revelar informação.
- **Micro-interações > efeitos grandiosos.** Um hover bem feito em um card vale mais que uma animação 3D genérica.
- **Feedback imediato**: todo clique, hover ou scroll deve responder em menos de 100ms (mesmo que a animação continue depois).
- **Contraste de ritmo**: alternar seções estáticas com seções interativas evita fadiga visual — nem tudo precisa se mover.
- **Easing natural**: nunca usar `linear`. Prefira `ease-out` para entradas e `ease-in-out` para transições de estado (ex: `cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 2. Bibliotecas e ferramentas

| Necessidade | Ferramenta | Uso típico |
|---|---|---|
| Animação geral | **Framer Motion** | Scroll reveal, hover, page transitions, `layout` animations |
| Animação complexa/sequenciada | **GSAP + ScrollTrigger** | Timelines com múltiplos elementos sincronizados ao scroll |
| Scroll suave | **Lenis** | Rolagem "premium", inércia controlada |
| 3D leve | **React Three Fiber + drei** | Fundo com partículas, objeto 3D interativo (usar com moderação) |
| Cursor customizado | **CSS + JS puro** (`mix-blend-mode`) | Reforça identidade visual sem lib extra |
| Gestos touch | **Framer Motion `drag`** ou **use-gesture** | Cards arrastáveis, carrosséis customizados |

Regra prática: comece só com **Framer Motion**. Só adicione GSAP ou R3F se a interação específica exigir (timeline complexa ou 3D real).

---

## 3. Padrões de interação recomendados para portfolio backend/dados

- **Scroll reveal progressivo**: seções e cards de projeto entram com `opacity` + `translateY` conforme entram na viewport (`whileInView` no Framer Motion).
- **Cards de projeto com hover em camadas**: imagem faz leve zoom, overlay com stack técnica sobe de baixo pra cima.
- **Diagrama de arquitetura interativo**: SVG onde hover em um componente (ex: "API", "Banco", "Cache") destaca conexões relacionadas — reforça que você entende o próprio sistema que construiu.
- **Contadores animados**: métricas de projeto (ex: "10k+ registros processados") contam de 0 até o valor final ao entrar na tela.
- **Tabs/accordion para stack técnica**: em vez de listar tudo, organizar por categoria (Backend / Dados / Infra) com transição suave ao trocar.
- **Terminal simulado**: comandos clicáveis que revelam informações (`whoami`, `cat skills.txt`) — já explorado anteriormente, reforça identidade de dev backend.

---

## 4. Responsividade — regras não negociáveis

- **Mobile-first**: escrever CSS/Tailwind partindo do menor breakpoint, adicionar complexidade com `sm:`, `md:`, `lg:`.
- **Breakpoints Tailwind padrão**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px) — não criar breakpoints customizados sem necessidade real.
- **Animações pesadas desligadas em mobile**: usar `useMediaQuery` ou `window.matchMedia('(max-width: 768px)')` para simplificar ou remover efeitos 3D/parallax em telas pequenas.
- **Testar em dispositivo real**, não só redimensionar o navegador — comportamento de touch e scroll é diferente.
- **Nunca usar `overflow-x: hidden` no body para "resolver" bugs de layout** — é sintoma de um problema de responsividade não corrigido na origem.
- **Tipografia fluida**: usar `clamp()` (ex: `font-size: clamp(1.5rem, 4vw, 3rem)`) em vez de múltiplos breakpoints de fonte.

---

## 5. Acessibilidade (não é opcional)

- Respeitar `prefers-reduced-motion`: usuários que ativaram essa preferência não devem ver animações de scroll/parallax.
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
  ```
- Todo elemento interativo (card, botão, terminal) precisa ser navegável por teclado (`tabIndex`, `:focus-visible` visível).
- Contraste mínimo de 4.5:1 entre texto e fundo, mesmo em overlays com imagem.

---

## 6. Checklist de performance para interatividade

- [ ] Nenhuma animação roda no thread principal sem necessidade — priorizar `transform` e `opacity` (não animar `width`, `top`, `left`)
- [ ] Framer Motion com `layout` usado com moderação (é caro em listas grandes)
- [ ] Lazy load de componentes pesados (R3F, GSAP) via `next/dynamic` com `ssr: false`
- [ ] Lighthouse Performance acima de 85 mesmo com interações ativas
- [ ] Testado com CPU throttling 4x no DevTools antes de considerar pronto