import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CgMenuRight } from 'react-icons/cg'
import { IoClose } from 'react-icons/io5'
import { RiSettings3Line } from 'react-icons/ri'

const MenuItem = ({ title, onClick, active, index }) => {
  return (
    <motion.div
      className={`text-lg md:text-2xl font-bold relative cursor-pointer ${
        active ? 'text-indigo-600' : 'text-white'
      }`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, x: 10 }}
    >
      {title}
      {active && (
        <motion.div
          className="absolute -left-4 top-1/2 w-2 h-2 rounded-full bg-indigo-600"
          layoutId="activeIndicator"
        />
      )}
    </motion.div>
  )
}

const MenuIcon = ({ isOpen, toggleMenu }) => (
  <motion.div
    className="fixed right-5 top-5 z-30 cursor-pointer bg-indigo-600/30 backdrop-blur-md rounded-full p-3 shadow-lg"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={toggleMenu}
  >
    {isOpen ? (
      <IoClose className="text-white text-2xl" />
    ) : (
      <CgMenuRight className="text-white text-2xl" />
    )}
  </motion.div>
)

const PerformanceToggle = () => {
  const [isHighQuality, setIsHighQuality] = useState(
    localStorage.getItem('performanceMode') === 'high'
  )

  const togglePerformance = () => {
    const newMode = !isHighQuality
    setIsHighQuality(newMode)
    localStorage.setItem('performanceMode', newMode ? 'high' : 'low')
    
    // Update the global performance mode
    if (window.setPerformanceMode) {
      window.setPerformanceMode(!newMode)
    }
    
    // Alert the user about the change and need to reload
    alert(`Performance mode changed to ${newMode ? 'High Quality' : 'Optimized Mode'}. Changes will take full effect after page reload.`)
  }

  return (
    <div className="mt-8 bg-indigo-900/50 p-4 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <RiSettings3Line className="text-indigo-300" />
          <h3 className="text-white font-medium">Performance Settings</h3>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-indigo-200">
          {isHighQuality ? 'High Quality' : 'Optimized Mode'}
        </span>
        <button
          onClick={togglePerformance}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isHighQuality ? 'bg-indigo-500' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isHighQuality ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {isHighQuality 
          ? 'For powerful devices with good connection' 
          : 'Better performance on all devices'}
      </p>
    </div>
  )
}

const Menu = ({ onSectionChange, menuOpened, setMenuOpened }) => {
  const [activeSection, setActiveSection] = useState(0)

  const handleMenuItemClick = (sectionIndex) => {
    setActiveSection(sectionIndex)
    onSectionChange(sectionIndex)
    setMenuOpened(false)
  }

  const menuItems = [
    { title: 'Home', section: 0 },
    { title: 'Skills', section: 1 },
    { title: 'Projects', section: 2 },
    { title: 'Contact', section: 3 }
  ]

  return (
    <>
      <MenuIcon isOpen={menuOpened} toggleMenu={() => setMenuOpened(!menuOpened)} />
      <motion.div
        className="fixed right-0 top-0 z-20 h-screen bg-gradient-to-l from-indigo-950 to-slate-900 w-full max-w-xs p-8 pt-20 shadow-2xl"
        initial={{ x: '100%', opacity: 0 }}
        animate={{
          x: menuOpened ? 0 : '100%',
          opacity: menuOpened ? 1 : 0
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <div className="flex flex-col gap-6 mt-4">
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.title}
              title={item.title}
              active={activeSection === item.section}
              onClick={() => handleMenuItemClick(item.section)}
              index={index}
            />
          ))}
        </div>

        <PerformanceToggle />
      </motion.div>
    </>
  )
}

export default Menu