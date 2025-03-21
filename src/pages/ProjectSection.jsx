import { useAtom } from "jotai"
import { currentProjectAtom } from "../components/Projects/Projects"
import { projects } from "../constants/projects"
import Section from "../components/Section"
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useMemo, memo, useEffect } from "react";

// Preload all project images to avoid flashing when switching projects
const preloadImages = (imageUrls) => {
    imageUrls.forEach(url => {
        if (url) {
            const img = new Image();
            img.src = url;
        }
    });
};

// Memoize the background elements to prevent unnecessary rerenders
const BackgroundElements = memo(({ colorFrom, colorTo }) => (
    <>
        <motion.div
            className="absolute -z-10 w-40 h-40 rounded-full blur-3xl"
            style={{ top: "30%", left: "20%", background: `linear-gradient(to right, ${colorFrom}60, ${colorTo}40)` }}
            animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
        />
        
        <motion.div
            className="absolute -z-10 w-32 h-32 rounded-full blur-3xl"
            style={{ bottom: "30%", right: "25%", background: `linear-gradient(to left, ${colorTo}50, ${colorFrom}30)` }}
            animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
    </>
));

// Memoize the header to prevent unnecessary rerenders
const Header = memo(({ colorFrom, colorTo }) => (
    <motion.h2 
        className="text-3xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent relative z-10"
        style={{
            backgroundImage: `linear-gradient(to right, ${colorFrom}, ${colorTo})`
        }}
    >
        Projects
    </motion.h2>
));

// Memoize the project indicator dots
const ProjectIndicators = memo(({ currentProject, setCurrentProject, colors }) => (
    <div className="flex gap-2">
        {projects.map((_, idx) => (
            <motion.button
                key={idx}
                className="w-2.5 h-2.5 rounded-full"
                style={{ 
                    backgroundColor: idx === currentProject ? colors[idx % colors.length] : '#ffffff20',
                    boxShadow: idx === currentProject ? `0 0 8px ${colors[idx % colors.length]}` : 'none'
                }}
                animate={{
                    scale: idx === currentProject ? [1, 1.2, 1] : 1
                }}
                transition={{
                    duration: 1.5,
                    repeat: idx === currentProject ? Infinity : 0,
                    repeatType: "reverse"
                }}
                onClick={() => setCurrentProject(idx)}
            />
        ))}
    </div>
));

// ProjectCard component to handle content transitions
const ProjectCard = memo(({ 
    currentProject, 
    currentColorFrom, 
    currentColorTo, 
    currentProjectData 
}) => {
    return (
        <motion.div
            className="w-full max-w-2xl bg-white/5 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/10 shadow-xl relative overflow-hidden"
            key={currentProject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            {/* Gradient corner effect */}
            <div 
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-30"
                style={{ background: `linear-gradient(to right bottom, ${currentColorFrom}, ${currentColorTo})` }}
            />
            
            <h3 className="text-2xl font-bold text-white mb-2">{currentProjectData.title}</h3>
            <p className="text-gray-300 mb-4">{currentProjectData.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {currentProjectData.tags && currentProjectData.tags.map((tag, index) => (
                    <span 
                        key={index} 
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ 
                            background: `linear-gradient(to right, ${currentColorFrom}80, ${currentColorTo}80)`,
                            color: 'white' 
                        }}
                    >
                        {tag}
                    </span>
                ))}
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-3 mt-4">
                <motion.a
                    href={currentProjectData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white"
                    style={{ background: currentColorFrom }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span>Visit Site</span>
                    <FaExternalLinkAlt />
                </motion.a>
            </div>
        </motion.div>
    );
});

const ProjectSection = () => {
    const [currentProject, setCurrentProject] = useAtom(currentProjectAtom)

    // Preload all project images on component mount
    useEffect(() => {
        const imageUrls = projects.map(project => project.image);
        preloadImages(imageUrls);
    }, []);

    const nextProject = () => {
        setCurrentProject((currentProject + 1) % projects.length)
    }

    const previousProject = () => {
        setCurrentProject((currentProject - 1 + projects.length) % projects.length)
    }

    // Memoize colors array to prevent recreation on each render
    const colors = useMemo(() => [
        "#6366F1", // Indigo
        "#8B5CF6", // Violet
        "#EC4899", // Pink
        "#F43F5E", // Rose
        "#10B981", // Emerald
        "#06B6D4", // Cyan
        "#3B82F6", // Blue
        "#F59E0B", // Amber
        "#84CC16", // Lime
        "#14B8A6", // Teal
        "#8B5CF6", // Violet (repeated for more projects)
        "#6366F1", // Indigo (repeated for more projects)
    ], []);

    // Use memoized function to get project color
    const getProjectColor = useMemo(() => (index) => {
        return colors[index % colors.length];
    }, [colors]);

    // Memoize these values to prevent recalculations
    const currentColorFrom = useMemo(() => getProjectColor(currentProject), [getProjectColor, currentProject]);
    const currentColorTo = useMemo(() => getProjectColor((currentProject + 1) % projects.length), [getProjectColor, currentProject, projects.length]);
    
    // Memoize the current project data
    const currentProjectData = useMemo(() => projects[currentProject], [projects, currentProject]);

    return (
        <Section>
            <motion.div 
                className="relative flex flex-col w-full h-full items-center justify-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                {/* Animated background elements */}
                <BackgroundElements colorFrom={currentColorFrom} colorTo={currentColorTo} />
                
                {/* Heading with gradient */}
                <Header colorFrom={currentColorFrom} colorTo={currentColorTo} />
                
                {/* Project info card */}
                <ProjectCard 
                    currentProject={currentProject}
                    currentColorFrom={currentColorFrom}
                    currentColorTo={currentColorTo}
                    currentProjectData={currentProjectData}
                />
                
                {/* Navigation controls */}
                <div className="flex w-full justify-center items-center gap-6 md:gap-12">
                    <motion.button 
                        onClick={previousProject} 
                        className="text-white hover:text-indigo-300 transition-colors bg-white/10 backdrop-blur-md rounded-full p-3 shadow-lg clickable"
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ boxShadow: `0 0 15px ${currentColorFrom}40` }}
                    >
                        <FaArrowAltCircleLeft fontSize={28} />
                    </motion.button>
                    
                    {/* Project indicator dots */}
                    <ProjectIndicators 
                        currentProject={currentProject} 
                        setCurrentProject={setCurrentProject}
                        colors={colors}
                    />
                    
                    <motion.button 
                        onClick={nextProject} 
                        className="text-white hover:text-indigo-300 transition-colors bg-white/10 backdrop-blur-md rounded-full p-3 shadow-lg clickable"
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ boxShadow: `0 0 15px ${currentColorTo}40` }}
                    >
                        <FaArrowAltCircleRight fontSize={28} />
                    </motion.button>
                </div>
            </motion.div>
        </Section>
    )
}

export default ProjectSection