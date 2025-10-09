"use client"

import { useQuery } from "@tanstack/react-query"
import { getArticles } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AddArticle from "@/components/AddArticle"

interface Author {
  _id: string
  username: string
  avatar?: string
  verified: boolean
}

interface RelatedEntity {
  _id: string
  title: string
  type: string
  posterUrl?: string
}

interface Article {
  _id: string
  title: string
  content: string
  author: Author
  relatedEntity?: RelatedEntity
  createdAt: string
  updatedAt: string
}

export default function ArticlesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Failed to fetch articles</p>

  const articles: Article[] = data?.articles || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles</CardTitle>
        <AddArticle/>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Related Entity</TableHead>
              <TableHead>Content Preview</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article._id}>
                <TableCell className="font-medium max-w-xs">
                  <div className="truncate">{article.title}</div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={article.author.avatar} />
                      <AvatarFallback>
                        {article.author.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {article.author.username}
                        {article.author.verified && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            ✓
                          </Badge>
                        )}
                      </span>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  {article.relatedEntity ? (
                    <div className="flex items-center gap-2">
                      {article.relatedEntity.posterUrl && (
                        <img
                          src={article.relatedEntity.posterUrl}
                          alt={article.relatedEntity.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium truncate max-w-32">
                          {article.relatedEntity.title}
                        </span>
                        <Badge variant="outline" className="text-xs w-fit">
                          {article.relatedEntity.type}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">No related entity</span>
                  )}
                </TableCell>
                
                <TableCell className="max-w-md">
                  <div className="truncate text-sm text-gray-600">
                    {article.content.substring(0, 100)}...
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}