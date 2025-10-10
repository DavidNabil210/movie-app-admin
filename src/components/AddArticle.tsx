"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addArticle,getEntities } from "@/lib/api"

export default function AddArticle() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    relatedEntity: ""
  })
  const {data:entitiesData, isLoading:isEntitiesLoading}=useQuery({
    queryKey:['Entities'],
    queryFn:getEntities,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

                  {/* Related Entity */}
          <div>
            <Label htmlFor="relatedEntity">Related Entity</Label>
            <select
              id="relatedEntity"
              name="relatedEntity"
              value={formData.relatedEntity}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="">-- Select an Entity --</option>
              {isEntitiesLoading ? (
                <option disabled>Loading...</option>
              ) : (
                entitiesData?.entities?.map((entity: any) => (
                  <option key={entity._id} value={entity._id}>
                    {entity.title}
                  </option>
                ))
              )}
            </select>
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Adding..." : "Add Article"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
