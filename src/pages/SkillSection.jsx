import Section from "../components/Section"
import { motion } from 'framer-motion'
import { skills, languages } from '../constants/skills'

const Title = ({ children }) => (
    <h2 className={`${children === "Languages" ? "pt-8" : ""} text-3xl md:text-5xl font-bold text-white`}>{children}</h2>
)

const SkillData = ({ habilities, title }) => {

    const delay = title === "Skills" ? 1 : 1.6

    return (
        <motion.div className='w-full' whileInView={"visible"}>
            <Title>{title}</Title>
            <div className="mt-8 space-y-4">
                {habilities.map((hability, idx) => (
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
                                        delay: delay + idx * 0.2,
                                    }
                                }
                            }}
                            className="text-lg md:text-xl font-bold text-gray-100"
                        >
                            {hability.title}
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
                                    delay: delay + idx * 0.2
                                }}
                                style={{ width: `${hability.level}%` }} className="h-full bg-indigo-500 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>

    )
}

const SkillSection = () => {
    return (
        <Section>
            <SkillData title="Skills" habilities={skills} />
            <SkillData title="Languages" habilities={languages} />
        </Section>
    )
}

export default SkillSection