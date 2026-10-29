let accountDeletionBusy=false;
function showAccountDeletion(){
 if(!currentUser)return;
 const truecallerOnly=!isRailwayActive()&&!currentUser.email&&currentUser.identities?.some(identity=>identity.provider==='custom:palateo-truecaller');
 document.getElementById('accountDeletionDialog')?.remove();
 document.body.insertAdjacentHTML('beforeend','<dialog id="accountDeletionDialog" aria-labelledby="accountDeletionTitle"><form data-action="confirm-account-deletion"><h2 id="accountDeletionTitle">Delete your Palateo account?</h2><p>This permanently removes your account, taste profile, ratings, saved places and connections. It cannot be undone.</p><label for="deleteAccountPassword">Confirm your password</label><input class="field" type="password" id="deleteAccountPassword" autocomplete="current-password" required maxlength="256"><label><input id="deleteAccountConfirm" type="checkbox" required> I understand that my account and data will be deleted.</label><p id="deleteAccountStatus" role="status"></p><div class="modalActions"><button class="btn secondary" type="button" data-action="cancel-deletion">Cancel</button><button class="btn" type="submit" id="deleteAccountSubmit">Delete permanently</button></div></form></dialog>');
 if(truecallerOnly){
  const password=document.getElementById('deleteAccountPassword');password.required=false;password.hidden=true;
  document.querySelector('label[for="deleteAccountPassword"]').textContent='Confirm your identity with Truecaller before deletion.';
  document.getElementById('deleteAccountSubmit').textContent='Verify and delete permanently';
 }
 const dialog=document.getElementById('accountDeletionDialog');dialog.addEventListener('cancel',event=>{if(accountDeletionBusy)event.preventDefault()});dialog.showModal();document.getElementById(truecallerOnly?'deleteAccountConfirm':'deleteAccountPassword').focus();
}
async function deletePalateoAccount(){
 if(accountDeletionBusy||!currentUser)return;
 const password=document.getElementById('deleteAccountPassword').value,owner=currentUser.id,email=currentUser.email;
 const truecallerOnly=!isRailwayActive()&&!email&&currentUser.identities?.some(identity=>identity.provider==='custom:palateo-truecaller');
 const status=document.getElementById('deleteAccountStatus'),button=document.getElementById('deleteAccountSubmit');
 if((!truecallerOnly&&!password)||!document.getElementById('deleteAccountConfirm').checked)return;
 accountDeletionBusy=true;button.disabled=true;status.textContent='Deleting your account…';
 try{
  if(isRailwayActive())await railwayFetch('/api/auth/delete-user',{method:'POST',body:JSON.stringify({password})});
  else{
   const client=getSupabaseClient();
   if(truecallerOnly)await verifyWithTruecaller({reauthenticate:true});
   else{const {data,error}=await client.auth.signInWithPassword({email,password});if(error)throw error;if(data.user?.id!==owner)throw Error('Account changed. Please sign in again.');}
   if(currentUser?.id!==owner)throw Error('Account changed. Please sign in again.');
   const result=await client.rpc('delete_own_account');if(result.error)throw Error('Could not delete your account. Please retry or contact support.');
   await client.auth.signOut({scope:'local'});
  }
  localStorage.removeItem('palateo-palo-memory-v2:'+owner);localStorage.removeItem('palateo-palo-ai-consent:'+owner);
  if(currentUser&&currentUser.id!==owner){document.getElementById('accountDeletionDialog')?.remove();return;}
  betterAuthToken=null;betterAuthSession=null;localStorage.removeItem('better_auth_token');
  useAccount(null);document.getElementById('accountDeletionDialog').remove();requireAuthGate('Your account and associated data have been deleted.');
 }catch(error){status.textContent=error.message||'Deletion failed. Your account has not been confirmed deleted.';}
 finally{accountDeletionBusy=false;button.disabled=false;}
}
