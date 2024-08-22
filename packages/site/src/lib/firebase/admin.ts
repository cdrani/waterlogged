import firebaseAdmin from 'firebase-admin'

const privateKey = Buffer.from(import.meta.env.VITE_FB_PRIVATE_KEY , 'base64').toString('ascii')

export const admin = (() => {
    try { return  firebaseAdmin.app() }
    catch (error) {
        return firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert({
                privateKey,
                projectId: import.meta.env.VITE_FB_PROJECT_ID,
                clientEmail: import.meta.env.VITE_FB_CLIENT_EMAIL,
            })
        })
    }
})()
