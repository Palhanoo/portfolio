import React from 'react'
import MenuButton from './MenuButton'
import { motion } from 'framer-motion'

const Menu = (props) => {
    const { onSectionChange, menuOpened, setMenuOpened } = props

    const menuVariants = {
        open: { width: "40%", transition: { duration: 0.5, ease: "easeInOut" } },
        closed: { width: 0, transition: { duration: 0.5, ease: "easeInOut" } }
    }

    return (
        <>
            <motion.button 
                onClick={() => setMenuOpened(!menuOpened)}
                className="z-20 fixed top-4 right-4 md:top-12 md:right-12 p-3 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-md w-11 h-11 shadow-lg clickable"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div
                    className={`bg-white h-0.5 rounded-md w-full transition-all ${menuOpened ? "rotate-45 translate-y-0.5" : ""}`}
                />
                <div
                    className={`bg-white h-0.5 rounded-md w-full my-1 transition-all ${menuOpened ? "opacity-0" : "opacity-100"}`}
                />
                <div
                    className={`bg-white h-0.5 rounded-md w-full transition-all ${menuOpened ? "-rotate-45" : ""}`}
                />
            </motion.button>
            <motion.div
                className="z-10 fixed top-0 right-0 bottom-0 bg-gradient-to-b from-white to-indigo-50 overflow-hidden flex flex-col"
                initial="closed"
                animate={menuOpened ? "open" : "closed"}
                variants={menuVariants}
            >
                <div className="relative flex-1 flex items-start justify-center flex-col gap-6 p-8 md:p-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: menuOpened ? 1 : 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="absolute top-4 left-8 md:top-8 md:left-16 text-xl font-bold text-indigo-900"
                    >
                        Menu
                    </motion.div>
                    <div className="mt-16">
                        <MenuButton label="About" onClick={() => onSectionChange(0)} />
                        <MenuButton label="Skills" onClick={() => onSectionChange(1)} />
                        <MenuButton label="Projects" onClick={() => onSectionChange(2)} />
                        <MenuButton label="Contact" onClick={() => onSectionChange(3)} />
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: menuOpened ? 1 : 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="mt-auto text-gray-500 text-sm"
                    >
                        &copy; {new Date().getFullYear()} Bruno Palhano
                    </motion.div>
                </div>
            </motion.div>
        </>
    )
}

export default Menu