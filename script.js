let move_speed = 3, grativy = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');
let score=0;

// getting bird element properties
let bird_props = bird.getBoundingClientRect();

// This method returns DOMReact -> top, right, bottom, left, x, y, width and height
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let hs_val = document.querySelector('.hs_val');
let hs_title = document.querySelector('.hs_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');


//animation script
                function animateScript() {
				var tID;//we will use this variable to clear the setInterval()
                var    position = 120; 
                const  interval = 150; 

                tID = setInterval ( () => {
                document.getElementById("bird-1").style.backgroundPosition = 
                `-${position}px 0px`; 
               
                if (position < 360)
                { position = position + 120;}
               
                else
                { position = 120; }
                
                }
                , interval );
                console.log("ani"); //end of setInterval
                }
//////////////////////
//document.addEventListener('keydown', (e) => {
    
    if(/*e.key == 'Enter' && */game_state != 'Play'){
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        img.style.display = 'block';
		animateScript();
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        hs_title.innerHTML = 'High Score : ';
        var hs_value=0;
        
        hs_val.innerHTML=localStorage.getItem('highscore');
        message.classList.remove('messageStyle');
        play();
    }
//});

function play(){
    function move(){
        if(game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if(pipe_sprite_props.right <= 0){
                element.remove();
            }
            else{
                if(bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && bird_props.left + bird_props.width > pipe_sprite_props.left && bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && bird_props.top + bird_props.height > pipe_sprite_props.top){
                    game_state = 'End';
                    message.innerHTML = ' <br><a href="default.asp"><img src="images/dead.png" alt="HTML tutorial" style="width:200px;height:200px;"></a>' + ' <p style="color:green; font-size: 25px; font-family: monospace;">Tonn Mort!!!</p>'+'<p style="color:#77DD77; font-family:arial;">Game Over</p>'+'<p style="color:green; font-size: 25px; font-family: monospace;">Press enter to restart the game</p>' + '<p style="color:green; font-size: 25px; font-family: monospace;">Press ESC to quit the game</p>' + '<br><p style="color:green; font-size: 25px; font-family: monospace;">Your Score is: </p>'+score;
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();

                    // faire zwer a restart
                    document.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter' && game_state != 'Play') {
                            document.querySelectorAll('.pipe_sprite').forEach((e) => {
                                e.remove();
                            });
                            img.style.display = 'block';
                            animateScript();
                            bird.style.top = '40vh';
                            game_state = 'Play';
                            message.innerHTML = '';
                            score_title.innerHTML = 'Score : ';
                            score_val.innerHTML = '0';
                            message.classList.remove('messageStyle');
                            play();
                        }

                        if (e.key === 'Escape') {
                            window.location.href = 'index.html';
                        }
                    });
                    return;
                }else{
                    if(pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1'){
                        score_val.innerHTML =+ score_val.innerHTML + 1;
                        score=score_val.innerHTML;
                        if (score>localStorage.getItem('highscore')){
                            hs_val.innerHTML=score;
                            hs_value=score;
                            localStorage.setItem('highscore', hs_value);
                        }
                        sound_point.play();
                    }

                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;
    function apply_gravity(){
        if(game_state != 'Play') return;
        bird_dy = bird_dy + grativy;
        document.addEventListener('keydown', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                bird_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
				console.log('keyup');
            }
        });

        if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
		
				
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 20;

    let pipe_gap = 35;


    function create_pipe() {
        if (game_state !== 'Play') return;
    
        if (pipe_seperation > 115) {
            pipe_seperation = 0;
    
            // Generate a random pipe position between 20vh and 60vh
            let pipe_posi = Math.random() * 75 + 40; // Generates a value between 20 and 60
    
            // Create the inverted pipe sprite
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            
            // Ensure the pipe position does not go beyond the top of the screen
            pipe_sprite_inv.style.top = Math.max(pipe_posi - 50, 0) + 'vh';
    
            pipe_sprite_inv.style.left = '100vw';
            document.body.appendChild(pipe_sprite_inv);
    
            // Create the regular pipe sprite
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            
            // Ensure the pipe position does not go beyond the bottom of the screen
            pipe_sprite.style.button = Math.min(pipe_posi + pipe_gap, 130) + 'vh';
    
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';
    
            document.body.appendChild(pipe_sprite);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
