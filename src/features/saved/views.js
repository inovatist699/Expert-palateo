function saved(){
const x=hasTasteProfile()?state.saves.map(activeRestaurant).filter(r=>r&&isQualifiedVenue(r)).map(r=>rec(r)).sort(compareRecommendations):[];
const savedContent=x.length?`<div class="restaurantGrid">${x.map(card).join('')}</div>`:`<div class="empty"><h2>Your shortlist starts here</h2><p>Save places you want to try and they’ll be waiting here for your next food plan.</p><button class="btn green" type="button" data-action="navigate" data-page="discover">Explore restaurants</button></div>`;
document.getElementById('root').innerHTML=`<section class="screen saved-screen"><div class="hero"><div class="eyebrow">Your collection</div><h1>Keep the good ones close.</h1><p>Your personal restaurant shortlist, ready whenever you are.</p></div>${savedContent}</section>`
}
