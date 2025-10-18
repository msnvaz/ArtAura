#!/usr/bin/env node

/**
 * Development Image Sync Script
 * Copies images from server/uploads to client/public/uploads for team development
 * 
 * Usage:
 *   node sync-dev-images.js
 *   npm run sync-images
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (ES module equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  serverUploadsPath: path.join(__dirname, '..', 'server', 'uploads'),
  clientPublicPath: path.join(__dirname, 'public', 'uploads'),
  // Add specific subdirectories to sync
  subdirectories: ['profiles', 'artworks', 'covers', 'posts'],
  // File extensions to copy
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

/**
 * Create directory if it doesn't exist
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

/**
 * Copy file from source to destination
 */
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`📁 Copied: ${path.basename(src)}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to copy ${src}: ${error.message}`);
    return false;
  }
}

/**
 * Check if file extension is allowed
 */
function isAllowedFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return config.allowedExtensions.includes(ext);
}

/**
 * Sync images from server to client public folder
 */
function syncImages() {
  console.log('🚀 Starting development image sync...\n');

  // Ensure client upload directory exists
  ensureDirectoryExists(config.clientPublicPath);

  // Check if server uploads directory exists
  if (!fs.existsSync(config.serverUploadsPath)) {
    console.log(`⚠️  Server uploads directory not found: ${config.serverUploadsPath}`);
    console.log('📝 Make sure your backend server has uploaded some images first.\n');
    return;
  }

  let totalCopied = 0;
  let totalSkipped = 0;

  // Sync each subdirectory
  config.subdirectories.forEach(subdir => {
    const serverSubPath = path.join(config.serverUploadsPath, subdir);
    const clientSubPath = path.join(config.clientPublicPath, subdir);

    console.log(`📂 Processing ${subdir}/...`);

    // Ensure subdirectory exists in client
    ensureDirectoryExists(clientSubPath);

    // Check if server subdirectory exists
    if (!fs.existsSync(serverSubPath)) {
      console.log(`   ⚠️  Server subdirectory not found: ${subdir}/`);
      return;
    }

    // Read files from server subdirectory
    const files = fs.readdirSync(serverSubPath);
    const imageFiles = files.filter(isAllowedFile);

    if (imageFiles.length === 0) {
      console.log(`   📭 No images found in ${subdir}/`);
      return;
    }

    // Copy each image file
    imageFiles.forEach(filename => {
      const srcPath = path.join(serverSubPath, filename);
      const destPath = path.join(clientSubPath, filename);

      // Skip if destination already exists (optional - remove this check to always overwrite)
      if (fs.existsSync(destPath)) {
        console.log(`   ⏭️  Skipped (exists): ${filename}`);
        totalSkipped++;
        return;
      }

      // Copy the file
      const success = copyFile(srcPath, destPath);
      if (success) {
        totalCopied++;
      }
    });

    console.log('');
  });

  // Also sync root level files
  console.log('📂 Processing root level files...');
  const rootFiles = fs.readdirSync(config.serverUploadsPath);
  const rootImageFiles = rootFiles.filter(file => {
    const filePath = path.join(config.serverUploadsPath, file);
    return fs.statSync(filePath).isFile() && isAllowedFile(file);
  });

  rootImageFiles.forEach(filename => {
    const srcPath = path.join(config.serverUploadsPath, filename);
    const destPath = path.join(config.clientPublicPath, filename);

    if (fs.existsSync(destPath)) {
      console.log(`   ⏭️  Skipped (exists): ${filename}`);
      totalSkipped++;
      return;
    }

    const success = copyFile(srcPath, destPath);
    if (success) {
      totalCopied++;
    }
  });

  // Summary
  console.log('\n🎉 Sync completed!');
  console.log(`📊 Files copied: ${totalCopied}`);
  console.log(`⏭️  Files skipped: ${totalSkipped}`);

  if (totalCopied > 0) {
    console.log('\n✅ Images are now available at:');
    console.log(`   Frontend: http://localhost:5173/uploads/`);
    console.log(`   Files: ${config.clientPublicPath}`);
  }

  console.log('\n📝 Note: These images are for development only.');
  console.log('💡 Add client/public/uploads/* to .gitignore for production.');
}

/**
 * Clean client uploads directory
 */
function cleanImages() {
  console.log('🧹 Cleaning client uploads directory...');

  if (fs.existsSync(config.clientPublicPath)) {
    fs.rmSync(config.clientPublicPath, { recursive: true, force: true });
    console.log('✅ Cleaned successfully');
  } else {
    console.log('📭 Directory already clean');
  }
}

// CLI handling
const command = process.argv[2];

switch (command) {
  case 'clean':
    cleanImages();
    break;
  case 'sync':
  default:
    syncImages();
    break;
}

export { syncImages, cleanImages };
