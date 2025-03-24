import { useProgress } from '@react-three/drei'
import React, { useEffect, useState } from 'react'
import { useLoadingProgress, initAssetPreloading } from '../utils/assetLoader'

const LoadingScreen = (props) => {
    const { started, setStarted } = props
    const { progress: dreiProgress } = useProgress()
    const { progress, lowResReady, complete } = useLoadingProgress()
    const [showOptions, setShowOptions] = useState(false)
    const [selectedMode, setSelectedMode] = useState(null)
    const [loadStage, setLoadStage] = useState('initial') // 'initial', 'low-res', 'high-res'

    // Initialize progressive asset loading
    useEffect(() => {
        // Start preloading as soon as component mounts
        const savedMode = localStorage.getItem('performanceMode');
        const isLowPerformanceMode = savedMode === 'low';
        initAssetPreloading(isLowPerformanceMode);
    }, []);

    // Show performance options when low-resolution assets are loaded
    useEffect(() => {
        if (lowResReady && loadStage === 'initial') {
            setLoadStage('low-res');
            setShowOptions(true);
        }
    }, [lowResReady, loadStage]);

    // Handle loading completion
    useEffect(() => {
        if (complete && loadStage === 'low-res') {
            setLoadStage('high-res');
        }
    }, [complete, loadStage]);

    // Handle user selection
    useEffect(() => {
        if (selectedMode !== null) {
            // Save the performance preference to localStorage
            localStorage.setItem('performanceMode', selectedMode ? 'high' : 'low')
            
            // Start the experience immediately after selection
            // We'll continue loading high-res assets in the background
            setTimeout(() => {
                setStarted(true)
            }, 500)
        }
    }, [selectedMode, setStarted])

    const handleModeSelection = (isHighPerformance) => {
        setSelectedMode(isHighPerformance)
        // Update the performance mode in the app
        if (window.setPerformanceMode) {
            window.setPerformanceMode(!isHighPerformance)
        }
    }

    // Calculate the displayed progress
    const displayProgress = loadStage === 'initial' 
        ? Math.min(progress, 40) // Cap at 40% during initial load
        : Math.min(80 + (progress / 5), 100); // Scale remaining progress

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-1000 ${started ? "pointer-events-none" : ""} flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-indigo-100
            ${started ? "opacity-0" : "opacity-100"}`}
        >
            <div className="text-4xl md:text-5xl font-bold text-indigo-900 relative mb-8">
                <div
                    style={{ width: `${displayProgress}%` }}
                    className="absolute left-0 top-0 overflow-hidden truncate text-clip transition-all duration-500 text-indigo-600">
                    Bruno Palhano
                </div>
                <div className="opacity-40">Bruno Palhano</div>
            </div>
            <div className="w-64 h-2 bg-indigo-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                    style={{ width: `${displayProgress}%` }}
                />
            </div>
            <div className="mt-2 text-indigo-500 font-medium">
                {Math.round(displayProgress)}% loaded
                {loadStage === 'initial' && <span className="block text-xs text-indigo-400">Loading essential assets</span>}
                {loadStage === 'low-res' && <span className="block text-xs text-indigo-400">Low-resolution assets loaded</span>}
                {loadStage === 'high-res' && <span className="block text-xs text-indigo-400">High-resolution assets loaded</span>}
            </div>
            
            {showOptions && !selectedMode && (
                <div className="mt-10 flex flex-col items-center">
                    <h2 className="text-xl font-bold text-indigo-800 mb-4">Select Experience Mode</h2>
                    <div className="flex flex-col md:flex-row gap-4">
                        <button
                            onClick={() => handleModeSelection(false)}
                            className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold transition-all hover:bg-indigo-700"
                        >
                            Optimized Mode
                            <div className="text-xs mt-1 font-normal">Better performance & faster loading</div>
                        </button>
                        <button
                            onClick={() => handleModeSelection(true)}
                            className="bg-indigo-100 text-indigo-800 border-2 border-indigo-600 py-3 px-6 rounded-lg font-bold transition-all hover:bg-indigo-200"
                        >
                            High Quality
                            <div className="text-xs mt-1 font-normal">Better visuals but slower loading</div>
                        </button>
                    </div>
                    {loadStage === 'low-res' && progress < 100 && (
                        <div className="mt-4 text-sm text-indigo-500">
                            Additional assets will continue loading in the background
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default LoadingScreen