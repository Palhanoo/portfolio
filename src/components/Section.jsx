import { motion } from 'framer-motion'
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

export default Section