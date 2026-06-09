async function processInput() {
   

  const task =
    document.getElementById("task").value;

  const input =
    document.getElementById("userInput").value;

  const output =
    document.getElementById("output");

  if (!input.trim()) {
    output.innerText =
      "Please enter text.";
    return;
  }

 output.innerHTML = `
<div class="loader"></div>
<p>Thinking...</p>
`;

  try {
    
   const response = await fetch("/ask", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    task: task,
    message: input
  })
});

    const data =
      await response.json();

      document.getElementById("history")
.innerHTML +=
`<p>📝 ${input}</p>`;

   if(data.reply.length < 200){
    typeWriter(data.reply, output);
}
else{
    output.innerText = data.reply;
}

  } catch (error) {

    output.innerText =
      "Error connecting to AI.";

  }
}

function feedback(type) {

  document.getElementById(
    "feedbackText"
  ).innerText =
    "Feedback: " + type;

}
function clearResponse() {

    document.getElementById("output").innerText =
        "AI response will appear here...";

    document.getElementById("userInput").value = "";

    document.getElementById("feedbackText").innerText = "";

}
document.getElementById("userInput")
.addEventListener("keypress", function(event){

    if(event.key === "Enter" && !event.shiftKey){
        event.preventDefault();
        processInput();
    }

});
function toggleDarkMode(){

    document.body.classList.toggle("dark");

}
function copyResponse(){

    const text =
    document.getElementById("output").innerText;

    navigator.clipboard.writeText(text);

    alert("Response copied!");

}
function startVoice(){

    alert("Listening... Speak now");

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice input is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function(){
        console.log("Started");
    };

    recognition.onresult = function(event){

        const transcript =
            event.results[0][0].transcript;

        console.log(transcript);

        document.getElementById("userInput").value =
            transcript;

    };

    recognition.onerror = function(event){

        console.log("Error:", event.error);

        alert("Voice Error: " + event.error);

    };

    recognition.onend = function(){
        console.log("Ended");
    };

    recognition.start();

}