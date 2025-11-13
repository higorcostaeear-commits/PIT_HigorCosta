import Link from 'next/link'

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-base-100">
      <header className="bg-black text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-3 items-center px-4 py-3">
          <Link
            href="/"
            className="btn btn-sm bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            Página Inicial
          </Link>
          <h1 className="text-center text-lg font-semibold uppercase tracking-wide">
            Painel de Admin
          </h1>
          <span />
        </div>
      </header>
      <main className="px-4 py-6">{children}</main>
    </div>
  )
}

