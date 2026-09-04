import LogoutIcon from '@mui/icons-material/Logout'
import AddIcon from '@mui/icons-material/Add'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProjectForm } from '../components/ProjectForm'
import { ProjectList } from '../components/ProjectList'
import { useAuth } from '../hooks/useAuth'
import { useProjectForm } from '../hooks/useProjectForm'
import { useProjects } from '../hooks/useProjects'

export function DashboardPage() {
  const { logout, username } = useAuth()
  const navigate = useNavigate()
  const { projects, loading, error, refetch } = useProjects()
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const projectForm = useProjectForm({ onSuccess: () => { refetch(); setProjectDialogOpen(false) } })
  const initials = (username || 'User').trim().slice(0, 1).toUpperCase()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 980, px: { xs: 2, md: 4 }, py: 4, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Projects
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Organize your work and keep every task moving.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>{initials}</Avatar>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 600 }}>
              {username || 'User'}
            </Typography>
          </Stack>
          <Button startIcon={<LogoutIcon />} onClick={handleLogout}>Logout</Button>
        </Stack>
      </Stack>

      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setProjectDialogOpen(true)} sx={{ mb: 3 }}>
        Add project
      </Button>

      <Dialog open={projectDialogOpen} onClose={() => setProjectDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add a project</DialogTitle>
        <DialogContent sx={{ pt: '8px !important' }}>
          <ProjectForm {...projectForm} />
        </DialogContent>
      </Dialog>

      <Paper sx={{ p: 3 }}>
        <ProjectList
          projects={projects}
          onSelect={(project) => navigate(`/projects/${project.id}/tasks`)}
          onChanged={refetch}
          loading={loading}
          error={error}
        />
      </Paper>
    </Box>
  )
}