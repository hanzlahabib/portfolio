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


[].forEach.call(cards,(card)=>{
  card.addEventListener('mouseover', setCardStyle, false)
  card.addEventListener('mouseleave', removeCardStyle, false)

})

function removeCardStyle(){
  console.log('removed')
  this.style.transform = '';
}
  // Set sticker height + hover animation
 function setCardStyle(){
  //  console.log(this)
    var cardWidth = this.clientWidth
    var cardHeight = cardWidth/2.5;

    // Set scale
    var cardContentScale = cardWidth/250;
    this.style.transform = 'translate3d(0,0,0) matrix3d(1,0,0.00,0.00,0.00,1,0.00,0,0,0,1,0,0,0,0,1) scale('+cardContentScale+')';
    // $('.card h1').css('font-size', cardContentScale*40+'px');
    // $('.card span').css('font-size', cardContentScale*16+'px');
    // $('.card li a').css('font-size', cardContentScale*16+'px');

    // // Set height
    // this.height(cardHeight);

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
  }

  // // Execute function
  // setCardStyle();
  // $(window).on('resize', function(){
  //     setCardStyle();
  // })
