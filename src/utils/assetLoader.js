import { useEffect, useState } from 'react';
import { useGLTF, useFBX } from '@react-three/drei';
import { suspend } from 'suspend-react';

// Tracks loading states of all models
const loadingState = {
  models: {},
  animations: {},
  textures: {},
  isLoadingComplete: false,
  lowResAssetsLoaded: false,
  highResAssetsLoaded: false,
  loadProgress: 0,
};

// A registry of assets with their low and high quality versions
const assetRegistry = {
  models: {
    // Avatar model
    avatar: {
      lowRes: './models/low/me_low.glb',
      highRes: './models/me.glb',
      priority: 1, // High priority
    },
    // Room model
    room: {
      lowRes: './models/low/Room_low.glb',
      highRes: './models/Room.glb',
      priority: 2, // Medium priority
    },
  },
  animations: {
    typing: {
      path: './animations/TypingSmall.fbx',
      priority: 1,
    },
    standing: {
      path: './animations/Standing.fbx',
      priority: 1,
    },
    landing: {
      path: './animations/Landing.fbx',
      priority: 2,
    },
    falling: {
      path: './animations/Falling.fbx',
      priority: 3,
    },
    dancing: {
      path: './animations/Dancing.fbx',
      priority: 3,
    },
    thumbsUp: {
      path: './animations/ThumbsUp.fbx',
      priority: 2,
    },
  },
  textures: {
    roomBaked: {
      path: './textures/RoomBaked.jpg',
      priority: 1,
    },
  },
};

// Calculate total assets for tracking progress
const calculateTotalAssets = () => {
  let count = 0;
  // Count models (both low and high res)
  count += Object.keys(assetRegistry.models).length * 2;
  // Count animations
  count += Object.keys(assetRegistry.animations).length;
  // Count textures
  count += Object.keys(assetRegistry.textures).length;
  return count;
};

const totalAssets = calculateTotalAssets();
let loadedAssets = 0;

// Update progress tracker
const updateLoadProgress = () => {
  loadedAssets++;
  loadingState.loadProgress = Math.min(100, Math.round((loadedAssets / totalAssets) * 100));
  
  // Check if essential low-res assets are loaded
  const lowResModelsLoaded = Object.keys(assetRegistry.models)
    .filter(key => assetRegistry.models[key].priority <= 2)
    .every(key => loadingState.models[key]?.lowResLoaded);
  
  const essentialAnimationsLoaded = Object.keys(assetRegistry.animations)
    .filter(key => assetRegistry.animations[key].priority <= 2)
    .every(key => loadingState.animations[key]?.loaded);
    
  loadingState.lowResAssetsLoaded = lowResModelsLoaded && essentialAnimationsLoaded;
  
  // Check if all assets are loaded
  const allModelsLoaded = Object.keys(assetRegistry.models)
    .every(key => loadingState.models[key]?.highResLoaded);
    
  const allAnimationsLoaded = Object.keys(assetRegistry.animations)
    .every(key => loadingState.animations[key]?.loaded);
    
  const allTexturesLoaded = Object.keys(assetRegistry.textures)
    .every(key => loadingState.textures[key]?.loaded);
    
  loadingState.highResAssetsLoaded = allModelsLoaded && allAnimationsLoaded && allTexturesLoaded;
  loadingState.isLoadingComplete = loadingState.highResAssetsLoaded;
};

// Preload all assets in the registry
export const preloadAllAssets = (lowPerformanceMode = false) => {
  // Load models - always load low-res for initial display
  Object.keys(assetRegistry.models).forEach(key => {
    const model = assetRegistry.models[key];
    
    // Initialize model tracking state
    if (!loadingState.models[key]) {
      loadingState.models[key] = { 
        lowResLoaded: false, 
        highResLoaded: false,
        data: null
      };
    }
    
    // Always load low-res version
    useGLTF.preload(model.lowRes, (gltf) => {
      loadingState.models[key].lowResLoaded = true;
      loadingState.models[key].lowResData = gltf;
      updateLoadProgress();
      
      // If in low performance mode, mark high-res as "loaded" too since we won't use it
      if (lowPerformanceMode && model.priority > 1) {
        loadingState.models[key].highResLoaded = true;
        updateLoadProgress();
      }
    });
    
    // In high performance mode or for high priority models, also load high-res version
    if (!lowPerformanceMode || model.priority === 1) {
      useGLTF.preload(model.highRes, (gltf) => {
        loadingState.models[key].highResLoaded = true;
        loadingState.models[key].highResData = gltf;
        updateLoadProgress();
      });
    }
  });
  
  // Load animations
  Object.keys(assetRegistry.animations).forEach(key => {
    const animation = assetRegistry.animations[key];
    
    // Skip low-priority animations in low performance mode
    if (lowPerformanceMode && animation.priority > 2) {
      loadingState.animations[key] = { loaded: true };
      updateLoadProgress();
      return;
    }
    
    // Initialize animation tracking state
    if (!loadingState.animations[key]) {
      loadingState.animations[key] = { loaded: false };
    }
    
    useFBX.preload(animation.path, (fbx) => {
      loadingState.animations[key].loaded = true;
      loadingState.animations[key].data = fbx;
      updateLoadProgress();
    });
  });
  
  // Load textures
  Object.keys(assetRegistry.textures).forEach(key => {
    const texture = assetRegistry.textures[key];
    
    // Initialize texture tracking state
    if (!loadingState.textures[key]) {
      loadingState.textures[key] = { loaded: false };
    }
    
    // Create an image to track loading
    const img = new Image();
    img.onload = () => {
      loadingState.textures[key].loaded = true;
      updateLoadProgress();
    };
    img.src = texture.path;
  });
};

// Custom hook to get current loading progress
export const useLoadingProgress = () => {
  const [progress, setProgress] = useState(loadingState.loadProgress);
  const [lowResReady, setLowResReady] = useState(loadingState.lowResAssetsLoaded);
  const [complete, setComplete] = useState(loadingState.isLoadingComplete);
  
  useEffect(() => {
    // Check progress every 100ms
    const interval = setInterval(() => {
      setProgress(loadingState.loadProgress);
      setLowResReady(loadingState.lowResAssetsLoaded);
      setComplete(loadingState.isLoadingComplete);
      
      if (loadingState.isLoadingComplete) {
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return { 
    progress, 
    lowResReady, 
    complete,
    highResReady: loadingState.highResAssetsLoaded
  };
};

// Hook to use the right model based on performance mode
export const useOptimizedModel = (modelKey, preferHighRes = false) => {
  const [model, setModel] = useState(null);
  const lowPerformanceMode = !preferHighRes && localStorage.getItem('performanceMode') === 'low';
  
  useEffect(() => {
    if (!assetRegistry.models[modelKey]) {
      console.error(`Model ${modelKey} not found in registry`);
      return;
    }
    
    const checkAndLoadModel = () => {
      const modelState = loadingState.models[modelKey];
      
      // First time or low performance mode: use low-res model
      if (modelState?.lowResLoaded && (lowPerformanceMode || !modelState.highResLoaded)) {
        setModel(modelState.lowResData);
      } 
      // High-res model available and preferred
      else if (modelState?.highResLoaded && !lowPerformanceMode) {
        setModel(modelState.highResData);
      }
    };
    
    // Initial check
    checkAndLoadModel();
    
    // Set up interval to check for model loading
    const interval = setInterval(() => {
      checkAndLoadModel();
      
      // Stop checking if we have loaded appropriate model
      if ((lowPerformanceMode && loadingState.models[modelKey]?.lowResLoaded) || 
          (!lowPerformanceMode && loadingState.models[modelKey]?.highResLoaded)) {
        clearInterval(interval);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [modelKey, lowPerformanceMode]);
  
  return model;
};

// Initialize preloading
export const initAssetPreloading = (lowPerformanceMode = false) => {
  // Start preloading assets
  setTimeout(() => {
    preloadAllAssets(lowPerformanceMode);
  }, 100); // Short delay to let the page render first
}; 