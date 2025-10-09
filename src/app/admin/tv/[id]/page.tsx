"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { getEntityById } from "@/lib/api"

export default function TvShowDetails() {
  const { id } = useParams()
  const tvId = id as string

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tvShow", tvId],
    queryFn: () => getEntityById(tvId),
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Something went wrong</p>

  const tv = data?.entity
  if (!tv) return <p>No data found.</p>

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 🖼️ Cover Image */}
      {/* {tv.coverUrl && (
        <div className="relative w-full h-64 mb-6">
          <img
            src={tv.coverUrl}
            alt={`${tv.title} cover`}
            className="w-full h-full object-cover rounded-2xl shadow-lg"
          />
        </div>
      )} */}

      {/* 🎬 Title and Poster */}
      <div className="flex flex-col md:flex-row gap-6">
        {tv.posterUrl && (
          <img
            src={tv.posterUrl}
            alt={tv.title}
            className="w-64 rounded-xl shadow-md"
          />
        )}
        <div>
          <h1 className="text-4xl font-bold mb-2">{tv.title}</h1>
          <p className="text-gray-500 mb-2">Type: {tv.type}</p>
          <p className="text-gray-600">{tv.description}</p>
        </div>
      </div>

      {/*  Rating */}
      {tv.rating && (
        <p className="text-lg font-semibold mt-4">
           Rating: <span className="text-yellow-500">{tv.rating}/10</span>
        </p>
      )}

      {/*  Genres */}
      {tv.genres && tv.genres.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mt-6 mb-2">Genres</h2>
          <ul className="list-disc ml-6 space-y-1">
            {tv.genres.map(
              (g: { name: string; description: string }, index: number) => (
                <li key={index}>
                  <strong>{g.name}</strong> – {g.description}
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {/*  Directors */}
      {tv.directors && tv.directors.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mt-6 mb-2">Directors</h2>
          <ul className="list-disc ml-6">
            {tv.directors.map((d: string, index: number) => (
              <li key={index}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      {/*  Cast */}
      {tv.cast && tv.cast.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mt-6 mb-2">Cast</h2>
          <ul className="list-disc ml-6">
            {tv.cast.map((c: string, index: number) => (
              <li key={index}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/*  Dates */}
      <div className="mt-6 text-sm text-gray-500">
        <p>Release Date: {new Date(tv.releaseDate).toLocaleDateString()}</p>
        <p>Created At: {new Date(tv.createdAt).toLocaleString()}</p>
        <p>Updated At: {new Date(tv.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  )
}
