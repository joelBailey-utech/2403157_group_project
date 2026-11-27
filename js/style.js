/* Joel Bailey | ID 2403157 | Lab: Friday 7-9 | Other group members: add names, IDs, lab times here */
/* All site JavaScript in one file: shared data, dark mode, page chrome, and each page's code. */
/* Dark mode is applied here, before the page draws, so there is no flash. */
function setTheme(t){document.documentElement.dataset.theme=t;localStorage.setItem("wrps_theme",t);const b=document.querySelector("#tg");if(b){b.textContent=t=="dark"?"Light mode":"Dark mode";b.setAttribute("aria-pressed",t=="dark")}}
function toggleTheme(){setTheme(document.documentElement.dataset.theme=="dark"?"light":"dark")}
document.documentElement.dataset.theme=localStorage.getItem("wrps_theme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");

/* ===== Shared data, session, helpers, chrome ===== */
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

/* ===== Administrator dashboard ===== */
function pageAdmin(){
const me=guard(["admin"]);
/* Tabs */
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tabs button").forEach(x=>x.classList.toggle("on",x===b));["reg","mat","led"].forEach(i=>$("#"+i).hidden=i!==b.dataset.t);if(b.dataset.t=="mat")grid();draw()});
function draw(){
 const L=students();
 $("#st").innerHTML="<tr><th>ID</th><th>Name</th><th>Class</th><th>Cohort</th><th>Guardian</th><th>Actions</th></tr>"+L.map(s=>"<tr><td>"+s.id+"</td><td>"+esc(s.name)+"</td><td>"+s.cls+"</td><td>"+s.sem+"</td><td>"+esc(s.guardian)+'</td><td><button class="btn sm" data-e="'+s.id+'">Edit</button> <button class="btn sm del" data-d="'+s.id+'">Delete</button></td></tr>').join("");
 $("#lt").innerHTML="<tr><th>ID</th><th>Name</th><th>Tuition</th><th>Paid</th><th>Balance</th><th>Status</th></tr>"+L.map(s=>"<tr><td>"+s.id+"</td><td>"+esc(s.name)+"</td><td>"+money(s.tuition)+"</td><td>"+money(paid(s.id))+"</td><td>"+money(Math.max(0,s.tuition-paid(s.id)))+"</td><td>"+badge(s)+"</td></tr>").join("");
 $("#ps").innerHTML=L.map(s=>'<option value="'+s.id+'">'+s.id+" "+esc(s.name)+"</option>").join("");
}
$("#st").onclick=e=>{const f=$("#sf"),b=e.target;
 if(b.dataset.e){const s=students().find(x=>x.id===b.dataset.e);for(const k in s)if(f.elements[k])f.elements[k].value=s[k];f.scrollIntoView()}
 if(b.dataset.d&&confirm("Delete this student and their records?")){const id=b.dataset.d;DB.set("students",students().filter(x=>x.id!==id));DB.set("grades",grades().filter(x=>x.sid!==id));DB.set("pay",(DB.get("pay")||[]).filter(x=>x.sid!==id));say("Student deleted.");draw()}};
$("#sf").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));f.tuition=+f.tuition;let L=students();
 if(f.id){L=L.map(s=>s.id===f.id?f:s);say("Student updated.")}else{f.id="S"+(Math.max(1000,...L.map(s=>+s.id.slice(1)))+1);L.push(f);say("Student registered as "+f.id+".")}
 DB.set("students",L);e.target.reset();e.target.elements.id.value="";draw()};
function grid(){gradeGrid($("#gg"),$("#sub").value,students())}
$("#sub").onchange=grid;
$("#pf").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target)),p=DB.get("pay")||[];p.push({sid:f.sid,amt:+f.amt});DB.set("pay",p);e.target.reset();say("Payment recorded.");draw()};
draw();
}

/* ===== Teacher panel ===== */
function pageTeacher(){
const me=guard(["teacher"]);let sub="",cls="";
$("#s1").innerHTML='<h2>Your subjects</h2><div class="chips">'+me.subjects.map(s=>'<button data-s="'+s+'">'+s+"</button>").join("")+"</div>";
$("#s1").onclick=e=>{if(!e.target.dataset.s)return;sub=e.target.dataset.s;$("#gg").innerHTML="";$("#s2").innerHTML="<h2>"+sub+": choose a class</h2><div class=\"chips\">"+CLASSES.map(c=>'<button data-c="'+c+'">'+c+"</button>").join("")+"</div>"};
$("#s2").onclick=e=>{if(!e.target.dataset.c)return;cls=e.target.dataset.c;const L=students().filter(s=>s.cls===cls);
 if(!L.length){$("#gg").innerHTML="<p>No students are registered in "+cls+" yet.</p>";return}
 gradeGrid($("#gg"),sub,L);$("#rc").innerHTML="<h2>Report cards</h2>"+L.map(s=>'<button class="btn alt sm" data-r="'+s.id+'">'+esc(s.name)+"</button>").join(" ")+'<div id="card"></div>'};
$("#rc").onclick=e=>{if(e.target.dataset.r)$("#card").innerHTML=reportCard(e.target.dataset.r)+'<p><button class="btn sm" onclick="print()">Print report card</button></p>'};
}

/* ===== Read-only viewer ===== */
function pageViewer(){
/* Read-only: no forms or inputs that change stored data on this page */
guard(["viewer","teacher","admin"]);
function find(){const q=$("#q").value.toLowerCase().trim();
 const L=q?students().filter(s=>s.name.toLowerCase().includes(q)||s.id.toLowerCase()==q):[];
 $("#res").innerHTML=L.map(s=>'<article class="card"><h3>'+esc(s.name)+"</h3><p>"+s.id+", "+s.cls+'</p><button class="btn sm" data-id="'+s.id+'">View profile</button></article>').join("")||(q?"<p>No student matches that search.</p>":"")}
$("#q").oninput=find;
$("#res").onclick=e=>{const id=e.target.dataset.id;if(!id)return;const s=students().find(x=>x.id===id);
 $("#prof").innerHTML='<h2>Profile</h2><p>'+esc(s.name)+", "+s.cls+", "+esc(s.sem)+", guardian "+esc(s.guardian)+"</p><p>Tuition "+money(s.tuition)+", paid "+money(paid(id))+", balance "+money(Math.max(0,s.tuition-paid(id)))+" "+badge(s)+"</p>"+reportCard(id)};
function rep(){const c=$("#fc").value,f=$("#fs").value;
 $("#rep").innerHTML="<tr><th>ID</th><th>Name</th><th>Class</th><th>Average</th><th>Fees</th></tr>"+students().filter(s=>(!c||s.cls===c)&&(!f||status(s)===f)).map(s=>{const g=grades().filter(x=>x.sid===s.id);return"<tr><td>"+s.id+"</td><td>"+esc(s.name)+"</td><td>"+s.cls+"</td><td>"+(g.length?Math.round(g.reduce((a,x)=>a+x.score,0)/g.length)+"%":"n/a")+"</td><td>"+badge(s)+"</td></tr>"}).join("")}
$("#fc").onchange=$("#fs").onchange=rep;rep();
}

/* ===== About us ===== */
function pageAbout(){
$("#dir").insertAdjacentHTML("beforeend",TEACHERS.map(t=>"<tr><td>"+t[0]+"</td><td>"+t[1]+"</td></tr>").join(""))
}

/* ===== Contact us form ===== */
function pageContact(){
$("#cf").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));const m=DB.get("messages")||[];m.push(f);DB.set("messages",m);e.target.reset();say("Message sent. We will reply by email.")}
}

/* ===== Login ===== */
function pageLogin(){
$("#lf").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));const u=USERS.find(x=>x.u===f.u&&x.p===f.p);if(!u)return say("Wrong username or password. Check both and try again.",1);sessionStorage.setItem("wrps_user",JSON.stringify(u));location.href=HOME[u.role]}
}

/* ===== Start-up: build header/footer, wire dark mode, run this page's code ===== */
document.addEventListener("DOMContentLoaded",()=>{
 chrome();setTheme(document.documentElement.dataset.theme);
 $("#tg").onclick=toggleTheme;
 const pages={"admin.html":pageAdmin,"teacher.html":pageTeacher,"viewer.html":pageViewer,"about.html":pageAbout,"contact.html":pageContact,"login.html":pageLogin};
 const run=pages[location.pathname.split("/").pop()];if(run)run();
});
