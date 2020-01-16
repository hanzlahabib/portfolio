let scene = document.getElementById('scene');
let parallaxInstance = new Parallax(scene);
let cards = document.querySelectorAll('.intro-card')
let tableImg = document.getElementById('table-img')
let container = document.querySelector('.hero')
let i = window.getComputedStyle(tableImg).height.split('px')[0]
let s = window.getComputedStyle(container).height.split('px')[0]

if(s < 750){
  let tm = `${s - i}px`
  tableImg.style.marginTop = tm
}
// Todo
// [].forEach.call(cards,(card)=>{
  // card.addEventListener('mouseover', setCardStyle, false)
  // card.addEventListener('mouseover', hoverEffect, false)
  // card.addEventListener('mousemove', mouseMove, false)
  // card.addEventListener('mouseleave', removeCardStyle, false)
// })

// function hoverEffect(){
  // console.log('mouseover', this)
// }
// function mouseMove(e){
  // console.log('mouse Move', this)
  // console.log(e)
// }


// function removeCardStyle(){
  // console.log('removed')
  // var cardWidth = this.clientWidth
  // var cardHeight = cardWidth/2.5;
  // var cardContentScale = cardWidth/250;

  // this.querySelector('.header-img > svg').style.width = '82px'
  // this.querySelector('.intro-card > h2').style.fontSize = '16px'
  // this.querySelector('.intro-card > p').style.fontSize = '14px'
  // this.style.transform = '';
// }
  // Set sticker height + hover animation
//  function setCardStyle(){
  //  console.log(this)
    // var cardWidth = this.clientWidth
    // var cardHeight = cardWidth/2.5;

    // Set scale
    // var cardContentScale = cardWidth/250;
    // this.style.transform = 'translate3d(0,0,0) matrix3d(1,0,0.00,0.00,0.00,1,0.00,0,0,0,1,0,0,0,0,1) scale(.99)';
    // this.style.transition = 'all .4s ease-in-out';
    // this.style.width = '300px';
    // this.querySelector('.header-img > svg').style.transition = 'all .4s ease-in-out';
    // this.querySelector('.intro-card > h2').style.transition = 'all .4s ease-in-out';
    // this.querySelector('.header-img > svg').style.width = cardContentScale*100+'px'
    // this.querySelector('.intro-card > h2').style.fontSize = cardContentScale*30+'px'
    // this.querySelector('.intro-card > p').style.fontSize = cardContentScale*15+'px'

    // // Set height
    // this.style.height = cardHeight;

    // // Generate hover effect
    // this
    //   .mouseover(function(){
    //     this.mousemove(function(e){
    //       // Find mouse X position in card
    //       mouseScreenPositionX = e.pageX;
    //       cardLeftPosition = card.offset().left;
    //       mousePosX = ((mouseScreenPositionX - cardLeftPosition)/cardWidth);
    //       // Calculate maxtrix3d X value
    //       matrix3dX = ((mousePosX/10000)*1.5)-0.0001;

    //       // Find mouse Y position in card
    //       mouseScreenPositionY = e.pageY;
    //       cardTopPosition = card.offset().top;
    //       mousePosY = ((mouseScreenPositionY-cardTopPosition)/cardHeight);
    //       // Calculate maxtrix3d Y value
    //       matrix3dY = ((mousePosY/10000)*1.65)-0.0001;

    //       // Set CSS
    //       this.css('transform', 'translate3d(0,-5px,0) matrix3d(1,0,0.00,'+matrix3dX+',0.00,1,0.00,'+matrix3dY+',0,0,1,0,0,0,0,1) scale('+cardContentScale*1.04+')');
    //     });
    //   })
    //   .mouseout(function(){
    //     // Unset CSS on mouseleave
    //     this.css('transform','translate3d(0,0,0) matrix3d(1,0,0.00,0.00,0.00,1,0.00,0,0,0,1,0,0,0,0,1) scale('+cardContentScale+')');
    //   });
  // }

  // // Execute function
  // setCardStyle();
  // $(window).on('resize', function(){
  //     setCardStyle();
  // })
