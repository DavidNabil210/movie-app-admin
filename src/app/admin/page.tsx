"use client"

import StatsCard from "@/components/StatsCard"
import { getUsers, getEntities, getArticles } from "@/lib/api"
import { Clapperboard } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

export default function AdminOverviewPage() {
  // Users Query
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })

  // Entities Query
  const { data: entitiesData, isLoading: entitiesLoading } = useQuery({
    queryKey: ["entities"],
    queryFn: getEntities,
  })

  // Articles Query
  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  })

  // Loading State
  if (usersLoading || entitiesLoading || articlesLoading) {
    return <p className="p-6">Loading...</p>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Users"
          value={usersData?.length || 0}
        />


        <StatsCard
          title="Total Entities"
          value={entitiesData?.entities?.length || 0}
          icon={<Clapperboard className="w-5 h-5" />}
        />

        <StatsCard
          title="Total Articles"
          value={articlesData?.articles?.length || 0}
        />
      </div>
    </div>
  )
}
