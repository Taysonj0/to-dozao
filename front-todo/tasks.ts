const API_URL = "http://localhost:8080"

export async function getTasks() {

  const token = localStorage.getItem("token")

  const res = await fetch(`${API_URL}/api/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    throw new Error("Erro ao buscar tarefas")
  }

  return res.json()
}