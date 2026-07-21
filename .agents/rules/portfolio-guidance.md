---
trigger: manual
---

# Skill: Construção de Portfolio Fullstack/Backend

## Objetivo
Construir um portfolio pessoal que demonstre domínio técnico real (arquitetura, decisões de engenharia, código em produção), não apenas uma vitrine visual. Público-alvo: recrutadores técnicos e tech leads.

---

## 1. Stack obrigatória

| Camada | Tecnologia | Motivo |
|---|---|---|
| Framework | **Next.js** (App Router) | SSG/SSR nativo, API Routes, integração direta com Vercel |
| Linguagem | **TypeScript** | Já é seu padrão nos projetos atuais — manter consistência |
| Estilo | **Tailwind CSS** | Padrão de mercado, produtividade alta, fácil dark mode |
| Conteúdo | **MDX** | Escrever cases técnicos em Markdown com componentes React embutidos |
| Deploy | **Vercel** | Preview deploys automáticos, zero-config com Next.js |
| Formulário de contato | Netlify Functions **ou** Vercel API Route + Resend/SendGrid | Reaproveita conhecimento que você já tem |

---

## 2. Bibliotecas a dominar (por ordem de prioridade)

1. **Framer Motion (Motion)** — animações de entrada, scroll reveal, hover states. É a lib mais cobrada/esperada em portfolios modernos.
2. **Lucide React** ou **Tabler Icons** — ícones consistentes, leves, sem dependência de imagens.
3. **clsx / tailwind-merge** — composição condicional de classes Tailwind sem gambiarra.
4. **next-mdx-remote** ou **@next/mdx** — renderização de conteúdo técnico dos projetos.
5. **Zod** — validação de formulário de contato (já usa em backend, reaproveitar).
6. **React Hook Form** — se o formulário de contato tiver mais de 2 campos.

Opcional (só se quiser diferenciação visual forte):
- **React Three Fiber** — elementos 3D/partículas de fundo.
- **Lenis** — smooth scroll.

---

## 3. Princípios de design (não negociáveis)

- **Flat, sem gradientes ou sombras decorativas.** Superfícies limpas, bordas finas (1px), respiro generoso.
- **Duas fontes no máximo**: uma sans-serif para UI (ex: Inter, Geist), uma mono para trechos de código/terminal (ex: JetBrains Mono).
- **Paleta reduzida**: 1 cor neutra (fundo/texto) + 1 cor de destaque (accent). Nunca mais que isso.
- **Modo escuro obrigatório** — usar variáveis CSS (`--bg`, `--text`, `--accent`) desde o início, nunca hex fixo.
- **Tipografia em sentence case**, nunca Title Case ou CAIXA ALTA.
- **Hierarquia visual clara**: h1 (nome/título) > h2 (seções) > corpo. Sem inflar tamanhos de fonte.
- **Whitespace é conteúdo.** Evitar densidade — cada seção deve "respirar".
- **Performance antes de estética**: se uma animação trava em mobile, ela não entra.

---

## 4. Estrutura de conteúdo

```
app/
  page.tsx                → home (hero + resumo + destaques)
  projects/
    page.tsx              → grid de projetos
    [slug]/page.mdx        → case detalhado por projeto
  about/page.tsx           → trajetória, formação
  contact/page.tsx         → formulário
components/
  ProjectCard.tsx
  Navbar.tsx
  SkillBadge.tsx
content/
  projects/
    ecommerce.mdx
    fisiovita.mdx
    rocket-chat.mdx
```

### Cada case de projeto (`[slug]/page.mdx`) deve conter:
- Problema que o projeto resolve
- Stack usada e por que (ex: "Netlify Functions em vez de servidor dedicado por causa de X")
- Diagrama de arquitetura (pode ser SVG simples ou imagem)
- Desafio técnico específico e como foi resolvido
- Link do repositório + link do deploy funcional (se houver)

---

## 5. Checklist de qualidade antes de publicar

- [ ] Lighthouse score acima de 90 em Performance e Acessibilidade
- [ ] Todas as imagens usando `next/image`
- [ ] Pelo menos 2 projetos com deploy ao vivo (não só repo)
- [ ] Dark mode funcional em todas as páginas
- [ ] Meta tags OG configuradas (preview bonito ao compartilhar link)
- [ ] Testado em mobile real, não só DevTools
- [ ] Sem `console.log` ou código comentado esquecido