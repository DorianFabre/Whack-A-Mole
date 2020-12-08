// Variable for tracking the score
let score = 0;

// Array to hold mole objects
const moles = [];

// Countdown variables
let countdown = null;
let seconds = 0;

// Mole object
function Mole(index) {
    this.id = 'molehole' + index,
    this.position = 'down',
    this.angel = null,
    this.moveMole = null
}

// Sounds
const music = new Audio('audio/music.mp3');
const pop = new Audio('audio/pop.mp3');
const splat = new Audio('audio/splat.mp3');

// move the moles up & down at random, or down when whacked
function popToggle(i, whacked) {
    clearTimeout(moles[i].moveMole);
    const id = moles[i].id;
    const angel = moles[i].angel;
    let timer = 0;
    moles[i].position === 'down' ? timer = (Math.random() * 9000) + 1000 :  timer = (Math.random() * 2000) + 1000;
    if (whacked && moles[i].position === 'up') { 
        document.getElementById(moles[i].id).querySelector('button').style.backgroundPosition = 'right';
        splat.play();
        timer = 0;
        score++;
        seconds++;
        document.getElementById('score').querySelector('span').innerHTML = score;
        setTimeout(function(){
            document.getElementById(angel).style.top = '-50px';
            document.getElementById(angel).style.opacity = '0';
        }, 250);
        setTimeout(function(){
            document.getElementById(angel).classList.remove('angelFlight');
            document.getElementById(angel).style.top = '55%';
            document.getElementById(angel).style.opacity = '1';
        }, 1250);
    }
    moles[i].moveMole = setTimeout(function(){
        if(moles[i].position === 'down') {
            document.getElementById(moles[i].id).querySelector('button').style.backgroundPosition = 'left';
            document.getElementById(angel).classList.add('angelFlight');
            if (document.getElementById('container').clientWidth >= 700 && window.innerHeight < window.innerWidth){
                document.getElementById(id).querySelector('button').style.top = '20%';
            } else {
                document.getElementById(id).querySelector('button').style.top = '10%';
            }
            moles[i].position = 'up';
            popToggle(i, null);
            setTimeout(function(){
                pop.play();
            }, 250);
        } else {
            document.getElementById(id).querySelector('button').style.top = '60%';
            moles[i].position = 'down';
            popToggle(i, null);
        }
    }, timer);
}

// Populate the page with moles at startup
function createMoles(num) {
    for (let i = 0; i < num; i++){
        moles[i] = new Mole(i);
        moles[i].angel = 'angel' + i;
        const moleHole = document.createElement('DIV');
        moleHole.classList.add('molehole');
        moleHole.setAttribute('id', 'molehole' + i);        
        let content = '<img alt="grass" src="img/back.png" class="backGrass">';
        content += '<button class="mole" onclick="popToggle(' + i + ', 1)">Mole</button>';
        content += '<img alt="angel" src="img/angel.png" class="angel angelFlight" id="' + moles[i].angel + '">';
        content += '<img alt="grass" src="img/front.png" class="frontGrass">'
        moleHole.innerHTML = content;
        document.getElementById('container').appendChild(moleHole);
    }
}

// Start & end the game
function startCountdown() {
    seconds = 30;
    score = 0;
    document.getElementById('countdown').querySelector('span').innerHTML = seconds;
    document.getElementById('score').querySelector('span').innerHTML = score;
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('startButton').style.display = 'none';
    moles.map(function(mole, i){
        clearTimeout(mole.moveMole);
        if (countdown) clearInterval(countdown);
        popToggle(i, null);
    });
    music.play();
    countdown = setInterval(function(){
        seconds--;
        document.getElementById('countdown').querySelector('span').innerHTML = seconds;
        if (seconds <= 0) {
            clearInterval(countdown);
            moles.map(function(mole){
                clearTimeout(mole.moveMole);
                console.log(mole.id, mole.moveMole)
                document.getElementById(mole.id).querySelector('button').style.top = '60%';
                mole.position = 'down';
            });
            document.getElementById('overlay').querySelector('h1').innerHTML = 'YOU SCORED ' + score;
            document.getElementById('overlay').querySelector('button').innerHTML = 'PLAY AGAIN';
            document.getElementById('overlay').style.display = 'flex';
            document.getElementById('startButton').style.display = 'block';
            music.pause();
            music.currentTime = 0;
        }
    }, 1000);
}

var followCursor = (function() {    
    return {
      init: function() {},    
      run: function() {
        e = window.event;
        let x = document.getElementById('mallet');
        x.style.left  = (e.clientX - 15) + 'px';
        x.style.top = (e.clientY - 200) + 'px';
      }
    };
  }());
  
  window.onload = function() {
    document.body.onmousemove = followCursor.run;
  }

  window.onmousedown = function() {
    document.getElementById('mallet').style.backgroundPositionX = 'left';
  }

  window.onmouseup = function() {
    document.getElementById('mallet').style.backgroundPositionX = 'right';
  }

createMoles(12);
