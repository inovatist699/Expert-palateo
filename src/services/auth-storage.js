/* Optional Supabase integration point.
   The SQL package created for Palateo contains matching tables and RPC.
   This function intentionally requires the developer to provide the
   project URL + publishable key rather than embedding secrets.
*/
/* Persistent auth storage for Android/file/content:// launches.
   Supabase normally uses localStorage, but a locally opened HTML file can
   get a different/isolated storage context. We use IndexedDB first and
   localStorage as a fallback so returning users stay signed in. */
const PALATEO_AUTH_DB='palateo_auth_v1';
const PALATEO_AUTH_STORE='sessions';
let palateoAuthDbPromise=null;
function openPalateoAuthDb(){
if(!window.indexedDB)return Promise.resolve(null);
if(!palateoAuthDbPromise)palateoAuthDbPromise=new Promise((resolve,reject)=>{
const request=window.indexedDB.open(PALATEO_AUTH_DB,1);
request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(PALATEO_AUTH_STORE))db.createObjectStore(PALATEO_AUTH_STORE)};
request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();palateoAuthDbPromise=null};resolve(db)};
request.onerror=()=>{palateoAuthDbPromise=null;reject(request.error)};
request.onblocked=()=>{palateoAuthDbPromise=null;reject(new Error('Auth storage is busy in another tab'))};
});
return palateoAuthDbPromise;
}
async function authStorageRequest(mode,operation,key,value){
const db=await openPalateoAuthDb();if(!db)return null;
return new Promise((resolve,reject)=>{
const transaction=db.transaction(PALATEO_AUTH_STORE,mode),store=transaction.objectStore(PALATEO_AUTH_STORE);let result=null;
transaction.oncomplete=()=>resolve(result);
transaction.onerror=()=>reject(transaction.error||new Error('Auth storage transaction failed'));
transaction.onabort=()=>reject(transaction.error||new Error('Auth storage transaction was cancelled'));
let request;if(operation==='get')request=store.get(key);if(operation==='set')request=store.put(value,key);if(operation==='remove')request=store.delete(key);
if(request)request.onsuccess=()=>{result=request.result??null};
});
}
const palateoAuthStorage={
  async getItem(key){
    try{const value=await authStorageRequest('readonly','get',key);if(value!=null)return value}catch(e){console.warn('IndexedDB auth read',e)}
    try{return window.localStorage.getItem(key)}catch(e){return null}
  },
  async setItem(key,value){
    try{await authStorageRequest('readwrite','set',key,value)}catch(e){console.warn('IndexedDB auth write',e)}
    try{window.localStorage.setItem(key,value)}catch(e){}
  },
  async removeItem(key){
    try{await authStorageRequest('readwrite','remove',key)}catch(e){}
    try{window.localStorage.removeItem(key)}catch(e){}
  }
};

