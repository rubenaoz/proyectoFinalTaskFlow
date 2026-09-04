export interface AuthResponse {
  token: string
}

export interface Project {
  id: number
  name: string
  description?: string
  ownerId: number
  createdAt: string
}

export interface NewProject {
  name: string
  description?: string
}

export type UpdateProject = NewProject

export interface Task {
  id: number
  title: string
  description?: string
  projectId: number
  priority: TaskPriority
  assigneeId: number | null
  dueDate: string | null
  status?: string
  createdAt: string
}

export type TaskPriority = 'LOW' | 'MED' | 'HIGH'

export interface NewTask {
  title: string
  description: string
  priority: TaskPriority
  assigneeId: number | null
  dueDate: string
}

export type UpdateTask = NewTask

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api' : 'https://d3ujwk09smrk9z.cloudfront.net')

export const TOKEN_KEY = 'jwt-auth-demo-token'
export const USERNAME_KEY = 'jwt-auth-demo-username'