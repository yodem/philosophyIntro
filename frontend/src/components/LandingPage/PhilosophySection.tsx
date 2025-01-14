import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { LABELS } from '@/constants'

const philosophyDefinitions = [
  {
    title: LABELS.CLASSICAL_DEFINITION,
    content: LABELS.CLASSICAL_DEFINITION_CONTENT
  },
  {
    title: LABELS.MODERN_PERSPECTIVE,
    content: LABELS.MODERN_PERSPECTIVE_CONTENT
  },
  {
    title: LABELS.PRACTICAL_APPLICATION,
    content: LABELS.PRACTICAL_APPLICATION_CONTENT
  }
]

function PhilosophySection() {
  return (
    <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        {LABELS.WHAT_IS_PHILOSOPHY}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {philosophyDefinitions.map((def, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {def.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {def.content}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default PhilosophySection
