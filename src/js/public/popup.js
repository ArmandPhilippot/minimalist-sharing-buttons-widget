const msbWidgetLinks = document.getElementsByClassName('msbwidget__link');

const openPopUp = link => {
	if (link.classList.contains('msbwidget__link--email')) {
		return;
	}

	link.target = 'popup';
	window.open(link.href, 'popup', 'width=600, height=600');
};

for (let i = 0; i < msbWidgetLinks.length; i++) {
	msbWidgetLinks[i].addEventListener('click', event =>
		openPopUp(event.target)
	);
}
