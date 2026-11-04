import { Outlet } from "react-router"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"
import { useContext, useState } from "react"
import { AuthContext } from "./features/auth/auth.context.js"
import Sidebar from "./components/Sidebar.jsx"
import TopBar from "./components/TopBar.jsx"

function WorkspaceSession() {
  const { user } = useContext(AuthContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <InterviewProvider key={user?._id || user?.id || 'guest'}>
      <div className="app-shell">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="app-canvas">
          <TopBar
            onToggleSidebar={() => setSidebarOpen(o => !o)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
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
