// Constants for the game init

const blockWidth = 101,
      blockHeight = 83,
      startX = blockWidth * 2,
      startY = blockWidth * 4,
      boundaryObject = {
          left : 0,
          right : 505,
          up : 505-83*5,
          down : 505,
      };

let playerImageSrc = "",
    notEmptyInputField = false;

const userNameInput = document.querySelector('.start-game-input'),
    startGameButton = document.querySelector('.start-game-button'),
    userNameBlock = document.querySelector('.game-session__user'),
    startModal = document.querySelector('.start-game-modal'),
    copyRightSection = document.querySelector('.copyright-section'),
    audioTrack = document.querySelector('.audio-track'),
    soundSwitcher = document.querySelector('.sound-switcher'),
    gameSession = document.querySelector('.game-session'),
    playersGrid = document.querySelector('.players-row');

// Enemies our player must avoid
var Enemy = function(xCord, yCord, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.speed = speed;
    this.x = xCord;
    this.y = yCord;
};

Enemy.prototype.update = function(dt) {

    if (this.x < boundaryObject.right) {
        this.x += this.speed * dt;
    }
    else {
        this.x = -blockWidth;
    }

};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function(xCord, yCord) {
    this.sprite = 'images/char-boy.png';
    this.counter = 0;
    this.x = xCord;
    this.y = yCord;
};

Player.prototype.update = function() {

    if(this.y > startY){
        this.y  = startY;
    }
    if(this.y < 0){
        this.counter++;
        this.y = startY;
    }
    if(this.x > (boundaryObject.right - blockWidth)){
        this.x -= boundaryObject.right;
    }
    if(this.x < 0){
        this.x = (rightBorder - blockWidth);
    }

};

function checkCollisions(){
    let arrayLength = allEnemies.length;
    let x = player.x;
    let y = player.y;
    for(let i = 0; i < arrayLength; i++){
        let backCollision = x <= (parseInt(allEnemies[i].x) + SPRITE_WIDTH) && x >= parseInt(allEnemies[i].x);
        let frontCollision = (x + SPRITE_WIDTH) >= parseInt(allEnemies[i].x) && (x + SPRITE_WIDTH) <= parseInt(allEnemies[i].x + SPRITE_WIDTH);
        let heightCollision = (y - ENEMY_HEIGHT) === (parseInt(allEnemies[i].y));
        if( (backCollision || frontCollision) && heightCollision){
            player.y = START_Y_POINT;
            player.x = START_X_POINT;
            player.count = 0;
        }
    }
}

function isCollide(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

Player.prototype.render = function() {
    let imageElement = document.createElement('img');
    imageElement.src = playerImageSrc;
    ctx.drawImage(imageElement, this.x, this.y);
};

Player.prototype.handleInput = function(keyCode) {

    switch(keyCode) {

        case 'up': this.y -= blockHeight; break;
        case 'down': this.y += blockHeight; break;
        case 'right': this.x += blockWidth; break;
        case 'left': this.x -= blockWidth; break;

        default: break;

    }

};

var firstEnemy = new Enemy(-blockWidth, 60, 30);
var secondEnemy = new Enemy(-blockWidth, 143, 40);
var thirdEnemy = new Enemy(-blockWidth, 226, 50);
var allEnemies = [firstEnemy,secondEnemy,thirdEnemy];

var player = new Player(startX,startY);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

let checkStartButton = () => {

    if (notEmptyInputField && playerImageSrc !== "") {
        startGameButton.disabled = false;
    }
    else {
        startGameButton.disabled = true;
    }

};

let checkActiveClass = (target) => {

    let activeElement = document.querySelector('.player-item.active');
    if (activeElement) {
        activeElement.classList.remove('active');
    }
    target.classList.add('active');

};


function startGame() {
    let userName = userNameInput.value;
    userNameBlock.textContent = userName;
    startModal.classList.add('closed');
    copyRightSection.classList.add('closed');
    gameSession.classList.remove('closed');

    /* looping track playing */
    audioTrack.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    audioTrack.play();
};

let setupEventListeners = () => {

    userNameInput.addEventListener('input', (event) => {

        if (event.target.value.length > 0) {
            notEmptyInputField = true;
        }
        else {
            notEmptyInputField = false;
        }

        checkStartButton();

    });

    startGameButton.addEventListener('click', () => {
        startGame();
    });

    document.addEventListener('keyup', (event) => {

        if (event.keyCode === 13 && event.which === 13 && !startGameButton.disabled) {
            startGame();
        }

    });

    soundSwitcher.addEventListener('click', (event) => {

        let currentTarget = event.target;
        currentTarget.classList.toggle('off');

        if (currentTarget.classList.contains('off')) {
            audioTrack.pause();
        }
        else {
            audioTrack.play();
        }


    });

    playersGrid.addEventListener('click', (event) => {

        if (event.target.classList.contains('player-item')) {
            playerImageSrc = event.target.dataset.src;
            checkActiveClass(event.target);
            checkStartButton();
        }
        else if (event.target.classList.contains('player-item__image')) {
            playerImageSrc = event.target.parentNode.dataset.src;
            checkActiveClass(event.target.parentNode);
            checkStartButton();
        }

    });

};

document.addEventListener('DOMContentLoaded', function initHandler() {

    setupEventListeners();
    document.removeEventListener('DOMContentLoaded', initHandler);

});
