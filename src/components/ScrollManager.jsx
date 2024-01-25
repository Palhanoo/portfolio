import React, { useEffect, useRef } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';

const ScrollManager = (props) => {
    const { section, onSectionChange } = props
    const data = useScroll();
    const lastScroll = useRef(0)
    const isAnimating = useRef(false)

    data.fill.classList.add("top-0"); //for some reason scroll dont work properly on usescroll
    data.fill.classList.add("absolute"); //for some reason scroll dont work properly on usescroll


    useEffect(() => {
        gsap.to(data.el, {
            duration: 1,
            scrollTop: section * data.el.clientHeight,
            onStart: () => {
                isAnimating.current = true
            },
            onComplete: () => {
                isAnimating.current = false
            }
        })
    }, [section])

    useFrame(() => {
        if (isAnimating.current) {
            lastScroll.current = data.scroll.current;
            return;
        }
        const curSection = Math.floor(data.scroll.current * data.pages)
        if (data.scroll.current > lastScroll.current && curSection === 0) onSectionChange(1)
        // if (data.scroll.current > lastScroll.current && curSection === 1 && data.scroll.current > 0.35) onSectionChange(2)
        // if (data.scroll.current > lastScroll.current && curSection === 2 && data.scroll.current > 0.68) onSectionChange(3)
        if (data.scroll.current < lastScroll.current && data.scroll.current < 1 / (data.pages - 1)) onSectionChange(0)
        // if (data.scroll.current < lastScroll.current && curSection === 3) onSectionChange(2)
        // if (data.scroll.current < lastScroll.current && curSection === 2) onSectionChange(1)

        lastScroll.current = data.scroll.current;

    })

    return (
        null
        // <div>ScrollManager</div>
    )
}

export default ScrollManager