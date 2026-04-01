import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID || 'studio-4383034491-9ef3d';

export function initAdmin() {
    if (getApps().length <= 0) {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            try {
                const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
                initializeApp({
                    credential: cert(serviceAccount),
                    projectId
                });
            } catch (e) {
                console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Initializing without credentials.');
                initializeApp({ projectId });
            }
        } else {
            console.warn('FIREBASE_SERVICE_ACCOUNT_KEY not set. Initializing default admin app (may lack permissions locally).');
            initializeApp({ projectId });
        }
    }
}

export const db = () => {
    initAdmin();
    return getFirestore();
};
