import { ValidationError, useForm } from "@formspree/react";
import Section from "../components/Section";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export const EmailSubmitted = atom(false)
const ContactSection = () => {
    const [state, handleSubmit] = useForm("xayrqbar");
    const [emailSubmitted, setEmailSubmitted] = useAtom(EmailSubmitted)
    
    useEffect(() => {
        if (state.succeeded) {
            setEmailSubmitted(true)
        }
        setTimeout(() => {
            setEmailSubmitted(false)
        }, 200)
    }, [state.succeeded])
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

export default ContactSection