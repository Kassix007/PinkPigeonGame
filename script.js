let move_speed = 3, grativy = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');
let score = 0;

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let hs_val = document.querySelector('.hs_val');
let hs_title = document.querySelector('.hs_title');

let game_state = 'Start';
let bird_dy = 0;
let highscore = localStorage.getItem('highscore') || 0;

img.style.display = 'none';
message.classList.add('messageStyle');

function animateScript() {
    let position = 120;
    const interval = 150;
    setInterval(() => {
        document.getElementById("bird-1").style.backgroundPosition = `-${position}px 0px`;
        position = (position < 360) ? position + 120 : 120;
    }, interval);
}

function startGame() {
    document.querySelectorAll('.pipe_sprite').forEach(e => e.remove());
    img.style.display = 'block';
    bird.style.top = '40vh';
    bird_dy = 0;
    game_state = 'Play';
    score = 0;

    message.innerHTML = '';
    message.classList.remove('messageStyle');
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    hs_title.innerHTML = 'High Score : ';
    hs_val.innerHTML = highscore;

    animateScript();
    play();
}

function gameOver() {
    game_state = 'End';
    img.style.display = 'none';
    sound_die.play();
    message.innerHTML =
        '<img src="images/dead.png" style="width:200px;height:200px;">' +
        '<p style="color:green; font-size:25px; font-family:monospace;">Tonn Mort!!!</p>' +
        '<p style="color:#77DD77; font-family:arial;">Game Over</p>' +
        '<p style="color:green; font-size:25px; font-family:monospace;">Tap anywhere to restart</p>' +
        `<p style="color:green; font-size:25px; font-family:monospace;">Your Score: ${score}</p>`;
    message.classList.add('messageStyle');
}

function jump() {
    if (game_state === 'Play') {
        bird_dy = -7.6;
    } else if (game_state === 'Start' || game_state === 'End') {
        startGame();
    }
}

// === Control events (Bound ONCE) ===
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'ArrowUp') jump();
    if (e.key === 'Enter') jump();
    if (e.key === 'Escape' && game_state === 'End') window.location.href = 'index.html';
});
document.addEventListener('touchstart', jump);
document.addEventListener('mousedown', jump);

function play() {
    function move() {
        if (game_state != 'Play') return;

        document.querySelectorAll('.pipe_sprite').forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (
                    bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top
                ) {
                    gameOver();
                    return;
                } else if (
                    pipe_sprite_props.right < bird_props.left &&
                    !element.scored
                ) {
                    element.scored = true;
                    score++;
                    score_val.innerHTML = score;
                    if (score > highscore) {
                        highscore = score;
                        hs_val.innerHTML = highscore;
                        localStorage.setItem('highscore', highscore);
                    }
                    sound_point.play();
                }
                element.style.left = pipe_sprite_props.left - move_speed + 'px';
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    function apply_gravity() {
        if (game_state != 'Play') return;
        bird_dy += grativy;

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            gameOver();
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;
    const pipe_gap = 35;

    function create_pipe() {
        if (game_state !== 'Play') return;

        if (pipe_seperation > 115) {
            pipe_seperation = 0;
            let pipe_posi = Math.random() * 75 + 40;

            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = Math.max(pipe_posi - 50, 0) + 'vh';
            pipe_sprite_inv.style.left = '100vw';
            document.body.appendChild(pipe_sprite_inv);

            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.bottom = Math.min(pipe_posi + pipe_gap, 130) + 'vh';
            pipe_sprite.style.left = '100vw';
            document.body.appendChild(pipe_sprite);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
