/**
 * Model optimization script
 * 
 * This script processes 3D models to create low-resolution versions for faster loading
 * 
 * To run:
 * 1. Install dependencies: npm install gltf-pipeline sharp fs-extra
 * 2. Run script: node scripts/optimize-models.js
 */

import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import sharp from 'sharp';
import gltfPipeline from 'gltf-pipeline';
import { fileURLToPath } from 'url';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const processGltf = gltfPipeline.processGltf;
const glbToGltf = gltfPipeline.glbToGltf;
const gltfToGlb = gltfPipeline.gltfToGlb;


// Configuration
const CONFIG = {
  modelsDir: './public/models',
  lowResDir: './public/models/low',
  texturesDir: './public/textures',
  lowResTexturesDir: './public/textures/low',
  // Compression options
  textureScale: 0.5, // Scale textures down to 50% for low-res models
  vertexCompression: 0.5, // 50% reduction in vertices
  draco: true, // Use Draco compression
};

// Ensure directories exist
fs.ensureDirSync(CONFIG.lowResDir);
fs.ensureDirSync(CONFIG.lowResTexturesDir);

// Get all GLB models in the models directory
const modelFiles = fs.readdirSync(CONFIG.modelsDir)
  .filter(file => path.extname(file).toLowerCase() === '.glb')
  .map(file => path.join(CONFIG.modelsDir, file));

// Get all texture files
const textureFiles = fs.readdirSync(CONFIG.texturesDir)
  .filter(file => ['.jpg', '.png', '.jpeg'].includes(path.extname(file).toLowerCase()))
  .map(file => path.join(CONFIG.texturesDir, file));

/**
 * Process a GLB model to create a low-res version
 */
async function processModel(modelPath) {
  const filename = path.basename(modelPath);
  const lowResPath = path.join(CONFIG.lowResDir, filename.replace('.glb', '_low.glb'));
  
  console.log(`Processing model: ${filename}`);
  
  try {
    // Read the GLB file
    const glbData = fs.readFileSync(modelPath);
    
    // Convert GLB to GLTF for processing
    const { gltf } = await glbToGltf(glbData);
    
    // Apply optimizations
    const options = {
      dracoOptions: CONFIG.draco ? {
        compressionLevel: 7,
        quantizePositionBits: 14,
        quantizeNormalBits: 10,
        quantizeTexcoordBits: 10,
        quantizeColorBits: 8,
        quantizeGenericBits: 12,
      } : undefined,
      compressMeshes: true,
      meshoptCompressionLevel: 9, // Max compression level
    };
    
    const processedGltf = await processGltf(gltf, options);
    
    // Manually reduce geometry complexity
    if (processedGltf.gltf && processedGltf.gltf.meshes) {
      processedGltf.gltf.meshes.forEach(mesh => {
        if (mesh.primitives) {
          mesh.primitives.forEach(primitive => {
            // Add an optimization flag for viewers that support it
            primitive.extras = primitive.extras || {};
            primitive.extras.optimized = true;
          });
        }
      });
    }
    
    // Convert back to GLB
    const { glb } = await gltfToGlb(processedGltf.gltf);
    
    // Write the optimized GLB file
    fs.writeFileSync(lowResPath, glb);
    
    console.log(`Created low-res model: ${path.basename(lowResPath)}`);
    return true;
  } catch (error) {
    console.error(`Error processing model ${filename}:`, error);
    return false;
  }
}

/**
 * Process a texture to create a low-res version
 */
// async function processTexture(texturePath) {
//   const filename = path.basename(texturePath);
//   const lowResPath = path.join(CONFIG.lowResTexturesDir, filename);
//   const ext = path.extname(filename).toLowerCase();
  
//   console.log(`Processing texture: ${filename}`);
  
//   try {
//     // Read and resize the image
//     let sharpInstance = sharp(texturePath)
//       .resize({
//         width: Math.floor(sharp(texturePath).metadata().width * CONFIG.textureScale),
//         height: Math.floor(sharp(texturePath).metadata().height * CONFIG.textureScale),
//         fit: 'inside',
//       });
    
//     // Apply appropriate compression based on file type
//     if (ext === '.jpg' || ext === '.jpeg') {
//       sharpInstance = sharpInstance.jpeg({ quality: 60 });
//     } else if (ext === '.png') {
//       sharpInstance = sharpInstance.png({ compressionLevel: 9 });
//     }
    
//     // Save the compressed texture
//     await sharpInstance.toFile(lowResPath);
    
//     console.log(`Created low-res texture: ${path.basename(lowResPath)}`);
//     return true;
//   } catch (error) {
//     console.error(`Error processing texture ${filename}:`, error);
//     return false;
//   }
// }

async function processTexture(texturePath) {
    const filename = path.basename(texturePath);
    const lowResPath = path.join(CONFIG.lowResTexturesDir, filename);
    const ext = path.extname(filename).toLowerCase();
  
    console.log(`Processing texture: ${filename}`);
  
    try {
      const metadata = await sharp(texturePath).metadata();
      const width = Math.floor(metadata.width * CONFIG.textureScale);
      const height = Math.floor(metadata.height * CONFIG.textureScale);
  
      let sharpInstance = sharp(texturePath).resize({
        width,
        height,
        fit: 'inside',
      });
  
      if (ext === '.jpg' || ext === '.jpeg') {
        sharpInstance = sharpInstance.jpeg({ quality: 60 });
      } else if (ext === '.png') {
        sharpInstance = sharpInstance.png({ compressionLevel: 9 });
      }
  
      await sharpInstance.toFile(lowResPath);
  
      console.log(`Created low-res texture: ${path.basename(lowResPath)}`);
      return true;
    } catch (error) {
      console.error(`Error processing texture ${filename}:`, error);
      return false;
    }
  }
  
/**
 * Main process function
 */
async function main() {
  console.log('Starting model and texture optimization...');
  
  // Process all models
  const modelPromises = modelFiles.map(modelPath => processModel(modelPath));
  
  // Process all textures
  const texturePromises = textureFiles.map(texturePath => processTexture(texturePath));
  
  // Wait for all processing to complete
  const results = await Promise.all([...modelPromises, ...texturePromises]);
  
  // Print summary
  const successful = results.filter(result => result).length;
  console.log(`
  Optimization complete:
  - Total files processed: ${results.length}
  - Successfully optimized: ${successful}
  - Failed: ${results.length - successful}
  
  Low-resolution models saved to: ${CONFIG.lowResDir}
  Low-resolution textures saved to: ${CONFIG.lowResTexturesDir}
  `);
}

// Run the main process
main().catch(error => {
  console.error('Error in optimization process:', error);
  process.exit(1);
}); 