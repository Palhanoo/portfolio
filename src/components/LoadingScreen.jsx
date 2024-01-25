import { useProgress } from '@react-three/drei'
import React, { useEffect } from 'react'

const LoadingScreen = (props) => {
    const { started, setStarted } = props
    const { progress, total, loaded, item } = useProgress()

    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {
                setStarted(true)
            }, 300)
        }
    }, [progress, total, loaded, item])

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-1000 pointer-events-none flex items-center justify-center bg-indigo-50 
            ${started ? "opacity-0" : "opacity-100"}`}
        >
            <div className="text-4xl md:text-xl font-bold text-indig-900 relative">
                <div
                    style={{ width: `${progress}%` }}
                    className="absolute left-0 top-0 overflow-hidden truncate text-clip transition-all duration-500">
                    Bruno Palhano
                </div>
                <div className="opacity-40">Bruno Palhano</div>
            </div>
        </div>
    )
}

export default LoadingScreen