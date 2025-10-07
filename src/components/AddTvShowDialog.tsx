"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import  api  from "@/lib/axios" 

export function AddTvShowDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseDate: "",
    endDate: "",
    posterUrl: "",
    coverUrl: "",
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
      setFormData({
        title: "",
        description: "",
        releaseDate: "",
        endDate: "",
        posterUrl: "",
        coverUrl: "",
      })
    },
  })

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

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
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
