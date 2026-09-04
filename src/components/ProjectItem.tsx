import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { ConfirmDialog } from './ConfirmDialog'
import { useProjectActions } from '../hooks/useProjectActions'
import type { Project } from '../types'

interface ProjectItemProps {
  project: Project
  onChanged: () => void
  onOpen: (project: Project) => void
}

export function ProjectItem({ project, onChanged, onOpen }: ProjectItemProps) {
  const actions = useProjectActions({ project, onSuccess: onChanged })
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
          <Typography variant="subtitle1">Edit project #{project.id}</Typography>
          {actions.error && <Alert severity="error">{actions.error}</Alert>}
          <TextField label="Name" value={actions.name} onChange={(event) => actions.setName(event.target.value)} required fullWidth inputProps={{ minLength: 3, maxLength: 80 }} />
          <TextField label="Description" value={actions.description} onChange={(event) => actions.setDescription(event.target.value)} fullWidth multiline rows={2} />
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={!actions.valid || actions.busy}>
              {actions.saving ? 'Saving...' : 'Save changes'}
            </Button>
            <Button type="button" startIcon={<CloseIcon />} onClick={actions.cancelEditing} disabled={actions.busy}>Cancel</Button>
          </Stack>
        </Stack>
      </Paper>
    )
  }

  return (
    <>
      <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        {actions.error && <Alert severity="error">{actions.error}</Alert>}
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1">{project.name}</Typography>
            <Typography variant="body2" color="text.secondary">{project.description || 'No description'}</Typography>
            <Typography variant="caption" color="text.secondary">ID {project.id} · Owner {project.ownerId}</Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button size="small" onClick={() => onOpen(project)}>Open</Button>
            <Button size="small" startIcon={<EditIcon />} onClick={actions.startEditing} disabled={actions.busy}>Edit</Button>
            <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={confirmDelete} disabled={actions.busy}>
              {actions.deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Stack>
        </Stack>
      </Stack>
      </Paper>
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete project?"
        message={`Delete "${project.name}"? Its tasks will also be deleted.`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => void handleConfirmedDelete()}
      />
    </>
  )
}
