"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { getArticleById  } from "@/lib/api"
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
import Link from "next/link"

export default function ArticleDetails() {
  const { id } = useParams()
  const articleId = id as string

  const { data, isLoading, isError } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => getArticleById (articleId),
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

  const article = data?.article
  console.log("Full data:", data)
console.log("Article article:", data?.article)
console.log("Article ID from params:", articleId)

  if (!article) return <p className="text-center text-gray-500 mt-6">No data found.</p>

  return (
    <div className="container mx-auto p-6">
      <Card className="overflow-hidden shadow-lg">
        {article.relatedEntity?.coverUrl && (
          <img
            src={article.relatedEntity.coverUrl}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
        )}

        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            <Link href={`/admin/Articles/author/${article.author._id}`}>
            {article.title}
            </Link>
            </CardTitle>
          {article.author?.username && (
            <CardDescription>By {article.author.username}</CardDescription>
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

          {/* Related Entity info */}
        
          {article.relatedEntity&& (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                Related: {article.relatedEntity?.title}
              </h3>
              <p className="text-muted-foreground">
                {article.relatedEntity?.description}
              </p>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="capitalize">
                  {article.relatedEntity?.type}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ⭐ {article.relatedEntity?.rating}
                </span>
              </div>
            </div>
          )}
          <Separator/>
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
