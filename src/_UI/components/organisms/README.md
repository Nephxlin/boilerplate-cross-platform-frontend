# Organisms

**O que significa:** Organismos são **seções complexas da UI** que agrupam moléculas e/ou átomos em blocos semânticos. Representam partes distintas de uma página (cabeçalho, rodapé, formulário completo, lista de itens).

**Tipos de componentes que pertencem aqui:**

- **Header** — Logo, navegação, idioma, tema, usuário
- **Footer** — Links, copyright, redes sociais
- **Sidebar** — Navegação lateral, filtros
- **Form** — Conjunto de FormFields (login, cadastro, filtros)
- **FeatureCards** — Grid de cards com ícone, título, descrição, links
- **DataTable** — Tabela com ordenação, paginação, ações
- **Modal / Drawer** — Overlay com conteúdo (formulário, confirmação)
- **Hero** — Banner com título, subtítulo, CTA

Organismos podem **consumir hooks** (roteamento, tema, i18n) e **estado local**. Mantenha **uma responsabilidade** por organismo e reuse átomos/moléculas sempre que fizer sentido.
