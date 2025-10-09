"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { Trash2 } from "lucide-react"

import api from "@/lib/axios"

type Episode = {
  title: string
  episodeNumber: number
  description: string
  releaseDate: string
  duration: string
  thumbnailUrl: string
}
type Season = {
  seasonNumber: number
  description: string
  posterUrl: string
  coverUrl: string
  episodes: Episode[]
}
type Genre = {
  name: string
  description: string
}
type TvFormData = {

  title: string
  description: string
  releaseDate: string
  endDate: string
  posterUrl: string
  coverUrl: string
  genres: Genre[]
  seasons: Season[]

}
export function AddTvShowDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<TvFormData>({
    title: "",
    description: "",
    releaseDate: "",
    endDate: "",
    posterUrl: "",
    coverUrl: "",
    genres: [{ name: "", description: "" }],
    seasons: [{
      seasonNumber: 1,
      description: "",
      posterUrl: "",
      coverUrl: "",
      episodes: [{
        title: "",
        episodeNumber: 1,
        description: "",
        releaseDate: "",
        duration: "",
        thumbnailUrl: "",
      }

      ],
    }

    ],
  })

  const queryClient = useQueryClient()


  const addTvShow = useMutation({
    mutationFn: async (tvData: any) => {
      const { data } = await api.post(`/entities/tv`, tvData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tv-entities"] })
      setOpen(false)
      // setFormData({
      //   title: "",
      //   description: "",
      //   releaseDate: "",
      //   endDate: "",
      //   posterUrl: "",
      //   coverUrl: "",
      // })
    },
  })
  // Updated Season Data
  const handleSeasonChange = <K extends keyof Season>(
    index: number,
    field: K,
    value: Season[K]
  ) => {
    const updatedSeasons = [...formData.seasons]
    updatedSeasons[index][field] = value
    setFormData({ ...formData, seasons: updatedSeasons })
  }
  // Updated Episode Data
  const handleEpisodeChange = <K extends keyof Episode>(
    seasonIndex: number,
    episodeIndex: number,
    field: K,
    value: Episode[K]
  ) => {
    const updatedSeasons = [...formData.seasons]
    updatedSeasons[seasonIndex].episodes[episodeIndex][field] = value
    setFormData({ ...formData, seasons: updatedSeasons })
  }
  // Add New Season 
  const addSeason = () => {
    setFormData({
      ...formData,
      seasons: [
        ...formData.seasons,
        {
          seasonNumber: formData.seasons.length + 1,
          description: "",
          posterUrl: "",
          coverUrl: "",
          episodes: [
            {
              title: "",
              episodeNumber: 1,
              description: "",
              releaseDate: "",
              duration: "",
              thumbnailUrl: "",
            },
          ],
        },
      ],
    })
  }
  // Add New Episode
  const addEpisode = (seasonIndex: number) => {
    const updatedSeasons = [...formData.seasons]
    updatedSeasons[seasonIndex].episodes.push({
      title: "",
      episodeNumber: updatedSeasons[seasonIndex].episodes.length + 1,
      description: "",
      releaseDate: "",
      duration: "",
      thumbnailUrl: "",
    })
    setFormData({ ...formData, seasons: updatedSeasons })
  }

  //Remove Season 
  const removeSeason = (index: number) => {
    const updatedSeasons = [...formData.seasons]
    updatedSeasons.splice(index, 1)
    setFormData({ ...formData, seasons: updatedSeasons })
  }

  // Remove Episode 
  const removeEpisode = (seasonIndex: number, episodeIndex: number) => {
    const updatedSeasons = [...formData.seasons]
    updatedSeasons[seasonIndex].episodes.splice(episodeIndex, 1)
    setFormData({ ...formData, seasons: updatedSeasons })
  }

  const handleGenreChange = (index: number, field: keyof Genre, value: string) => {
    const updatedGenres = [...formData.genres]
    updatedGenres[index][field] = value
    setFormData({ ...formData, genres: updatedGenres })
  }

  const addGenre = () => {
    setFormData({
      ...formData,
      genres: [...formData.genres, { name: "", description: "" }],
    })
  }

  const removeGenre = (index: number) => {
    const updatedGenres = formData.genres.filter((_, i) => i !== index)
    setFormData({ ...formData, genres: updatedGenres })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTvShow.mutate({
      type: "tv",
      ...formData,
    })
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">
          <Plus className="mr-2 h-4 w-4" />
          Add TV Show
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New TV Show</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="releaseDate">Release Date</Label>
            <Input
              id="releaseDate"
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="posterUrl">Poster URL</Label>
            <Input
              id="posterUrl"
              type="url"
              value={formData.posterUrl}
              onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="coverUrl">Cover URL</Label>
            <Input
              id="coverUrl"
              type="url"
              value={formData.coverUrl}
              onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          {/* Genres Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Genres</h3>

            {formData.genres.map((genre, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Genre Name"
                  value={genre.name}
                  onChange={(e) => handleGenreChange(index, "name", e.target.value)}
                />
                <Input
                  placeholder="Description"
                  value={genre.description}
                  onChange={(e) => handleGenreChange(index, "description", e.target.value)}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeGenre(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" onClick={addGenre}>
              Add Genre
            </Button>
          </div>

          {/* Seasons Section */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Seasons</h3>
              <Button type="button" onClick={addSeason} size="sm">
                <Plus className="mr-1 h-4 w-4" /> Add Season
              </Button>
            </div>

            {formData.seasons.map((season, sIndex) => (
              <div key={sIndex} className="border rounded-lg p-3 mt-3 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Season {season.seasonNumber}</h4>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => removeSeason(sIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <Input
                  placeholder="Description"
                  value={season.description}
                  onChange={(e) => handleSeasonChange(sIndex, "description", e.target.value)}
                />
                <Input
                  placeholder="Poster URL"
                  value={season.posterUrl}
                  onChange={(e) => handleSeasonChange(sIndex, "posterUrl", e.target.value)}
                />
                <Input
                  placeholder="Cover URL"
                  value={season.coverUrl}
                  onChange={(e) => handleSeasonChange(sIndex, "coverUrl", e.target.value)}
                />

                {/* Episodes Section */}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <h5 className="font-semibold">Episodes</h5>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addEpisode(sIndex)}
                    >
                      <Plus className="mr-1 h-4 w-4" /> Add Episode
                    </Button>
                  </div>

                  {season.episodes.map((episode, eIndex) => (
                    <div key={eIndex} className="border p-2 rounded mt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Episode {episode.episodeNumber}</span>
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => removeEpisode(sIndex, eIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <Input
                        placeholder="Title"
                        value={episode.title}
                        onChange={(e) => handleEpisodeChange(sIndex, eIndex, "title", e.target.value)}
                      />
                      <Textarea
                        placeholder="Description"
                        value={episode.description}
                        onChange={(e) =>
                          handleEpisodeChange(sIndex, eIndex, "description", e.target.value)
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={episode.releaseDate}
                          onChange={(e) =>
                            handleEpisodeChange(sIndex, eIndex, "releaseDate", e.target.value)
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Duration (min)"
                          value={episode.duration}
                          onChange={(e) =>
                            handleEpisodeChange(sIndex, eIndex, "duration", e.target.value)
                          }
                        />
                      </div>
                      <Input
                        placeholder="Thumbnail URL"
                        value={episode.thumbnailUrl}
                        onChange={(e) =>
                          handleEpisodeChange(sIndex, eIndex, "thumbnailUrl", e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={addTvShow.isPending || !formData.title}
          >
            {addTvShow.isPending ? "Adding..." : "Add TV Show"}
          </Button>

          {addTvShow.isError && (
            <p className="text-red-500 text-sm">Error adding TV show. Please try again.</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
