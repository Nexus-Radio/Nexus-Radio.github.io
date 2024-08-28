// Variables globales
let tracks = [];
let currentTrackIndex = 0;
let isPlaying = false;
let audioContext;
let sourceNode;
let gainNode;
let bassBoost;
let trebleBoost;
let loudnessNode;
let dolbyAtmosNode;
let analyser;

const audioElement = new Audio();
const playPauseButton = document.getElementById('play-pause');
const volumeControl = document.getElementById('volume-control');
const downloadButton = document.getElementById('download');
const bassBoostButton = document.getElementById('bass-boost');
const trebleBoostButton = document.getElementById('treble-boost');
const loudnessButton = document.getElementById('loudness');
const dolbyAtmosButton = document.getElementById('dolby-atmos');
const listenerCount = document.getElementById('listener-count');

// Fonction pour charger la liste des fichiers audio du dossier 'music'
async function loadMusicFiles() {
    try {
        // Remplacez 'OWNER' et 'REPO' par les valeurs appropriées de votre dépôt GitHub
        const response = await fetch('https://api.github.com/repos/OWNER/REPO/contents/music');
        if (!response.ok) throw new Error('Erreur lors du chargement des fichiers');
        const files = await response.json();
        tracks = files
            .filter(file => file.name.endsWith('.mp3'))
            .map(file => ({
                title: file.name.replace('.mp3', ''),
                artist: 'Artiste Inconnu',
                cover: `/api/placeholder/300/300?text=${encodeURIComponent(file.name.replace('.mp3', ''))}`,
                file: file.download_url
            }));
        if (tracks.length === 0) throw new Error('Aucun fichier audio trouvé');
        loadRandomTrack();
    } catch (error) {
        console.error('Erreur lors du chargement des fichiers musicaux:', error);
        // Fallback sur une liste prédéfinie en cas d'erreur
        tracks = [
            { title: "Mona Lisa Feat. JSX", artist: "Booba", cover: "/api/placeholder/300/300?text=Sample+Track+1", file: "https://example.com/sample1.mp3" },
            { title: "Sample Track 2", artist: "Sample Artist", cover: "/api/placeholder/300/300?text=Sample+Track+2", file: "https://example.com/sample2.mp3" }
        ];
        loadRandomTrack();
    }
}

// Fonction pour charger et jouer une piste aléatoire
function loadRandomTrack() {
    currentTrackIndex = Math.floor(Math.random() * tracks.length);
    loadTrack(currentTrackIndex);
}

// Fonction pour charger une piste spécifique
function loadTrack(index) {
    const track = tracks[index];
    audioElement.src = track.file;
    document.getElementById('track-title').textContent = track.title;
    document.getElementById('artist-name').textContent = track.artist;
    document.querySelector('.album-cover').src = track.cover;

    if (isPlaying) {
        audioElement.play().catch(e => console.error('Erreur de lecture:', e));
    }
}

// Initialisation de l'audio context et des nœuds d'effets
function initAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    sourceNode = audioContext.createMediaElementSource(audioElement);
    gainNode = audioContext.createGain();
    bassBoost = audioContext.createBiquadFilter();
    trebleBoost = audioContext.createBiquadFilter();
    loudnessNode = audioContext.createGain();
    dolbyAtmosNode = audioContext.createConvolver();
    analyser = audioContext.createAnalyser();

    bassBoost.type = 'lowshelf';
    bassBoost.frequency.value = 200;
    bassBoost.gain.value = 0;

    trebleBoost.type = 'highshelf';
    trebleBoost.frequency.value = 2000;
    trebleBoost.gain.value = 0;

    sourceNode.connect(bassBoost);
    bassBoost.connect(trebleBoost);
    trebleBoost.connect(loudnessNode);
    loudnessNode.connect(dolbyAtmosNode);
    dolbyAtmosNode.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audioContext.destination);
}

// Gestion de la lecture/pause
playPauseButton.addEventListener('click', () => {
    if (!audioContext) {
        initAudioContext();
    }
    if (isPlaying) {
        audioElement.pause();
        playPauseButton.textContent = 'Lecture';
    } else {
        audioElement.play().catch(e => console.error('Erreur de lecture:', e));
        playPauseButton.textContent = 'Pause';
    }
    isPlaying = !isPlaying;
});

// Gestion du volume
volumeControl.addEventListener('input', (e) => {
    audioElement.volume = e.target.value / 100;
});

// Gestion du téléchargement
downloadButton.addEventListener('click', () => {
    const track = tracks[currentTrackIndex];
    const link = document.createElement('a');
    link.href = track.file;
    link.download = `${track.title}.mp3`;
    link.click();
});

// Gestion des effets audio (inchangée)
bassBoostButton.addEventListener('click', () => {
    bassBoost.gain.value = bassBoost.gain.value === 0 ? 7 : 0;
    bassBoostButton.classList.toggle('active');
});

trebleBoostButton.addEventListener('click', () => {
    trebleBoost.gain.value = trebleBoost.gain.value === 0 ? 7 : 0;
    trebleBoostButton.classList.toggle('active');
});

loudnessButton.addEventListener('click', () => {
    loudnessNode.gain.value = loudnessNode.gain.value === 1 ? 1.5 : 1;
    loudnessButton.classList.toggle('active');
});

dolbyAtmosButton.addEventListener('click', () => {
    if (dolbyAtmosButton.classList.contains('active')) {
        dolbyAtmosNode.buffer = null;
    } else {
        const length = audioContext.sampleRate * 0.5;
        const buffer = audioContext.createBuffer(2, length, audioContext.sampleRate);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            channelData[i] = (Math.random() * 2 - 1) * Math.sin(i / length * Math.PI);
        }
        dolbyAtmosNode.buffer = buffer;
    }
    dolbyAtmosButton.classList.toggle('active');
});

// Gestion de la fin de la piste
audioElement.addEventListener('ended', loadRandomTrack);

// Simulation du nombre d'auditeurs
function updateListenerCount() {
    const count = Math.floor(Math.random() * 1000) + 1;
    listenerCount.textContent = count;
}

// Animation visuelle basée sur l'audio
function visualize() {
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    // Calculer la moyenne des fréquences
    const average = dataArray.reduce((a, b) => a + b) / bufferLength;

    // Changer la couleur de fond en fonction de l'intensité
    document.body.style.backgroundColor = `hsl(${average}, 50%, 50%)`;

    requestAnimationFrame(visualize);
}

// Initialisation
loadMusicFiles();
setInterval(updateListenerCount, 5000);
visualize();

// Simulation des logs d'écoute
let userStats = {
    connectionTime: Date.now(),
    totalListeningTime: 0,
    maxListeners: 0,
    uniqueUsers: new Set()
};

// Mise à jour des statistiques toutes les minutes
setInterval(() => {
    userStats.totalListeningTime += 60;
    userStats.uniqueUsers.add('user_' + Math.random().toString(36).substr(2, 9));
    userStats.maxListeners = Math.max(userStats.maxListeners, parseInt(listenerCount.textContent));

    // Affichage des statistiques dans la console (pour démonstration)
    console.log('Statistiques d\'écoute:', userStats);
}, 60000);

// Gestion des erreurs
audioElement.addEventListener('error', (e) => {
    console.error('Erreur de lecture audio:', e);
    loadRandomTrack(); // Charger une nouvelle piste en cas d'erreur
});
