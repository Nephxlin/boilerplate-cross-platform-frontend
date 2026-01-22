import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-4xl font-bold">404</h1>
      <p className="text-foreground/70 mb-8 text-lg">Page not found</p>
      <Link
        href="/"
        className="hover:bg-foreground hover:text-background rounded-lg border px-4 py-2 transition-colors"
      >
        Go back home
      </Link>
    </main>
  )
}
