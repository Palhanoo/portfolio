import { ValidationError, useForm } from "@formspree/react";
import Section from "../components/Section";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const EmailSubmitted = atom(false)

const SocialLink = ({ icon, label, url }) => (
    <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-white/30 backdrop-blur-sm p-3 rounded-lg hover:bg-indigo-100/50 transition-colors"
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.98 }}
    >
        <div className="text-indigo-600 text-xl">{icon}</div>
        <span className="text-gray-800 font-medium">{label}</span>
    </motion.a>
);

// Animated particle component
const Particle = ({ delay = 0 }) => {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const size = Math.random() * 10 + 3;
    const duration = Math.random() * 15 + 10;
    
    return (
        <motion.div
            className="absolute rounded-full bg-indigo-200 opacity-50"
            style={{ 
                left: `${randomX}%`, 
                top: `${randomY}%`,
                width: size,
                height: size
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
                scale: [0, 1, 0.8, 1.2, 0],
                opacity: [0, 0.7, 0.5, 0.2, 0],
                y: [0, -30, -60, -100]
            }}
            transition={{ 
                duration: duration,
                delay: delay,
                repeat: Infinity,
                repeatDelay: Math.random() * 5
            }}
        />
    );
};

const ContactSection = () => {
    const [state, handleSubmit] = useForm("xayrqbar");
    const [emailSubmitted, setEmailSubmitted] = useAtom(EmailSubmitted);
    const [particles, setParticles] = useState([]);
    
    useEffect(() => {
        // Create particles on mount
        const particleCount = 15;
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            delay: i * 0.4
        }));
        setParticles(newParticles);
    }, []);
    
    useEffect(() => {
        if (state.succeeded) {
            setEmailSubmitted(true)
        }
        setTimeout(() => {
            setEmailSubmitted(false)
        }, 200)
    }, [state.succeeded])

    const inputVariants = {
        focus: { scale: 1.02, boxShadow: "0 4px 20px -12px rgba(79, 70, 229, 0.5)" },
        blur: { scale: 1, boxShadow: "none" }
    }

    return (
        <Section>
            {/* Background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle) => (
                    <Particle key={particle.id} delay={particle.delay} />
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
                <div className="md:order-1 order-2">
                    <motion.div 
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white">Get In Touch</h2>
                        <p className="text-gray-300 mt-4 max-w-md">
                            Feel free to reach out for collaborations, project inquiries, 
                            or just to say hello! I'm always open to discussing new projects 
                            and opportunities.
                        </p>
                        <motion.div
                            className="absolute -z-10 w-32 h-32 rounded-full bg-indigo-500/30 blur-xl"
                            style={{ top: "-20%", right: "-10%" }}
                            animate={{ 
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 0.7, 0.5],
                            }}
                            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                        />
                    </motion.div>
                    
                    <motion.div 
                        className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <SocialLink 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>} 
                            label="GitHub" 
                            url="https://github.com/Palhanoo" 
                        />
                        <SocialLink 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>} 
                            label="LinkedIn" 
                            url="https://linkedin.com/in/bruno-palhano-30911a1b6/" 
                        />
                        <SocialLink 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                            </svg>} 
                            label="YouTube" 
                            url="https://youtube.com/@PalhanooDev" 
                        />
                        {/* <SocialLink 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                            </svg>} 
                            label="Twitter" 
                            url="https://twitter.com/yourusername" 
                        /> */}
                    </motion.div>
                </div>
            
                <div className="md:order-2 order-1">
                    <motion.div 
                        className="p-8 rounded-xl bg-white bg-opacity-80 backdrop-blur-sm border border-indigo-50 w-full shadow-lg"
                        initial={{ opacity: 0, y: 40, rotateY: 10 }}
                        whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        {state.succeeded ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center justify-center py-10"
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                                <p className="text-gray-600 text-center mb-6">Thanks for reaching out. I'll get back to you soon.</p>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="clickable bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium transition-all hover:bg-indigo-700"
                                >
                                    Send Another Message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="font-medium text-gray-900 block mb-2">
                                        Name
                                    </label>
                                    <motion.input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        variants={inputVariants}
                                        whileFocus="focus"
                                        whileTap="focus"
                                        className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3 transition-all" 
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="email" className="font-medium text-gray-900 block mb-2">
                                        Email
                                    </label>
                                    <motion.input 
                                        type="email" 
                                        name="email" 
                                        id="email" 
                                        variants={inputVariants}
                                        whileFocus="focus"
                                        whileTap="focus"
                                        className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3 transition-all" 
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                    <ValidationError
                                        className='mt-1 text-red-500 text-sm'
                                        prefix="Email"
                                        field="email"
                                        errors={state.errors}
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="message" className="font-medium text-gray-900 block mb-2">
                                        Message
                                    </label>
                                    <motion.textarea 
                                        name="message" 
                                        id="message" 
                                        variants={inputVariants}
                                        whileFocus="focus"
                                        whileTap="focus"
                                        className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3 transition-all" 
                                        rows="4"
                                        placeholder="Your message here..."
                                        required
                                    />
                                    <ValidationError
                                        className='mt-1 text-red-500 text-sm'
                                        errors={state.errors}
                                    />
                                </div>
                                
                                <motion.button 
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    disabled={state.submitting} 
                                    className="clickable w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-semibold text-lg mt-4 shadow-md transition-colors flex justify-center items-center"
                                >
                                    {state.submitting ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </div>
                                    ) : "Send Message"}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </Section>
    )
}

export default ContactSection