"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { getEntityById } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

export default function TvShowDetails() {
  const { id } = useParams()
  const tvId = id as string

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tvShow", tvId],
    queryFn: () => getEntityById(tvId),
  })

  if (isLoading) return     (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  if (isError) return <p className="text-red-500 text-center mt-6">Something went wrong</p>

  const tv = data?.entity
  if (!tv) return <p className="text-center text-gray-500 mt-6">No data found.</p>

  return (
   <div className="container mx-auto p-6">
      <Card className="overflow-hidden shadow-lg">
        {tv.posterUrl && (
          <img
            src={tv.posterUrl}
            alt={tv.title}
            className="w-full h-96 object-cover"
          />
        )}
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{tv.title}</CardTitle>
          <CardDescription>{tv.type}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          <p className="text-muted-foreground">{tv.description}</p>

          {/* Rating */}
          {tv.rating && (
            <div className="flex items-center gap-2">
              <p className="font-semibold">Rating:</p>
              <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                {tv.rating}/10
              </Badge>
            </div>
          )}

          <Separator />

          {/* Genres */}
          {tv.genres && tv.genres.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {tv.genres.map((g: { name: string }, index: number) => (
                  <Badge key={index} variant="secondary">
                    {g.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Directors */}
          {tv.directors && tv.directors.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Directors</h2>
              <ul className="list-disc ml-6 text-sm space-y-1">
                {tv.directors.map((d: string, index: number) => (
                  <li key={index}>{d}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Cast */}
          {tv.cast && tv.cast.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Cast</h2>
              <ScrollArea className="h-32 rounded-md border p-2">
                <ul className="list-disc ml-6 text-sm space-y-1">
                  {tv.cast.map((c: string, index: number) => (
                    <li key={index}>{c}</li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          )}

          <Separator />

          {/* Dates */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Release Date: {new Date(tv.releaseDate).toLocaleDateString()}</p>
            <p>Created At: {new Date(tv.createdAt).toLocaleString()}</p>
            <p>Updated At: {new Date(tv.updatedAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
