import { useAtom } from "jotai"
import { currentProjectAtom } from "../components/Projects/Projects"
import { projects } from "../constants/projects"
import Section from "../components/Section"

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

export default ProjectSection