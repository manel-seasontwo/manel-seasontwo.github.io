// Minimal, dependency-free form handler
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('waiting-list');
  if(!form) return;
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

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
      statusEl.textContent = 'Please fill required fields correctly.';
      form.reportValidity();
      return;
    }

    // Read endpoint from data attribute
    const endpoint = form.dataset.endpoint;
    if(!endpoint || endpoint.includes('XXXX')){
      statusEl.textContent = 'Form endpoint is not configured. Please set site.form_endpoint in `_config.yml`.';
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
        statusEl.textContent = 'Thanks — you are on the waiting list. We will contact you with details.';
        form.reset();
      } else {
        const data = await res.json().catch(()=>({}));
        statusEl.textContent = data.error || 'Failed to submit. Please try again later.';
      }
    }catch(err){
      console.error(err);
      statusEl.textContent = 'Network error. Please try again later.';
    }finally{
      submitBtn.disabled = false;
      submitBtn.textContent = 'Join waiting list';
    }
  });
});
