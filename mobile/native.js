import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Geolocation } from '@capacitor/geolocation';
import { registerPlugin } from '@capacitor/core';
import { createClient } from '@supabase/supabase-js';

const TruecallerAuth = typeof registerPlugin === 'function' ? registerPlugin('TruecallerAuth') : null;

window.supabase={createClient};
window.PalateoNative={
  getCurrentPosition:options=>Geolocation.getCurrentPosition(options),
  truecaller:{
    isAvailable:async()=>{
      try{
        if(!TruecallerAuth)return false;
        const res=await TruecallerAuth.isUsable();
        return Boolean(res&&res.usable);
      }catch(e){return false;}
    },
    verifyMobile:async(options)=>{
      if(!TruecallerAuth)throw new Error('Truecaller plugin is not registered');
      return await TruecallerAuth.verifyMobile(options||{});
    }
  }
};
App.addListener('backButton',()=>{
 const dialog=document.querySelector('dialog[open]');
 if(dialog){const cancel=new Event('cancel',{cancelable:true});if(dialog.dispatchEvent(cancel))dialog.close();return;}
 if(document.getElementById('passportModalBackdrop')){closePalatePassportModal();return;}
 if(document.getElementById('accountDeletionDialog')){document.querySelector('[data-action="cancel-deletion"]')?.click();return;}
 if(document.getElementById('authModal')){const close=document.querySelector('[data-action="close-auth"]');if(close)close.click();else App.minimizeApp();return;}
 if(typeof page!=='undefined'&&page==='place'&&typeof closePlaceDetails==='function'){closePlaceDetails();return;}
 if(typeof page!=='undefined'&&page!=='home'&&typeof go==='function'){go('home');return;}
 App.minimizeApp();
});
App.addListener('appStateChange',({isActive})=>{if(!isActive)window.speechSynthesis?.cancel()});
document.addEventListener('click',event=>{
 const link=event.target.closest('a[href]');if(!link)return;
 const url=new URL(link.href,location.href);
 if(url.protocol==='https:'&&url.origin!==location.origin){event.preventDefault();Browser.open({url:url.href}).catch(()=>{});}
});
