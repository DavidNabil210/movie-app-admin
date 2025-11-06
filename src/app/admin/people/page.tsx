"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllPeople, addPerson } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function PeoplePage() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["people"],
    queryFn: () => getAllPeople(),
  })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    bio: "",
    dateOfBirth: "",
    photoUrl: "",
    roles: "",
  })

  const mutation = useMutation({
    mutationFn: addPerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["people"] })
      setOpen(false)
      setForm({
        name: "",
        bio: "",
        dateOfBirth: "",
        photoUrl: "",
        roles: "",
      })
    },
    onError: (error: any) => {
      console.error("Error adding person:", error.response?.data || error.message)
      alert("Failed to add person. Please check the console for details.")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Clean the data - only include non-empty fields
    const personData = {
      name: form.name.trim(),
      bio: form.bio.trim() || undefined,
      dateOfBirth: form.dateOfBirth || undefined,
      photoUrl: form.photoUrl.trim() || undefined,
      roles: form.roles
        ? form.roles.split(",").map((r) => r.trim()).filter(Boolean)
        : [],
    }


    mutation.mutate(personData)
  }
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (isError || !data?.people) {
    return <p className="text-center text-red-500">Failed to load people.</p>
  }

  return (
    <Card className="m-6">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>People</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Person</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Person</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                placeholder="Role"
                value={form.roles}
                onChange={(e) => setForm({ ...form, roles: e.target.value })}
              />
              <Input
                type="date"
                placeholder="Date of Birth"
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              />
              <Input
                placeholder="Photo URL"
                value={form.photoUrl}
                onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
              />
              <Textarea
                placeholder="Bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
              <DialogFooter>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Add
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Bio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.people.map((person: any) => (
              <TableRow key={person._id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={person.avatar} alt={person.name} />
                    <AvatarFallback>
                      {person.name?.charAt(0).toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/people/${person._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {person.name}
                  </Link>
                </TableCell>
                <TableCell>{person.roles ?? "—"}</TableCell>
                <TableCell className="max-w-[300px] truncate text-muted-foreground">
                  {person.bio ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
