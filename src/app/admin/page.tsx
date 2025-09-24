"use client"

import { useEffect, useState } from "react"
import StatsCard from "@/components/StatsCard"
import { getUsers, getEntities, getArticles } from "@/lib/api"
import { Clapperboard } from "lucide-react"

export default function AdminOverviewPage() {
  const [usersCount, setUsersCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [Entities, setEntities] = useState<number>(0)
  const [Articles, setArticles] = useState<number>(0)

  // Get Users Number
  useEffect(() => {
    async function fetchUsersCount() {
      try {
        const data = await getUsers()

        if (data && data.success && Array.isArray(data.users)) {
          setUsersCount(data.users.length)
          console.log(data);
        } else {
          console.error("Unexpected API response format:", data)
          setUsersCount(0)
        }
      } catch (err) {
        console.error("Failed to fetch users count", err)
        setUsersCount(0)
      } finally {
        setLoading(false)
      }
    }
    fetchUsersCount()
  }, [])
// Get Entites Number
  useEffect(() => {
    async function FetchEntitiesNumber() {
      try {
        const data = await getEntities()
        if (data && data.success && Array.isArray(data.entities)) {
          setEntities(data.entities.length)
          console.log(data.entities);
        }
        else {
          console.error("Unexpected API response format:", data)
          setEntities(0)
        }
      } catch (err) {
        console.error("Failed to fetch users count", err)
      } finally {
        setLoading(false)
      }


    }

    FetchEntitiesNumber()
  }, [])

  // Get Articles Number
  useEffect(() => {
    async function FetchArticlesNumber() {
      try {
        const data = await getArticles()
        if (data && data.success && Array.isArray(data.articles)) {
          setArticles(data.articles.length)
          console.log(data.articles);
        }
        else {
          console.error("Unexpected API response format:", data)
          setArticles(0)
        }
      } catch (err) {
        console.error("Failed to fetch users count", err)
      } finally {
        setLoading(false)
      }


    }

    FetchArticlesNumber()
  }, [])

  if (loading) {
    return <p className="p-6">Loading...</p>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Users" value={usersCount} />
        <StatsCard
          title="Total Entities"
          value={Entities}
          icon={<Clapperboard className="w-5 h-5" />}
        />

        <StatsCard title="Total articles" value={Articles} />
      </div>
    </div>
  )
}