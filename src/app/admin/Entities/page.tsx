"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getEntities } from "@/lib/api"
import api from "@/lib/axios"

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
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

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

  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [releaseDate, setReleaseDate] = useState("")
  const [genreName, setGenreName] = useState("")


  const addMovie = useMutation({
    mutationFn: async (movieData: any) => {
      const { data } = await api.post("/entities/movie", movieData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entities"] })
      setOpen(false)
      setTitle("")
      setDescription("")
      setReleaseDate("")
      setGenreName("")
    },
  })


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const movieData = {
      title,
      description,
      releaseDate,
      type: "movie",
      genres: genreName ? [{ name: genreName }] : [],
      directors: [],
      cast: []
    }

    addMovie.mutate(movieData)
  }
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all")

  const { data, isLoading, isError } = useQuery({
    queryKey: ["entities", filter],
    queryFn: async () => {
      const result = await getEntities()
      const entities = (result?.entities || []) as Entity[]
      if (filter === "movie") {
        const movies = entities.filter(entity => entity?.type === 'movie')

        return { ...result, entities: movies }
      }

      if (filter === "tv") {
        const tvShows = entities.filter(entity => entity?.type === 'tv')
        return { ...result, entities: tvShows }
      }

      return { ...result, entities }
    },
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Failed to fetch entities</p>

  const entities: Entity[] = data?.entities || []

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add Movie</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Movie</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Release Date</label>
              <Input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Genre</label>
              <Input
                value={genreName}
                onChange={(e) => setGenreName(e.target.value)}
                placeholder="Action, Drama, etc."
              />
            </div>
            <Button type="submit" disabled={addMovie.isPending}>
              {addMovie.isPending ? "Adding..." : "Add Movie"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Card>

        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle>Entities</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "movie" ? "default" : "outline"}
              onClick={() => setFilter("movie")}
            >
              Movies
            </Button>
            <Button
              variant={filter === "tv" ? "default" : "outline"}
              onClick={() => setFilter("tv")}
            >
              TV Shows
            </Button>
          </div>
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
    </>


  )
}
