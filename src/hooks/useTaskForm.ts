import { useState } from 'react'
import { createTask } from '../services/taskService'
import type { TaskPriority, TaskStatus } from '../types'

interface UseTaskFormOptions {
  projectId: number | null
  projectName: string
  onSuccess?: () => void
}

export function useTaskForm({ projectId, projectName, onSuccess }: UseTaskFormOptions) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('MED')
  const [assigneeId, setAssigneeId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<TaskStatus>('TODO')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const valid =
    projectId !== null &&
    title.trim().length >= 3 &&
    dueDate.length > 0

  function reset() {
    setTitle('')
    setDescription('')
    setPriority('MED')
    setAssigneeId('')
    setDueDate('')
    setStatus('TODO')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || submitting) return

    setSubmitting(true)
    setError(null)

    try {
      if (projectId === null) return

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
        assigneeId: Number(assigneeId) > 0 ? Number(assigneeId) : null,
        status,
      }

      await createTask(projectId, taskData)
      reset()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating task')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    projectName,
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    assigneeId,
    setAssigneeId,
    dueDate,
    setDueDate,
    status,
    setStatus,
    submitting,
    error,
    valid,
    handleSubmit,
  }
}