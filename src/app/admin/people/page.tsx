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
import { Edit, Eye, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import AddPersonDialog from "@/components/AddPersonDialog"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"

export default function PeoplePage() {
  // const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["people"],
    queryFn: () => getAllPeople(),
  })
  // const [open, setOpen] = useState(false)
  // const [form, setForm] = useState({
  //   name: "",
  //   bio: "",
  //   dateOfBirth: "",
  //   photoUrl: "",
  //   roles: "",
  // })

  // const mutation = useMutation({
  //   mutationFn: addPerson,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["people"] })
  //     setOpen(false)
  //     setForm({
  //       name: "",
  //       bio: "",
  //       dateOfBirth: "",
  //       photoUrl: "",
  //       roles: "",
  //     })
  //   },
  //   onError: (error: any) => {
  //     console.error("Error adding person:", error.response?.data || error.message)
  //     alert("Failed to add person. Please check the console for details.")
  //   },
  // })

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()

  //   // Clean the data - only include non-empty fields
  //   const personData = {
  //     name: form.name.trim(),
  //     bio: form.bio.trim() || undefined,
  //     dateOfBirth: form.dateOfBirth || undefined,
  //     photoUrl: form.photoUrl.trim() || undefined,
  //     roles: form.roles
  //       ? form.roles.split(",").map((r) => r.trim()).filter(Boolean)
  //       : [],
  //   }


  //   mutation.mutate(personData)
  // }
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
    <Card className="m-6 bg-gray-900 border-gray-800 text-gray-100">
      <CardHeader className="flex justify-between items-center border-b border-gray-800">
        <CardTitle>People</CardTitle>
        <AddPersonDialog />
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-800">
                <TableHead className="text-gray-400">Avatar</TableHead>
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Role</TableHead>
                <TableHead className="text-gray-400">Bio</TableHead>

                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.people.map((person: any) => (
                <TableRow key={person._id}>
                  {/*  */}
                  <TableCell>

                    <Avatar>
                      <AvatarImage src={person.photoUrl} alt={person.name} />
                      <AvatarFallback>
                        {person.name?.charAt(0).toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  {/* Name */}
                  <TableCell>
                    <Link
                      href={`/people/${person._id}`}
                      className="text-yellow-500 hover:underline"
                    >
                      {person.name}
                    </Link>
                  </TableCell>
                  {/* Role */}
                  <TableCell>{person.roles ? <Badge variant={"secondary"}>{person.roles}</Badge> : ("—")}</TableCell>
                  {/* Bio */}
                  <TableCell className="max-w-[300px] truncate text-muted-foreground">
                    {person.bio ?? "—"}
                  </TableCell>
                  {/* Actions */}
                  <TableCell>
                    <div className="flex gap-2">

                      {/* View */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-2 hover:bg-gray-700 rounded">
                              <Eye size={16} className="text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" align="end">
                            <p>View</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Edit */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-2 hover:bg-gray-700 rounded">
                              <Edit size={16} className="text-blue-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" align="end">
                            <p>Edit</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Delete */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-2 hover:bg-gray-700 rounded">
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" align="end">
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
