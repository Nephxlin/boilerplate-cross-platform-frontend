# Molecules

**O que significa:** Moléculas são **combinações de átomos** que formam um bloco funcional. Ainda são relativamente simples, mas já representam um padrão de UI reconhecível (ex.: campo de busca, item de lista).

**Tipos de componentes que pertencem aqui:**

- **SearchBar** — Input + Button (ou Icon) de busca
- **FormField** — Label + Input + mensagem de erro
- **Card** — Container (átomo) + título + descrição + ações
- **ListItem** — Avatar + texto + botão ou link
- **Chip / Tag** — Badge + ícone de fechar
- **NavigationTab** — Link ou Button repetido em grupo
- **Alert** — Ícone + título + descrição + ação opcional
- **CheckboxField / RadioField** — Input + Label + hint

As moléculas **combinam apenas átomos** (ou outras moléculas simples). Evite lógica de negócio ou estado global; prefira **props** para configuração.
