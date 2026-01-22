'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'
import { staggerFadeIn } from '@/lib/animations'
import { features } from '@/lib/features'

export default function HomePage() {
  const t = useTranslations()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      staggerFadeIn(contentRef.current.children)
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 pt-[calc(var(--header-height)+1rem)]">
      <div ref={contentRef} className="max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold">{t('home.title')}</h1>
        <p className="text-foreground/70 mb-8 text-lg">{t('home.description')}</p>

        <div className="flex flex-wrap justify-center gap-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.slug}
              slug={feature.slug}
              icon={feature.icon}
              title={t(`features.${feature.slug}.title`)}
              description={t(`features.${feature.slug}.shortDescription`)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

interface FeatureCardProps {
  slug: string
  icon: string
  title: string
  description: string
}

function FeatureCard({ slug, icon, title, description }: FeatureCardProps) {
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
