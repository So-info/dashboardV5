import { auth, db, provider, signInWithPopup, onAuthStateChanged, signOut } from './firebase-init.js'
import { doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js'


// Sign-in Google
export async function signInWithGoogle(){
const res = await signInWithPopup(auth, provider)
const user = res.user
// Crée/Met à jour la fiche user (si première connexion)
const ref = doc(db, 'users', user.uid)
const snap = await getDoc(ref)
if(!snap.exists()){
await setDoc(ref, {
uid: user.uid,
email: user.email,
displayName: user.displayName || '',
photoURL: user.photoURL || '',
role: 'pending', // l’admin changera ensuite
createdAt: serverTimestamp(),
updatedAt: serverTimestamp()
})
} else {
await setDoc(ref, { updatedAt: serverTimestamp(), email: user.email }, { merge: true })
}
}


// Obtenir le rôle de l’utilisateur courant
export async function getCurrentRole(){
if(!auth.currentUser) return null
const ref = doc(db, 'users', auth.currentUser.uid)
const snap = await getDoc(ref)
return snap.exists() ? (snap.data().role || 'pending') : null
}


// Protéger chaque page par rôle
const pageRoles = {
'admin': ['admin'],
'reception': ['reception','admin'],
'technique': ['technique','admin'],
'menage': ['menage','admin'],
'intervention': ['reception','technique','menage','admin'],
'inventaire-technique': ['technique','admin'],
'inventaire-menage': ['menage','admin']
}


function pathForRole(role){
switch(role){
case 'admin': return '/admin.html'
case 'reception': return '/reception.html'
case 'technique': return '/technique.html'
case 'menage': return '/menage.html'
default: return '/index.html'
}
}


// Redirection après login et sécurisation des pages
onAuthStateChanged(auth, async (user) => {
const path = location.pathname
const isLogin = path.endsWith('/') || path.endsWith('/index.html') || path === '/index.html'


if(!user){
// Si pas connecté, rester uniquement sur index
if(!isLogin) location.replace('/index.html')
return
}


const role = await getCurrentRole()


// Si login, rediriger vers le bon dashboard
if(isLogin){
location.replace(pathForRole(role))
return
}


// Si page protégée sans droit, renvoyer vers sa page
const pageKey = document.body.getAttribute('data-page')
if(pageKey){
const allowed = pageRoles[pageKey] || []
if(!allowed.includes(role)){
alert("Accès refusé pour ce rôle.")
location.replace(pathForRole(role))
}
}
})


export { signOut }