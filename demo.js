(() => {
 const app=document.body.dataset.app;
 const $=id=>document.getElementById(id);
 if(app==='grade-calculator'){
  const ids=['grade1','grade2','grade3','weight1','weight2','weight3'];
  $('calculate').addEventListener('click',()=>{
   const grades=[1,2,3].map(i=>Number($('grade'+i).value));
   const weights=[1,2,3].map(i=>Number($('weight'+i).value));
   if(grades.some((v,i)=>$('grade'+(i+1)).value===''||!Number.isFinite(v)||v<0||v>100)||weights.some((v,i)=>$('weight'+(i+1)).value===''||!Number.isFinite(v)||v<0||v>100)){$('result').textContent='Please enter valid grades and weights from 0 to 100.';return;}
   const total=weights.reduce((a,b)=>a+b,0);if(total===0){$('result').textContent='Please set at least one weight above zero.';return;}
   const score=grades.reduce((sum,g,i)=>sum+g*weights[i],0)/total;
   $('result').innerHTML=`<div class="small">WEIGHTED AVERAGE</div><strong style="font-size:2rem">${score.toFixed(2)}%</strong><div>${score>=75?'✓ Passing based on the demo threshold of 75%.':'Below the demo passing threshold of 75%.'}</div><div class="small">Weights total ${total}%; normalized automatically.</div>`;
  });$('reset').addEventListener('click',()=>{ids.forEach((id,i)=>$(id).value=[90,88,94,40,30,30][i]);$('result').textContent='Your result will appear here.';});
 }
 if(app==='password-generator'){
  const chars={lower:'abcdefghijklmnopqrstuvwxyz',upper:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',numbers:'0123456789',symbols:'!@#$%^&*()-_=+[]{};:,.?'};
  $('length').addEventListener('input',()=> $('lengthValue').textContent=$('length').value);
  $('generate').addEventListener('click',()=>{let pool='',required=[];Object.keys(chars).forEach(k=>{if($(k).checked){pool+=chars[k];required.push(chars[k]);}});if(!pool){$('message').textContent='Choose at least one character type.';$('password').textContent='';return;}const n=Number($('length').value);let out=required.map(s=>s[crypto.getRandomValues(new Uint32Array(1))[0]%s.length]);const random=()=>crypto.getRandomValues(new Uint32Array(1))[0]%pool.length;while(out.length<n)out.push(pool[random()]);for(let i=out.length-1;i>0;i--){const j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[out[i],out[j]]=[out[j],out[i]];}$('password').textContent=out.join('');$('message').textContent='Password generated locally in your browser.';});
  $('copy').addEventListener('click',async()=>{const p=$('password').textContent;if(!p||p==='Click Generate to begin'){$('message').textContent='Generate a password first.';return;}try{await navigator.clipboard.writeText(p);$('message').textContent='Password copied to clipboard.';}catch(e){$('message').textContent='Copy is blocked by this browser. Select the password and copy it manually.';}});
 }
 if(app==='python-calculator'){
  let expr='';const display=$('display');const paint=()=>display.textContent=expr||'0';
  function press(k){if(k==='C'){expr='';paint();return;}if(k==='back'){expr=expr.slice(0,-1);paint();return;}if(k==='='){try{if(!expr||!/^[0-9+*/%.()\- ]+$/.test(expr))throw Error();const result=Function('"use strict";return ('+expr+')')();if(typeof result!=='number'||!Number.isFinite(result))throw Error();expr=String(Number(result.toPrecision(12)));}catch(e){expr='';display.textContent='Invalid expression';return;}paint();return;}if(expr.length<80)expr+=k;paint();}
  document.querySelectorAll('[data-key]').forEach(b=>b.addEventListener('click',()=>press(b.dataset.key)));document.addEventListener('keydown',e=>{if(/^[0-9+*/%.()\-]$/.test(e.key))press(e.key);else if(e.key==='Enter'||e.key==='='){e.preventDefault();press('=');}else if(e.key==='Backspace')press('back');else if(e.key==='Escape')press('C');});
 }
 if(app==='todo-list'){
  const key='rain-project-lab-tasks-v1';let tasks=[];try{tasks=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(tasks))tasks=[];}catch(e){tasks=[];}
  const save=()=>{try{localStorage.setItem(key,JSON.stringify(tasks));}catch(e){}render();};
  function render(){const list=$('tasks');list.replaceChildren();tasks.forEach(task=>{const li=document.createElement('li');if(task.done)li.classList.add('done');const check=document.createElement('input');check.type='checkbox';check.checked=task.done;check.setAttribute('aria-label','Mark task complete');check.addEventListener('change',()=>{task.done=check.checked;save();});const span=document.createElement('span');span.textContent=task.text;const del=document.createElement('button');del.className='danger';del.textContent='Delete';del.addEventListener('click',()=>{tasks=tasks.filter(t=>t.id!==task.id);save();});li.append(check,span,del);list.append(li);});const left=tasks.filter(t=>!t.done).length;$('taskSummary').textContent=`${tasks.length} task${tasks.length===1?'':'s'} · ${left} remaining`+(tasks.length===0?' — add your first task above.':'');}
  $('taskForm').addEventListener('submit',e=>{e.preventDefault();const text=$('taskInput').value.trim();if(!text)return;tasks.push({id:Date.now()+Math.random(),text,done:false});$('taskInput').value='';save();});$('clearDone').addEventListener('click',()=>{tasks=tasks.filter(t=>!t.done);save();});$('clearAll').addEventListener('click',()=>{if(tasks.length&&confirm('Delete every task?')){tasks=[];save();}});render();
 }
})();
