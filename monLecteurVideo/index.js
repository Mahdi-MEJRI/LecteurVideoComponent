import './lib/webaudio-controls.js';



const getBaseURL = () => {
    return new URL('.', import.meta.url);
};

let style = `
.fond {
    text-align: center;
    margin-top: 150px;     
}

.vol {
    position: relative;
    top: -120px; 
    left: 10px;
}

.balance {
    position: relative;
    top: 50px; 
    left: 0px;
}

button {
    border: 0;
    line-height: 2.5;
    padding: 0 20px;
    font-size: 1rem;
    text-align: center;
    color: #fff;
    text-shadow: 1px 1px 1px #000;
    border-radius: 10px;
    background-color: rgba(90, 90, 90);
    background-image: linear-gradient(to top left,
                                      rgba(0, 0, 0, .2),
                                      rgba(0, 0, 0, .2) 30%,
                                      rgba(0, 0, 0, 0));
    box-shadow: inset 2px 2px 3px rgba(255, 255, 255, .6),
                inset -2px -2px 3px rgba(0, 0, 0, .6);
  }

  button:hover {
    background-color: rgba(240, 240, 240);
}

button:active {
    box-shadow: inset -2px -2px 3px rgba(255, 255, 255, .6),
                inset 2px 2px 3px rgba(0, 0, 0, .6);
}
`;
let template = /*html*/`
<div class="fond">
  <video id="player" crossorigin="anonymous">
      <br>
  </video>
  <br>
  <button id="vitesse-4" ><<<<</button>
  <button id="stop">STOP</button>
  <button id="play">PLAY</button>
  <button id="pause">PAUSE</button>
  <button id="info">GET INFO</button>
  <button id="avance10">+10s</button>
  <button id="vitesse4" >>>>></button>
  <!--webaudio-knob id="volume" min=0 max=1 value=0.5 step="0.01" 
         tooltip="%s" diameter="80" src="./assets/Aqua.png" sprites="100"></webaudio-knob!-->
         
         <webaudio-knob id="volume" class="vol" src="./assets/LittlePhatty_sample.png" min=0 max=1 value=0.5 step="0.01" diameter="60"></webaudio-knob>
        <div class="balance">
            <label for="pannerSlider">Balance</label>
            <input type="range" min="-1" max="1" step="0.1" value="0" id="pannerSlider" />
        </div>
    </div>      
</body>
   `;

class MyVideoPlayer extends HTMLElement {
    constructor() {
        super();


        console.log("BaseURL = " + getBaseURL());

        this.attachShadow({ mode: "open" });
    }

    fixRelativeURLs() {
        // pour les knobs
        let knobs = this.shadowRoot.querySelectorAll('webaudio-knob, webaudio-switch, webaudio-slider');
        knobs.forEach((e) => {
            let path = e.getAttribute('src');
            e.src = getBaseURL() + '/' + path;
        });
    }
    connectedCallback() {
        // Appelée avant affichage du composant
        // this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.shadowRoot.innerHTML = `<style>${style}</style>${template}`;
        
        this.fixRelativeURLs();

        this.player = this.shadowRoot.querySelector("#player");

        this.ctx = window.AudioContext || window.webkitAudioContext;

        // récupération de l'attribut HTML
        this.player.src = this.getAttribute("src");

        // déclarer les écouteurs sur les boutons
        this.definitEcouteurs();

        
    }

    definitEcouteurs() {

        console.log("ecouteurs définis")
        
        this.shadowRoot.querySelector("#pannerSlider").oninput = (event) => {            
            this.pannerNode.pan.value = event.target.value;
        }

        let i = 0;
        this.shadowRoot.querySelector("#play").onclick = () => {          
            
            this.play();
            this.context = new this.ctx();            
            if(i==0) this.buildAudioGraphPanner();
            i=1;
        }

        this.shadowRoot.querySelector("#pause").onclick = () => {
            this.pause();
        }

        this.shadowRoot.querySelector("#volume").oninput = (event) => {
            const vol = parseFloat(event.target.value);
            this.player.volume = vol;
        }

        this.shadowRoot.querySelector("#avance10").onclick = () => {
            this.avance10s();
        }

        this.shadowRoot.querySelector("#vitesse4").onclick = () => {
            this.vitesse4();
        }

        this.shadowRoot.querySelector("#vitesse-4").onclick = () => {
            this.ralenti4();
        }

        this.shadowRoot.querySelector("#stop").onclick = () => {
            this.stop();
        }

        this.shadowRoot.querySelector("#info").onclick = () => {
            this.info();
        }  
    }

    // API de mon composant

    buildAudioGraphPanner() {
        // create source and gain node
        this.source = this.context.createMediaElementSource(this.player);
        this.pannerNode = this.context.createStereoPanner();
      
        // connect nodes together
        this.source.connect(this.pannerNode);
        this.pannerNode.connect(this.context.destination);
    
    }
    
    play() {
        this.player.play();
    }

    pause() {
        this.player.pause();
    }

    avance10s() {
        this.player.currentTime += 10;
    }

    vitesse4() {
        this.player.playbackRate += 4;
    }

    ralenti4() {
        this.player.playbackRate -= 4;
    }

    stop() {
        this.player.load();
    }

    info() {
        console.log("Durée de la vidéo : " + this.player.duration);
        console.log("Temps courant : " + this.player.currentTime);
    }    
}

customElements.define("my-player", MyVideoPlayer);
