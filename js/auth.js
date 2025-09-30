import { auth, db, provider, signInWithPopup, onAuthStateChanged, signOut } from './firebase-init.js'
import { doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js'

// --- Connexion Google --------------------------------------------------------
export async function signInWithGoogle() {
  const res = await signInWithPopup(auth, provider)
  const user = res.user
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      role: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  } else {
    await setDoc(ref, { updatedAt: serverTimestamp(), email: user.email }, { merge: true })
  }
}

// --- Rôles -------------------------------------------------------------------
export async function getCurrentRole() {
  if (!auth.currentUser) return null
  const ref = doc(db, 'users', auth.currentUser.uid)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data().role || 'pending') : null
}

const pageRoles = {
  'admin': ['admin'],
  'reception': ['reception', 'admin'],
  'technique': ['technique', 'admin'],
  'menage': ['menage', 'admin'],
  'intervention': ['reception', 'technique', 'menage', 'admin'],
  'inventaire-technique': ['technique', 'admin'],
  'inventaire-menage': ['menage', 'admin']
}

// chemins RELATIFS (crucial pour GitHub Pages)
function pathForRole(role) {
  switch (role) {
    case 'admin': return 'admin.html'
    case 'reception': return 'reception.html'
    case 'technique': return 'technique.html'
    case 'menage': return 'menage.html'
    default: return 'index.html'
  }
}

// Détection de la page login : pas d’attribut data-page sur <body>
function isLoginPage() {
  return !document.body.getAttribute('data-page')
}

// Sécurisation + redirections
onAuthStateChanged(auth, async (user) => {
  const onLogin = isLoginPage()

  if (!user) {
    // Pas connecté : autorisé seulement sur la page login
    if (!onLogin) location.replace('index.html')   // <<-- RELATIF
    return
    }

  const role = await getCurrentRole()

  // Si on est sur la page login ET connecté -> envoyer vers son dashboard
  if (onLogin) {
    location.replace(pathForRole(role))            // <<-- RELATIF
    return
  }

  // Si page protégée sans droit -> renvoyer vers sa page
  const pageKey = document.body.getAttribute('data-page')
  if (pageKey) {
    const allowed = pageRoles[pageKey] || []
    if (!allowed.includes(role)) {
      alert('Accès refusé pour ce rôle.')
      location.replace(pathForRole(role))          // <<-- RELATIF
    }
  }
})

export { signOut }
