import { getAuth, signOut } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LogoutButton = () => {
  const [busy, setBusy] = useState(false)
  const auth = getAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setBusy(true)
    void signOut(auth)
      .then(() => {
        void navigate('/login')
      })
      .catch(err => {
        console.error(err)
        setBusy(false)
      })
  }

  return (
    <button onClick={handleLogout} disabled={busy}>
      Logout
    </button>
  )
}

export default LogoutButton
