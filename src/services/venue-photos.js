const FALLBACK_INTERIORS={
  cafe:['https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'],
  finedining:['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80'],
  regional:['https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80'],
  dessert:['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80'],
  casual:['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80']
};
function resolveVenuePhoto(r){
  if(r.photo_url&&typeof r.photo_url==='string'&&r.photo_url.startsWith('https://'))return r.photo_url;
  if(r.photo&&typeof r.photo==='string'&&r.photo.startsWith('https://'))return r.photo;
  const normName=(r.name||'').trim().toLowerCase(),city=(r.city||'Ahmedabad').toLowerCase(),extId=r.external_place_id||r.id;
  const match=catalog.find(x=>(extId&&x.id===extId)||(normName&&x.name&&x.name.trim().toLowerCase()===normName&&(x.city||'Ahmedabad').toLowerCase()===city))
    || vadodaraCatalog.find(x=>(extId&&x.id===extId)||(normName&&x.name&&x.name.trim().toLowerCase()===normName&&(x.city||'Vadodara').toLowerCase()===city))
    || (typeof allMetroVenues!=='undefined'&&allMetroVenues.find(x=>(extId&&x.id===extId)||(normName&&x.name&&x.name.trim().toLowerCase()===normName&&(x.city||'').toLowerCase()===city)));
  if(match&&match.photo&&typeof match.photo==='string'&&match.photo.startsWith('https://'))return match.photo;
  let pool=FALLBACK_INTERIORS.casual;
  const tagsStr=[...(r.cuisines||r.c||[]),...(r.tags||r.t||[]),r.name||''].join(' ').toLowerCase();
  if(tagsStr.includes('cafe')||tagsStr.includes('coffee'))pool=FALLBACK_INTERIORS.cafe;
  else if(tagsStr.includes('dessert')||tagsStr.includes('ice cream')||tagsStr.includes('bakery')||tagsStr.includes('cake')||tagsStr.includes('sweet'))pool=FALLBACK_INTERIORS.dessert;
  else if(tagsStr.includes('gujarati')||tagsStr.includes('thali')||tagsStr.includes('kathiyawadi'))pool=FALLBACK_INTERIORS.regional;
  else if(r.price==='1000_2000'||r.price==='2000_plus'||tagsStr.includes('italian')||tagsStr.includes('fine dining')||tagsStr.includes('luxury')||tagsStr.includes('bistro'))pool=FALLBACK_INTERIORS.finedining;
  let hash=0;
  for(let i=0;i<normName.length;i++)hash=(hash*31+normName.charCodeAt(i))>>>0;
  return pool[hash%pool.length];
}

// Rated venue snapshots, researched 7 October 2026; unknown attributes stay empty.
