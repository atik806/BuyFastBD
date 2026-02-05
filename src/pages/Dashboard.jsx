import AdminDashboard from './AdminDashboard'
import UserDashboard from './UserDashboard'

export default function Dashboard({ user, role, onLogout }) {
  if (role === 'admin') {
    return <AdminDashboard user={user} onLogout={onLogout} />
  }

  return <UserDashboard user={user} onLogout={onLogout} />
}
