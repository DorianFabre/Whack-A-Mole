// Variable for tracking the score
let score = 0;

// Array to hold mole objects
const moles = [];

// Countdown variables
let countdown = null;
let seconds = 0;

// Variable to force stop molesthat were in motion at game end
let playing = false;

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

// Populate the page with moles at startup
function createMoles(num) {
    for (let i = 0; i < num; i++){
        // Create a new mole object for each mole
        moles[i] = new Mole(i);
        // Create an identifier for each mole's angel
        moles[i].angel = 'angel' + i;
        // Create the on-screen elements for each mole
        const moleHole = document.createElement('DIV');
        moleHole.classList.add('molehole');
        moleHole.setAttribute('id', 'molehole' + i);        
        let content = '<img alt="grass" src="img/back.png" class="backGrass">';
        content += '<button class="mole" onclick="popToggle(' + i + ', 1)">Mole</button>';
        content += '<img alt="angel" src="img/angel.png" class="angel angelFlight" id="' + moles[i].angel + '">';
        content += '<img alt="grass" src="img/front.png" class="frontGrass">'
        moleHole.innerHTML = content;
        // Add tthe on-screen elements to the 'container' article
        document.getElementById('container').appendChild(moleHole);
    }
}

// Move each mole up & down at random times, or down when whacked
function popToggle(i, whacked) {
    // Only proceed if the game should be playing
    if (playing){
        // Clear any previous timeout
        clearTimeout(moles[i].moveMole);
        // Set required variables
        const id = moles[i].id;
        const angel = moles[i].angel;
        let timer = 0;
        // Set different delay times, depending on whether the mole is in the 'up' or 'down' position
        // Times are in fractions of a second (hence no Math.ceil()), with a minimum time of 1 second
        moles[i].position === 'down' ? timer = (Math.random() * 9000) + 1000 :  timer = (Math.random() * 2000) + 1000;
        // If this mole has been whacked
        if (whacked && moles[i].position === 'up') { 
            // Show the 'whacked' mole image 
            document.getElementById(moles[i].id).querySelector('button').style.backgroundPosition = 'right';
            // Play the 'splat' sound
            splat.play();
            // Set required variables, including incrementing the time remaining by 1 second
            timer = 0;
            score++;
            seconds++;
            // Show the current score on screen
            document.getElementById('score').querySelector('span').innerHTML = score;
            // Animate the mole's angel
            setTimeout(function(){
                document.getElementById(angel).style.top = '-50px';
                document.getElementById(angel).style.opacity = '0';
            }, 250);
            // Reset the mole's angel after animation (the 'angelFlight' class must be removed to prevent it animating back)
            setTimeout(function(){
                document.getElementById(angel).classList.remove('angelFlight');
                document.getElementById(angel).style.top = '55%';
                document.getElementById(angel).style.opacity = '1';
            }, 1250);
        }
        // Move the mole after the delay time calculated above
        moles[i].moveMole = setTimeout(function(){
            // If the mole is in the 'down' position
            if(moles[i].position === 'down') {
                // Reset the mole image in case it was previously whacked
                document.getElementById(moles[i].id).querySelector('button').style.backgroundPosition = 'left';
                // Reapply the 'angelFlight' to the angel if required to allow animation
                document.getElementById(angel).classList.add('angelFlight');
                // Animate the mole upwards
                if (document.getElementById('container').clientWidth >= 700 && window.innerHeight < window.innerWidth){
                    document.getElementById(id).querySelector('button').style.top = '20%';
                } else {
                    document.getElementById(id).querySelector('button').style.top = '10%';
                }
                // Set the mole's recorded position and repeat this function
                moles[i].position = 'up';
                popToggle(i, null);
                // Play the 'pop' sound after the mouse has moved up
                setTimeout(function(){
                    pop.play();
                }, 250);
            // If the mole is in the 'up' position
            } else {
                // Animate the mole down, set it's recorded position and repeat this function
                document.getElementById(id).querySelector('button').style.top = '60%';
                moles[i].position = 'down';
                popToggle(i, null);
            }
        }, timer);
    }
}

// Start & end the game
function startCountdown() {
    // Set required variables
    playing = true;
    seconds = 30;
    score = 0;
    // Set up screen elements
    document.getElementById('countdown').querySelector('span').innerHTML = seconds;
    document.getElementById('score').querySelector('span').innerHTML = score;
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('startButton').style.display = 'none';
    // Clear any existing timeouts (just in case) and start the moles moving
    moles.map(function(mole, i){
        clearTimeout(mole.moveMole);
        if (countdown) clearInterval(countdown);
        popToggle(i, null);
    });
    // Play that cheesy music!
    music.play();
    // Countdown and game end subroutine, runs every second
    countdown = setInterval(function(){
        // Decrement the seconds value by 1 and write it on-screen
        seconds--;
        document.getElementById('countdown').querySelector('span').innerHTML = seconds;
        // Once no time is left, stop the game
        if (seconds <= 0) {
            // Prevent stray mole movement
            playing = false;
            // Stop the countdown function
            clearInterval(countdown);
            // Stop each mole and reset it to the 'start' position
            moles.map(function(mole){
                clearTimeout(mole.moveMole);
                console.log(mole.id, mole.moveMole)
                document.getElementById(mole.id).querySelector('button').style.top = '60%';
                mole.position = 'down';
            });
            // Set up screen elements, stop & rewind the music
            document.getElementById('overlay').querySelector('h1').innerHTML = 'YOU SCORED ' + score;
            document.getElementById('overlay').querySelector('button').innerHTML = 'PLAY AGAIN';
            document.getElementById('overlay').style.display = 'flex';
            document.getElementById('startButton').style.display = 'block';
            music.pause();
            music.currentTime = 0;
        }
    }, 1000);
}

// Make the mallet image follow the cursor position
var followCursor = (function() {    
    return {
      init: function() {},    
      run: function() {
        e = window.event;
        let mallet = document.getElementById('mallet');
        mallet.style.left  = (e.clientX - 15) + 'px';
        mallet.style.top = (e.clientY - 200) + 'px';
      }
    };
  }());
  
// Start the mallet-image-follow-cursor function when the page loads
window.onload = function() {
    document.body.onmousemove = followCursor.run;
}

// Show the mallet in the 'down' position when the mouse key is pressed
window.onmousedown = function() {
    document.getElementById('mallet').style.backgroundPositionX = 'left';
}

// Show the mallet in the 'up' position when the mouse key is released
window.onmouseup = function() {
    document.getElementById('mallet').style.backgroundPositionX = 'right';
}

// Run the function that creates all the moles on the page
createMoles(12);
