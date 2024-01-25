import React from 'react'
import ProjectSection from '../pages/ProjectSection';
import AboutSection from '../pages/AboutSection';
import ContactSection from '../pages/ContactSection';
import SkillSection from '../pages/SkillSection';

const Interface = (props) => {
    const { setSection } = props
    return (
        <div className='flex flex-col items-center w-screen'>
            <AboutSection setSection={setSection} />
            <SkillSection />
            <ProjectSection />
            <ContactSection />
        </div>
    )
}


export default Interface