let authEmailNextAt=0,passwordRecovery=false;
async function sendAuthEmail(type){
 const status=document.getElementById('authStatus'),email=document.getElementById('authEmail')?.value.trim()||'';
 if(!status)return;
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){status.textContent='Enter your email address above first.';return}
 if(Date.now()<authEmailNextAt){status.textContent='Please wait one minute before requesting another email.';return}
 authEmailNextAt=Date.now()+60000;status.textContent='Requesting email…';
 try{
  const client=getSupabaseClient(),options={emailRedirectTo:'https://palateo.in/app/'};
  const {error}=type==='recovery'?await client.auth.resetPasswordForEmail(email,{redirectTo:options.emailRedirectTo}):await client.auth.resend({type:'signup',email,options});
  if(error)throw error;
  status.textContent='If an eligible account exists, an email will arrive shortly. Check your spam folder too.';
 }catch(error){status.textContent=authErrorMessage(error)}
}
function showPasswordRecovery(){
 document.getElementById('authModal')?.remove();
 document.body.insertAdjacentHTML('beforeend','<div class="modal" id="authModal" role="dialog" aria-modal="true" aria-labelledby="authTitle"><div class="modalCard"><h2 id="authTitle">Choose a new password</h2><form data-action="password-reset"><label class="fieldLabel" for="resetPassword">New password</label><input class="field" id="resetPassword" type="password" autocomplete="new-password" minlength="8" required><label class="fieldLabel" for="resetConfirm">Confirm password</label><input class="field" id="resetConfirm" type="password" autocomplete="new-password" minlength="8" required><div class="status" id="authStatus" aria-live="polite"></div><button class="btn green" id="authSubmit" type="submit">Save new password</button></form></div></div>');
 document.getElementById('resetPassword')?.focus();
}
async function resetAccountPassword(){
 if(authBusy)return;
 const password=document.getElementById('resetPassword')?.value||'',confirm=document.getElementById('resetConfirm')?.value||'',status=document.getElementById('authStatus');
 if(password.length<8||password!==confirm){status.textContent='Enter matching passwords with at least 8 characters.';return}
 authBusy=true;document.getElementById('authSubmit').disabled=true;
 try{const {error}=await getSupabaseClient().auth.updateUser({password});if(error)throw error;passwordRecovery=false;document.getElementById('authModal')?.remove();go('home');toast('Your password was updated.')}catch(error){status.textContent=authErrorMessage(error)}finally{authBusy=false;const button=document.getElementById('authSubmit');if(button)button.disabled=false}
}
function closeAuth(){if(authRequired&&!currentUser)return;document.getElementById('authModal')?.remove();document.getElementById('mobileVerifyModal')?.remove?.();}
