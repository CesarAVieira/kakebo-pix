import { createContext, useContext, useEffect, useState } from 'react'
import {
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // ================= LOGIN =================

    const loginGoogle = () =>
        signInWithPopup(auth, new GoogleAuthProvider())

    const loginFacebook = () =>
        signInWithPopup(auth, new FacebookAuthProvider())

    const loginGithub = () =>
        signInWithPopup(auth, new GithubAuthProvider())

    const loginEmail = (email, password) =>
        signInWithEmailAndPassword(auth, email, password)

    const resetPassword = email =>
        sendPasswordResetEmail(auth, email)

    const registerEmail = async (email, password, username) => {
        const cred = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )

        const userData = {
            uid: cred.user.uid,
            email,
            username,
            provider: 'email',
            challenges: [],
            historico: [],
            gamification: {
                level: 1,
                xp: 0,
                totalXp: 0
            },
            createdAt: new Date()
        }

        await setDoc(doc(db, 'users', cred.user.uid), userData)

        return cred.user
    }

    const logout = () => signOut(auth)

    // ================= UPDATE USER =================

    const updateUser = async (data) => {
        if (!user?.uid) return

        const ref = doc(db, 'users', user.uid)

        await updateDoc(ref, data)

        // sincroniza estado local
        setUser(prev => ({
            ...prev,
            ...data
        }))
    }

    // ================= OBSERVADOR =================

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async currentUser => {
            if (!currentUser) {
                setUser(null)
                setLoading(false)
                return
            }

            const ref = doc(db, 'users', currentUser.uid)
            const snap = await getDoc(ref)

            let data

            if (!snap.exists()) {
                data = {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    username:
                        currentUser.displayName ||
                        currentUser.email?.split('@')[0],
                    provider:
                        currentUser.providerData[0]?.providerId || 'email',
                    challenges: [],
                    historico: [],
                    createdAt: new Date()
                }

                await setDoc(ref, data)
            } else {
                data = snap.data()
            }

            setUser({
                uid: currentUser.uid,
                email: currentUser.email,
                username: data.username,
                provider: data.provider,
                pix: data.pix || null,
                challenges: data.challenges || [],
                historico: data.historico || [],
                gamification: data.gamification || {
                    level: 1,
                    xp: 0,
                    totalXp: 0
                }
            })

            setLoading(false)
        })

        return unsub
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                updateUser,
                loading,
                loginGoogle,
                loginFacebook,
                loginGithub,
                loginEmail,
                registerEmail,
                resetPassword,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
