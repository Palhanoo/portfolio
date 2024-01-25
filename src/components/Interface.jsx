import React from 'react'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai';
import { currentProjectAtom, projects } from './Projects';
import { useForm, ValidationError } from '@formspree/react';

const Section = (props) => {
    const { children, mobileTop } = props;

    return (
        <motion.section
            initial={{
                opacity: 0,
                y: 50,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                    duration: 1,
                    delay: 0.3,
                }
            }}
            className={`
            h-screen w-screen p-8 max-w-screen-2xl 
            mx-auto flex flex-col items-start 
            ${mobileTop ? "justify-start md:justify-center" : "justify-center"}
        `}>
            {children}
        </motion.section>
    )
}

const Interface = ({ setSection }) => {
    return (
        <div className='flex flex-col items-center w-screen'>

            <AboutSection setSection={setSection} />
            <SkillSection />
            <ProjectSection />
            <ContactSection />
        </div>
    )
}

const ProjectSection = () => {

    const [currentProject, setCurrentProject] = useAtom(currentProjectAtom)

    const nextProject = () => {
        setCurrentProject((currentProject + 1) % projects.length)
    }

    const PreviousProject = () => {
        setCurrentProject((currentProject - 1 + projects.length) % projects.length)
    }

    return (
        <Section>
            <div className="flex w-full h-full gap-8 items-center justify-center">
                <button onClick={PreviousProject} className="hover:text-indigo-600 transition-colors">
                    Previous
                </button>
                <h2 className="text-3xl md:text-5xl font-bold">Projects</h2>
                <button onClick={nextProject} className="hover:text-indigo-600 transition-colors">
                    Next
                </button>
            </div>
        </Section>
    )
}

const AboutSection = ({ setSection }) => {
    return (

        <Section mobileTop={true}>
            <h1 className='text-3xl md:text-5xl font-extrabold leading-snug mt-8 md:mt-0'>
                Hi, I'm
                <br />
                <span className="bg-white px-1 italic">Bruno Palhano</span>
            </h1>
            <motion.p
                initial={{
                    opacity: 0,
                    y: 25,

                }}
                whileInView={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 1,
                    delay: 1
                }}
                className="text-lg text-gray-600 mt-4">
                I make things for the web.
                <br />
                Including 3d apps
            </motion.p>
            <motion.button
                initial={{
                    opacity: 0,
                    y: 25,

                }}
                whileInView={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 1,
                    delay: 2
                }}
                onClick={() => setSection(3)}
                className={`bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg mt-4 md:mt-16`}
            >
                Contact Me
            </motion.button>
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
]


const SkillSection = () => {
    return (
        <Section>
            <motion.div className='w-full' whileInView={"visible"}>
                <h2 className="text-3xl md:text-5xl font-bold text-white">Skills</h2>
                <div className="mt-8 space-y-4">
                    {skills.map((skill, idx) => (
                        <div key={idx} className="w-full md:w-64">
                            <motion.h3
                                initial={{
                                    opacity: 0,
                                }}
                                variants={{
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            duration: 1,
                                            delay: 1 + idx * 0.2,
                                        }
                                    }
                                }}
                                className="text-lg md:text-xl font-bold text-gray-100"
                            >
                                {skill.title}
                            </motion.h3>
                            <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                                <motion.div
                                    initial={{
                                        scaleX: 0,
                                        originX: 0,
                                    }}
                                    whileInView={{
                                        scaleX: 1
                                    }}
                                    transition={{
                                        duration: 1,
                                        delay: 1 + idx * 0.2
                                    }}
                                    style={{ width: `${skill.level}%` }} className="h-full bg-indigo-500 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
            <motion.div className='w-full' whileInView={"visible"}>
                <h2 className="text-3xl md:text-5xl font-bold mt-10 text-white">Languages</h2>
                <div className="mt-8 space-y-4">
                    {languages.map((language, idx) => (
                        <div key={idx} className="w-full md:w-64">
                            <motion.h3
                                initial={{
                                    opacity: 0,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    transition: {
                                        duration: 1,
                                        delay: 1.5 + idx * 0.2,
                                    }
                                }}
                                className="text:lg md:text-xl font-bold text-gray-100">
                                {language.title}
                            </motion.h3>
                            <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                                <motion.div
                                    initial={{
                                        scaleX: 0,
                                        originX: 0,
                                    }}
                                    whileInView={{
                                        scaleX: 1
                                    }}
                                    transition={{
                                        duration: 1,
                                        delay: 1.5 + idx * 0.2
                                    }} style={{ width: `${language.level}%` }} className="h-full bg-indigo-500 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </Section>
    )
}

const ContactSection = () => {
    const [state, handleSubmit] = useForm("xayrqbar");

    return (
        <Section>
            <h2 className="text-3xl md:text-5xl font-bold">Contact Me</h2>
            <div className="mt-8 p-8 rounded-md bg-white bg-opacity-50 w-96 max-w-full">
                {state.succeeded ? (
                    <p className="text-gray-900 text-center">Thanks for your message !</p>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                    >
                        <label htmlFor="name" className="font-medium text-gray-900 block mb-1">
                            Name
                        </label>
                        <input type="text" id="name" name="name" className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3" />
                        <label htmlFor="email" className="font-medium text-gray-900 block mb-1 mt-4">
                            Email
                        </label>
                        <input type="email" name="email" id="email" className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3" />
                        <ValidationError
                            className='mt-1 text-red-500'
                            prefix="Email"
                            field="email"
                            errors={state.errors}
                        />
                        <label htmlFor="message" className="font-medium text-gray-900 block mb-1 mt-4">
                            Message
                        </label>
                        <textarea name="message" id="message" className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3" rows="4" />
                        <ValidationError
                            className='mt-1 text-red-500'
                            errors={state.errors}
                        />
                        <button disabled={state.submitting} className="bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg mt-8">
                            Send Message
                        </button>
                    </form>
                )}

            </div>
        </Section>
    )
}

export default Interface