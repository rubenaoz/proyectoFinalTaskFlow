import { useState, type FormEvent } from 'react'
import { deleteTask, updateTask } from '../services/taskService'
import type { Task, TaskPriority, TaskStatus } from '../types'

interface UseTaskActionsOptions {
  task: Task
  onSuccess?: () => void
}

export function useTaskActions({ task, onSuccess }: UseTaskActionsOptions) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task.priority)
  const [assigneeId, setAssigneeId] = useState(
    task.assigneeId === null ? '' : String(task.assigneeId),
  )
  const [dueDate, setDueDate] = useState(task.dueDate ?? '')
  const [status, setStatus] = useState<TaskStatus>(task.status ?? 'TODO')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const valid = title.trim().length >= 3 && Boolean(dueDate?.length)
  const busy = saving || deleting

  function resetFields() {
    setTitle(task.title)
    setDescription(task.description ?? '')
    setPriority(task.priority)
    setAssigneeId(task.assigneeId === null ? '' : String(task.assigneeId))
    setDueDate(task.dueDate ?? '')
    setStatus(task.status ?? 'TODO')
  }

  function startEditing() {
    resetFields()
    setError(null)
    setEditing(true)
  }

  function cancelEditing() {
    resetFields()
    setError(null)
    setEditing(false)
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!valid || busy) return

    setSaving(true)
    setError(null)
    try {
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        assigneeId: Number(assigneeId) > 0 ? Number(assigneeId) : null,
        dueDate,
        status,
      })
      setEditing(false)
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la tarea')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (busy) return

    setDeleting(true)
    setError(null)
    try {
      await deleteTask(task.id)
      onSuccess?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error deleting task')
    } finally {
      setDeleting(false)
    }
  }

  return {
    editing,
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
    saving,
    deleting,
    error,
    valid,
    busy,
    startEditing,
    cancelEditing,
    handleUpdate,
    handleDelete,
  }
}
