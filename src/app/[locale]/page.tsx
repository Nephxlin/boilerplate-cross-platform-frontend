'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { staggerFadeIn } from '@/lib/animations'
import { features } from '@/data/features/featuresMock'
import FeatureCard from '@/_UI/components/organisms/FeatureCards'
import Logo from '@/_UI/components/atoms/Logo/Aqtale'
import { NotificationButton } from '@/_UI/components/atoms'

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
      <div>
      <Logo width={100} height={100} />
      </div>
      <div ref={contentRef} className="max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold">{t('home.title')}</h1>
        <p className="text-foreground/70 mb-8 text-lg">{t('home.description')}</p>

        <div className="mb-8" suppressHydrationWarning>
          <NotificationButton
            variant="default"
            size="lg"
            notificationTitle={t('notifications.defaultTitle')}
            notificationBody={t('notifications.defaultBody')}
          />
        </div>

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


