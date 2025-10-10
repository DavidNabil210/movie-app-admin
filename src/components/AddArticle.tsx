"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addArticle } from "@/lib/api"

export default function AddArticle() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    relatedEntity: ""
  })

  const { mutate, isPending } = useMutation({
    mutationFn: addArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] })

      setFormData({ title: "", content: "", relatedEntity: "" })
    },
    onError: (err) => {
      console.error("Error adding article:", err)
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  mutate(formData)
}


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Article</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Article</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter article title"
              required
            />
          </div>

          <div>
            <Label>Content</Label>
            <Textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your article content..."
              required
            />
          </div>

          <div>
            <Label>Related Entity ID</Label>
            <Input
              name="relatedEntity"
              value={formData.relatedEntity}
              onChange={handleChange}
              placeholder="Entity ID (e.g., TV show _id)"
              required
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Adding..." : "Add Article"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
