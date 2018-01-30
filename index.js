function startDictation() {

    if (window.hasOwnProperty('webkitSpeechRecognition')) {

      var recognition = new webkitSpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.lang = "en-US";
      recognition.start();
      document.getElementById("voice-btn").classList.add("animated");
      document.getElementById("mic-ico").classList.add("text-danger");
      document.getElementById('detect-text').innerHTML = ".";

      recognition.onresult = function(e) {
        document.getElementById('detect-text').innerHTML
                                 = e.results[0][0].transcript;
        recognition.stop();
        document.getElementById("voice-btn").classList.remove("animated");
        document.getElementById("mic-ico").classList.remove("text-danger");
          
            axios.get('/bulb', {
              params: {
                text: e.results[0][0].transcript
              }
            })
            .then(function (response) {
                console.log(response.data);
                var data = response.data;
                console.log(data.status);
                
                if(data.status > 0) {
                    switch(data.blue_state) {
                        case 1:switchOn('red-bulb');break;
                        case 2:switchOff('red-bulb');break;
                    }
                    switch(data.red_state) {
                        case 1:switchOn('blue-bulb');break;
                        case 2:switchOff('blue-bulb');break;
                    }
                    document.getElementById('detect-text').innerHTML = data.text;
                }
                else {
                    document.getElementById('detect-text').innerHTML = 
                        "Sorry, some error has occured while analyzing the text";
                }
                document.getElementById("loading").className = "";

              
              
            })
            .catch(function (error) {
                document.getElementById('detect-text').innerHTML = 
                    "Sorry, some error has occured while contacting the server";
                console.log(error);
                document.getElementById("loading").className = "";
            });
            
      };

      recognition.onerror = function(e) {
        recognition.stop();
        document.getElementById("voice-btn").classList.remove("animated");
        document.getElementById("mic-ico").classList.remove("text-danger");

        document.getElementById('detect-text').innerHTML
                                 = "Sorry,couldn't hear you";
      }

    }
    else {
      document.getElementById('detect-text').innerHTML
                                 = "Sorry,your browser is not supported";
    }
  }

function switchOn(bulb) {
    document.getElementById(bulb).classList.add("fa-inverse");
  }
function switchOff(bulb) {
    document.getElementById(bulb).classList.remove("fa-inverse");
  }

function toggle(bulb){
  if(document.getElementById(bulb).classList.contains("fa-inverse"))
    switchOff(bulb);
  else
    switchOn(bulb);
}