/* Joel Bailey | ID 2403157 | Lab: Friday 7-9 | Other group members: add names, IDs, lab times here */
/* Shared data layer, login session, and page chrome for the portal. */
const SUBJECTS=["Mathematics","English Language","Science","Social Studies","Religious Education","Information Technology"];
const CLASSES=["Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6"];
const SEMESTERS=["Semester 1 2026","Semester 2 2026"];
const USERS=[
 {u:"admin",p:"Admin@123",role:"admin",name:"Administrator"},
 {u:"teacher",p:"Teach@123",role:"teacher",name:"Mrs. Brown",subjects:["Mathematics","Science"]},
 {u:"viewer",p:"View@123",role:"viewer",name:"Guest Viewer"}];
const TEACHERS=[["Mrs. Brown","Mathematics, Science"],["Mr. Campbell","English Language"],["Ms. Reid","Social Studies"],["Mr. Grant","Religious Education"],["Ms. Lewis","Information Technology"]];
const HOME={admin:"admin.html",teacher:"teacher.html",viewer:"viewer.html"};
const $=s=>document.querySelector(s);
const esc=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const DB={get(k){try{return JSON.parse(localStorage.getItem("wrps_"+k))}catch(e){return null}},set(k,v){localStorage.setItem("wrps_"+k,JSON.stringify(v))}};
/* Seed sample data once so every page has something to show */
if(!DB.get("students")){
 const n=["Andre Clarke","Shanice Morgan","Kemar Hall","Tiana Francis","Jaden Powell","Alicia Wright"];
 DB.set("students",n.map((x,i)=>({id:"S"+(1001+i),name:x,cls:CLASSES[i%6],sem:SEMESTERS[0],guardian:"Parent of "+x.split(" ")[0],tuition:60000})));
 DB.set("grades",[]);DB.set("pay",[{sid:"S1001",amt:60000},{sid:"S1002",amt:25000}]);
}
const students=()=>DB.get("students")||[];
const grades=()=>DB.get("grades")||[];
function paid(id){return(DB.get("pay")||[]).filter(p=>p.sid===id).reduce((a,p)=>a+p.amt,0)}
function status(s){const p=paid(s.id);return p>=s.tuition?"Paid":p>0?"Pending":"Outstanding"}
const badge=s=>'<span class="badge '+status(s)+(status(s)=="Paid"?"":" flash")+'">'+status(s)+"</span>";
const money=n=>"J$"+Number(n).toLocaleString();
const session=()=>JSON.parse(sessionStorage.getItem("wrps_user")||"null");
function guard(roles){const s=session();if(!s||!roles.includes(s.role)){location.href="login.html"}return s}
function say(t,bad){const m=$("#msg");if(m){m.textContent=t;m.className=bad?"err":""}}
const letter=n=>n>=80?"A":n>=70?"B":n>=60?"C":n>=50?"D":"E";
/* Grade entry grid: used by admin (Academic Matrix) and teacher panel */
function gradeGrid(el,subject,list){
 el.innerHTML='<div class="wrap"><table><tr><th>ID</th><th>Student</th><th>'+esc(subject)+' score (0-100)</th></tr>'+list.map(s=>{const g=grades().find(x=>x.sid===s.id&&x.subject===subject);return'<tr><td>'+s.id+'</td><td>'+esc(s.name)+'</td><td><input type="number" min="0" max="100" data-sid="'+s.id+'" value="'+(g?g.score:"")+'" aria-label="Score for '+esc(s.name)+'"></td></tr>'}).join("")+'</table></div><p><button class="btn" id="saveG">Save grades</button></p>';
 $("#saveG").onclick=()=>{let all=grades();el.querySelectorAll("input").forEach(i=>{if(i.value==="")return;const v=Math.min(100,Math.max(0,+i.value));all=all.filter(x=>!(x.sid===i.dataset.sid&&x.subject===subject));all.push({sid:i.dataset.sid,subject,score:v})});DB.set("grades",all);say("Grades saved for "+subject+".")};
}
/* Report card generator */
function reportCard(id){
 const s=students().find(x=>x.id===id);if(!s)return"";
 const g=grades().filter(x=>x.sid===id);
 const avg=g.length?Math.round(g.reduce((a,x)=>a+x.score,0)/g.length):null;
 return'<article class="report"><img src="../assets/crest.png" alt=""><h3>Windward Road Primary School</h3><p>143 Windward Rd, Kingston</p><p><strong>'+esc(s.name)+'</strong> ('+s.id+'), '+esc(s.cls)+', '+esc(s.sem)+'</p><table><tr><th>Subject</th><th>Score</th><th>Grade</th></tr>'+(g.length?g.map(x=>'<tr><td>'+esc(x.subject)+'</td><td>'+x.score+'</td><td>'+letter(x.score)+'</td></tr>').join(""):'<tr><td colspan="3">No grades recorded yet.</td></tr>')+'</table><p><strong>Average: '+(avg===null?"n/a":avg+"% (grade "+letter(avg)+")")+'</strong></p></article>';
}
/* Page chrome: header, nav, footer */
function chrome(){
 const s=session(),here=location.pathname.split("/").pop()||"index.html";
 const links=[["index.html","Home"],["about.html","About us"],["contact.html","Contact us"]];
 $("#site-header").innerHTML='<a class="brand" href="index.html"><img src="../assets/crest.png" alt="Windward Road Primary School crest"><span>Windward Road Primary</span></a><button class="btn sm menu" aria-label="Toggle menu">Menu</button><nav>'+links.map(l=>'<a href="'+l[0]+'"'+(here==l[0]?' class="on"':"")+">"+l[1]+"</a>").join("")+'<button class="btn sm theme" id="tg" aria-label="Toggle dark mode"></button>'+(s?'<a href="'+HOME[s.role]+'">Dashboard</a><a href="#" id="lo">Log out</a>':'<a href="login.html">Log in</a>')+"</nav>";
 $(".menu").onclick=()=>document.body.classList.toggle("open");
 if(s)$("#lo").onclick=e=>{e.preventDefault();sessionStorage.removeItem("wrps_user");location.href="login.html"};
 $("#site-footer").innerHTML="<p>Windward Road Primary School, 143 Windward Rd, Kingston, Jamaica</p>";
}
/* Dark mode: saved choice wins, otherwise follow the device setting */
function setTheme(t){document.documentElement.dataset.theme=t;localStorage.setItem("wrps_theme",t);const b=$("#tg");if(b){b.textContent=t=="dark"?"Light mode":"Dark mode";b.setAttribute("aria-pressed",t=="dark")}}
document.addEventListener("DOMContentLoaded",()=>{chrome();setTheme(document.documentElement.dataset.theme||"light");$("#tg").onclick=()=>setTheme(document.documentElement.dataset.theme=="dark"?"light":"dark")});
