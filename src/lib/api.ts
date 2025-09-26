import api from "@/lib/axios"

export async function getUsers() {
  const { data } = await api.get("/users")
  return Array.isArray(data) ? data : data.users
}
export async function getEntities() {
  const { data } = await api.get("/entities")
  return data
}
export async function getArticles() {
  const { data } = await api.get("/articles")
  return data
}
export async function deleteUser(userId: string) {
  const { data } = await api.delete(`/users/${userId}`)
  return data
}

// api.ts
export async function updateUser(userId: string, updates: any) {
  const { data } = await api.put(`/users/${userId}`, updates)
  return data
}
