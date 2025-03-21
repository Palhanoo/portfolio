import React, { useEffect, useRef } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';

const ScrollManager = (props) => {
    const { section, onSectionChange, lowPerformanceMode } = props
    const data = useScroll();
    const lastScroll = useRef(0)
    const isAnimating = useRef(false)
    const frameSkip = useRef(0)
    const throttleFrames = lowPerformanceMode ? 3 : 1; // Skip frames in low performance mode

    data.fill.classList.add("top-0"); //for some reason scroll dont work properly on usescroll
    data.fill.classList.add("absolute"); //for some reason scroll dont work properly on usescroll

    useEffect(() => {
        // Use a simpler animation for low performance mode
        gsap.to(data.el, {
            duration: lowPerformanceMode ? 0.8 : 1,
            scrollTop: section * data.el.clientHeight,
            ease: lowPerformanceMode ? "power1.out" : "power2.inOut",
            onStart: () => {
                isAnimating.current = true
            },
            onComplete: () => {
                isAnimating.current = false
            }
        })
    }, [section, lowPerformanceMode])

    useFrame(() => {
        // Skip frames in low performance mode to reduce computation
        if (frameSkip.current < throttleFrames) {
            frameSkip.current++;
            return;
        }
        
        frameSkip.current = 0;
        
        if (isAnimating.current) {
            lastScroll.current = data.scroll.current;
            return;
        }
        
        const curSection = Math.floor(data.scroll.current * data.pages)
        
        // Simplified section detection logic
        if (data.scroll.current > lastScroll.current && curSection === 0) {
            onSectionChange(1);
        } else if (data.scroll.current < lastScroll.current && data.scroll.current < 1 / (data.pages - 1)) {
            onSectionChange(0);
        }

        lastScroll.current = data.scroll.current;
    })

    return null
}

export default ScrollManager