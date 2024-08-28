const startButton = document.getElementById('startRecord');
const stopButton = document.getElementById('stopRecord');
const audioPlayback = document.getElementById('audioPlayback');
const outputText = document.getElementById('outputText'); // Element to display the converted text

let mediaRecorder;
let audioChunks = [];

startButton.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayback.src = audioUrl;
        audioChunks = [];

        // Now, use the audioBlob for speech recognition
        startRecognition(audioBlob);
    };

    mediaRecorder.start();
    startButton.disabled = true;
    stopButton.disabled = false;
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
});

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US'; // Set the language for recognition
recognition.interimResults = false; // You can set this to true if you want real-time results
recognition.maxAlternatives = 1;

function startRecognition(audioBlob) {
    // You need a method to convert the Blob to a format recognized by the Web Speech API (e.g., streaming it as audio input).
    // The Web Speech API currently does not directly accept Blobs, so you might need to play the audio and capture it via the microphone.
    
    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        outputText.textContent = `Recognized text: ${transcript}`;
    };

    recognition.onspeechend = function() {
        recognition.stop();
    };

    recognition.onerror = function(event) {
        outputText.textContent = `Error occurred in recognition: ${event.error}`;
    };
}
