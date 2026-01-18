// Minimal, dependency-free form handler with toast notifications
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('waiting-list');
  if(!form) return;
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastClose = document.getElementById('toast-close');
  let toastTimer = null;

  function showToast(message, type){
    if(!toast) return;
    toastMessage.textContent = message;
    toast.classList.remove('success','error');
    toast.classList.add(type === 'error' ? 'error' : 'success');
    toast.hidden = false;
    requestAnimationFrame(()=> toast.classList.add('show'));
    toast.setAttribute('tabindex','-1');
    toast.focus({preventScroll:true});
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>hideToast(), 5000);
  }

  function hideToast(){
    if(!toast) return;
    toast.classList.remove('show');
    clearTimeout(toastTimer);
    setTimeout(()=>{ toast.hidden = true; toast.removeAttribute('tabindex'); }, 250);
  }

  if(toastClose) toastClose.addEventListener('click', hideToast);
  if(toast) toast.addEventListener('keydown', (ev)=>{ if(ev.key === 'Escape') hideToast(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';

    // Honeypot
    if(form.querySelector('input[name="_gotcha"]').value){
      // silently fail
      return;
    }

    // Basic built-in validation check
    if(!form.checkValidity()){
      const msg = 'Please fill required fields correctly.';
      statusEl.textContent = msg;
      form.reportValidity();
      showToast(msg, 'error');
      return;
    }

    // Read endpoint from data attribute
    const endpoint = form.dataset.endpoint;
    if(!endpoint || endpoint.includes('XXXX')){
      const msg = 'Form endpoint is not configured. Please set site.form_endpoint in `_config.yml`.';
      statusEl.textContent = msg;
      showToast(msg, 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Convert form to JSON and add lightweight metadata for audit/GDPR
    const fd = new FormData(form);
    const payload = {};
    fd.forEach((v,k)=>{payload[k]=v});
    // Add a timestamp so we can demonstrate consent/time of opt-in for GDPR
    payload.signup_ts = new Date().toISOString();
    // add where the signup came from
    payload.source = window.location.href;

    try{
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if(res.ok){
        const okMsg = 'Thanks — you are on the waiting list. We will contact you with details.';
        statusEl.textContent = okMsg;
        showToast(okMsg, 'success');
        form.reset();
      } else {
        const data = await res.json().catch(()=>({}));
        const err = data.error || 'Failed to submit. Please try again later.';
        statusEl.textContent = err;
        showToast(err, 'error');
      }
    }catch(err){
      console.error(err);
      const errMsg = 'Network error. Please try again later.';
      statusEl.textContent = errMsg;
      showToast(errMsg, 'error');
    }finally{
      submitBtn.disabled = false;
      submitBtn.textContent = 'Join waiting list';
    }
  });
});
