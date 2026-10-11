function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){console.warn('Local preferences could not be saved',e)}}
