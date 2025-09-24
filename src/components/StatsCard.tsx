"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
}

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <Card className="shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}
