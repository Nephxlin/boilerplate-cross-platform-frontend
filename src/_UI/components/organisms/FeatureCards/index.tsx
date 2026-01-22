import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/cn"

interface FeatureCardProps {
    slug: string
    icon: string
    title: string
    description: string
  }
  
  export default function FeatureCard({ slug, icon, title, description }: FeatureCardProps) {
    return (
      <Link
        href={`/features/${slug}`}
        className={cn(
          'w-40 rounded-lg border p-4 text-left transition-colors',
          'hover:border-foreground/50 hover:bg-foreground/5'
        )}
      >
        <div className="mb-2 text-2xl">{icon}</div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-foreground/60 text-sm">{description}</p>
      </Link>
    )
  }