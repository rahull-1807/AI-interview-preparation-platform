import { Outlet } from "react-router"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"

function App() {

  return (
    <AuthProvider>
      <InterviewProvider>
        <Outlet />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App