var tilesize = 55;
var white_pawn;
var black_pawn;
var fire;

function preload() {
  white_pawn = loadImage('white_pawn.png');
  black_pawn = loadImage('black_pawn.png');
  fire = loadImage('fire.png');
}

function Board (cols_n, rows_n) {
  this.cols = cols_n;
  this.rows = rows_n;
  this.tiles = [];
  for (var i = 0; i < this.cols; i++) {
    this.tiles.push([]);
    for (var j = 0; j < this.rows; j++) {
      this.tiles[i].push(0);
    }
  }
  this.highlight_g = [];
  this.highlight_r = [];
  this.P1 = [];
  this.P2 = [];
  this.turn = 'P1';
  this.state = 'base';
  this.picked = null;
  this.show = function () {
    //draw white and black tiles
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        noStroke();
        if ((i+j)%2 == 0) {
          fill(235);  
        } else {
          fill(20);
        }
        rect(i*tilesize, j*tilesize, tilesize, tilesize);
      }
    }
    
    //draw tiles on fire
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (this.tiles[i][j] == 1) {
          image(fire, 2 + i * tilesize, 2 + j * tilesize);
        }
        
      }
    }
    
    //draw white pawns
    for (let w_pawn of this.P1) {
      image(white_pawn, 2 + w_pawn.x * tilesize, 2 + w_pawn.y * tilesize)
    }
    
    //draw black pawns
    for (let b_pawn of this.P2) {
      image(black_pawn, 2 + b_pawn.x * tilesize, 2 + b_pawn.y * tilesize)
    }
    
    //draw legal moves
    strokeWeight(6);
    stroke(10, 255, 10);
    noFill();
    
    for (let tile of this.highlight_g) {
      rect(3 + tile[0] * tilesize, 3 + tile[1] * tilesize, tilesize - 6, tilesize - 6);
    }
    
    stroke(255, 10, 10);
    
    for (let tile of this.highlight_r) {
      rect(3 + tile[0] * tilesize, 3 + tile[1] * tilesize, tilesize - 6, tilesize - 6);
    }
    
  };
}

function Pawn (parent, side, x, y) {
  this.x = x;
  this.y = y;
  this.parent = parent;
  this.side = side;
  this.parent[this.side].push(this);
  this.parent.tiles[this.x][this.y] = this.side;
  this.possible = [];
  this.search = function(trgt) {
    
    //right
    for (let i = this.x + 1; i < this.parent.cols; i++) {
      if (this.parent.tiles[i][this.y] == 0) {
        this.possible.push([i, this.y]);
      } else {
      break;
      }
    }
    
    //left
    for (let i = this.x - 1; i >= 0; i--) {
      if (this.parent.tiles[i][this.y] == 0) {
        this.possible.push([i, this.y]);
      } else {
      break;
      }
    }
    
    //down
    for (let j = this.y + 1; j < this.parent.rows; j++) {
      if (this.parent.tiles[this.x][j] == 0) {
        this.possible.push([this.x, j]);
      } else {
      break;
      }
    }
    
    //up
    for (let j = this.y - 1; j >= 0; j--) {
      if (this.parent.tiles[this.x][j] == 0) {
        this.possible.push([this.x, j]);
      } else {
      break;
      }
    }
    
    //down right
    for (let k = createVector(this.x + 1, this.y + 1); k.x < parent.cols && k.y < parent.rows ; k.add(1, 1)) {
      if (this.parent.tiles[k.x][k.y] == 0) {
        this.possible.push([k.x, k.y]);
      } else {
      break;
      }
    }
    
    //down left
    for (let k = createVector(this.x - 1, this.y + 1); k.x >= 0 && k.y < parent.rows ; k.add(-1, 1)) {
      if (this.parent.tiles[k.x][k.y] == 0) {
        this.possible.push([k.x, k.y]);
      } else {
      break;
      }
    }
    
    //up left
    for (let k = createVector(this.x - 1, this.y - 1); k.x >= 0 && k.y >= 0 ; k.add(-1, -1)) {
      if (this.parent.tiles[k.x][k.y] == 0) {
        this.possible.push([k.x, k.y]);
      } else {
      break;
      }
    }
    
    //up right
    for (let k = createVector(this.x + 1, this.y - 1); k.x < parent.cols && k.y >= 0 ; k.add(1, -1)) {
      if (this.parent.tiles[k.x][k.y] == 0) {
        this.possible.push([k.x, k.y]);
      } else {
      break;
      }
    }
    
    
    //highlight
    this.parent[trgt].push(...this.possible);
    
  }
  this.move = function (destX, destY) {
    this.parent.tiles[this.x][this.y] = 0;
    this.x = destX;
    this.y = destY;
    this.parent.tiles[this.x][this.y] = this.side;
    this.possible = [];
    this.parent.highlight_g = [];
  };
  
  this.fire_arrow = function (destX, destY) {
    this.parent.tiles[destX][destY] = 1;
    this.possible = [];
    this.parent.highlight_r = [];
    if (this.side == 'P1') {
      this.parent.turn = 'P2';
    } else {
      this.parent.turn = 'P1';
    }
  };
}

var main = function (brd, m_x, m_y) {
  let i = Math.floor(m_x / tilesize);
  let j = Math.floor(m_y / tilesize);
  console.log(i, j)
  switch (brd.state) {
    
    case 'base':
      for (let pawn of brd[brd.turn]) {
        if (i == pawn.x && j == pawn.y) {
          pawn.search('highlight_g');
          brd.picked = pawn
          brd.state = 'pawn picked';
          break;
        }
      }
      break;
    
    case 'pawn picked':
      let invalid = true;
      for (let tile of brd.picked.possible) {
        if (i == tile[0] && j == tile[1]) {
          invalid = false;
          brd.picked.move(i, j);
          brd.picked.search('highlight_r');
          brd.state = 'pawn-moved';
          break;
        }
      }
      if (invalid) {
        brd.state = 'base';
        brd.picked.possible = [];
        brd.picked = null;
        brd.highlight_g = [];
      }
      break;
      
    case 'pawn-moved':
      for (let tile of brd.picked.possible) {
        if (i == tile[0] && j == tile[1]) {
          brd.picked.fire_arrow(i, j);
          brd.state = 'base';
          break;
        }
      }
      break;
  }
};

var wPawns = [[0, 6], [3, 9], [6, 9], [9, 6]];
var bPawns = [[0, 3], [3, 0], [6, 0], [9, 3]];
var board;

function setup() {
  board = new Board(10, 10);
  createCanvas(tilesize*board.cols, tilesize*board.rows);
  
  for (let pawn of wPawns) {
    pawn = new Pawn(board, 'P1', pawn[0], pawn[1]);
  }
  
  for (let pawn of bPawns) {
    pawn = new Pawn(board, 'P2', pawn[0], pawn[1]);
  }
  
}

function draw() {
  background(125);
  board.show();
}


function mouseClicked() {
  main(board, mouseX, mouseY);
}
