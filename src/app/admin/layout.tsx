
"use client"

import { Sidebar } from "@/components/sidebar"
import { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar*/}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
