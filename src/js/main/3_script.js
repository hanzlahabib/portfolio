let scene = document.getElementById('scene');
let parallaxInstance = new Parallax(scene);
let cards = document.querySelectorAll('.intro-card')
let tableImg = document.getElementById('table-img')
let container = document.querySelector('.header')


// let i = window.getComputedStyle(tableImg).height.split('px')[0]
// let s = window.getComputedStyle(container).height.split('px')[0]

// if(s < 750){
//   let tm = `${((s - i) - 60)}px`
//   tableImg.style.marginTop = tm
// }
