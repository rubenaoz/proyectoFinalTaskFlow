import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './ProtectedRoute'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { ProjectTasksPage } from './pages/ProjectTasksPage.tsx'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#d5a85d', contrastText: '#211d18' },
    secondary: { main: '#b7c7bd' },
    background: { default: '#202321', paper: '#303431' },
    text: { primary: '#f1eadc', secondary: '#b9b7ad' },
    divider: '#4b504b',
  },
  typography: {
    fontFamily: 'Georgia, Cambria, "Times New Roman", serif',
    button: { fontFamily: '"Trebuchet MS", sans-serif', fontWeight: 700 },
    h4: { fontWeight: 700, letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
  },
})
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter basename={routerBasename}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects/:projectId/tasks" element={<ProjectTasksPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}