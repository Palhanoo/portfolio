import React from 'react'

const Section = (props) => {
    const { children } = props;
    console.log(children)

    return (
        <section className={`
            h-screen w-screen p-8 max-w-screen-2xl 
            mx-auto flex flex-col items-start 
            justify-center
        `}>
            {children}
        </section>
    )
}

const Interface = () => {
    return (
        <div className='flex flex-col items-center w-screen'>

            <AboutSection />
            <Section>
                Skills
            </Section>
            <Section>
                Projects
            </Section>
            <Section>
                Contact
            </Section>
        </div>
    )
}

const AboutSection = () => {
    return (

        <Section>
            <h1 className='text-6xl font-extrabold leading-snug'>
                Hi, I'm
                <br />
                <span className="bg-white px-1 italic">Bruno Palhano</span>
            </h1>
            <p className="text-lg text-gray-600 mt-4">
                I make things for the web.
                <br />
                Including 3d apps
            </p>
            <button
                className={`bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg mt-16`}
            >
                Contact Me
            </button>
        </Section>
    )
}

export default Interface