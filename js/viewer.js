/* Joel Bailey | ID 2403157 | Lab: Friday 7-9 | Other group members: add names, IDs, lab times here */
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
