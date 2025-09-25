"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {deleteUser, getUsers, updateUser} from "@/lib/api"

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
    },
  })

  if (isLoading) return <p className="p-6">Loading users...</p>
  if (isError) return <p className="p-6 text-red-500">❌ Failed to fetch users</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user:User) => (
            <tr key={user._id}>
              <td className="p-2 border">{user.username}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border flex gap-2">
                <button className="px-2 py-1 bg-blue-500 text-white rounded">
                  Edit
                </button>
                <button className="px-2 py-1 bg-red-500 text-white rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
