# Bruno Palhano's Portfolio

This is an interactive 3D portfolio showcasing Bruno Palhano's skills and projects.

## Features

- Interactive 3D room and avatar
- Responsive design for all devices
- Performance-optimized for different device capabilities
- Progressive asset loading for better network performance

## Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Performance Optimization

This portfolio uses various optimization techniques to ensure good performance across different devices and network conditions:

### Automatic Performance Mode

- On first load, users can choose between "Optimized Mode" or "High Quality"
- The selection is saved for future visits
- This can be changed later via the menu

### Progressive Asset Loading

The application implements progressive loading:
1. First loads low-resolution models and essential animations
2. Then loads remaining assets in the background
3. Users can start interacting before all assets are fully loaded

### Model Optimization

For the best performance on slow networks, the portfolio uses optimized 3D models:

1. Low-resolution models for slower devices
2. Draco compression for smaller file sizes
3. Texture compression for faster loading

To generate optimized models, run:

```bash
# Install optimization dependencies
npm install gltf-pipeline sharp fs-extra

# Run optimization script
npm run optimize-models
```

This will:
- Create low-resolution versions of 3D models in `public/models/low/`
- Generate compressed textures in `public/textures/low/`
- Apply Draco compression for smaller file sizes

## Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## License

This project is licensed under the MIT License.

