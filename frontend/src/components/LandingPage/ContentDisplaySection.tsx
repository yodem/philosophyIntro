import { motion } from 'framer-motion'
import ContentDisplayCard from './ContentDisplayCard'
import { CircleHelp, Users, Lightbulb } from 'lucide-react'
import { LABELS } from '@/constants'
import { ContentTypes, Sections } from '@/types'

const sections: Sections[] = [
  {
    title: LABELS.BIG_PHILOSOPHERS,
    description: LABELS.JOURNEY_THROUGH_HISTORY,
    icon: Users,
    to: "/content",
    type: ContentTypes.PHILOSOPHER
  },
  {
    title: LABELS.BIG_QUESTIONS,
    description: LABELS.EXPLORE_QUESTIONS,
    icon: CircleHelp,
    to: "/content",
    type: ContentTypes.QUESTION
  },
  {
    title: LABELS.CONCEPT_EXPLORER,
    description: LABELS.UNDERSTAND_CONCEPTS,
    icon: Lightbulb,
    to: "/content",
    type: ContentTypes.TERM
  }
]

function ContentDisplaySection() {
  return (
    <section className="py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {LABELS.EXPLORE_PHILOSOPHY}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <ContentDisplayCard {...section} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default ContentDisplaySection
