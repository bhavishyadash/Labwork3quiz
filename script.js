

const answers = {
	q1: 'a', 
	q2: ['color','background','font-size','text-decoration'],
	q3: ['article','nav'],
	q4: '404',
	q5: 32
};


function iconSVG(type){
	if(type==='ok') return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232a9d8f"><path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z"/></svg>'
	return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e76f51"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V6h2v7z"/></svg>'
}


function populateQ2(){
	const choices = [
		{value:'color',label:'color'},
		{value:'background',label:'background-color'},
		{value:'font-size',label:'font-size'},
		{value:'text-decoration',label:'text-decoration'}
	];
	
	for(let i=choices.length-1;i>0;i--){
		const j=Math.floor(Math.random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]]
	}
	const container = document.getElementById('q2-choices');
	container.innerHTML='';
	choices.forEach((c,idx)=>{
		const id=`q2-${idx}`;
		const label = document.createElement('label');
		label.className='choice';
		label.htmlFor=id;
		label.innerHTML = `<input type="radio" id="${id}" name="q2" value="${c.value}"> <span>${c.label}</span>`;
		container.appendChild(label);
	});
}

function showFeedback(qid, correct, text){
	const fb = document.querySelector(`.feedback[data-for="${qid}"]`);
	fb.innerHTML = '';
	const img = document.createElement('img');
	img.src = iconSVG(correct? 'ok':'err');
	img.alt = correct? 'correct':'incorrect';
	const span = document.createElement('span');
	span.textContent = text;
	fb.appendChild(img);
	fb.appendChild(span);
}

function computeScore(){
	let score = 0; let details = {};

	
	const q1 = (document.getElementById('q1-input').value||'').trim().toLowerCase();
	const q1Correct = (q1 === 'a' || q1 === '<a>' || q1 === 'anchor' || q1 === 'anchor tag');
	if(q1Correct){ score += 20 }
	details.q1 = q1Correct;

	
	const radios = document.querySelectorAll('input[name="q2"]');
	let q2val='';
	radios.forEach(r=>{ if(r.checked) q2val=r.value });
	const q2Correct = q2val==='color';
	if(q2Correct) score+=20;
	details.q2=q2Correct;

	
	const checked = Array.from(document.querySelectorAll('input[name="q3"]:checked')).map(i=>i.value);
	const required = ['article','nav'];
	const q3Correct = required.every(r=>checked.includes(r)) && checked.length===required.length;
	if(q3Correct) score+=20;
	details.q3=q3Correct;

	
	const q4 = document.getElementById('q4-select').value;
	const q4Correct = q4==='404';
	if(q4Correct) score+=20;
	details.q4=q4Correct;

	
	const q5 = Number(document.getElementById('q5-range').value);
	const q5Correct = q5===32;
	if(q5Correct) score+=20;
	details.q5=q5Correct;

	return {score,details};
}

function updatePerQuestionFeedback(details){
	showFeedback('q1', details.q1, details.q1? 'Correct':'Wrong — answer: <a>');
	showFeedback('q2', details.q2, details.q2? 'Correct':'Wrong — property is "color"');
	showFeedback('q3', details.q3, details.q3? 'Correct':'Wrong — semantic elements: article, nav');
	showFeedback('q4', details.q4, details.q4? 'Correct':'Wrong — 404 is Not Found');
	showFeedback('q5', details.q5, details.q5? 'Correct':'Wrong — IPv4 is 32 bits');
}

function disableInputs(){
	const inputs = document.querySelectorAll('#quiz input, #quiz select, #quiz button');
	inputs.forEach(i=>{ if(i.id!=='reset') i.disabled=true });
}

function enableInputs(){
	const inputs = document.querySelectorAll('#quiz input, #quiz select, #quiz button');
	inputs.forEach(i=> i.disabled=false );
}

// localStorage: track times taken
function incrementTimes(){
	const key = 'lab3_times';
	const val = Number(localStorage.getItem(key) || '0') + 1;
	localStorage.setItem(key, String(val));
	document.getElementById('times').textContent = val;
}

function loadTimes(){
	const key='lab3_times';
	const val = Number(localStorage.getItem(key) || '0');
	document.getElementById('times').textContent = val;
}


document.addEventListener('DOMContentLoaded', ()=>{
	populateQ2();
	loadTimes();

	
	const r=document.getElementById('q5-range');
	const v=document.getElementById('q5-val');
	v.textContent=r.value;
	r.addEventListener('input',()=> v.textContent=r.value);

	document.getElementById('submit').addEventListener('click', ()=>{
		const {score,details} = computeScore();
		updatePerQuestionFeedback(details);
		document.getElementById('summary').innerHTML = `<div class="score">Total: ${score} / 100</div>`;
		if(score>80){
			const c = document.createElement('div'); c.className='congrats'; c.textContent='Congratulations — great job!';
			document.getElementById('summary').appendChild(c);
		}
		incrementTimes();
		disableInputs();
	});

	document.getElementById('reset').addEventListener('click', ()=>{
		
		document.getElementById('quiz').reset();
		populateQ2();
		document.querySelectorAll('.feedback').forEach(f=>f.innerHTML='');
		document.getElementById('summary').innerHTML='';
		enableInputs();
		loadTimes();
		
		document.getElementById('q5-val').textContent = document.getElementById('q5-range').value;
	});
});
