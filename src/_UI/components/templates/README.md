# Templates

**O que significa:** Templates são **layouts de página**: a estrutura (grid, colunas, áreas) onde organismos e seções são dispostos. Eles **não** contêm conteúdo real, apenas **placeholders** ou slots para os organismos.

**Tipos de componentes que pertencem aqui:**

- **DefaultLayout** — Header + área de conteúdo (children) + Footer opcional
- **AuthLayout** — Layout centrado para login, cadastro, recuperar senha
- **DashboardLayout** — Sidebar + Header + conteúdo principal
- **LandingLayout** — Hero + seções + Footer, sem sidebar
- **ModalLayout** — Overlay + container centralizado para modais

Templates **não** definem textos, imagens ou dados; apenas **estrutura e comportamento do layout** (responsividade, scroll, etc.). As **pages** preenchem os templates com conteúdo e organismos reais.
