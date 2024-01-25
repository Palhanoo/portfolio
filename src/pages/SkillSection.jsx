import Section from "../components/Section"
import {motion} from 'framer-motion'
import {skills, languages} from '../constants/skills'

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

export default SkillSection