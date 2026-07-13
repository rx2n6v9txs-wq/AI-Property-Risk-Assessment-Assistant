import type { PropsWithChildren } from 'react'
import Header from './Header'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">{children}</main>
    </div>
  )
}
