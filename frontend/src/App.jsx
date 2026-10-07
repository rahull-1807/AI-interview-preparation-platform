import { Outlet } from "react-router"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"
import Header from "./components/Header.jsx"
import { useContext } from "react"
import { AuthContext } from "./features/auth/auth.context.js"

function WorkspaceSession() {
  const { user } = useContext(AuthContext)
  return (
    <InterviewProvider key={user?._id || user?.id || 'guest'}>
      <Header />
      <Outlet />
    </InterviewProvider>
  )
}

function App() {

  return (
    <AuthProvider>
      <WorkspaceSession />
    </AuthProvider>
  )
}

export default App
