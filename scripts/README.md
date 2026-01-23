# Scripts

Este diretório contém scripts utilitários para o projeto.

## generate-icons.js

Script para gerar automaticamente todos os ícones necessários para o aplicativo.

### Uso

```bash
# Usar ícone fonte padrão (procura em src-tauri/icons/icon-source.png)
pnpm generate-icons

# Ou especificar o caminho do ícone fonte
node scripts/generate-icons.js caminho/para/seu/icone.png
```

### Requisitos

- **Ícone fonte**: PNG, JPG ou JPEG com pelo menos 512x512px (recomendado: 1024x1024px)
- **Dependências**: `sharp` e `png2icons` (já instaladas no projeto)

### O que o script gera

#### Ícones Tauri (Desktop e Mobile)
- `icon.png` (512x512px) - Ícone principal
- `32x32.png` - Tamanho pequeno
- `128x128.png` - Tamanho médio
- `128x128@2x.png` (256x256px) - Retina
- `icon.ico` - Windows (gerado via png2icons)
- `icon.icns` - macOS (gerado via png2icons)

#### Ícones PWA/Web
- `icon-48x48.png`
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-144x144.png`
- `icon-192x192.png`
- `icon-512x512.png`

### Localização dos arquivos

- **Tauri**: `src-tauri/icons/`
- **PWA/Web**: `public/icons/`

### Exemplo

1. Coloque seu ícone fonte em `src-tauri/icons/icon-source.png` (ou qualquer outro nome)
2. Execute: `pnpm generate-icons`
3. Todos os ícones serão gerados automaticamente!

### Notas

- O script preserva transparência (fundo transparente)
- Os ícones são redimensionados mantendo proporção
- Se o ícone fonte for menor que 512x512px, você verá um aviso mas o script continuará
