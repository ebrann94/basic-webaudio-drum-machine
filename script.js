const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

class Drum {
    constructor(audioFilename, playButton, gainControl, pitchControl) {
        this.audioBuffer;
        this.playBackSpeed = 1.0;

        fetch(audioFilename)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Unable to load sound file');
                }
                return res.arrayBuffer();
            })
            .then(rawBuffer => {
                audioContext.decodeAudioData(rawBuffer, (decodedData) => {
                    this.audioBuffer = decodedData;
                }, err => {
                    console.log('Unable to create audiobuffer' + err);
                });
                
            });
        
        this.gainNode = audioContext.createGain();
        this.gainNode.connect(audioContext.destination);
        
        this.UIElements = {
            playButton,
            gainControl,
            pitchControl
        }
        this.setupEventListeners();
        
    }

    setGain(newGain) {
        this.gainNode.gain.value = newGain;
    }

    play() {
        const source = audioContext.createBufferSource();
        source.buffer = this.audioBuffer;
        source.playbackRate.value = this.playBackSpeed;
        source.connect(this.gainNode);
        source.start(0);
    }

    setupEventListeners() {
        this.UIElements.gainControl.addEventListener('input', (e) => {
            this.setGain(e.target.value);
        });

        this.UIElements.playButton.addEventListener('mousedown', (e) => {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            this.play();
        });

        this.UIElements.pitchControl.addEventListener('input', (e) => {
            this.playBackSpeed = Number(e.target.value);
        });
    }
}

const kickDrum = new Drum(
    'sounds/909-kick.wav', 
    document.querySelector('#kick-btn'),
    document.querySelector('#kick-volume'),
    document.querySelector('#kick-pitch')
);

const snareDrum = new Drum(
    'sounds/909-snare.wav', 
    document.querySelector('#snare-btn'),
    document.querySelector('#snare-volume'),
    document.querySelector('#snare-pitch')
);

const hihat = new Drum(
    'sounds/909-hihat.wav', 
    document.querySelector('#hihat-btn'),
    document.querySelector('#hihat-volume'),
    document.querySelector('#hihat-pitch')
);


window.addEventListener('keydown', (e) => {
    switch (e.key ) {
        case 'a':
            kickDrum.play();
            break;
        case 's':
            snareDrum.play();
            break;
        case 'd':
            hihat.play();
            break;
    }
});