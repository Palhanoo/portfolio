import Section from "../components/Section"
import { motion } from 'framer-motion'
import { skills, languages, advancedSkills } from '../constants/skills'
import { useRef } from "react"

const SkillCard = ({ skill, index, category }) => {
    const cardRef = useRef(null)
    
    // Different colors for different skill categories
    const getGradient = () => {
        if (category === "Skills") {
            return {
                from: "from-violet-500",
                to: "to-indigo-600",
                bgHover: "group-hover:bg-indigo-500"
            }
        } else if (category === "Advanced") {
            return {
                from: "from-blue-500",
                to: "to-purple-600",
                bgHover: "group-hover:bg-blue-500"
            }
        } else {
            return {
                from: "from-teal-400",
                to: "to-cyan-500",
                bgHover: "group-hover:bg-teal-500"
            }
        }
    }
    
    const { from, to, bgHover } = getGradient()
    
    const handleMouseMove = (e) => {
        if (!cardRef.current) return
        
        const card = cardRef.current
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        
        const rotateX = (y - centerY) / 10
        const rotateY = (centerX - x) / 10
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }
    
    const handleMouseLeave = () => {
        if (!cardRef.current) return
        cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`
    }
    
    return (
        <motion.div
            ref={cardRef}
            className="w-full md:w-[calc(33%-0.75rem)] relative group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${from} ${to} opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative h-full bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg md:text-xl font-bold text-white">{skill.title}</h3>
                    <div className="text-white/80 font-bold text-lg">{skill.level}%</div>
                </div>
                
                <div className="h-2 w-full bg-white/20 rounded-full">
                    <motion.div 
                        className={`h-full ${bgHover} rounded-full transition-colors duration-300`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ 
                            duration: 1.2,
                            delay: 0.3 + index * 0.1,
                            ease: "easeOut"
                        }}
                    />
                </div>
                
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-tr from-white/5 to-white/20 group-hover:scale-150 transition-transform duration-500 ease-out" />
            </div>
        </motion.div>
    )
}

const SkillCategory = ({ title, skills, category }) => {
    return (
        <div className="mb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative inline-block"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h2>
                <motion.div 
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                />
            </motion.div>
            
            <div className="mt-6 flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                    <SkillCard 
                        key={skill.title} 
                        skill={skill} 
                        index={index}
                        category={category}
                    />
                ))}
            </div>
        </div>
    )
}

const SkillSection = () => {
    return (
        <Section>
            <div className="relative w-full max-h-screen overflow-y-auto no-scrollbar py-4">
                <motion.div 
                    className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
                    initial={{ backgroundPosition: "0% 0%" }}
                    animate={{ 
                        backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{ 
                        repeat: Infinity,
                        repeatType: "mirror",
                        duration: 15,
                    }}
                    style={{
                        backgroundImage: "radial-gradient(circle at center, rgba(120, 119, 198, 0.8) 0%, transparent 60%)",
                        backgroundSize: "80% 80%",
                        backgroundRepeat: "no-repeat",
                    }}
                />
                
                <SkillCategory title="Core Skills" skills={skills} category="Skills" />
                <SkillCategory title="Advanced Technologies" skills={advancedSkills} category="Advanced" />
                <SkillCategory title="Languages" skills={languages} category="Languages" />
            </div>
        </Section>
    )
}

export default SkillSection