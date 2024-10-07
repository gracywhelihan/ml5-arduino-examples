// This example uses ml5.js Handpose and Webserial
// 
// Each finger position will be sent to an Arduino and will be mapped to and LED
// If the finger is "up" the LED will turn on and if the finger is "down" the LED will turn off.
// 
// written by Gracy Whelihan

let handpose;
let video;
let hands = [];

// variable to hold an instance of the p5.webserial library:
const serial = new p5.WebSerial();

// HTML button object:
let portButton;
let inData; // for incoming serial data
let outByte0 = 0; // for outgoing data for thumb
let outByte1 = 0; // for outgoing data for pointer finger
let outByte2 = 0; // for outgoing data for middle finger
let outByte3 = 0; // for outgoing data for ring finger
let outByte4 = 0; // for outgoing data for pinky finger
let outByte5 = 0; // for outgoing data for thumb

function preload() {
  // Load the handpose model.
  handpose = ml5.handpose();
}

function setup() {
  createCanvas(640, 480);

  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  // start detecting hands from the webcam video
  handpose.detectStart(video, gotHands);

  // check to see if serial is available:
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  }
  // if serial is available, add connect/disconnect listeners:
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
  // check for any ports that are available:
  serial.getPorts();
  // if there's no port chosen, choose one:
  serial.on("noport", makePortButton);
  // open whatever port is available:
  serial.on("portavailable", openPort);
  // handle serial errors:
  serial.on("requesterror", portError);
  // handle any incoming serial data:
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);
}

function draw() {
  // flip the video so that is is mirrored
  //move image by the width of image to the left
  translate(video.width, 0);
  //then scale it by -1 in the x-axis
  //to flip the image
  scale(-1, 1);

  // Draw the webcam video
  image(video, 0, 0, width, height);

  if(hands.length >0){
  let hand = hands[0];
  if (hands[0]) {
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];

      // if the tip of the thumb
      // this need some work because it only works for the right hand at the moment
      if (keypoint == hand.keypoints[4]) {
        if (keypoint.x > hand.keypoints[3].x) {
          outByte0 = 1;
          // send it out the serial port:
          circle(keypoint.x, keypoint.y, 10);
        } else {
          outByte0 = 0;
        }
      }
      // check position of the pointer finger
      else if (keypoint == hand.keypoints[8]) {
        // if the pointer finger is up -- the tip has a lower y value than the first knuckle key point
        if (keypoint.y < hand.keypoints[7].y) {
          // set outByte1 to 1
          outByte1 = 1;
          // draw a circle at the tip of the pointer finger
          circle(keypoint.x, keypoint.y, 10);
          // if the pointer finger is down
        } else {
          // set outByte1 to 0
          outByte1 = 0;
        }
      } // check position of the middle finger
      else if (keypoint == hand.keypoints[12]) {
        // if the middle finger is up -- the tip has a lower y value than the first knuckle key point
        if (keypoint.y < hand.keypoints[11].y) {
          // set outByte2 to 1
          outByte2 = 1;
          // draw a circle at the tip of the middle finger
          circle(keypoint.x, keypoint.y, 10);
          // if the middle finger is down
        } else {
          // set outByte2 to 0
          outByte2 = 0;
        }
      } // check position of the ring finger
      else if (keypoint == hand.keypoints[16]) {
        // if the ring finger is up -- the tip has a lower y value than the first knuckle key point
        if (keypoint.y < hand.keypoints[15].y) {
          // set outByte3 to 1
          outByte3 = 1;
          // draw a circle at the tip of the pointer finger
          circle(keypoint.x, keypoint.y, 10);
          // if the ring finger is down
        } else {
          // set outByte3 to 0
          outByte3 = 0;
        }
      } // check position of the pinky finger
      else if (keypoint == hand.keypoints[20]) {
        // if the pinky finger is up -- the tip has a lower y value than the first knuckle key point
        if (keypoint.y < hand.keypoints[19].y) {
          // set outByte4 to 1
          outByte4 = 1;
          // draw a circle at the tip of the pointer finger
          circle(keypoint.x, keypoint.y, 10);
          // if the pinky finger is down
        } else {
          // set outByte4 to 0
          outByte4 = 0;
        }
      }
    }
  }

  //   let outputData = [];
  //   for(let i = 0; i < 5; i++){
  //     outputData.push(window[`outByte${i}`])
  //   }

  // send it out the serial port
  // serial.println(outByte0 + "," + outByte1 + "," + outByte2 + "," + outByte3 + "," + outByte4);
  } else{
    outByte0 = 0;
    outByte1 = 0;
    outByte2 = 0;
    outByte3 = 0;
    outByte4 = 0;
  }  
    serial.println(
    outByte0 + "," + outByte1 + "," + outByte2 + "," + outByte3 + "," + outByte4
  );  
}

// Callback function for when handpose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}

// Webserial functions

// if there's no port selected,
// make a port select button appear:
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton("choose port");
  portButton.position(10, 10);
  // give the port button a mousepressed handler:
  portButton.mousePressed(choosePort);
}

// make the port selector window appear:
function choosePort() {
  serial.requestPort();
}

// open the selected port, and make the port
// button invisible:
function openPort() {
  // wait for the serial.open promise to return,
  // then call the initiateSerial function
  serial.open().then(initiateSerial);

  // once the port opens, let the user know:
  function initiateSerial() {
    console.log("port open");
  }
  // hide the port button once a port is chosen:
  if (portButton) portButton.hide();
}

// read any incoming data as a byte:
function serialEvent() {
  // read a byte from the serial port:
  var inByte = serial.read();
  // store it in a global variable:
  inData = inByte;
}

// pop up an alert if there's a port error:
function portError(err) {
  alert("Serial port error: " + err);
}

// try to connect if a new serial port
// gets added (i.e. plugged in via USB):
function portConnect() {
  console.log("port connected");
  serial.getPorts();
}

// if a port is disconnected:
function portDisconnect() {
  serial.close();
  console.log("port disconnected");
}

function closePort() {
  serial.close();
}