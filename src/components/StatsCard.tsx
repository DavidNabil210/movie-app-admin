"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  description?: string
  className?: string
}

export default function StatsCard({
  title,
  value,
  icon,
  description,
  className,
}: StatsCardProps) {
  return (
    <Card className={`rounded-2xl text-gray-900 shadow-sm ${className || ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold truncate">{value}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
