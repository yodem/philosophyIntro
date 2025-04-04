import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from '@tanstack/react-router'
import { LABELS } from '@/constants'
import { Sections } from "@/types"

function ContentDisplayCard({ to, icon: Icon, title, description, type }: Sections) {
    const navigate = useNavigate()

    return (
        <Card
            className="h-full group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-none"
            onClick={() => navigate({ to, search: { type } })}
        >
            <CardHeader>
                <div className="mb-4 w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
                <Button
                    variant="outline"
                    className="group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"
                >
                    {LABELS.EXPLORE}
                </Button>
            </CardContent>
        </Card>
    )
}

export default ContentDisplayCard

