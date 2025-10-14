/* DS³ Frontend functionality using localStorage
   Keys:
     ds3_skills, ds3_internships, ds3_hackathons, ds3_chats
   Chat structure:
     { group: [ {sender,msg,time} ], oneToOne: { "Alice": [ {from,to,msg,time} ], ... }, users: ["Alice","Priya",...] }
*/

// utility
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const readJSON = (k, def) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; }
};
const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const flash = (el) => { el.classList.add('flash'); setTimeout(()=>el.classList.remove('flash'),1200); };

// init storage defaults
function ensureDefaults(){
  if(!localStorage.getItem('ds3_skills')) writeJSON('ds3_skills', []);
  if(!localStorage.getItem('ds3_internships')) writeJSON('ds3_internships', []);
  if(!localStorage.getItem('ds3_hackathons')) writeJSON('ds3_hackathons', []);
  if(!localStorage.getItem('ds3_chats')) {
    writeJSON('ds3_chats', { group: [], oneToOne: {}, users: ["Alex","Priya","John","Jamie"] });
  }
}
ensureDefaults();

// page router
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || 'index';
  if(page === 'skills') initSkills();
  if(page === 'internships') initInternships();
  if(page === 'hackathons') initHackathons();
  if(page === 'chat') initChat();
});

/* ---------------- SKILLS ---------------- */
function initSkills(){
  const skills = readJSON('ds3_skills', []);
  const list = $('#skillsList');
  const form = $('#skillForm');
  const nameIn = $('#skillName');
  const noteIn = $('#skillNote');
  const progIn = $('#skillProgress');
  const progVal = $('#progressVal');

  const render = () => {
    list.innerHTML = '';
    const s = readJSON('ds3_skills', []);
    if(s.length === 0){ list.innerHTML = '<div class="muted">No skills yet — add one!</div>'; return; }
    s.slice().reverse().forEach((it, idx) => {
      const el = document.createElement('div');
      el.className = 'item fade-in';
      el.innerHTML = `
        <div class="meta">
          <div class="title">${escapeHtml(it.name)} <small style="font-size:0.8rem;color:#99cdeb">(${it.progress}%)</small></div>
          <div class="muted">${escapeHtml(it.note || '')}</div>
        </div>
        <div class="actions">
          <button class="btn small view">View</button>
          <button class="btn small del">Delete</button>
        </div>
      `;
      list.appendChild(el);
      // view opens small modal-like alert
      el.querySelector('.view').addEventListener('click', () => {
        alert(`${it.name}\nProgress: ${it.progress}%\n\nNote: ${it.note || '—'}`);
      });
      el.querySelector('.del').addEventListener('click', () => {
        if(!confirm('Delete this skill?')) return;
        const current = readJSON('ds3_skills', []);
        // skill index reversed mapping
        const trueIndex = current.length - 1 - idx;
        current.splice(trueIndex,1);
        writeJSON('ds3_skills', current);
        render();
      });
    });
  };

  // progress update display
  progIn.addEventListener('input', () => progVal.textContent = progIn.value);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameIn.value.trim();
    if(!name) return alert('Please enter a skill name');
    const note = noteIn.value.trim();
    const progress = Number(progIn.value || 0);
    const arr = readJSON('ds3_skills', []);
    arr.push({ id: Date.now(), name, note, progress, created: new Date().toISOString() });
    writeJSON('ds3_skills', arr);
    nameIn.value = ''; noteIn.value = ''; progIn.value = 0; progVal.textContent = 0;
    render();
    flash(list);
  });

  render();
}

/* ---------------- INTERNSHIPS ---------------- */
function initInternships(){
  const list = $('#internList');
  const form = $('#internForm');

  const render = () => {
    list.innerHTML = '';
    const arr = readJSON('ds3_internships', []);
    if(arr.length === 0){ list.innerHTML = '<div class="muted">No internships posted yet.</div>'; return; }
    arr.slice().reverse().forEach((it, idx) => {
      const el = document.createElement('div');
      el.className = 'item fade-in';
      el.innerHTML = `
        <div class="meta">
          <div class="title">${escapeHtml(it.role)} @ ${escapeHtml(it.company)}</div>
          <div class="muted">${escapeHtml(it.duration || '')}</div>
          <div class="muted">${escapeHtml(it.note || '')}</div>
        </div>
        <div class="actions">
          <button class="btn small view">View</button>
          <button class="btn small del">Delete</button>
        </div>
      `;
      list.appendChild(el);
      el.querySelector('.view').addEventListener('click', () => {
        alert(`${it.role} @ ${it.company}\nDuration: ${it.duration || '—'}\n\nNotes: ${it.note || '—'}`);
      });
      el.querySelector('.del').addEventListener('click', () => {
        if(!confirm('Delete this internship?')) return;
        const cur = readJSON('ds3_internships', []);
        const trueIndex = cur.length - 1 - idx;
        cur.splice(trueIndex,1);
        writeJSON('ds3_internships', cur);
        render();
      });
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const role = $('#internRole').value.trim();
    const company = $('#internCompany').value.trim();
    const duration = $('#internDuration').value.trim();
    const note = $('#internNote').value.trim();
    if(!role || !company) return alert('Role and Company are required');
    const arr = readJSON('ds3_internships', []);
    arr.push({ id: Date.now(), role, company, duration, note, created: new Date().toISOString() });
    writeJSON('ds3_internships', arr);
    form.reset();
    render();
    flash(list);
  });

  render();
}

/* ---------------- HACKATHONS ---------------- */
function initHackathons(){
  const list = $('#hackList');
  const form = $('#hackForm');

  const render = () => {
    list.innerHTML = '';
    const arr = readJSON('ds3_hackathons', []);
    if(arr.length === 0){ list.innerHTML = '<div class="muted">No hackathons posted yet — add one!</div>'; return; }
    arr.slice().reverse().forEach((it, idx) => {
      const el = document.createElement('div');
      el.className = 'item fade-in';
      el.innerHTML = `
        <div class="meta">
          <div class="title">${escapeHtml(it.name)}</div>
          <div class="muted">${escapeHtml(it.organizer || '')} • ${escapeHtml(it.dates || '')}</div>
          <div class="muted">${escapeHtml(it.desc || '')}</div>
          <a class="muted" href="${escapeHtml(it.link || '#')}" target="_blank">${it.link ? 'Registration link' : ''}</a>
        </div>
        <div class="actions">
          <button class="btn small view">View</button>
          <button class="btn small del">Delete</button>
        </div>
      `;
      list.appendChild(el);
      el.querySelector('.view').addEventListener('click', ()=> {
        alert(`${it.name}\n\nOrg: ${it.organizer || '—'}\nDates: ${it.dates || '—'}\n\n${it.desc || ''}\n\nLink: ${it.link || '—'}`);
      });
      el.querySelector('.del').addEventListener('click', ()=>{
        if(!confirm('Delete this hackathon?')) return;
        const cur = readJSON('ds3_hackathons', []);
        const trueIndex = cur.length - 1 - idx;
        cur.splice(trueIndex,1);
        writeJSON('ds3_hackathons', cur);
        render();
      });
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#hackName').value.trim();
    if(!name) return alert('Please provide a hackathon name');
    const organizer = $('#hackOrg').value.trim();
    const dates = $('#hackDates').value.trim();
    const link = $('#hackLink').value.trim();
    const desc = $('#hackDesc').value.trim();
    const arr = readJSON('ds3_hackathons', []);
    arr.push({ id: Date.now(), name, organizer, dates, link, desc, created: new Date().toISOString() });
    writeJSON('ds3_hackathons', arr);
    form.reset();
    render();
    flash(list);
  });

  render();
}

/* ---------------- CHAT ---------------- */
function initChat(){
  const chats = readJSON('ds3_chats', { group: [], oneToOne: {}, users: ["Alex","Priya","John","Jamie"] });
  const groupMessages = $('#groupMessages');
  const groupForm = $('#groupForm');
  const groupSender = $('#groupSender');
  const groupMsg = $('#groupMsg');

  const oneMessages = $('#oneMessages');
  const oneForm = $('#oneForm');
  const oneSender = $('#oneSender');
  const oneMsg = $('#oneMsg');
  const userSelect = $('#chatUserSelect');
  const newChatBtn = $('#newChat');

  // tabs
  $$('.tab').forEach(t => t.addEventListener('click', () => {
    $$('.tab').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    $$('.tabcontent').forEach(c=>c.classList.remove('show'));
    document.getElementById(t.dataset.target).classList.add('show');
  }));

  // load users
  function renderUsers(){
    const chatData = readJSON('ds3_chats', { group: [], oneToOne: {}, users: ["Alex","Priya","John","Jamie"] });
    userSelect.innerHTML = '';
    chatData.users.forEach(u => {
      const opt = document.createElement('option'); opt.value = u; opt.textContent = u;
      userSelect.appendChild(opt);
    });
  }

  // group render
  function renderGroup(){
    const data = readJSON('ds3_chats', { group: [], oneToOne: {}, users: [] }).group || [];
    groupMessages.innerHTML = '';
    data.slice().forEach(m => {
      const el = document.createElement('div');
      el.className = `msg ${m.sender === 'You' ? 'you':''}`;
      el.innerHTML = `<strong>${escapeHtml(m.sender)}</strong>: ${escapeHtml(m.msg)} <small>${timeAgo(m.time)}</small>`;
      groupMessages.appendChild(el);
    });
    groupMessages.scrollTop = groupMessages.scrollHeight;
  }

  // one-to-one
  let activeContact = userSelect.value || null;
  function renderOne(){
    const data = readJSON('ds3_chats', { group: [], oneToOne: {}, users: [] });
    oneMessages.innerHTML = '';
    if(!activeContact){ oneMessages.innerHTML = '<div class="muted">Select or create a contact</div>'; return; }
    const msgs = data.oneToOne[activeContact] || [];
    msgs.slice().forEach(m => {
      const el = document.createElement('div');
      const isYou = m.from === 'You';
      el.className = `msg ${isYou ? 'you':''}`;
      el.innerHTML = `<strong>${escapeHtml(m.from)}</strong>: ${escapeHtml(m.msg)} <small>${timeAgo(m.time)}</small>`;
      oneMessages.appendChild(el);
    });
    oneMessages.scrollTop = oneMessages.scrollHeight;
  }

  userSelect.addEventListener('change', (e) => {
    activeContact = e.target.value;
    renderOne();
  });

  // create new contact (1-to-1)
  newChatBtn.addEventListener('click', () => {
    const name = prompt('Enter friend name to create 1-to-1 with (will add to contacts):');
    if(!name) return;
    const data = readJSON('ds3_chats', { group: [], oneToOne: {}, users: [] });
    if(!data.users.includes(name)) data.users.push(name);
    if(!data.oneToOne[name]) data.oneToOne[name] = [];
    writeJSON('ds3_chats', data);
    renderUsers();
    userSelect.value = name;
    activeContact = name;
    renderOne();
    flash(userSelect);
  });

  // send group message
  groupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const sender = (groupSender.value.trim() || 'You');
    const msg = groupMsg.value.trim();
    if(!msg) return;
    const data = readJSON('ds3_chats', { group: [], oneToOne: {}, users: [] });
    data.group.push({ sender, msg, time: new Date().toISOString() });
    writeJSON('ds3_chats', data);
    groupMsg.value = '';
    renderGroup();
    flash(groupMessages);
  });

  // send one-to-one
  oneForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const sender = (oneSender.value.trim() || 'You');
    const msg = oneMsg.value.trim();
    if(!activeContact) return alert('Select a contact first');
    if(!msg) return;
    const data = readJSON('ds3_chats', { group: [], oneToOne: {}, users: [] });
    if(!data.oneToOne[activeContact]) data.oneToOne[activeContact] = [];
    data.oneToOne[activeContact].push({ from: sender, to: activeContact, msg, time: new Date().toISOString() });
    // also allow symmetry: add a message under their thread as if received? For prototype, we'll just store in their array.
    writeJSON('ds3_chats', data);
    oneMsg.value = '';
    renderOne();
    flash(oneMessages);
  });

  // init
  renderUsers();
  if(userSelect.options.length) { userSelect.selectedIndex = 0; activeContact = userSelect.value; }
  renderGroup();
  renderOne();
}

/* ---------------- utilities ---------------- */
function timeAgo(iso){
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime())/1000);
  if(diff < 5) return 'just now';
  if(diff < 60) return `${diff}s ago`;
  if(diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if(diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return d.toLocaleString();
}
function escapeHtml(unsafe){
  if(!unsafe && unsafe !== 0) return '';
  return String(unsafe).replace(/[&<>"'`]/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[m]));
}
