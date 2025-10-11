"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { getEntityById } from "@/lib/api"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ArticleDetails() {
  const { id } = useParams()
  const articleId = id as string

  const { data, isLoading, isError } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => getEntityById(articleId),
  })

  if (isLoading)
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-20 w-full" />
      </div>
    )

  if (isError) return <p className="text-red-500 text-center mt-6">Something went wrong.</p>

  const article = data?.entity
  if (!article) return <p className="text-center text-gray-500 mt-6">No data found.</p>

  return (
    <div className="container mx-auto p-6">
      <Card className="overflow-hidden shadow-lg">
        {article.coverUrl && (
          <img
            src={article.coverUrl}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
        )}

        <CardHeader>
          <CardTitle className="text-3xl font-bold">{article.title}</CardTitle>
          {article.author && (
            <CardDescription>By {article.author}</CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/*  Article content */}
          <ScrollArea className="h-80 rounded-md border p-4">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {article.content}
            </p>
          </ScrollArea>

          <Separator />

          {/*  Tags */}
          {article.tags && article.tags.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/*  Dates */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Created At: {new Date(article.createdAt).toLocaleString()}</p>
            <p>Updated At: {new Date(article.updatedAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
