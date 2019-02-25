const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext = new AudioContext();

// Get audio element form DOM
// const audioElement = document.querySelector('audio');

// const track = audioContext.createMediaElementSource(audioElement);

// class DrumTrack {
//     constructor(audioElement, playButton, volumeControl) {
//         this.audioElement = audioElement;
//         this.track = audioContext.createMediaElementSource(this.audioElement);

//         this.playButton = playButton; // DOM Element

//         this.gainNode = audioContext.createGain();
//         this.gainControl = volumeControl // DOM element;

//         this.track.connect(this.gainNode);
//         this.gainNode.connect(audioContext.destination);
        
//         this.gainControl.addEventListener('input', (e) => {
//             this.setGain(e.target.value);
//         });

//         this.playButton.addEventListener('mousedown', (e) => {
//             if (audioContext.state === 'suspended') {
//                 audioContext.resume();
//             }
//             this.audioElement.play();
//             console.log('Playing Element');
//         });

//         //this.setGain = this.setGain.bind(this);
//     }

//     setGain(newGain) {
//         this.gainNode.gain.value = newGain;
//         console.log(this.gainNode.gain.value);
//     }
// }

// const kickDrum = new DrumTrack(
//     document.querySelector('#kick'), 
//     document.querySelector('#kick-btn'),
//     document.querySelector('#kick-volume')
// );

// setTimeout(() => {
//     console.log(test);
// }, 1000);

class DrumTrackBuffer {
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
        
        this.UIElements.gainControl.addEventListener('input', (e) => {
            this.setGain(e.target.value);
        });

        this.UIElements.playButton.addEventListener('mousedown', (e) => {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            const source = audioContext.createBufferSource();
            source.buffer = this.audioBuffer;
            source.playbackRate.value = this.playBackSpeed;
            source.connect(this.gainNode);
            source.start(0);
        });

        this.UIElements.pitchControl.addEventListener('input', (e) => {
            this.playBackSpeed = Number(e.target.value);
        });
    }

    setGain(newGain) {
        this.gainNode.gain.value = newGain;
    }
}

const kickDrum = new DrumTrackBuffer(
    'sounds/909-kick.wav', 
    document.querySelector('#kick-btn'),
    document.querySelector('#kick-volume'),
    document.querySelector('#kick-pitch')
);

const snareDrum = new DrumTrackBuffer(
    'sounds/909-snare.wav', 
    document.querySelector('#snare-btn'),
    document.querySelector('#snare-volume'),
    document.querySelector('#snare-pitch')
);