// Game variables
let ball;
let paddle;

// Limite di velocità dopo il quale l'AI fallisce (e la partita si resetta)
// Questo valore è arbitrario e determina la difficoltà del gioco.
const MAX_AI_SPEED_LIMIT = 15;

// Dimensions will be dynamically set in setup()
let w;
let h;

// --- Paddle Class (HUMANIZED AI Controlled) ---
class Paddle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    // Velocità di reazione elevata (inerzia)
    this.aiSpeed = 0.85;
  }

  update(ball) {
    let targetX = ball.x - this.w / 2;

    // ⭐️ LOGICA DI SCONFITTA:
    // Se la velocità assoluta della palla supera il limite, rallenta la reazione dell'AI.
    // Questo è il "punto debole" che permette all'AI di perdere.
    let currentAiSpeed = this.aiSpeed;
    if (abs(ball.velX) > MAX_AI_SPEED_LIMIT || abs(ball.velY) > MAX_AI_SPEED_LIMIT) {
      // Rallenta drasticamente la reattività, simulando il panico o il ritardo.
      currentAiSpeed = 0.05;
    }

    this.x = lerp(this.x, targetX, currentAiSpeed);
    this.x = constrain(this.x, 0, width - this.w);
  }

  show() {
    fill(255);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}

// --- Ball Class ---
class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.velX = 0;
    this.velY = 0;
  }

  update() {
    this.x += this.velX;
    this.y += this.velY;
  }

  checkBoundary() {
    if (this.x - this.r < 0 || this.x + this.r > width) {
      this.velX *= -1;
      this.velX *= 1.01;
    }

    if (this.y - this.r < 0) {
      this.velY *= -1;
      this.velY *= 1.01;
    }
  }

  checkPaddle(p) {
    if (this.y + this.r >= p.y && this.y + this.r < p.y + p.h + abs(this.velY)) {
      if (this.x > p.x && this.x < p.x + p.w) {
        this.y = p.y - this.r;

        this.velY *= -1;

        let hitSpot = this.x - (p.x + p.w / 2);
        this.velX += hitSpot * 0.1;

        this.velX = constrain(this.velX, -25, 25); // Aumentato il limite massimo
        this.velY = constrain(this.velY, -25, 25);
      }
    }
  }

  // Controlla se l'AI ha mancato la palla O se la palla è troppo veloce
  checkMiss(p) {
    // La palla ha superato il fondo
    if (this.y - this.r > height) {
      this.reset();
      return;
    }

    // ⭐️ LOGICA DI SCONFITTA/RESET: Se la palla è troppo veloce (e l'AI rallenta), la partita riparte.
    // L'AI rallenta a 15, e se la palla supera 15, l'AI mancherà la palla e si resettà.
    if (abs(this.velX) > MAX_AI_SPEED_LIMIT + 5 || abs(this.velY) > MAX_AI_SPEED_LIMIT + 5) {
      this.reset();
    }
  }

  reset() {
    // ⭐️ AVVIO CASUALE: La palla parte da una X casuale
    this.x = random(this.r, width - this.r);
    // ⭐️ NUOVO: La palla parte dal bordo superiore (y = 0 + r)
    this.y = this.r;

    // Direzione iniziale casuale per renderlo meno prevedibile
    this.velX = random([-10, 10]);
    this.velY = 10;
  }

  show() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }
}

// --- p5.js Main Functions ---

function setup() {
  let parent = document.getElementById("pong-container");
  if (parent) {
    w = parent.offsetWidth;
    h = parent.offsetHeight;
  } else {
    w = 1080;
    h = 1080;
  }

  let canvas = createCanvas(w, h, P2D);
  canvas.parent("pong-container");

  canvas.style("background-color", "transparent");

  // ⭐️ NUOVO: Raggio della palla ridotto del 50% (da 0.015 a 0.0075)
  ball = new Ball(width / 2, height / 2, width * 0.0075);

  paddle = new Paddle(width / 2 - width * 0.06, height * 0.9, width * 0.12, height * 0.005);

  // ⭐️ Avvio iniziale casuale
  ball.reset();
}

function draw() {
  clear();

  paddle.update(ball);

  ball.update();
  ball.checkBoundary();
  ball.checkPaddle(paddle);
  // Passa il paddle per la logica di reset
  ball.checkMiss(paddle);

  paddle.show();
  ball.show();
}
