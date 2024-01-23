import React from 'react'

const Section = (props) => {
    const { children } = props;

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
            <SkillSection />
            <Section>
                Projects
            </Section>
            <ContactSection />
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

const skills = [
    {
        title: "React",
        level: 90
    },
    {
        title: "React Native",
        level: 70
    },
    {
        title: "Node JS",
        level: 90
    },
    {
        title: "C#",
        level: 40
    },
    {
        title: "Typescript",
        level: 80
    },
    {
        title: "3D Modelling",
        level: 40
    },
]

const languages = [
    {
        title: "Portuguese",
        level: 100
    },
    {
        title: "English",
        level: 80
    },
    {
        title: "Spanish",
        level: 40
    },
    {
        title: "Japanese",
        level: 15
    }
]


const SkillSection = () => {
    return (
        <Section>
            <div>
                <h2 className="text-5xl font-bold">Skills</h2>
                <div className="mt-8 space-y-4">
                    {skills.map((skill, idx) => (
                        <div key={idx} className="w-64">
                            <h3 className="text-xl font-bold text-gray-800">{skill.title}</h3>
                            <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                                <div style={{ width: `${skill.level}%` }} className="h-full bg-indigo-500 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-5xl font-bold mt-10">Languages</h2>
                <div className="mt-8 space-y-4">
                    {languages.map((language, idx) => (
                        <div key={idx} className="w-64">
                            <h3 className="text-xl font-bold text-gray-800">{language.title}</h3>
                            <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                                <div style={{ width: `${language.level}%` }} className="h-full bg-indigo-500 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    )
}

const ContactSection = () => {
    return (
        <Section>
            <h2 className="text-5xl font-bold">Contact Me</h2>
            <div className="mt-8 p-8 rounded-md bg-white w-96 max-w-full">
                <form action="">
                    <label htmlFor="name" className="font-medium text-gray-900 block mb-1">
                        Name
                    </label>
                    <input type="text" id="name" className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3" />
                    <label for="email" className="font-medium text-gray-900 block mb-1 mt-4">
                        Email
                    </label>
                    <input type="email" id="email" className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3" />
                    <label for="message" className="font-medium text-gray-900 block mb-1 mt-4">
                        Message
                    </label>
                    <textarea id="message" className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3" rows="4" />
                    <button className="bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg mt-8">
                        Send Message
                    </button>
                </form>
            </div>
        </Section>
    )
}

export default Interface