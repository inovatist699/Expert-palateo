function load(){try{const value=JSON.parse(localStorage.getItem(KEY));return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch(e){return{}}}
