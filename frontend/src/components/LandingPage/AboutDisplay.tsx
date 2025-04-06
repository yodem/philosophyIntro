import { motion } from 'framer-motion'
import avatar from '@/assets/avatar_profile.jpg'
// import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { LABELS } from '@/constants'

// const socialLinks = [
//     { icon: Github, href: LABELS.SOCIAL_URLS.GITHUB, label: LABELS.SOCIAL_LINKS.GITHUB },
//     { icon: Twitter, href: LABELS.SOCIAL_URLS.TWITTER, label: LABELS.SOCIAL_LINKS.TWITTER },
//     { icon: Linkedin, href: LABELS.SOCIAL_URLS.LINKEDIN, label: LABELS.SOCIAL_LINKS.LINKEDIN },
//     { icon: Mail, href: LABELS.SOCIAL_URLS.EMAIL, label: LABELS.SOCIAL_LINKS.EMAIL }
// ]

function AboutDisplay() {
    return (
        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* About Me Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {LABELS.ABOUT_ME}
                        </h2>
                        <div className="flex items-start gap-6 mb-6">
                            <img
                                src={avatar}
                                alt="Profile avatar"
                                className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                            />
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{LABELS.PHILOSOPHY_ENTHUSIAST}</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {LABELS.DEDICATED_TO_EXPLORING}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 italic mt-2">
                                    "{LABELS.QUOTE}"
                                </p>
                            </div>
                        </div>
                        {/* <div className="flex gap-3">
                            {socialLinks.map((link) => (
                                <Button
                                    key={link.label}
                                    variant="ghost"
                                    size="icon"
                                    className="hover:scale-110 transition-transform"
                                    asChild
                                >
                                    <a onClick={() => navigate({ to: "/about" })} target="_blank" rel="noopener noreferrer">
                                        <link.icon className="w-5 h-5" />
                                    </a>
                                </Button>
                            ))}
                        </div> */}
                    </motion.div>

                    {/* About Project Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {LABELS.ABOUT_PROJECT}
                        </h2>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300">
                            <p>
                                {LABELS.PHILOSOPHY_HUB_AIMS}
                            </p>
                            <p>
                                {LABELS.INTERACTIVE_CONTENT}
                            </p>
                            <div className="pt-4">
                                <Button onClick={() => { }} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90">
                                    {LABELS.LEARN_MORE}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default AboutDisplay
