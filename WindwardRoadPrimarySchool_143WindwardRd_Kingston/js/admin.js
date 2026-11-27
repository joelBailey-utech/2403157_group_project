/* Joel Bailey | ID 2403157 | Lab: Friday 7-9 | Other group members: add names, IDs, lab times here */
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
