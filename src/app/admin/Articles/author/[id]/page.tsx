"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getArticlesByAuthor } from "@/lib/api"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function AuthorArticlesPage() {
  const { id } = useParams()
  const authorId = id as string

  const { data, isLoading, isError } = useQuery({
    queryKey: ["author-articles", authorId],
    queryFn: () => getArticlesByAuthor(authorId),
  })

  if (isLoading)
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    )

  if (isError)
    return (
      <p className="text-center text-red-500 mt-6">
        Something went wrong.
      </p>
    )

  const author = data?.author
  const articles = data?.articles || []

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Author Info */}
      {author && (
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{author.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-1">
              {author.username}
              {author.verified && (
                <CheckCircle className="w-4 h-4 text-blue-500" />
              )}
            </h2>
            <p className="text-muted-foreground">
              {articles.length} article{articles.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      <Separator />

      {/* Articles List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article: any) => (
          <Link key={article._id} href={`/articles/${article._id}`}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {article.relatedEntity?.posterUrl && (
                  <img
                    src={article.relatedEntity.posterUrl}
                    alt={article.relatedEntity.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize">
                    {article.relatedEntity?.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
