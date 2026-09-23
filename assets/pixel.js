/* Meta (Facebook/Instagram) Pixel — loaded in <head> on every marketing page.
   Powers retargeting. To swap the pixel, change PF_PIXEL_ID below (Meta Events Manager →
   Data Sources → your pixel). An id containing "__" keeps it dormant. */
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
window.PF_PIXEL_ID = '1319421116295927';
window.PF_PIXEL_ON = !!(window.PF_PIXEL_ID && window.PF_PIXEL_ID.indexOf('__') === -1);
if (window.PF_PIXEL_ON) { fbq('init', window.PF_PIXEL_ID); fbq('track', 'PageView'); }
// Every click into the web app (signup / sign in) is a soft conversion signal.
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest && e.target.closest('a[href^="https://app.partfive.app"]');
  if (a && window.PF_PIXEL_ON) { try { fbq('trackCustom', 'GetStartedClick'); } catch (_) {} }
}, true);
