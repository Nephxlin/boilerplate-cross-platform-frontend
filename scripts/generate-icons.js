const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconSource = path.join(__dirname, '../src-tauri/icons/icon.png');
const iconsDir = path.join(__dirname, '../public/icons');

// Criar diretório se não existir
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generateIcons() {
  try {
    // Gerar ícone 192x192
    await sharp(iconSource)
      .resize(192, 192)
      .toFile(path.join(iconsDir, 'icon-192x192.png'));

    // Gerar ícone 512x512
    await sharp(iconSource)
      .resize(512, 512)
      .toFile(path.join(iconsDir, 'icon-512x512.png'));

    console.log('✅ Ícones gerados com sucesso!');
    console.log('  - icon-192x192.png');
    console.log('  - icon-512x512.png');
  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error.message);
    process.exit(1);
  }
}

generateIcons();
