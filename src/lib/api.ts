import api from "@/lib/axios"

export async function getUsers() {
  const { data } = await api.get("/users")
  return data
}
export async function getEntities() {
  const { data } = await api.get("/entities")
  return data
}
export async function getArticles() {
  const { data } = await api.get("/articles")
  return data
}

