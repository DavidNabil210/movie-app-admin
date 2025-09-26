"use client"

import { useQuery } from "@tanstack/react-query"
import { getEntities } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Genre {
  name: string
  description?: string
}

interface Entity {
  _id: string
  title: string
  description: string
  releaseDate: string
  type: string
  genres: Genre[]
  directors: string[]
  cast: string[]
}

export default function EntitiesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["entities"],
    queryFn: getEntities,
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Failed to fetch entities</p>

  const entities: Entity[] = data?.entities || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entities</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Genres</TableHead>
              <TableHead>Directors</TableHead>
              <TableHead>Cast</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entities.map((entity) => (
              <TableRow key={entity._id}>
                <TableCell className="font-medium">{entity.title}</TableCell>
                <TableCell>{entity.description}</TableCell>
                <TableCell>
                  {new Date(entity.releaseDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge>{entity.type}</Badge>
                </TableCell>
                <TableCell className="flex gap-1 flex-wrap">
                  {entity.genres.map((genre, i) => (
                    <Badge key={i} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell>{entity.directors.length}</TableCell>
                <TableCell>{entity.cast.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
