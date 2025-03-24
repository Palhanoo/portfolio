import { useProgress } from '@react-three/drei'
import React, { useEffect, useState } from 'react'

const LoadingScreen = (props) => {
    const { started, setStarted } = props
    const { progress } = useProgress()
    const [showOptions, setShowOptions] = useState(false)
    const [selectedMode, setSelectedMode] = useState(null)

    useEffect(() => {
        if (progress === 100) {
            setShowOptions(true)
        }
    }, [progress])

    useEffect(() => {
        if (selectedMode !== null) {
            // Save the performance preference to localStorage
            localStorage.setItem('performanceMode', selectedMode ? 'high' : 'low')
            
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

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-1000 ${started ? "pointer-events-none" : ""} flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-indigo-100
            ${started ? "opacity-0" : "opacity-100"}`}
        >
            <div className="text-4xl md:text-5xl font-bold text-indigo-900 relative mb-8">
                <div
                    style={{ width: `${progress}%` }}
                    className="absolute left-0 top-0 overflow-hidden truncate text-clip transition-all duration-500 text-indigo-600">
                    Bruno Palhano
                </div>
                <div className="opacity-40">Bruno Palhano</div>
            </div>
            <div className="w-64 h-2 bg-indigo-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="mt-2 text-indigo-500 font-medium">
                {Math.round(progress)}% loaded
            </div>
            
            {showOptions && !selectedMode && (
                <div className="mt-10 flex flex-col items-center">
                    <h2 className="text-xl font-bold text-indigo-800 mb-4">Select Experience Mode</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleModeSelection(false)}
                            className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold transition-all hover:bg-indigo-700"
                        >
                            Optimized Mode
                            <div className="text-xs mt-1 font-normal">Better performance on all devices</div>
                        </button>
                        <button
                            onClick={() => handleModeSelection(true)}
                            className="bg-indigo-100 text-indigo-800 border-2 border-indigo-600 py-3 px-6 rounded-lg font-bold transition-all hover:bg-indigo-200"
                        >
                            High Quality
                            <div className="text-xs mt-1 font-normal">Recommended for powerful devices</div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LoadingScreen