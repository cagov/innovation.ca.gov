document.querySelectorAll('a').forEach((a) => {
  // look for and track anchor and pdf links
  if(a.href.indexOf(window.location.hostname) > -1) {
    if(a.href.indexOf('.pdf') > -1) {
      a.addEventListener('click',function() {
        reportGA('pdf', this.href.split(window.location.hostname)[1])
      });    
    }
    if(a.href.indexOf('#') > -1) {
      a.addEventListener('click',function() {
        reportGA('anchor', this.href.split(window.location.hostname)[1])
      });    
    }
  }
  // look for offsite links
  if(a.href.indexOf(window.location.origin) === -1 && a.href.indexOf('http') > -1) { // we are looking at a different protocol + hostname, ignoring tel: links
    a.addEventListener('click',function() {
      reportGA('offsite', this.href)
    })          
  }
});

window.reportGA = function(eventAction, eventLabel, eventCategory = 'click') {
  // if(typeof(ga) !== 'undefined') {
  //   ga('send', 'event', eventCategory, eventAction, eventLabel);
  // }
  if (typeof gtag !== "undefined") {
    gtag("event", eventAction, {
      event_category: eventCategory,
      event_label: eventLabel,
    });
  } else {
    setTimeout(() => {
      window.reportGA(eventAction, eventLabel, eventCategory);
    }, 500);
  }

}