import Section from "../components/Section"
import { motion } from "framer-motion"
import RotatingTitles from "../components/RotatingTitles"

const AboutSection = (props) => {
    const { setSection } = props

    const nameLetters = "Bruno Palhano".split("");
    
    return (
        <Section mobileTop={true}>
            <div className="relative">
                <motion.h1 
                    className='text-3xl md:text-6xl font-extrabold leading-snug mt-8 md:mt-0'
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Hi, I'm
                    <br />
                    <div className="flex mt-2 flex-wrap">
                        {nameLetters.map((letter, index) => (
                            letter === " " ? (
                                <span key={index} className="w-2 md:w-4"></span>
                            ) : (
                                <motion.span
                                    key={index}
                                    className="text-indigo-600 inline-block px-1"
                                    initial={{ y: 50, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ 
                                        duration: 0.5, 
                                        delay: 0.5 + index * 0.06,
                                        type: "spring",
                                        stiffness: 150
                                    }}
                                    whileHover={{ 
                                        y: -10, 
                                        color: "#4338ca",
                                        transition: { duration: 0.2 } 
                                    }}
                                >
                                    {letter}
                                </motion.span>
                            )
                        ))}
                    </div>
                </motion.h1>
                <motion.div
                    className="absolute -z-10 w-20 h-20 md:w-32 md:h-32 rounded-full bg-indigo-200/50 blur-xl"
                    style={{ top: "40%", left: "30%" }}
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            </div>
            <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
            >
                <p className="text-lg md:text-xl text-gray-600 mt-4 font-medium">
                    I'm a <RotatingTitles />
                    <br />
                    <span className="text-indigo-600">
                        Exploring cybersecurity through a Master's program
                    </span>
                </p>
                <p className="text-base text-gray-500 mt-2 max-w-lg">
                    I create dynamic experiences across web, mobile, and cloud platforms.
                    From RESTful APIs to complex frontends, I'm passionate about 
                    building elegant solutions and exploring emerging technologies like AI
                    and RAG systems.
                </p>
                <motion.div
                    className="absolute -z-10 w-16 h-16 rounded-full bg-indigo-100/70 blur-lg"
                    style={{ top: "0%", right: "20%" }}
                    animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            </motion.div>
            <div className="flex gap-4 mt-8">
                <motion.button
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 2 }}
                    whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 20px -10px rgba(79, 70, 229, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSection(3)}
                    className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold text-lg clickable shadow-md transition-all"
                >
                    Contact Me
                </motion.button>
                <motion.button
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 2.1 }}
                    whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 20px -10px rgba(79, 70, 229, 0.2)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSection(1)}
                    className="border-2 border-indigo-600 text-indigo-600 py-3 px-6 rounded-lg font-bold text-lg transition-all hover:bg-indigo-50"
                >
                    My Skills
                </motion.button>
            </div>
        </Section>
    )
}

export default AboutSection