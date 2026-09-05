import { httpClient } from './httpClient'
import type { NewTask, Task, UpdateTask } from '../types'

export async function getTasks(): Promise<Task[]> {
  const { data } = await httpClient.get<Task[]>('/tasks')
  return data
}

export async function getTasksByProject(projectId: number): Promise<Task[]> {
  const { data } = await httpClient.get<Task[]>(`/projects/${projectId}/tasks`)
  return data
}

export async function createTask(projectId: number, body: NewTask): Promise<Task> {
  const { data } = await httpClient.post<Task>(`/projects/${projectId}/tasks`, body)
  return data
}

export async function updateTask(id: number, body: UpdateTask): Promise<Task> {
  const { data } = await httpClient.put<Task>(`/tasks/${id}`, body)
  return data
}

export async function deleteTask(id: number): Promise<void> {
  await httpClient.delete(`/tasks/${id}`)
}