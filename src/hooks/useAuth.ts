import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

export const useAuth = (navigate: NavigateFunction) => {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const lastSignInTime = user.metadata.lastSignInTime
        // checks if last sign in time exists
        if (!lastSignInTime) {
          console.log('session ended (no last sign-in time)')
          void signOut(auth)
          void navigate('/login')
          return
        }

        const lastSignIn = new Date(lastSignInTime).getTime()
        const lastSignInLimit = 30 * 24 * 60 * 60 * 1000 // a month in milliseconds

        //checks if last sign in time is not older than the limit
        if (Date.now() - lastSignIn > lastSignInLimit) {
          console.log('session ended')
          void signOut(auth)
          void navigate('/login')
        } else {
          setLoading(false)
        }
      } else {
        console.log('unauthorized')
        setLoading(false)
        void navigate('/login')
      }
    })
    return () => unsubscribe()
  }, [auth, navigate])

  return { loading }
}
