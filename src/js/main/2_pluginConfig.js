import Glide, { Controls, Breakpoints } from '@glidejs/glide/dist/glide.modular.esm'

document.addEventListener('DOMContentLoaded', function () {
  Typed.new('.typeWords', {
    strings: ["^600 Hanzla.", "^600 a Developer.", "^1000 a UI/UX Designer.", "^600 Wordpress Developer."],
    typeSpeed: 0,
    startDelay: 1000,
    loop: true
  });
});

new fullpage('.wrapper', {
	//options here
	autoScrolling:true,
  scrollHorizontally: true,
  licenseKey: 'isThisValid'
});
