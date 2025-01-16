import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import AboutDisplay from '@/components/LandingPage/AboutDisplay'
import ContentDisplaySection from '@/components/LandingPage/ContentDisplaySection'
import Description from '@/components/LandingPage/Description'
import PhilosophySection from '@/components/LandingPage/PhilosophySection'
import React from 'react'

const SectionLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  </div>
)

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  // Enable smooth scroll behavior
  React.useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  const scrollYProgress = useScrollProgress();

  return (
    <AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="no-scrollbar h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800"
      >
        {/* Main content sections with consistent spacing */}
        <Suspense fallback={<SectionLoader />}>
          <div className="snap-y snap-mandatory">
            <section className="snap-start">
              <Description />
            </section>

            <section className="snap-start">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="py-24 md:py-32"
              >
                <PhilosophySection />
              </motion.div>
            </section>

            <section className="snap-start">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="py-24 md:py-32 bg-slate-50/50 dark:bg-slate-800/50"
              >
                <ContentDisplaySection />
              </motion.div>
            </section>

            <section className="snap-start">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="py-24 md:py-32"
              >
                <AboutDisplay />
              </motion.div>
            </section>
          </div>
        </Suspense>

        {/* Scroll progress indicator */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 h-1 bg-blue-600 origin-left"
          style={{
            scaleX: scrollYProgress
          }}
        />
      </motion.main>
    </AnimatePresence>
  )
}

// Custom hook for scroll progress
const useScrollProgress = () => {
  const [scrollYProgress, setScrollYProgress] = React.useState(0)

  React.useEffect(() => {
    const handleScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      const progress = window.scrollY / height
      setScrollYProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollYProgress
}

export default RouteComponent
