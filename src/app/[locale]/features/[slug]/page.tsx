import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getFeatureBySlug, getAllFeatureSlugs } from '@/data/features/featuresMock'
import { routing } from '@/i18n/routing'

interface FeaturePageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = getAllFeatureSlugs()
  // Generate params for all combinations of locale and slug
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: FeaturePageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('features')
  const feature = getFeatureBySlug(slug)

  if (!feature) {
    return { title: 'Not Found' }
  }

  return {
    title: t(`${slug}.title`),
    description: t(`${slug}.shortDescription`),
  }
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const feature = getFeatureBySlug(slug)

  if (!feature) {
    notFound()
  }

  const featureKeys = ['1', '2', '3', '4', '5'] as const

  return (
    <main className="min-h-screen p-8 pt-[calc(var(--header-height)+1rem)]">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-foreground/60 hover:text-foreground mb-8 inline-flex items-center gap-2 transition-colors"
        >
          <span>←</span>
          <span>{t('common.backToHome')}</span>
        </Link>

        <header className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <span className="text-5xl">{feature.icon}</span>
            <div>
              <h1 className="text-4xl font-bold">{t(`features.${slug}.title`)}</h1>
              <p className="text-foreground/60 text-lg">
                {t(`features.${slug}.shortDescription`)}
              </p>
            </div>
          </div>
        </header>

        <section className="mb-8">
          <p className="text-foreground/80 text-lg leading-relaxed">
            {t(`features.${slug}.description`)}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">{t('features.usedInProject')}</h2>
          <p className="text-foreground/80 leading-relaxed">{t(`features.${slug}.usage`)}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">{t('features.keyFeatures')}</h2>
          <ul className="space-y-2">
            {featureKeys.map((key) => (
              <li key={key} className="flex items-start gap-3">
                <span className="text-foreground/40 mt-1">•</span>
                <span className="text-foreground/80">
                  {t(`features.${slug}.features.${key}`)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-foreground/10 border-t pt-8">
          <h2 className="mb-4 text-xl font-semibold">{t('common.learnMore')}</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href={feature.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors hover:bg-foreground hover:text-background"
            >
              <span>🌐</span>
              <span>{t('common.officialWebsite')}</span>
            </a>
            <a
              href={feature.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors hover:bg-foreground hover:text-background"
            >
              <span>📚</span>
              <span>{t('common.documentation')}</span>
            </a>
            {feature.githubUrl && (
              <a
                href={feature.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors hover:bg-foreground hover:text-background"
              >
                <span>💻</span>
                <span>{t('common.github')}</span>
              </a>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
