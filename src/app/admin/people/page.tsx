"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllPeople } from "@/lib/api"
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

export default function PeoplePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["people"],
    queryFn: () => getAllPeople(),
  })

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
      <CardHeader>
        <CardTitle>People</CardTitle>
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
                <TableCell>{person.role ?? "—"}</TableCell>
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
