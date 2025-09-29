import { db, auth } from './firebase-init.js'
const locked = it.locked
const controls = canChange && !locked ? `
<div class="flex gap-2 mt-3">
<button class="btn-outline action" data-action="status" data-id="${id}" data-status="a_faire">À faire</button>
<button class="btn-outline action" data-action="status" data-id="${id}" data-status="en_cours">En cours</button>
<button class="btn-primary action" data-action="status" data-id="${id}" data-status="termine">Terminée</button>
<button class="btn-outline action" data-action="lock" data-id="${id}">Valider (verrouiller)</button>
</div>` : ''


return `<li class="card">
<div class="flex items-center justify-between">
<div class="font-semibold">MH ${it.mhNumber||'-'}</div>
${statusBadge(it.status||'a_faire')}
</div>
<div class="text-sm text-gray-600 mt-1">${it.details||''}</div>
<div class="mt-2 text-xs text-gray-600">Client présent: <b>${boolLabel(!!it.clientPresent)}</b> — Autorisation: <b>${boolLabel(!!it.allowEntry)}</b></div>
${it.validatedByName? `<div class="mt-2 text-xs">Validée par <b>${it.validatedByName}</b></div>`: ''}
${locked? `<div class="mt-2 badge badge-gray">Verrouillée</div>`:''}
${controls}
</li>`
}


function bindActions(){
document.querySelectorAll('.action').forEach(btn=>{
btn.addEventListener('click', async ()=>{
const id = btn.getAttribute('data-id')
const action = btn.getAttribute('data-action')
const ref = doc(db,'interventions', id)
const snap = await getDoc(ref)
const it = snap.data()
if(!it) return
if(it.locked){ alert('Intervention verrouillée.'); return }


if(action==='status'){
const status = btn.getAttribute('data-status')
await updateDoc(ref, { status, updatedAt: serverTimestamp() })
}
if(action==='lock'){
const name = auth.currentUser?.displayName || 'Technicien'
await updateDoc(ref, {
locked:true,
validatedBy: auth.currentUser?.uid || null,
validatedByName: name,
validatedAt: serverTimestamp()
})
}
})
})
}


function renderInventoryItem(col, id, it){
return `<li class="py-2 flex items-center justify-between gap-2">
<div>
<div class="font-semibold">${it.name}</div>
<div class="text-xs text-gray-600">Qté: <b>${it.qty||0}</b></div>
</div>
<div class="flex items-center gap-1">
<button class="btn-outline inv" data-col="${col}" data-id="${id}" data-delta="-1">-1</button>
<button class="btn-outline inv" data-col="${col}" data-id="${id}" data-delta="+1">+1</button>
<button class="btn-outline inv-del" data-col="${col}" data-id="${id}">Supprimer</button>
</div>
</li>`
}


function bindInvActions(){
document.querySelectorAll('.inv').forEach(b=>{
b.addEventListener('click', async ()=>{
const col = b.getAttribute('data-col')
const id = b.getAttribute('data-id')
const delta = parseInt(b.getAttribute('data-delta')+"",10)
const ref = doc(db, col, id)
const snap = await getDoc(ref)
const q = (snap.data()?.qty||0) + delta
await updateDoc(ref, { qty: Math.max(0,q), updatedAt: serverTimestamp() })
})
})
document.querySelectorAll('.inv-del').forEach(b=>{
b.addEventListener('click', async ()=>{
const col = b.getAttribute('data-col')
const id = b.getAttribute('data-id')
if(confirm('Supprimer cet objet ?')) await deleteDoc(doc(db,col,id))
})
})
}