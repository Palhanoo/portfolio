import { useProgress } from '@react-three/drei'
import React, { useEffect } from 'react'

const LoadingScreen = (props) => {
    const { started, setStarted } = props
    const { progress } = useProgress()

    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {
                setStarted(true)
            }, 500)
        }
    }, [progress, setStarted])

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-1000 pointer-events-none flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-indigo-100
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
        </div>
    )
}

export default LoadingScreen