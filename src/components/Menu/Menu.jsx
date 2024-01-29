import React from 'react'
import MenuButton from './MenuButton'

const Menu = (props) => {
    const { onSectionChange, menuOpened, setMenuOpened } = props
    return (
        <>
            <button onClick={() => setMenuOpened(!menuOpened)} className="z-20 clickable fixed top-4 right-4 md:top-12 md:right-12 p-3 bg-indigo-600/80 hover:bg-indigo-600/100 transition-colors w-11 h-11 rounded-md">
                <div
                    className={`bg-white h-0.5 rounded-md w-full transition-all ${menuOpened ? "rotate-45 translate-y-0.5" : ""}`}
                />
                <div
                    className={`bg-white h-0.5 rounded-md w-full my-1 ${menuOpened ? "hidden" : ""}`}
                />
                <div
                    className={`bg-white h-0.5 rounded-md w-full transition-all ${menuOpened ? "-rotate-45" : ""}`}
                />
            </button>
            <div
                className={`z-10 fixed top-0 right-0 bottom-0 bg-white transition-all overflow-hidden flex flex-col ${menuOpened ? "w-full md:w-80" : "w-0"}`}
            >
                <div className="flex-1 flex items-start justify-center flex-col gap-6 p-8">
                    <MenuButton label="About" onClick={() => onSectionChange(0)} />
                    <MenuButton label="Skills" onClick={() => onSectionChange(1)} />
                    <MenuButton label="Projects" onClick={() => onSectionChange(2)} />
                    <MenuButton label="Contact" onClick={() => onSectionChange(3)} />
                </div>
            </div>
        </>
    )
}

export default Menu