let authBusy=false;
function authErrorMessage(error){
const message=String(error?.message||'');
if(/invalid login credentials/i.test(message))return 'Those details did not match an account. Check your email and password, or create an account.';
if(/email not confirmed/i.test(message))return 'Please confirm your email from the message we sent, then sign in.';
if(/already registered|user already exists/i.test(message))return 'That email already has an account. Sign in instead.';
if(/network|failed to fetch|library did not load|load/i.test(message))return 'Palateo could not reach its sign-in service. Check your internet connection and try again.';
return message||'We could not complete that request. Please try again.';
}
async function submitAuth(mode){
if(authBusy)return;
const status=document.getElementById('authStatus'),submit=document.getElementById('authSubmit');
if(!status)return;
const email=document.getElementById('authEmail')?.value.trim()||'',password=document.getElementById('authPass')?.value||'';
const setError=message=>{status.dataset.kind='error';status.textContent=message};
if(!email){setError('Please enter your email address.');document.getElementById('authEmail')?.focus();return}
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setError('Please enter a valid email address.');document.getElementById('authEmail')?.focus();return}
if(password.length<6){setError('Password must be at least 6 characters.');document.getElementById('authPass')?.focus();return}
let name='',phone='';
if(mode==='signup'){
name=document.getElementById('authName')?.value.trim()||'';phone=document.getElementById('authPhone')?.value.trim()||'';
if(name.length<2){setError('Please enter your full name.');document.getElementById('authName')?.focus();return}
if(phone.replace(/\D/g,'').length<7){setError('Please enter a phone number with at least 7 digits.');document.getElementById('authPhone')?.focus();return}
}
authBusy=true;if(submit)submit.disabled=true;
status.dataset.kind='loading';status.textContent=mode==='signup'?'Creating your account…':'Signing you in…';
try{if(mode==='signup')await signUpV5(name,phone,email,password,readLegalConsent());else await signInV5(email,password)}
catch(error){const currentStatus=document.getElementById('authStatus');if(currentStatus){currentStatus.dataset.kind='error';currentStatus.textContent=authErrorMessage(error)}}
finally{authBusy=false;const currentButton=document.getElementById('authSubmit');if(currentButton)currentButton.disabled=false}
}
