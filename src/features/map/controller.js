function zoomMap(delta){
 mapZoom=Math.max(0.85,Math.min(1.8,Number((mapZoom+delta).toFixed(2))));
 const svg=document.querySelector('.zestMapSvg');
 if(svg){
   if(map3d)svg.style.transform=`rotateX(26deg) rotateZ(-2deg) scale(${mapZoom*0.96})`;
   else svg.style.transform=`scale(${mapZoom})`;
 }
}
function resetMapZoom(){
 mapZoom=1;
 const svg=document.querySelector('.zestMapSvg');
 if(svg){
   if(map3d)svg.style.transform='rotateX(26deg) rotateZ(-2deg) scale(0.96)';
   else svg.style.transform='scale(1)';
 }
}
