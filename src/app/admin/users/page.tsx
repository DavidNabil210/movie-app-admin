"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteUser, getUsers, updateUser } from "@/lib/api"
import { useState } from "react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
interface User {
  _id: string
  username: string
  email: string
  role: string
}



export default function UsersPage() {
  const queryClient = useQueryClient()
  // users query
  const { data: users, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<User>>({})

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })

    },
  })

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<User> }) =>
      updateUser(userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setEditingUserId(null)
    },
  })

  const handleEditClick = (user: User) => {
    setEditingUserId(user._id)
    setFormData(user)
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value})
  }

  const handleSave = () => {
    const updates = {
    username: formData.username,
    email: formData.email, 
    role: formData.role,
  }
    if (editingUserId) {
      
      updateMutation.mutate({
        userId: editingUserId,
        updates: updates,
      },
      {
        onSuccess: () => {
          
          queryClient.invalidateQueries({ queryKey: ["users"] })
          setEditingUserId(null) 
        },
        onError: (err) => {
          console.error("❌ Failed to update user", err)
        },
      }
    )
    }
    console.log("📤 Sending updates:", formData)

  }


  if (isLoading) return <p className="p-6">Loading users...</p>
  if (isError) return <p className="p-6 text-red-500">❌ Failed to fetch users</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>

      <Table>
        <TableCaption>A list of all users in the system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user: User) => (
            <TableRow key={user._id}>
              {editingUserId === user._id ? (
                <>
                  <TableCell>
                    <Input
                      value={formData.username || ""}
                     
                      onChange={(e) => handleChange("username", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={formData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleChange("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                        <SelectItem value="accountant">Accountant</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button size="sm" variant="default" onClick={handleSave}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingUserId(null)}>
                      Cancel
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button size="sm" variant="default" onClick={() => handleEditClick(user)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(user._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
