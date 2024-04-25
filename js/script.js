//establece que va a ser un juego en 2D
//canvas
let contexto = document.getElementById("lienzo_juego");
//contexto
let ctx = contexto.getContext("2d");

//VARIABLES
//puntuación
let score = 0;

//fotogramas por segundo
let FPS = 60;
let gravedad = 1.5;

//establece el alto y ancho de la pantalla
let WIDTH = 300;
let HEIGHT = 530;
let CANVAS_WIDTH = 300;
let CANVAS_HEIGHT= 530;
contexto.width = WIDTH;
contexto.height = HEIGHT;

//caracteristicas del personaje
let personaje = {
    x:50,
    y:150,
    w:50,
    h:50
}

//IMAGENES
//pájaro
let bird = new Image();
bird.src = "/css/imagenes/bird.png";

//fondo
let background = new Image();
background.src = "/css/imagenes/background.png";

//piso
let suelo = new Image();
suelo.src = "/css/imagenes/suelo.png";

//tuberías
let tuberiaNorte = new Image();
tuberiaNorte.src = "/css/imagenes/tuberiaNorte.png";
let tuberiaSur = new Image();
tuberiaSur.src = "/css/imagenes/tuberiaSur.png";

let tuberias = [];
tuberias[0] = {
    //se posiciona al extemos superior derecho
    x:contexto.width,
    y:0
};

//AUDIOS
//punto
let punto = new Audio();
punto.src = "/css/audios/punto.mp3";

//game over
let gameOver = false;
let gameOverSound = new Audio;
gameOverSound.src = "/css/audios/game-over.mp3";

//blucle
function loop(){
    //limpia el canvas
    ctx.clearRect(0, 0, 300, 700);

    //fondo (se dibuja primero que el personaje, inicia en la posicion (0, 0))
    ctx.drawImage(background, 0, 0);
    ctx.drawImage(suelo, 0, contexto.height - suelo.height);

    //personaje
    ctx.drawImage(bird, personaje.x, personaje.y);

    //tuberias
    for(let i = 0; i < tuberias.length; i++){
        //el desfase son 100px mas que la altura de la tuberia norte
        let desfase = tuberiaNorte.height + 100; 
        ctx.drawImage(tuberiaNorte, tuberias[i].x, tuberias[i].y);
        ctx.drawImage(tuberiaSur, tuberias[i].x, tuberias[i].y + desfase);
        //permite que la tuberia se mueva a la izquiera
        tuberias[i].x--;

        if(tuberias[i].y + tuberiaNorte.height < 100){
            tuberias[i].y = 0;
        }

        //cada vez que una tuberia llegue a la mitad (150px) de la pantalla, se agrega una nueva tuberia al array
        if(tuberias[i].x == 150){
            tuberias.push({
                x:contexto.width +80,
                //math.floor redondena el numero al entero menor -> 2.90 = 2
                y:Math.floor(Math.random()*tuberiaNorte.height) - tuberiaNorte.height
            });
        }

        //colisiones
        /*
        colision en el eje x =  (personaje.x + bird.width >= tuberias[i].x && personaje.x <= tuberias[i].x + tuberiaNorte.width) 
                                Comprueba si la parte derecha del personaje está más allá del borde izquierdo de la tubería (personaje.x + bird.width >= tuberias[i].x) 
                                y si la parte izquierda del personaje está antes del borde derecho de la tubería (personaje.x <= tuberias[i].x + tuberiaNorte.width)
                               
        colision en el eje y =  (personaje.y <= tuberias[i].y + tuberiaNorte.height || personaje.y + bird.height >= tuberias[i].y + desfase)
                                Comprueba si la parte superior del personaje está por encima del borde inferior de la tubería (personaje.y <= tuberias[i].y + tuberiaNorte.height) 
                                o si la parte inferior del personaje está por debajo del borde superior de la tubería (personaje.y + bird.height >= tuberias[i].y + desfase)
                                El desfase se utiliza para la tubería sur, que está desplazada hacia abajo.

        colision con el suelo:  personaje.y + bird.height >= contexto.canvas.height - suelo.height: 
                                Comprueba si la parte inferior del personaje está en o por debajo del borde superior del suelo (personaje.y + bird.height >= contexto.canvas.height - suelo.height).

        */
        if(personaje.x + bird.width >= tuberias[i].x && 
            personaje.x <= tuberias[i].x + tuberiaNorte.width &&
            (personaje.y <= tuberias[i].y + tuberiaNorte.height ||
                personaje.y + bird.height >= tuberias[i].y + desfase) ||
                personaje.y + bird.height >= contexto.height - suelo.height){
    
            gameOver = true;        
            gameOverSound.play();
     
            
            //se reinicia el juego
            location.reload();
        }

        //score
        //si la tuberia alcanza el punto de inicio del personaje (x=50)
        if(tuberias[i].x == personaje.x){
            //aumenta en 10 
            score += 10;
            punto.play();
        }
    }

    //CONDICIONES
    //para que el rectangulo caiga
    personaje.y += gravedad;
    //score
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.font = "25px Arial";
    ctx.fillText("Score: "+score, 10, contexto.height - 20);


       
}   


//fija el intervalo para llamar el loop
setInterval(loop, 1000/FPS);
//control del personaje
function presionar(event){
    // verifica si la tecla presionada es "Enter" o la flecha hacia arriba
    if(event.key === " " || event.key === "ArrowUp"){
        //el personaje "salta" 25px cada vez que se llame
        personaje.y -= 25; 
    }

    if(event.key === "ArrowRight"){
        //el personaje "adelanta" 25px cada vez que se llame
        personaje.x += 25; 
    }

}

resize();
function resize(){
    //altura de la ventana
    CANVAS_HEIGHT = window.innerHeight;
    //anchura de la ventana
    CANVAS_WIDTH = window.innerWidth;
    
    contexto.width = WIDTH;
    contexto.height = HEIGHT;

    contexto.style.height = ""+CANVAS_HEIGHT+"px";
}


//ocurre el evento cuando se seleccione una tecla caulquiera
window.addEventListener("keydown", presionar);
window.addEventListener("resize",resize);




 