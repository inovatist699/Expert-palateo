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
let email=document.getElementById('authEmail')?.value.trim()||'',password=document.getElementById('authPass')?.value||'';
if(email&&email.includes('@')&&!email.includes('.')){email+='.com';const el=document.getElementById('authEmail');if(el)el.value=email;}
const setError=message=>{status.dataset.kind='error';status.textContent=message};
if(!email){setError('Please enter your email address.');document.getElementById('authEmail')?.focus();return}
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setError('Please enter a valid email address.');document.getElementById('authEmail')?.focus();return}
if(password.length<6){setError('Password must be at least 6 characters.');document.getElementById('authPass')?.focus();return}
let name='',phone='';
if(mode==='signup'){
if(password.length<8){setError('Use at least 8 characters for a new password.');return}
name=document.getElementById('authName')?.value.trim()||'';phone=document.getElementById('authPhone')?.value.trim()||'';
if(name.length<2){setError('Please enter your full name.');document.getElementById('authName')?.focus();return}
if(phone&&phone.replace(/\D/g,'').length<7){setError('Please enter a phone number with at least 7 digits.');document.getElementById('authPhone')?.focus();return}
}
authBusy=true;if(submit)submit.disabled=true;
status.dataset.kind='loading';status.textContent=mode==='signup'?'Creating your account…':'Signing you in…';
try{if(mode==='signup')await signUpV5(name,phone,email,password,readLegalConsent());else await signInV5(email,password)}
catch(error){const currentStatus=document.getElementById('authStatus');if(currentStatus){currentStatus.dataset.kind='error';currentStatus.textContent=authErrorMessage(error)}}
finally{authBusy=false;const currentButton=document.getElementById('authSubmit');if(currentButton)currentButton.disabled=false}
}
async function handleTruecallerAuth(){
 if(authBusy)return;
 const status=document.getElementById('authStatus'),tcBtn=document.querySelector('[data-action="truecaller-verify"]');
 if(window.PalateoNative?.truecaller){
  if(status){status.dataset.kind='loading';status.textContent='Verifying mobile with Truecaller…';}
  if(tcBtn)tcBtn.disabled=true;
  authBusy=true;
  try{
   await verifyWithTruecaller();
  }catch(error){
   console.warn('[Truecaller Native Auth] Fallback to modal:', error);
   showMobileVerificationModal(document.getElementById('authPhone')?.value||'');
  }finally{
   authBusy=false;
   const currentTcBtn=document.querySelector('[data-action="truecaller-verify"]');
   if(currentTcBtn)currentTcBtn.disabled=false;
  }
 }else{
  showMobileVerificationModal(document.getElementById('authPhone')?.value||'');
 }
}
async function submitMobileVerify(form){
 if(authBusy)return;
 const phoneInput=form.querySelector('#tcPhoneInput')||form.querySelector('input[name="phone"]');
 const status=form.querySelector('#tcVerifyStatus');
 const submitBtn=form.querySelector('#tcSubmitBtn');
 const rawPhone=(phoneInput?.value||'').trim();
 const digits=rawPhone.replace(/\D/g,'').slice(-10);
 if(digits.length<10){
  if(status){status.dataset.kind='error';status.textContent='Please enter a valid 10-digit mobile number.';}
  phoneInput?.focus();
  return;
 }
 const formattedPhone='+91'+digits;
 const name=document.getElementById('authName')?.value?.trim()||state.profile?.name||'Palateo Foodie';
 authBusy=true;
 if(submitBtn)submitBtn.disabled=true;
 if(status){status.dataset.kind='loading';status.textContent='Verifying mobile number…';}
 try{
  await verifyWithTruecaller({phone:formattedPhone,name});
  document.getElementById('mobileVerifyModal')?.remove?.();
 }catch(error){
  if(status){status.dataset.kind='error';status.textContent=authErrorMessage(error);}
 }finally{
  authBusy=false;
  if(submitBtn)submitBtn.disabled=false;
 }
}
