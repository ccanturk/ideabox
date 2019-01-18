// A small fan-art project for "Yakusoku no Neverland" series
// This script creates circular morse codes similar to ones W.Minerva left in books using p5.js.
// Add your words to list below, each word will be drawn with a smaller radius
// You can fit up to 9 words before lines become too cramped
var words = ["please","add", "your", "words", "here"]

// declaring coordinates for center point
var cx = 270;
var cy = 270;

// arrays that contain paramaters for each dot and dash
var arcs = [];
var dots = [];


function setup() {
  createCanvas(cx*2,cy*2);
  background(0);
  angleMode(DEGREES);
  ellipseMode(RADIUS);
}

var morse = {'a':'.-', 'b':'-...', 'c':'-.-.', 'd':'-..', 'e':'.', 'f':'..-.', 'g':'--.', 'h':'....', 'i':'..', 'j':'.---', 'k':'-.-', 'l':'.-..', 'm':'--', 'n':'-.', 'o':'---', 'p':'.--.', 'q':'--.-', 'r':'.-.', 's':'...', 't':'-', 'u':'..-', 'v':'...-', 'w':'.--', 'x':'-..-', 'y':'-.--', 'z':'--..', ' ':'   ', '0':'-----', '1':'.----', '2':'..---', '3':'...--', '4':'....-', '5':'.....', '6':'-....', '7':'--...', '8':'---..', '9':'----.'}

// this function converts a string to morse code
function str2morse(string) {
  string = string.toLowerCase()
  var output = "";
  for (var i = 0; i < string.length; i++) {
    output += morse[string[i]] + ' ';
  }
  output = output.slice(0, -1);
  return output;
}

// this function takes in morse code adds drawing paramaters to arrays  
function morse2circle(mcode, crad) {
  // this loop calculates total length of message
  var tlenght = 0.5;
  for (var i = 0; i < mcode.length; i++) {
    tlenght += 1.5;
    if (mcode[i] == "-") {
      tlenght += 3;
    } else if (mcode[i] == " ") {
      tlenght += 1.5;
    }
  }
  tlenght += 2;

  
// this loop calculates the positions of each dot and dash
  var clenght = 0.5;
  for (var i = 0; i < mcode.length; i++) {
    clenght += 1.5;
    if (mcode[i] == "-") {
      arcs.push([crad, -90+360*clenght/tlenght, -90+360*(clenght+3)/tlenght]);
      clenght += 3;
    } else if (mcode[i] == " ") {
      clenght += 1.5;
    } else if (mcode[i] == ".") {
      dots.push([clenght/tlenght, crad]);
    }
  }
}

// convert each word in the array
for (var i = 0; i < words.length; i++) {
  morse2circle(str2morse(words[i]), 250-i*20);
}


function draw() {
  stroke(255);
  strokeCap(ROUND);
  strokeWeight(10);
  noFill();
  for (var i = 0; i < arcs.length; i++) {
    arc(cx, cy, arcs[i][0], arcs[i][0], arcs[i][1], arcs[i][2]);
  }
  noStroke();
  fill(255)
  for (var i = 0; i < dots.length; i++) {
    ellipse(cx + dots[i][1]*cos(-90 + 360*dots[i][0]), cy + dots[i][1]*sin(-90 + 360*dots[i][0]), 5)
  }
}
