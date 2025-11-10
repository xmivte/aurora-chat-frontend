import { getAuth, GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const Login = () => {
  const auth = getAuth()
  const navigate = useNavigate()

  const [authing, setAuthing] = useState(false)
  const [error, setError] = useState('')

  const signInWithProvider = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
    try {
      setAuthing(true)
      await signInWithPopup(auth, provider)
      void navigate('/')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Authentication failed')
      setAuthing(false)
    }
  }

  return (
    <>
      <div>
        <h1>You are logged out</h1>
      </div>
      <div className="card">
        <button
          onClick={() => void signInWithProvider(new GoogleAuthProvider())}
          disabled={authing}
        >
          Continue with Google
        </button>
        <button
          onClick={() => void signInWithProvider(new GithubAuthProvider())}
          disabled={authing}
        >
          Continue with Github
        </button>
      </div>

      {authing && <span className="loader"></span>}
      {error && <div>{error}</div>}
    </>
  )
}

export default Login
