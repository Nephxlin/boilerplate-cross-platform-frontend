# Boilerplate Front-End 2026

Um boilerplate moderno e completo para desenvolvimento de aplicações web e desktop, utilizando as tecnologias mais recentes do ecossistema React.

## Tech Stack

### Core
- **[Next.js 16](https://nextjs.org/)** - Framework React com App Router e Turbopack
- **[React 19](https://react.dev/)** - Biblioteca para construção de interfaces
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first

### Estado e Formulários
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gerenciamento de estado leve e performático
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript-first

### Autenticação
- **[better-auth](https://better-auth.com/)** - Autenticação moderna e flexível

### Internacionalização
- **[next-intl](https://next-intl.dev/)** - i18n para Next.js App Router
- Idiomas configurados: Inglês (en) e Português (pt-BR)

### Desktop & Mobile
- **[Tauri 2](https://v2.tauri.app/)** - Framework para aplicações desktop e mobile nativas

### PWA
- **[Serwist](https://serwist.pages.dev/)** - Service Worker e PWA support

### Animações
- **[Anime.js](https://animejs.com/)** - Biblioteca de animações JavaScript

### Testes
- **[Playwright](https://playwright.dev/)** - Testes E2E cross-browser
- **[Vitest](https://vitest.dev/)** - Testes unitários

### Documentação
- **[Storybook 10](https://storybook.js.org/)** - Documentação e desenvolvimento de componentes

### Qualidade de Código
- **[ESLint 9](https://eslint.org/)** - Linting de código
- **[Prettier](https://prettier.io/)** - Formatação de código

## Pré-requisitos

### Para desenvolvimento Web
- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+

### Para desenvolvimento Desktop (Tauri)
- [Rust](https://www.rust-lang.org/tools/install) 1.77.2+
- Dependências específicas do sistema operacional:

#### Windows
- [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (geralmente já instalado no Windows 10/11)

#### macOS
```bash
xcode-select --install
```

#### Linux (Debian/Ubuntu)
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

### Para desenvolvimento Mobile (Tauri)

#### Android
1. Instale o [Android Studio](https://developer.android.com/studio)
2. Configure o Android SDK (API level 24+)
3. Configure as variáveis de ambiente:
```bash
# Windows (adicione ao PATH do sistema)
ANDROID_HOME=C:\Users\<user>\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Android\Android Studio\jbr

# macOS/Linux (adicione ao ~/.bashrc ou ~/.zshrc)
export ANDROID_HOME=$HOME/Android/Sdk
export JAVA_HOME=/Applications/Android\ Studio.app/Contents/jbr/Contents/Home
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
```
4. **Windows: Habilite o Modo de Desenvolvedor** (necessário para links simbólicos):
   - Abra **Configurações** do Windows (Win + I)
   - Vá em **Privacidade e Segurança** → **Para desenvolvedores**
   - Ative o **Modo de Desenvolvedor**
   - Reinicie o computador se necessário
5. Crie um emulador Android ou conecte um dispositivo físico com depuração USB ativada

#### iOS (somente macOS)
1. Instale o [Xcode](https://apps.apple.com/app/xcode/id497799835) via App Store
2. Instale as ferramentas de linha de comando:
```bash
xcode-select --install
```
3. Instale o [CocoaPods](https://cocoapods.org/):
```bash
sudo gem install cocoapods
```
4. Aceite a licença do Xcode:
```bash
sudo xcodebuild -license accept
```

## Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd boilerplate-front-end-2026

# Instale as dependências
pnpm install

# Copie o arquivo de ambiente
cp .env.example .env.local

# Configure as variáveis de ambiente no .env.local
```

## Scripts Disponíveis

### Desenvolvimento Web

```bash
# Inicia o servidor de desenvolvimento (Turbopack)
pnpm dev

# Inicia o servidor de desenvolvimento (Webpack)
pnpm dev:webpack

# Build para produção
pnpm build

# Inicia o servidor de produção
pnpm start

# Lint do código
pnpm lint
```

### Tauri - Desktop

```bash
# Inicia o app desktop em modo de desenvolvimento
pnpm tauri:dev

# Build do app desktop para produção
pnpm tauri:build

# Comandos Tauri diretos
pnpm tauri [comando]

# Limpa processos Tauri travados (Windows)
pnpm tauri:clean
```

### Tauri - Mobile

#### Android

```bash
# Inicializa o projeto Android (execute apenas uma vez)
pnpm tauri android init

# Inicia o app Android em modo de desenvolvimento
pnpm tauri android dev

# Build do app Android para produção
pnpm tauri android build

# Abre o projeto no Android Studio
pnpm tauri android open
```

#### iOS (somente macOS)

```bash
# Inicializa o projeto iOS (execute apenas uma vez)
pnpm tauri ios init

# Inicia o app iOS em modo de desenvolvimento
pnpm tauri ios dev

# Build do app iOS para produção
pnpm tauri ios build

# Abre o projeto no Xcode
pnpm tauri ios open
```

### Storybook

```bash
# Inicia o Storybook em modo de desenvolvimento
pnpm storybook

# Build do Storybook
pnpm build-storybook
```

### Testes

```bash
# Executa testes E2E com Playwright
pnpm exec playwright test

# Executa testes E2E com interface visual
pnpm exec playwright test --ui

# Gera ícones do app
pnpm generate-icons
```

## Estrutura do Projeto

```
├── .storybook/           # Configuração do Storybook
├── e2e/                  # Testes E2E (Playwright)
├── public/               # Arquivos estáticos
├── scripts/              # Scripts utilitários
├── src/
│   ├── app/              # App Router (páginas e layouts)
│   │   ├── [locale]/     # Rotas internacionalizadas
│   │   ├── api/          # API Routes
│   │   ├── globals.css   # Estilos globais
│   │   └── sw.ts         # Service Worker
│   ├── components/       # Componentes React
│   │   └── ui/           # Componentes de UI reutilizáveis
│   ├── hooks/            # Custom hooks
│   ├── i18n/             # Configuração de internacionalização
│   │   ├── messages/     # Arquivos de tradução (en.json, pt-BR.json)
│   │   ├── navigation.ts # Navegação internacionalizada
│   │   ├── request.ts    # Configuração de request
│   │   └── routing.ts    # Configuração de rotas
│   ├── lib/              # Utilitários e configurações
│   │   ├── animations.ts # Animações com Anime.js
│   │   ├── auth.ts       # Configuração do better-auth (server)
│   │   ├── auth-client.ts# Cliente de autenticação
│   │   ├── cn.ts         # Utilitário para classes CSS
│   │   └── validations/  # Schemas de validação Zod
│   ├── stores/           # Stores Zustand
│   ├── stories/          # Stories do Storybook
│   └── types/            # Definições de tipos TypeScript
├── src-tauri/            # Código Rust do Tauri
│   ├── capabilities/     # Permissões do app
│   ├── icons/            # Ícones do app
│   ├── src/              # Código fonte Rust
│   │   ├── lib.rs        # Biblioteca principal
│   │   └── main.rs       # Entry point
│   ├── Cargo.toml        # Dependências Rust
│   └── tauri.conf.json   # Configuração do Tauri
├── .env.example          # Exemplo de variáveis de ambiente
├── eslint.config.mjs     # Configuração do ESLint
├── next.config.ts        # Configuração do Next.js
├── playwright.config.ts  # Configuração do Playwright
├── postcss.config.mjs    # Configuração do PostCSS
└── tsconfig.json         # Configuração do TypeScript
```

## Configuração do Tauri

O arquivo `src-tauri/tauri.conf.json` contém as configurações do Tauri:

```json
{
  "productName": "boilerplate-app",
  "version": "0.1.0",
  "identifier": "com.tauri.dev",
  "build": {
    "frontendDist": "../out",
    "devUrl": "http://localhost:3000",
    "beforeDevCommand": "pnpm dev",
    "beforeBuildCommand": "pnpm build"
  }
}
```

### Personalizando o App

1. **Nome e Identificador**: Altere `productName` e `identifier` no `tauri.conf.json`
2. **Ícones**: Substitua os ícones em `src-tauri/icons/` ou use:
   ```bash
   pnpm generate-icons
   ```
3. **Janela**: Configure tamanho, título e comportamento em `app.windows`
4. **Permissões**: Configure em `src-tauri/capabilities/`

## Internacionalização (i18n)

O projeto suporta múltiplos idiomas usando `next-intl`. Para adicionar um novo idioma:

1. Crie o arquivo de mensagens em `src/i18n/messages/[locale].json`
2. Adicione o locale em `src/i18n/routing.ts`:
   ```typescript
   export const locales = ['en', 'pt-BR', 'novo-locale'] as const
   ```

## Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `NEXT_PUBLIC_APP_URL` | URL base da aplicação | Sim |
| `BETTER_AUTH_SECRET` | Chave secreta para autenticação | Sim |
| `BETTER_AUTH_URL` | URL do servidor de autenticação | Sim |
| `DATABASE_URL` | URL de conexão com banco de dados | Não |

## Build para Produção

### Web
```bash
pnpm build
pnpm start
```

### Desktop

```bash
# Windows (.exe, .msi)
pnpm tauri:build

# macOS (.app, .dmg)
pnpm tauri:build

# Linux (.deb, .AppImage)
pnpm tauri:build
```

Os instaladores serão gerados em `src-tauri/target/release/bundle/`.

### Mobile

```bash
# Android (.apk, .aab)
pnpm tauri android build

# iOS (.ipa)
pnpm tauri ios build
```

## Solução de Problemas

### Tauri Desktop

**Erro: "failed to bundle project"**
- Verifique se o Rust está instalado corretamente: `rustc --version`
- No Windows, verifique se o Build Tools está instalado

**Erro: "WebView2 not found"**
- Baixe e instale o [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

### Tauri Mobile

**Android: "SDK location not found"**
- Configure a variável `ANDROID_HOME` corretamente
- Verifique se o Android SDK está instalado via Android Studio

**Android (Windows): "Creation symbolic link is not allowed"**
- Habilite o **Modo de Desenvolvedor** no Windows:
  1. Abra **Configurações** (Win + I)
  2. Vá em **Privacidade e Segurança** → **Para desenvolvedores**
  3. Ative o **Modo de Desenvolvedor**
  4. Reinicie o computador
- Alternativa: Execute o terminal como Administrador (não recomendado)

**iOS: "Xcode not found"**
- Instale o Xcode via App Store
- Execute `xcode-select --install`

**Erro: "Unable to determine iOS deployment target"**
- Execute `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`

## Licença

Este projeto está sob a licença MIT.
