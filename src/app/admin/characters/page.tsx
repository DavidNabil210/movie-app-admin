"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllCharacters } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import AddCharacter from "@/components/AddCharacter"

export default function CharactersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["characters"],
    queryFn: () => getAllCharacters(),
  })

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 text-yellow-500 animate-spin" />
      </div>
    )

  if (isError)
    return <div className="text-center text-red-500">Failed to load characters.</div>

  const characters = data?.characters || []

  return (
  <div >
      <Card className="bg-gray-900 border-gray-800 text-gray-100">
      <CardHeader className="flex justify-between items-center border-b border-gray-800">
        <div>
          <CardTitle className="text-white">Characters</CardTitle>
          <p className="text-gray-400 text-sm">Manage all characters</p>
        </div>
        <AddCharacter />
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-800">
                <TableHead className="text-gray-400">Character</TableHead>
                <TableHead className="text-gray-400">Description</TableHead>
                <TableHead className="text-gray-400">Actor</TableHead>
                <TableHead className="text-gray-400">Movie</TableHead>
                <TableHead className="text-gray-400">Created</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {characters.map((char: any) => (
                <TableRow key={char._id} className="hover:bg-gray-800/50">
                  <TableCell className="flex items-center gap-3 py-4">
                    <Avatar>
                      <AvatarImage src={char.entity?.posterUrl} />
                      <AvatarFallback className="bg-gray-700">
                        {char.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white">{char.name}</span>
                  </TableCell>

                  <TableCell className="max-w-[250px] truncate text-gray-300">
                    {char.description}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={char.actor?.photoUrl} />
                        <AvatarFallback className="bg-gray-700 text-xs">
                          {char.actor?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-300">{char.actor?.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Link
                      href={`/entities/${char.entity?._id}`}
                      className="text-yellow-500 hover:underline"
                    >
                      {char.entity?.title}
                    </Link>
                  </TableCell>

                  <TableCell className="text-gray-300">
                    {new Date(char.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-700 rounded">
                        <Eye size={16} className="text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-700 rounded">
                        <Edit size={16} className="text-blue-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-700 rounded">
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
  )
}
