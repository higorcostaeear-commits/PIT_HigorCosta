import DrawerButton from '@/components/DrawerButton'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/header/Header'

export default function FrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="drawer">
      <DrawerButton />
      <div className="drawer-content">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4">{children}</main>
          <footer className="footer footer-center p-4 bg-base-300 text-base-content">
            <p>Copyright © 2025 - All right reserved by Higor </p>
          </footer>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <Sidebar />
      </div>
    </div>
  )
}
