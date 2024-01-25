import Section from "../components/Section"
import { motion } from "framer-motion"

const AboutSection = (props) => {
    const { setSection } = props
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

export default AboutSection