"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getEntities, deleteEntity } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TVPage() {
  const queryClient = useQueryClient()

  // ✅ Fetch only TV entities
  const { data: entities, isLoading, error } = useQuery({
    queryKey: ["tv-entities"],
    queryFn: async () => {
      const all = await getEntities()
      return all.filter((item: any) => item.category === "tv")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEntity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tv-entities"] })
    },
  })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading TV shows</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>TV Shows</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Genres</TableHead>
              <TableHead>Seasons</TableHead>
              <TableHead>Poster</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entities?.map((entity: any) => (
              <TableRow key={entity._id}>
                <TableCell>{entity.title}</TableCell>
                <TableCell>
  {entity.genres?.map((g: any) => (
    <Badge key={g._id} className="mr-1">
      {g.name}
    </Badge>
  ))}
</TableCell>

                <TableCell>
                  {entity.seasons?.length ? (
                    entity.seasons.map((s: any) => (
                      <div key={s.number} className="flex items-center gap-2 mb-1">
                        <span>Season {s.number}</span>
                        {s.poster && (
                          <img
                            src={s.poster}
                            alt={`Season ${s.number}`}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <span>—</span>
                  )}
                </TableCell>
                <TableCell>
                  {entity.poster && (
                    <img
                      src={entity.poster}
                      alt={entity.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => deleteMutation.mutate(entity._id)}
                    disabled={deleteMutation.isPending}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
