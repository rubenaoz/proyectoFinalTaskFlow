import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

interface ProjectFormProps {
  name: string
  setName: (value: string) => void
  description: string
  setDescription: (value: string) => void
  submitting: boolean
  error: string | null
  valid: boolean
  handleSubmit: (e: React.FormEvent) => void
}

export function ProjectForm({ name, setName, description, setDescription, submitting, error, valid, handleSubmit }: ProjectFormProps) {
  return (
    <Stack spacing={2} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6">New project</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth helperText="At least 3 characters" />
      <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={2} />
      <Button type="submit" variant="contained" disabled={!valid || submitting}>
        {submitting ? 'Creating...' : 'Create project'}
      </Button>
    </Stack>
  )
}