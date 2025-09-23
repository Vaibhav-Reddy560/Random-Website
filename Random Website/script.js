/* Basic interactive behavior
   - mockup view switching
   - modal dialog for notification
   - a local "email capture" (stores in localStorage and shows status)
   - simple countdown
*/

document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mockup switching
  const dots = Array.from(document.querySelectorAll('.dot'));
  const mockups = {
    front: document.getElementById('mockup-front'),
    back:  document.getElementById('mockup-back'),
    side:  document.getElementById('mockup-side')
  };
  function setMockup(view){
    Object.values(mockups).forEach(img => img.classList.remove('active'));
    if(view === 'front') mockups.front.classList.add('active');
    if(view === 'back') mockups.back.classList.add('active');
    if(view === 'side') mockups.side.classList.add('active');
    dots.forEach(d => d.classList.toggle('active', d.dataset.target === view));
  }
  dots.forEach(d => d.addEventListener('click', () => setMockup(d.dataset.target)));
  // auto rotate every 4.5s
  let views = ['front','side','back'];
  let idx = 0;
  setInterval(() => { idx = (idx+1) % views.length; setMockup(views[idx]); }, 4500);

  // Dialog (notify)
  const notifyBtn = document.getElementById('notifyBtn');
  const dialog = document.getElementById('notifyDialog');
  const dialogClose = document.getElementById('dialogClose');
  const dialogCancel = document.getElementById('dialogCancel');
  const dialogForm = document.getElementById('dialogForm');
  const dialogEmail = document.getElementById('dialogEmail');
  const dialogMsg = document.getElementById('dialogMsg');

  function openDialog() {
    dialog.setAttribute('aria-hidden','false');
    dialogEmail.focus();
  }
  function closeDialog() {
    dialog.setAttribute('aria-hidden','true');
    dialogMsg.textContent = '';
  }
  notifyBtn.addEventListener('click', openDialog);
  dialogClose.addEventListener('click', closeDialog);
  dialogCancel.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (e) => { if(e.target === dialog) closeDialog(); });

  // Signup handling (both main form and dialog)
  const signupForm = document.getElementById('signupForm');
  const emailInput = document.getElementById('email');
  const signupMsg = document.getElementById('signupMsg');

  function handleSubmit(email, msgEl) {
    if(!email || !/.+@.+\..+/.test(email)) {
      msgEl.textContent = 'Please enter a valid email.';
      return;
    }
    // local store (easy to replace with API call)
    const saved = JSON.parse(localStorage.getItem('jb_emails') || '[]');
    if(saved.includes(email)) {
      msgEl.textContent = 'You are already on the list — thanks!';
    } else {
      saved.push(email);
      localStorage.setItem('jb_emails', JSON.stringify(saved));
      msgEl.textContent = 'Thanks — you’re on the list!';
    }
  }

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSubmit(emailInput.value.trim(), signupMsg);
  });

  dialogForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const m = dialogForm.querySelector('#dialogMsg');
    handleSubmit(dialogEmail.value.trim(), dialogMsg);
    if(/.+@.+\..+/.test(dialogEmail.value.trim())) {
      setTimeout(() => { closeDialog(); }, 1000);
    }
  });

  // Countdown (set the target date here)
  // Replace with your drop date (YYYY, M-1, D, H, M, S)
  const dropDate = new Date(Date.UTC(2025, 11, 1, 12, 0, 0)); // Dec 1, 2025 12:00 UTC example
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('mins');
  const secsEl = document.getElementById('secs');

  function updateCountdown(){
    const now = new Date();
    let diff = Math.max(0, Math.floor((dropDate - now) / 1000));
    const days = Math.floor(diff / 86400); diff %= 86400;
    const hours = Math.floor(diff / 3600); diff %= 3600;
    const mins = Math.floor(diff / 60); const secs = diff % 60;
    daysEl.textContent = String(days).padStart(2,'0');
    hoursEl.textContent = String(hours).padStart(2,'0');
    minsEl.textContent = String(mins).padStart(2,'0');
    secsEl.textContent = String(secs).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

});
