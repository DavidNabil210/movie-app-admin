"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllCharacters } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import AddCharacter from "@/components/AddCharacter"

export default function CharactersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["characters"],
    
    queryFn:  ()=> getAllCharacters(),
    
  })

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )

  if (isError)
    return <div className="text-center text-red-500">Failed to load characters.</div>

  const characters = data?.characters || []

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Characters</CardTitle>
         <AddCharacter />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Character</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {characters.map((char: any) => (
                <TableRow key={char._id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={char.entity?.posterUrl} alt={char.name} />
                      <AvatarFallback>{char.name[0]}</AvatarFallback>
                    </Avatar>
                    {char.name}
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate">{char.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={char.actor?.photoUrl} alt={char.actor?.name} />
                        <AvatarFallback>{char.actor?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      {char.actor?.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/entities/${char.entity?._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {char.entity?.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {new Date(char.createdAt).toLocaleDateString()}
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
