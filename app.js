'use strict';
const $=id=>document.getElementById(id), KEY='growthlab-dashboard-v1';
const empty=()=>({profile:{username:'@ton_compte',followers:0,following:0,totalLikes:0},videos:[],history:[]});
let data; try{data=JSON.parse(localStorage.getItem(KEY))||empty()}catch{data=empty()}
const save=()=>localStorage.setItem(KEY,JSON.stringify(data));
const fmt=v=>new Intl.NumberFormat('fr-FR').format(Number(v)||0);
function notify(s){const t=$('toast');t.textContent=s;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)}
function render(){
 $('usernameTop').textContent=data.profile.username;
 $('followers').textContent=fmt(data.profile.followers); $('following').textContent=fmt(data.profile.following);
 $('likes').textContent=fmt(data.profile.totalLikes); $('views').textContent=fmt(data.videos.reduce((s,v)=>s+v.views,0));
 $('username').value=data.profile.username; $('profileFollowers').value=data.profile.followers;
 $('profileFollowing').value=data.profile.following; $('profileLikes').value=data.profile.totalLikes;
 $('videoCount').textContent=data.videos.length+' vidéo(s)'; $('videoRows').replaceChildren();
 data.videos.forEach((v,i)=>{const tr=document.createElement('tr');
 [v.title,fmt(v.views),fmt(v.likes),fmt(v.comments)].forEach(x=>{const td=document.createElement('td');td.textContent=x;tr.appendChild(td)});
 const td=document.createElement('td'),b=document.createElement('button');b.className='delete';b.type='button';b.textContent='×';
 b.addEventListener('click',()=>{data.videos.splice(i,1);save();render();notify('Vidéo supprimée.')});td.appendChild(b);tr.appendChild(td);$('videoRows').appendChild(tr)});
 $('growthChart').textContent=data.history.length?data.history.map(h=>h.date+' : '+fmt(h.followers)+' abonnés').join(' • '):'Enregistre tes statistiques plusieurs fois pour constituer ton historique.';
}
$('profileForm').addEventListener('submit',e=>{e.preventDefault();data.profile={username:$('username').value.trim()||'@ton_compte',followers:Number($('profileFollowers').value),following:Number($('profileFollowing').value),totalLikes:Number($('profileLikes').value)};data.history.push({date:new Date().toLocaleDateString('fr-FR'),followers:data.profile.followers});save();render();notify('Statistiques enregistrées sur cet appareil.')});
$('videoForm').addEventListener('submit',e=>{e.preventDefault();data.videos.push({title:$('videoTitle').value.trim(),views:Number($('videoViews').value),likes:Number($('videoLikes').value),comments:Number($('videoComments').value),date:$('videoDate').value});save();render();$('videoForm').reset();$('videoDate').value=new Date().toISOString().slice(0,10);notify('Vidéo ajoutée.')});
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);notify(b.dataset.copy+' copié.')}catch{notify('Copie non disponible.')}}));
$('videoDate').value=new Date().toISOString().slice(0,10);render();
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
