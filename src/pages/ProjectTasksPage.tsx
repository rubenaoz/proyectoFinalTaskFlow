import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'
import { useProjects } from '../hooks/useProjects'
import { useTaskForm } from '../hooks/useTaskForm'
import { useTasks } from '../hooks/useTasks'

export function ProjectTasksPage() {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const projectNumber = Number(projectId)
  const { projects } = useProjects()
  const { tasks, loading, error, refetch } = useTasks()
  const project = projects.find((item) => item.id === projectNumber)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const taskForm = useTaskForm({
    projectId: project?.id ?? null,
    projectName: project?.name ?? '',
    onSuccess: () => { refetch(); setTaskDialogOpen(false) },
  })
  const projectTasks = tasks.filter((task) => task.projectId === projectNumber)

  return (
    <Box sx={{ width: '100%', maxWidth: 980, px: { xs: 2, md: 4 }, py: 4, mx: 'auto' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>
        Back to projects
      </Button>

      {!project ? (
        <Typography color="text.secondary">Loading project...</Typography>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>{project.name}</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {project.description || 'Project tasks'}
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setTaskDialogOpen(true)} sx={{ mb: 3 }}>
            Add task
          </Button>
          <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>Add a task</DialogTitle>
            <DialogContent sx={{ pt: '8px !important' }}>
              <TaskForm {...taskForm} />
            </DialogContent>
          </Dialog>
          <Paper sx={{ p: 3 }}>
            <TaskList tasks={projectTasks} loading={loading} error={error} onChanged={refetch} />
          </Paper>
        </>
      )}
    </Box>
  )
}