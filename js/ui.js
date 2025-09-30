import { signOut } from './auth.js'

const links = [
  { href: 'admin.html', label: 'Admin', key: 'admin' },
  { href: 'reception.html', label: 'Réception', key: 'reception' },
  { href: 'technique.html', label: 'Technique', key: 'technique' },
  { href: 'menage.html', label: 'Ménage', key: 'menage' },
  { href: 'intervention.html', label: 'Interventions', key: 'intervention' },
  { href: 'inventaire-technique.html', label: 'Inv. Technique', key: 'inventaire-technique' },
  { href: 'inventaire-menage.html', label: 'Inv. Ménage', key: 'inventaire-menage' }
]

export function renderNav() {
  const key = document.body.getAttribute('data-page')
  const nav = document.getElementById('nav')
  if (!nav) return
  const items = links.map(l =>
    `<a href="${l.href}" class="navlink ${l.key === key ? 'navlink-active' : ''}">${l.label}</a>`
  ).join('')
  nav.innerHTML = `
    <div class="navbar px-3 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <img src="./logo-la-plage.png" alt="logo" class="w-8 h-8"/>
        <span class="font-semibold text-sky-700">La Plage</span>
      </div>
      <div class="flex gap-1 overflow-x-auto">${items}</div>
      <button id="logoutBtn" class="btn-outline">Déconnexion</button>
    </div>`

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await signOut()
    location.replace('index.html')                 // <<-- RELATIF
  })
}

export function statusBadge(status) {
  const map = { a_faire: 'badge-yellow', en_cours: 'badge-sky', termine: 'badge-green' }
  return `<span class="badge ${map[status] || 'badge-gray'}">${labelStatus(status)}</span>`
}

export function labelStatus(s) {
  return s === 'a_faire' ? 'À faire' : s === 'en_cours' ? 'En cours' : s === 'termine' ? 'Terminée' : s
}

export function boolLabel(v) { return v ? 'Oui' : 'Non' }

renderNav()
