"use strict";

var msbWidgetLinks = document.getElementsByClassName('msbwidget__link');

var openPopUp = function openPopUp(link) {
  if (link.classList.contains('msbwidget__link--email')) {
    return;
  }

  link.target = 'popup';
  window.open(link.href, 'popup', 'width=600, height=600');
};

for (var i = 0; i < msbWidgetLinks.length; i++) {
  msbWidgetLinks[i].addEventListener('click', function (event) {
    return openPopUp(event.target);
  });
}