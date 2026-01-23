#!/usr/bin/env node

/**
 * Script para gerar ícones do aplicativo
 * 
 * Gera ícones para:
 * - Tauri (Desktop e Mobile)
 * - PWA/Web
 * 
 * Uso:
 *   node scripts/generate-icons.js [caminho-do-icone-fonte]
 * 
 * Se não fornecer o caminho, procura por:
 * - src-tauri/icons/icon-source.png
 * - src-tauri/icons/icon.png (se já existir, será usado como base)
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { execSync } = require('child_process')

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

// Diretórios
const rootDir = path.resolve(__dirname, '..')
const tauriIconsDir = path.join(rootDir, 'src-tauri', 'icons')
const publicIconsDir = path.join(rootDir, 'public', 'icons')

// Tamanhos de ícones para Tauri
const tauriSizes = [
  { name: 'icon.png', size: 512 }, // Ícone principal (mínimo 512x512)
  { name: '32x32.png', size: 32 },
  { name: '128x128.png', size: 128 },
  { name: '128x128@2x.png', size: 256 },
]

// Tamanhos de ícones para PWA/Web
const pwaSizes = [
  { name: 'icon-48x48.png', size: 48 },
  { name: 'icon-72x72.png', size: 72 },
  { name: 'icon-96x96.png', size: 96 },
  { name: 'icon-144x144.png', size: 144 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
]

/**
 * Mostra ajuda
 */
function showHelp() {
  console.log(`
🎨 Gerador de Ícones do Aplicativo

Uso:
  pnpm generate-icons [caminho-do-icone-fonte]

Exemplos:
  pnpm generate-icons
  pnpm generate-icons src-tauri/icons/meu-icone.png
  pnpm generate-icons ./icon-source.png

O script gera automaticamente:
  • Ícones Tauri (icon.png, 32x32.png, 128x128.png, etc.)
  • Ícones PWA/Web (icon-48x48.png, icon-192x192.png, etc.)
  • Ícones de plataforma (.ico para Windows, .icns para macOS)

Se não fornecer o caminho, o script procura por:
  1. src-tauri/icons/icon-source.png
  2. src-tauri/icons/icon-source.jpg
  3. src-tauri/icons/icon.png (se já existir)

Requisitos:
  • Ícone fonte: PNG, JPG ou JPEG
  • Tamanho mínimo recomendado: 512x512px
  • Tamanho ideal: 1024x1024px ou maior
`)
  process.exit(0)
}

/**
 * Encontra o arquivo fonte do ícone
 */
function findSourceIcon() {
  const args = process.argv.slice(2)
  
  // Mostrar ajuda
  if (args.includes('--help') || args.includes('-h')) {
    showHelp()
  }
  
  // Se fornecido como argumento
  if (args.length > 0 && !args[0].startsWith('-')) {
    const providedPath = path.resolve(args[0])
    if (fs.existsSync(providedPath)) {
      return providedPath
    }
    logError(`Arquivo não encontrado: ${providedPath}`)
    process.exit(1)
  }
  
  // Procurar em locais comuns
  const possibleSources = [
    path.join(tauriIconsDir, 'icon-source.png'),
    path.join(tauriIconsDir, 'icon-source.jpg'),
    path.join(tauriIconsDir, 'icon-source.jpeg'),
    path.join(tauriIconsDir, 'icon.png'),
    path.join(rootDir, 'icon-source.png'),
    path.join(rootDir, 'icon.png'),
  ]
  
  for (const source of possibleSources) {
    if (fs.existsSync(source)) {
      logInfo(`Ícone fonte encontrado: ${source}`)
      return source
    }
  }
  
  logError('Nenhum ícone fonte encontrado!')
  logInfo('Forneça o caminho do ícone: node scripts/generate-icons.js <caminho-do-icone>')
  logInfo('Ou coloque um arquivo chamado "icon-source.png" em src-tauri/icons/')
  process.exit(1)
}

/**
 * Garante que os diretórios existem
 */
function ensureDirectories() {
  if (!fs.existsSync(tauriIconsDir)) {
    fs.mkdirSync(tauriIconsDir, { recursive: true })
    logInfo(`Diretório criado: ${tauriIconsDir}`)
  }
  
  if (!fs.existsSync(publicIconsDir)) {
    fs.mkdirSync(publicIconsDir, { recursive: true })
    logInfo(`Diretório criado: ${publicIconsDir}`)
  }
}

/**
 * Gera um ícone redimensionado
 */
async function generateIcon(inputPath, outputPath, size) {
  try {
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }, // Fundo transparente
      })
      .png()
      .toFile(outputPath)
    
    return true
  } catch (error) {
    logError(`Erro ao gerar ${outputPath}: ${error.message}`)
    return false
  }
}

/**
 * Gera ícones .ico e .icns usando png2icons
 */
async function generatePlatformIcons(icon512Path) {
  // png2icons não quer extensão no outfile
  const icoBasePath = path.join(tauriIconsDir, 'icon')
  const icnsBasePath = path.join(tauriIconsDir, 'icon')
  
  // png2icons espera o caminho sem extensão para o outfile
  const iconBasePath = path.join(tauriIconsDir, 'icon')
  
  try {
    // Gerar .ico (Windows) - formato icop (ICO com PNG)
    logInfo('Gerando icon.ico...')
    // Tentar primeiro com png2icons-cli, depois com png2icons
    try {
      execSync(`npx png2icons-cli "${icon512Path}" "${iconBasePath}" -icop -i`, { 
        stdio: 'pipe',
        cwd: rootDir 
      })
    } catch {
      // Fallback para png2icons sem -cli
      execSync(`npx png2icons "${icon512Path}" "${iconBasePath}" -icop -i`, { 
        stdio: 'pipe',
        cwd: rootDir 
      })
    }
    logSuccess('icon.ico gerado')
  } catch (error) {
    logWarning('Não foi possível gerar icon.ico (opcional)')
  }
  
  try {
    // Gerar .icns (macOS)
    logInfo('Gerando icon.icns...')
    // Tentar primeiro com png2icons-cli, depois com png2icons
    try {
      execSync(`npx png2icons-cli "${icon512Path}" "${iconBasePath}" -icns -i`, { 
        stdio: 'pipe',
        cwd: rootDir 
      })
    } catch {
      // Fallback para png2icons sem -cli
      execSync(`npx png2icons "${icon512Path}" "${iconBasePath}" -icns -i`, { 
        stdio: 'pipe',
        cwd: rootDir 
      })
    }
    logSuccess('icon.icns gerado')
  } catch (error) {
    logWarning('Não foi possível gerar icon.icns (opcional)')
  }
}

/**
 * Função principal
 */
async function main() {
  log('\n🎨 Gerador de Ícones do Aplicativo\n', 'blue')
  
  // Encontrar ícone fonte
  const sourceIcon = findSourceIcon()
  logInfo(`Usando ícone fonte: ${sourceIcon}`)
  
  // Verificar se o arquivo é válido
  try {
    const metadata = await sharp(sourceIcon).metadata()
    logInfo(`Tamanho original: ${metadata.width}x${metadata.height}px`)
    
    if (metadata.width < 512 || metadata.height < 512) {
      logWarning('Recomendado: ícone fonte deve ter pelo menos 512x512px para melhor qualidade')
    }
  } catch (error) {
    logError(`Erro ao ler ícone fonte: ${error.message}`)
    process.exit(1)
  }
  
  // Garantir diretórios
  ensureDirectories()
  
  // Gerar ícones do Tauri
  log('\n📱 Gerando ícones do Tauri...', 'cyan')
  let tauriSuccess = 0
  for (const { name, size } of tauriSizes) {
    const outputPath = path.join(tauriIconsDir, name)
    
    // Pular se o arquivo de saída for o mesmo que o de entrada
    if (path.resolve(outputPath) === path.resolve(sourceIcon)) {
      logInfo(`${name} já existe e é o arquivo fonte, pulando...`)
      tauriSuccess++
      continue
    }
    
    const success = await generateIcon(sourceIcon, outputPath, size)
    if (success) {
      logSuccess(`${name} (${size}x${size}px)`)
      tauriSuccess++
    }
  }
  
  // Gerar ícones PWA/Web
  log('\n🌐 Gerando ícones PWA/Web...', 'cyan')
  let pwaSuccess = 0
  for (const { name, size } of pwaSizes) {
    const outputPath = path.join(publicIconsDir, name)
    const success = await generateIcon(sourceIcon, outputPath, size)
    if (success) {
      logSuccess(`${name} (${size}x${size}px)`)
      pwaSuccess++
    }
  }
  
  // Gerar ícones de plataforma (.ico e .icns)
  const icon512Path = path.join(tauriIconsDir, 'icon.png')
  if (fs.existsSync(icon512Path)) {
    log('\n🖥️  Gerando ícones de plataforma...', 'cyan')
    await generatePlatformIcons(icon512Path)
  }
  
  // Resumo
  log('\n📊 Resumo:', 'blue')
  logSuccess(`Ícones Tauri gerados: ${tauriSuccess}/${tauriSizes.length}`)
  logSuccess(`Ícones PWA gerados: ${pwaSuccess}/${pwaSizes.length}`)
  
  // Verificar se icon.png foi pulado (porque é o arquivo fonte)
  const iconPngPath = path.join(tauriIconsDir, 'icon.png')
  const iconPngSkipped = path.resolve(iconPngPath) === path.resolve(sourceIcon)
  
  // Contar ícones esperados (icon.png conta se não foi pulado)
  const expectedTauriCount = iconPngSkipped ? tauriSizes.length - 1 : tauriSizes.length
  
  // Considerar sucesso se os ícones principais foram gerados
  // .ico e .icns são opcionais e não contam para o sucesso
  if (tauriSuccess >= expectedTauriCount && pwaSuccess === pwaSizes.length) {
    log('\n✨ Todos os ícones principais foram gerados com sucesso!', 'green')
    if (iconPngSkipped) {
      logInfo('Nota: icon.png já existe e foi usado como fonte.')
    }
    logInfo('Próximos passos:')
    logInfo('1. Recompile o app Tauri: pnpm tauri:build')
    logInfo('2. Para Android: pnpm tauri:android:build')
    process.exit(0)
  } else {
    logWarning('Alguns ícones não foram gerados. Verifique os erros acima.')
    process.exit(1)
  }
}

// Executar
main().catch((error) => {
  logError(`Erro fatal: ${error.message}`)
  console.error(error)
  process.exit(1)
})
