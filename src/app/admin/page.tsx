"use client"

import StatsCard from "@/components/StatsCard"
import { getUsers, getEntities, getArticles } from "@/lib/api"
import { Clapperboard, BarChart3 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
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
// Chart Data
const summaryData = [
  { name: "Users", count: usersData?.length || 0 },
  { name: "Entities", count: entitiesData?.entities?.length || 0 },
  { name: "Articles", count: articlesData?.articles?.length || 0 },
]

// Mock growth data
const growthData = [
  { month: "Jan", users: 10, articles: 5, entities: 2 },
  { month: "Feb", users: 20, articles: 12, entities: 6 },
  { month: "Mar", users: 30, articles: 18, entities: 10 },
  { month: "Apr", users: 40, articles: 22, entities: 12 },
]

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
       {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Content Overview</CardTitle>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Growth Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="articles"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="entities"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        </div>
    </div>
  )
}
