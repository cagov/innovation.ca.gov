/*
  This augments the seven minute tabs web component
  by adding url changes on tab change
  and applying initial tab visibility based on url
*/
export function augmentSevenMinuteTabs() {
  // see if there are 7 minute tabs here
  let tabsFound = document.querySelector('seven-minute-tabs');
  if(tabsFound) {
    let tabLinks = document.querySelectorAll('seven-minute-tabs a[role="tab"]');
    tabLinks.forEach(tabLink => {
      tabLink.addEventListener('click',function() {
        // change url to reflect currently selected tab without reloading page
        history.replaceState({tab: this.id}, "", "?activeTab="+this.id)
      })
    })

    if(window.location.search.indexOf('activeTab') > -1) { // There is a tab state in the url
      // get the value from the url
      const urlParams = new URLSearchParams(window.location.search);
      let desiredTab = urlParams.get('activeTab');
      if(desiredTab && document.getElementById(desiredTab)) {
        // Make sure right tab is visible by sendig click event to desired tab
        document.getElementById(desiredTab).click();
        document.getElementById(desiredTab).blur();
      }
    }
  }
}