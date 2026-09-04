import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { ConfirmDialog } from './ConfirmDialog'
import { useTaskActions } from '../hooks/useTaskActions'
import type { Task, TaskPriority, TaskStatus } from '../types'

interface TaskItemProps {
  task: Task
  onChanged: () => void
}

export function TaskItem({ task, onChanged }: TaskItemProps) {
  const actions = useTaskActions({ task, onSuccess: onChanged })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  function confirmDelete() {
    setDeleteDialogOpen(true)
  }

  async function handleConfirmedDelete() {
    await actions.handleDelete()
    setDeleteDialogOpen(false)
  }

  if (actions.editing) {
    return (
      <Paper variant="outlined" sx={{ p: 2 }} component="form" onSubmit={actions.handleUpdate}>
        <Stack spacing={2}>
          <Typography variant="subtitle1">Edit task #{task.id}</Typography>
          {actions.error && <Alert severity="error">{actions.error}</Alert>}
          <TextField label="Title" value={actions.title} onChange={(event) => actions.setTitle(event.target.value)} required fullWidth />
          <TextField label="Description" value={actions.description} onChange={(event) => actions.setDescription(event.target.value)} fullWidth multiline rows={2} />
          <TextField select label="Priority" value={actions.priority} onChange={(event) => actions.setPriority(event.target.value as TaskPriority)} fullWidth>
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MED">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
          </TextField>
          <TextField select label="Status" value={actions.status} onChange={(event) => actions.setStatus(event.target.value as TaskStatus)} fullWidth>
            <MenuItem value="TODO">To do</MenuItem>
            <MenuItem value="IN_PROGRESS">In progress</MenuItem>
            <MenuItem value="DONE">Done</MenuItem>
          </TextField>
          <TextField label="Assignee ID" type="number" value={actions.assigneeId} onChange={(event) => actions.setAssigneeId(event.target.value)} fullWidth inputProps={{ min: 1 }} />
          <TextField label="Due date" type="date" value={actions.dueDate} onChange={(event) => actions.setDueDate(event.target.value)} required fullWidth InputLabelProps={{ shrink: true }} />
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={!actions.valid || actions.busy}>{actions.saving ? 'Saving...' : 'Save changes'}</Button>
            <Button type="button" startIcon={<CloseIcon />} onClick={actions.cancelEditing} disabled={actions.busy}>Cancel</Button>
          </Stack>
        </Stack>
      </Paper>
    )
  }

  return (
    <>
      <Paper variant="outlined" sx={{ p: 2 }}>
      {actions.error && <Alert severity="error" sx={{ mb: 1 }}>{actions.error}</Alert>}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1">{task.title}</Typography>
          <Typography variant="body2" color="text.secondary">{task.description || 'No description'}</Typography>
          <Typography variant="caption" color="text.secondary">
            Status: {task.status ?? 'TODO'} · Priority: {task.priority} · Assignee: {task.assigneeId ?? 'Unassigned'} · Due date: {task.dueDate ?? 'No due date'}
          </Typography>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button size="small" startIcon={<EditIcon />} onClick={actions.startEditing} disabled={actions.busy}>Edit</Button>
          <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={confirmDelete} disabled={actions.busy}>{actions.deleting ? 'Deleting...' : 'Delete'}</Button>
        </Stack>
      </Stack>
      </Paper>
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete task?"
        message={`Delete the task "${task.title}"?`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => void handleConfirmedDelete()}
      />
    </>
  )
}
