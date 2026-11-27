/* Joel Bailey | ID 2403157 | Lab: Friday 7-9 | Other group members: add names, IDs, lab times here */
const me=guard(["teacher"]);let sub="",cls="";
$("#s1").innerHTML='<h2>Your subjects</h2><div class="chips">'+me.subjects.map(s=>'<button data-s="'+s+'">'+s+"</button>").join("")+"</div>";
$("#s1").onclick=e=>{if(!e.target.dataset.s)return;sub=e.target.dataset.s;$("#gg").innerHTML="";$("#s2").innerHTML="<h2>"+sub+": choose a class</h2><div class=\"chips\">"+CLASSES.map(c=>'<button data-c="'+c+'">'+c+"</button>").join("")+"</div>"};
$("#s2").onclick=e=>{if(!e.target.dataset.c)return;cls=e.target.dataset.c;const L=students().filter(s=>s.cls===cls);
 if(!L.length){$("#gg").innerHTML="<p>No students are registered in "+cls+" yet.</p>";return}
 gradeGrid($("#gg"),sub,L);$("#rc").innerHTML="<h2>Report cards</h2>"+L.map(s=>'<button class="btn alt sm" data-r="'+s.id+'">'+esc(s.name)+"</button>").join(" ")+'<div id="card"></div>'};
$("#rc").onclick=e=>{if(e.target.dataset.r)$("#card").innerHTML=reportCard(e.target.dataset.r)+'<p><button class="btn sm" onclick="print()">Print report card</button></p>'};
