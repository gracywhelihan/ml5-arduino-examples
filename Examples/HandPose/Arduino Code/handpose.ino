// define the pins that the 5 LEDs are attached to
// thumb to pin 6
const int led0 = 6;
// index to pin 5
const int led1 = 5;
// middle to pin 4
const int led2 = 4;
// ring to pin 3
const int led3 = 3;
// pinky to pin 2
const int led4 = 2;


void setup() {
  Serial.begin(9600);     // initialize serial communications
  // initialize the LED pins as output
  pinMode(led0, OUTPUT);
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);
  pinMode(led3, OUTPUT);
}
 
void loop() {
  if (Serial.available() > 0) { // if there's serial data available
    String inputString = Serial.readStringUntil('\n'); // Read the incoming data until a newline
    int outBytes[5]; // initialize an array with 5 elements to hold the incoming data for each finger

      // Parse the incoming string
    for (int i = 0; i < 5; i++) {
      int commaIndex = inputString.indexOf(','); // Find the comma
      if (commaIndex == -1) { // the last number in the string
        outBytes[i] = inputString.toInt(); // If no more commas, convert the substring to an integer
        break;
      }
      outBytes[i] = inputString.substring(0, commaIndex).toInt(); // Convert the substring to an integer and store it in the outbytes array
      inputString = inputString.substring(commaIndex + 1); // Remove the parsed part of the sting 
    }

    // check the value of each element in the outBytes array

    if(outBytes[0] == 1){ // if the value is 1 -- the finger is up
      digitalWrite(led0, HIGH); // turn the LED on
    }else{ // if the value is 0 -- the finger is down
      digitalWrite(led0, LOW); // turn the LED off
    }

     if(outBytes[1] == 1){
      digitalWrite(led1, HIGH);
    }else{
      digitalWrite(led1, LOW);
    }

     if(outBytes[2] == 1){
      digitalWrite(led2, HIGH);
    }else{
      digitalWrite(led2, LOW);
    }

     if(outBytes[3] == 1){
      digitalWrite(led3, HIGH);
    }else{
      digitalWrite(led3, LOW);
    }

    if(outBytes[4] == 1){
      digitalWrite(led4, HIGH);
    }else{
      digitalWrite(led4, LOW);
    }
  }
}
