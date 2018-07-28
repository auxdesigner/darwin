var lstm;
var textInput;
var lengthSlider;
var tempSlider;
var button;

function setup() {
  noCanvas();

  $('.chatSection').append('<div class="botMsg">Hi. Ask me anything.</div>')

  // Create the LSTM Generator passing it the model directory
  lstm = ml5.LSTMGenerator('./models/darwin/', modelReady);

  // Grab the DOM elements
  textInput = $('#textInput');
  lengthSlider = $('#lenSlider');
  tempSlider = $('#tempSlider');
  button = $('#generate');

  // DOM element events
  button.click(generate);
  // lengthSlider.input(updateSliders);
  // tempSlider.input(updateSliders);

 
}



// Update the slider values
function updateSliders() {
  $('#length').html(lengthSlider.val());
  $('#temperature').html(tempSlider.val());
}

function modelReady() {
  $('#status').html('Darwin is ready.');
}

function scroll() {
  $('.chatSection').animate({ scrollTop: $(".chatSection")[0].scrollHeight }, 100);
  
  //console.log($(".chatSection")[0].scrollHeight);
}

// Generate new text
function generate() {
  // Update the status log
  $('#status').html('Darwin is thinking...');

  // Grab the original text
  var original = textInput.val();
  // Make it to lower case
  var txt = original.toLowerCase() + ' ';
  //console.log(txt);
  $('.chatSection').append('<div class="myMsg">' + txt + '</div>');

  scroll();
  setTimeout(function(){ 
      $('.chatSection').append('<div class="botMsg">OK. Let me think...</div>');
      scroll();
  }, 300);
  
  msg = $('#textInput').val();

  $('#textInput').val("");

  setTimeout(function(){ 
    newText(msg); 
  }, 400);
 
  
}

function newText(e) {
 
  let txt = e.toLowerCase();
  if (txt.length > 0) {
    // This is what the LSTM generator needs
    // Seed text, temperature, length to outputs
    // TODO: What are the defaults?
    let data = {
      seed: txt,
      temperature: tempSlider.val(),
      length: lengthSlider.val()
    };
    
    // Generate text with the lstm
    lstm.generate(data, gotData);

    // When it's done
    function gotData(err, result) {
      // Update the status log
      $('#status').html('Darwin finished his thought.');

      var cleaned = result + "."


      $('.chatSection').append('<div class="botMsg">' + cleaned + '</div>');
      scroll();
      // var reply = createElement('div', result);
      // reply.addClass('reply');
      //select('#result').html(txt + '<br>' + result);
      
    }
  }
}




// Execute a function when the user releases a key on the keyboard
$('#textInput').on("keyup", function(event) {
  
  // // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    generate();
  }
});
