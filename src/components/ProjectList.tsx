import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Project } from '../types'
import { ProjectItem } from './ProjectItem'

interface ProjectListProps {
  projects: Project[]
  onSelect: (project: Project) => void
  onChanged: () => void
  loading: boolean
  error: string | null
}

export function ProjectList({ projects, onSelect, onChanged, loading, error }: ProjectListProps) {
  if (loading) return <Stack alignItems="center" py={4}><CircularProgress /></Stack>
  if (error) return <Alert severity="error">{error}</Alert>
  if (projects.length === 0) return <Typography color="text.secondary">No projects yet.</Typography>

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Projects ({projects.length})</Typography>
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} onChanged={onChanged} onOpen={onSelect} />
      ))}
    </Stack>
  )
}