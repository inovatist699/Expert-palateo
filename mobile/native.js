import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Geolocation } from '@capacitor/geolocation';
import { createClient } from '@supabase/supabase-js';

window.supabase={createClient};
window.PalateoNative={getCurrentPosition:options=>Geolocation.getCurrentPosition(options)};
App.addListener('backButton',()=>{
 const dialog=document.querySelector('dialog[open]');
 if(dialog){const cancel=new Event('cancel',{cancelable:true});if(dialog.dispatchEvent(cancel))dialog.close();return;}
 if(typeof page!=='undefined'&&page!=='home'&&typeof go==='function'){go('home');return;}
 App.minimizeApp();
});
App.addListener('appStateChange',({isActive})=>{if(!isActive)window.speechSynthesis?.cancel()});
document.addEventListener('click',event=>{
 const link=event.target.closest('a[href]');if(!link)return;
 const url=new URL(link.href,location.href);
 if(url.protocol==='https:'&&url.origin!==location.origin){event.preventDefault();Browser.open({url:url.href}).catch(()=>{});}
});
