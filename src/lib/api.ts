import api from "@/lib/axios"

export async function getUsers() {
  const { data } = await api.get("/users")
  return Array.isArray(data) ? data : data.users
}
export async function getEntities() {
  const { data } = await api.get("/entities")
  return data?.entities ? data : { entities: [], pagination: {} }
}
export async function getArticles() {
  const { data } = await api.get("/articles")
  return data
}
export async function deleteUser(userId: string) {
  const { data } = await api.delete(`/users/${userId}`)
  return data
}

export async function updateUser(userId: string, updates: Partial<{ username: string; email: string; role: string }>) {
  const { data } = await api.put(`/users/${userId}`, updates)
  return data
}
// Get movies only
export async function getMovies() {
  try {
    const { data } = await api.get("/entities/movies/filter")
    return data?.entities ? data : { entities: [], pagination: {} }
  } catch (error) {
    console.error("Error fetching movies:", error)
    return { entities: [], pagination: {} }
  }
}
//get tv shows
export async function getTvShows() {
  try {
    const { data } = await api.get("/entities/tv/filter")
    console.log("TV Shows data:", data)
    // ✅ Map tvShows to entities to match component expectations
    return { 
      entities: data?.tvShows || [],
      count: data?.count || 0,
      success: data?.success || false
    }
  } catch (error) {
    console.error("Error fetching TV shows:", error)
    return { entities: [], count: 0, success: false }
  }
}


//delete entity
export async function deleteEntity(id: string) {
  const { data } = await api.delete(`/entities/${id}`)
  return data
}


export async function getEntityById(id:string) {
  const { data } = await api.get(`/entities/${id}`)
  return data
}
