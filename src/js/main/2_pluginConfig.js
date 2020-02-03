document.addEventListener('DOMContentLoaded', function () {
  Typed.new('.typeWords', {
    strings: ["^600 Hanzla.", "^600 a Developer.", "^1000 a UI/UX Designer.", "^600 Wordpress Developer."],
    typeSpeed: 0,
    startDelay: 1000,
    loop: true
  });
});

new fullpage('.wrapper', {
  afterLoad: function(origin, {index}, direction){
    console.log(index)
    // if(index == 2){
    //   fullpage_api.setAutoScrolling(false);
    // }else{
    //   fullpage_api.setAutoScrolling(true);

    // }
  },
});
