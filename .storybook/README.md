# Storybook

## Tela principal

A doc **Introduction** (`src/stories/Introduction.mdx`) é a tela de apresentação do _UI. Ela aparece primeiro no sidebar.

## Erro "Couldn't find story matching id ...readme--docs"

Esse erro aparece quando o Storybook tenta abrir uma story **removida** (ex.: antigos `README.mdx` do atomic design). Normalmente é cache ou “última story vista” no navegador.

**Como resolver:**

1. Parar o Storybook (Ctrl+C).
2. Limpar o cache:
   ```bash
   rm -rf node_modules/.cache/storybook
   ```
3. No navegador, **limpar o localStorage** do Storybook (ex.: `http://localhost:6006`):
   - DevTools → Application → Local Storage → `http://localhost:6006` → Clear  
   - Ou abrir o Storybook em **aba anônima**.
4. Subir de novo e abrir a **Introduction** ou a raiz:
   ```bash
   pnpm storybook
   ```
   Acesse `http://localhost:6006` (ou use o link da Introduction no sidebar).

Após isso, o Storybook deixa de tentar abrir a story antiga.
