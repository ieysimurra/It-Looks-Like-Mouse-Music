// =====================================================
// MUSIC MOUSE - GRADE DE FREQUÊNCIAS
// Baseado em Laurie Spiegel
// Ambos os eixos controlam frequências
// =====================================================

// =====================================================
// CONFIGURAÇÕES E CONSTANTES
// =====================================================

const CONFIG = {
    GRID_SIZE_X: 32,
    GRID_SIZE_Y: 24,
    BASE_FREQ_X: 110,    // A2 para eixo X
    BASE_FREQ_Y: 220,    // A3 para eixo Y
    FREQ_RANGE_X: 3,     // oitavas no eixo X
    FREQ_RANGE_Y: 2,     // oitavas no eixo Y
    MIN_LINES: 1,
    MAX_LINES: 8,
    DEFAULT_VOLUME: 0.2,
    BASE_SPACING: 80,    // Espaçamento base entre linhas
    MIN_SPACING: 20,     // Espaçamento mínimo
    MAX_SPACING: 150     // Espaçamento máximo
};

// Escalas musicais
const SCALES = {
    chromatic: {
        name: 'Cromática',
        intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    },
    major: {
        name: 'Maior',
        intervals: [0, 2, 4, 5, 7, 9, 11]
    },
    minor: {
        name: 'Menor Natural',
        intervals: [0, 2, 3, 5, 7, 8, 10]
    },
    harmonicMinor: {
        name: 'Menor Harmônica',
        intervals: [0, 2, 3, 5, 7, 8, 11]
    },
    pentatonic: {
        name: 'Pentatônica',
        intervals: [0, 2, 4, 7, 9]
    },
    blues: {
        name: 'Blues',
        intervals: [0, 3, 5, 6, 7, 10]
    },
    middleEastern: {
        name: 'Oriente Médio',
        intervals: [0, 1, 4, 5, 7, 8, 11]
    },
    japanese: {
        name: 'Japonesa',
        intervals: [0, 2, 3, 7, 8]
    },
    wholeTone: {
        name: 'Tons Inteiros',
        intervals: [0, 2, 4, 6, 8, 10]
    },
    continuous: {
        name: 'Contínua (Hz Linear)',
        intervals: [], // Array vazio indica escala contínua
        isContinuous: true // Flag para identificar escala contínua
    }
};

// Modos de espaçamento
const SPACING_MODES = {
    equal: 'Igualmente Espaçadas',
    dynamic: 'Movimento Contrário',
    random: 'Espaçamento Aleatório'
};

// Variáveis globais
let musicMouse;
let isInteracting = false;
let showInterface = false;
let showInstructions = false;
let instructionsLanguage = 'pt'; // 'pt' ou 'en'
let instructionsScroll = 0;
let canvas;

// Sistema de gravação
let videoRecorder = null;
let audioRecorder = null;
let recordedChunks = [];
let isRecordingVideo = false;
let isRecordingAudio = false;
let recordingStartTime = 0;

// =====================================================
// CLASSE MUSIC MOUSE
// =====================================================

class MusicMouseFrequencyGrid {
    constructor() {
        // Estado musical
        this.currentScale = SCALES.chromatic;
        this.rhythmTreatment = 'chord';
        this.transpose = 0;
        this.waveType = 'sine';
        this.isAudioStarted = false;
        this.toneAvailable = false;
        this.toneInitialized = false;
        
        // Linhas dinâmicas
        this.verticalLines = 3;
        this.horizontalLines = 1;
        
        // Sistema de seleção de linha
        this.selectedLineType = 'vertical';
        this.selectedLineIndex = 0;
        
        // Sistema de memória e automação
        this.isRecording = false;
        this.isPlayingBack = false;
        this.recordedMovements = [];
        this.playbackIndex = 0;
        this.playbackStartTime = 0;
        this.recordingStartTime = 0;
        
        // Espaçamento de linhas
        this.spacingMode = 'equal';
        this.randomSpacings = [];
        this.updateRandomSpacings();
        
        // Arrays de vozes
        this.verticalVoices = [];
        this.horizontalVoices = [];
        
        // Sistemas de áudio
        this.p5Oscillators = [];
        this.p5Envelopes = [];
        this.toneSynths = [];
        
        // Análise de áudio
        this.fft = null;
        this.amplitude = null;
        
        // Cores para as linhas
        this.lineColors = [
            [0, 100, 100],     // Vermelho
            [30, 100, 100],    // Laranja
            [60, 100, 100],    // Amarelo
            [120, 100, 100],   // Verde
            [180, 100, 100],   // Ciano
            [240, 100, 100],   // Azul
            [270, 100, 100],   // Roxo
            [300, 100, 100]    // Magenta
        ];
        
        // Inicializar sistemas
        this.initializeAudio();
    }
    
    // =====================================================
    // INICIALIZAÇÃO DE ÁUDIO
    // =====================================================
    
    initializeAudio() {
        this.initializeP5Sound();
        this.checkToneAvailability();
        this.updateVoiceArrays();
    }
    
    initializeP5Sound() {
        try {
            this.fft = new p5.FFT(0.8, 512);
            this.amplitude = new p5.Amplitude();
            console.log('p5.sound inicializado com sucesso');
        } catch (error) {
            console.error('Erro ao inicializar p5.sound:', error);
        }
    }
    
    checkToneAvailability() {
        try {
            if (typeof Tone !== 'undefined') {
                this.toneAvailable = true;
                console.log('Tone.js detectado');
            } else {
                this.toneAvailable = false;
                console.log('Tone.js não encontrado');
            }
        } catch (error) {
            this.toneAvailable = false;
            console.log('Erro ao verificar Tone.js:', error);
        }
    }
    
    async initializeToneJS() {
        if (!this.toneAvailable || this.toneInitialized) {
            return false;
        }
        
        try {
            await Tone.start();
            this.toneInitialized = true;
            console.log('Tone.js inicializado com sucesso');
            return true;
        } catch (error) {
            console.error('Erro ao inicializar Tone.js:', error);
            this.toneAvailable = false;
            return false;
        }
    }
    
    // =====================================================
    // ESPAÇAMENTO DE LINHAS
    // =====================================================
    
    updateRandomSpacings() {
        this.randomSpacings = [];
        const totalLines = this.verticalLines + this.horizontalLines;
        for (let i = 0; i < totalLines; i++) {
            this.randomSpacings.push(random(CONFIG.MIN_SPACING, CONFIG.MAX_SPACING));
        }
    }
    
    calculateLinePositions(mousePos, lineCount, isVertical) {
        switch (this.spacingMode) {
            case 'equal':
                return this.calculateEqualSpacing(mousePos, lineCount);
            case 'dynamic':
                return this.calculateDynamicSpacing(mousePos, lineCount, isVertical);
            case 'random':
                return this.calculateRandomSpacing(mousePos, lineCount, isVertical);
            default:
                return this.calculateEqualSpacing(mousePos, lineCount);
        }
    }
    
    calculateEqualSpacing(mousePos, lineCount) {
        const positions = [];
        const spacing = CONFIG.BASE_SPACING;
        const totalWidth = (lineCount - 1) * spacing;
        const startPos = mousePos - totalWidth / 2;
        
        for (let i = 0; i < lineCount; i++) {
            positions.push(startPos + i * spacing);
        }
        return positions;
    }
    
    calculateDynamicSpacing(mousePos, lineCount, isVertical) {
        const positions = [];
        let compressionFactor;
        
        if (isVertical) {
            compressionFactor = map(mouseX, 0, width, 1.5, 0.3);
        } else {
            compressionFactor = map(mouseY, 0, height, 1.5, 0.3);
        }
        
        const baseSpacing = CONFIG.BASE_SPACING * compressionFactor;
        const totalWidth = (lineCount - 1) * baseSpacing;
        const startPos = mousePos - totalWidth / 2;
        
        for (let i = 0; i < lineCount; i++) {
            positions.push(startPos + i * baseSpacing);
        }
        return positions;
    }
    
    calculateRandomSpacing(mousePos, lineCount, isVertical) {
        const positions = [];
        const baseIndex = isVertical ? 0 : this.verticalLines;
        
        const totalWidth = this.randomSpacings.slice(baseIndex, baseIndex + lineCount - 1)
            .reduce((sum, spacing) => sum + spacing, 0);
        
        let currentPos = mousePos - totalWidth / 2;
        positions.push(currentPos);
        
        for (let i = 1; i < lineCount; i++) {
            currentPos += this.randomSpacings[baseIndex + i - 1];
            positions.push(currentPos);
        }
        return positions;
    }
    
    changeSpacingMode() {
        const modes = Object.keys(SPACING_MODES);
        const currentIndex = modes.indexOf(this.spacingMode);
        this.spacingMode = modes[(currentIndex + 1) % modes.length];
        
        if (this.spacingMode === 'random') {
            this.updateRandomSpacings();
        }
        
        console.log(`Modo de espaçamento: ${SPACING_MODES[this.spacingMode]}`);
    }
    
    // =====================================================
    // GERENCIAMENTO DE VOZES
    // =====================================================
    
    updateVoiceArrays() {
        console.log(`Atualizando vozes: ${this.verticalLines} verticais, ${this.horizontalLines} horizontais`);
        
        // Salvar configurações das vozes existentes (se existirem)
        const savedVerticalVoices = this.verticalVoices ? this.verticalVoices.map(voice => ({
            waveType: voice.waveType,
            frequency: voice.frequency,
            isActive: voice.isActive
        })) : [];
        
        const savedHorizontalVoices = this.horizontalVoices ? this.horizontalVoices.map(voice => ({
            waveType: voice.waveType,
            frequency: voice.frequency,
            isActive: voice.isActive
        })) : [];
        
        this.clearAllVoices();
        
        this.p5Oscillators = [];
        this.p5Envelopes = [];
        this.toneSynths = [];
        this.verticalVoices = [];
        this.horizontalVoices = [];
        
        // Criar vozes para linhas verticais (preservando configurações)
        for (let i = 0; i < this.verticalLines; i++) {
            const savedVoice = savedVerticalVoices[i] || null;
            this.createVoice('vertical', i, savedVoice);
        }
        
        // Criar vozes para linhas horizontais (preservando configurações)
        for (let i = 0; i < this.horizontalLines; i++) {
            const savedVoice = savedHorizontalVoices[i] || null;
            this.createVoice('horizontal', i, savedVoice);
        }
        
        if (this.spacingMode === 'random') {
            this.updateRandomSpacings();
        }
        
        if (this.isAudioStarted) {
            this.startP5Oscillators();
        }
        
        console.log(`Vozes criadas: ${this.p5Oscillators.length} osciladores p5.sound`);
        if (savedVerticalVoices.length > 0 || savedHorizontalVoices.length > 0) {
            console.log(`✓ Configurações preservadas: ${savedVerticalVoices.length} verticais, ${savedHorizontalVoices.length} horizontais`);
        }
    }
    
    createVoice(type, index, savedVoice = null) {
        const currentMouseX = typeof mouseX !== 'undefined' ? mouseX : width / 2;
        const currentMouseY = typeof mouseY !== 'undefined' ? mouseY : height / 2;
        
        // Usar configurações salvas ou padrão
        const voiceWaveType = savedVoice ? savedVoice.waveType : this.waveType;
        
        // Criar oscilador p5.sound com a forma de onda correta
        const osc = new p5.Oscillator(voiceWaveType);
        osc.amp(0);
        
        // Criar envelope
        const env = new p5.Envelope();
        env.setADSR(0.01, 0.1, 0.7, 0.5);
        env.setRange(CONFIG.DEFAULT_VOLUME, 0);
        
        // Conectar envelope ao oscilador
        env.setInput(osc);
        
        // Criar sintetizador Tone.js se disponível
        let synth = null;
        if (this.toneAvailable && this.toneInitialized) {
            synth = this.createToneSynth(voiceWaveType);
        }
        
        this.p5Oscillators.push(osc);
        this.p5Envelopes.push(env);
        this.toneSynths.push(synth);
        
        // Calcular posição inicial
        let initialPosition;
        if (type === 'vertical') {
            const positions = this.calculateLinePositions(currentMouseX, this.verticalLines, true);
            initialPosition = positions[index] || currentMouseX;
        } else {
            const positions = this.calculateLinePositions(currentMouseY, this.horizontalLines, false);
            initialPosition = positions[index] || currentMouseY;
        }
        
        const voice = {
            type: type,
            index: index,
            frequency: savedVoice ? savedVoice.frequency : 440,
            isActive: savedVoice ? savedVoice.isActive : false,
            lastTrigger: 0,
            oscIndex: this.p5Oscillators.length - 1,
            position: initialPosition,
            waveType: voiceWaveType // Usar a forma de onda correta
        };
        
        if (type === 'vertical') {
            this.verticalVoices.push(voice);
        } else {
            this.horizontalVoices.push(voice);
        }
    }
    
    createToneSynth(waveType = this.waveType) {
        if (!this.toneAvailable || !this.toneInitialized) return null;
        
        try {
            const synth = new Tone.Synth({
                oscillator: { type: waveType },
                envelope: {
                    attack: 0.01,
                    decay: 0.2,
                    sustain: 0.7,
                    release: 0.5
                }
            }).toDestination();
            
            return synth;
        } catch (error) {
            console.error('Erro ao criar synth Tone.js:', error);
            return null;
        }
    }
    
    startP5Oscillators() {
        for (let osc of this.p5Oscillators) {
            if (osc && !osc.started) {
                try {
                    osc.start();
                } catch (error) {
                    console.error('Erro ao iniciar oscilador:', error);
                }
            }
        }
    }
    
    clearAllVoices() {
        // Parar todos os osciladores p5.sound
        for (let osc of this.p5Oscillators) {
            if (osc) {
                try {
                    osc.stop();
                    osc.dispose();
                } catch (error) {
                    // Ignorar erros de cleanup
                }
            }
        }
        
        // Desconectar sintetizadores Tone.js
        for (let synth of this.toneSynths) {
            if (synth && synth.dispose) {
                try {
                    synth.dispose();
                } catch (error) {
                    // Ignorar erros de cleanup
                }
            }
        }
    }
    
    // =====================================================
    // ADICIONAR/REMOVER LINHAS
    // =====================================================
    
    addVerticalLine() {
        if (this.verticalLines < CONFIG.MAX_LINES) {
            this.verticalLines++;
            this.updateVoiceArrays();
            console.log(`Linhas verticais: ${this.verticalLines}`);
        }
    }
    
    removeVerticalLine() {
        if (this.verticalLines > CONFIG.MIN_LINES) {
            this.verticalLines--;
            
            // Ajustar linha selecionada se necessário
            if (this.selectedLineType === 'vertical' && this.selectedLineIndex >= this.verticalLines) {
                this.selectedLineIndex = this.verticalLines - 1;
            }
            
            this.updateVoiceArrays();
            console.log(`Linhas verticais: ${this.verticalLines}`);
        }
    }
    
    addHorizontalLine() {
        if (this.horizontalLines < CONFIG.MAX_LINES) {
            this.horizontalLines++;
            this.updateVoiceArrays();
            console.log(`Linhas horizontais: ${this.horizontalLines}`);
        }
    }
    
    removeHorizontalLine() {
        if (this.horizontalLines > CONFIG.MIN_LINES) {
            this.horizontalLines--;
            
            // Ajustar linha selecionada se necessário
            if (this.selectedLineType === 'horizontal' && this.selectedLineIndex >= this.horizontalLines) {
                this.selectedLineIndex = this.horizontalLines - 1;
            }
            
            this.updateVoiceArrays();
            console.log(`Linhas horizontais: ${this.horizontalLines}`);
        }
    }
    
    // =====================================================
    // INICIAR ÁUDIO
    // =====================================================
    
    async startAudio() {
        if (!this.isAudioStarted) {
            console.log('Iniciando sistema de áudio...');
            
            try {
                userStartAudio();
                this.startP5Oscillators();
                
                if (this.toneAvailable) {
                    await this.initializeToneJS();
                }
                
                this.isAudioStarted = true;
                console.log('Sistema de áudio iniciado com sucesso');
                
                // Esconder loading
                const loading = document.getElementById('loading');
                if (loading) {
                    loading.classList.add('hidden');
                }
            } catch (error) {
                console.error('Erro ao inicializar áudio:', error);
            }
        }
    }
    
    // =====================================================
    // MAPEAMENTO DE FREQUÊNCIAS
    // =====================================================
    
    mapToFrequency(value, axis) {
        // Verificar se é escala contínua
        if (this.currentScale.isContinuous) {
            return this.mapToContinuousFrequency(value, axis);
        }
        
        const scaleIntervals = this.currentScale.intervals;
        const baseFreq = axis === 'x' ? CONFIG.BASE_FREQ_X : CONFIG.BASE_FREQ_Y;
        const freqRange = axis === 'x' ? CONFIG.FREQ_RANGE_X : CONFIG.FREQ_RANGE_Y;
        
        const noteRange = scaleIntervals.length * freqRange;
        const noteIndex = Math.floor(value * noteRange);
        const octave = Math.floor(noteIndex / scaleIntervals.length);
        const scaleIndex = noteIndex % scaleIntervals.length;
        
        const semitone = scaleIntervals[scaleIndex] + (octave * 12) + this.transpose;
        const frequency = baseFreq * Math.pow(2, semitone / 12);
        
        return constrain(frequency, 20, 20000);
    }
    
    mapToContinuousFrequency(value, axis) {
        // Mapeamento linear direto para frequências em Hz
        let minFreq, maxFreq;
        
        if (axis === 'x') {
            // Eixo X: frequências mais graves para agudas
            minFreq = 55;    // A1 (55 Hz)
            maxFreq = 1760;  // A6 (1760 Hz) - aproximadamente 5 oitavas
        } else {
            // Eixo Y: frequências médias para agudas
            minFreq = 110;   // A2 (110 Hz)
            maxFreq = 880;   // A5 (880 Hz) - aproximadamente 3 oitavas
        }
        
        // Aplicar transposição como multiplicador (mais musical para escala contínua)
        const transposeMultiplier = Math.pow(2, this.transpose / 12);
        
        // Mapeamento linear com suavização logarítmica para soar mais musical
        const logMin = Math.log(minFreq);
        const logMax = Math.log(maxFreq);
        const logFreq = logMin + value * (logMax - logMin);
        const frequency = Math.exp(logFreq) * transposeMultiplier;
        
        return constrain(frequency, 20, 20000);
    }
    
    // =====================================================
    // TOCAR NOTAS
    // =====================================================
    
    playNote(voice, frequency) {
        if (!voice || voice.oscIndex >= this.p5Oscillators.length) {
            return;
        }
        
        const oscIndex = voice.oscIndex;
        
        // p5.sound
        if (this.p5Oscillators[oscIndex] && this.p5Envelopes[oscIndex]) {
            try {
                this.p5Oscillators[oscIndex].freq(frequency);
                this.p5Envelopes[oscIndex].play();
            } catch (error) {
                console.error('Erro ao tocar nota p5.sound:', error);
            }
        }
        
        // Tone.js
        if (this.toneAvailable && this.toneInitialized && this.toneSynths[oscIndex]) {
            try {
                this.toneSynths[oscIndex].triggerAttackRelease(frequency, '8n');
            } catch (error) {
                console.error('Erro ao tocar nota Tone.js:', error);
            }
        }
        
        voice.frequency = frequency;
        voice.isActive = true;
        voice.lastTrigger = millis();
    }
    
    stopVoice(voice) {
        if (!voice || voice.oscIndex >= this.p5Envelopes.length) {
            return;
        }
        
        const oscIndex = voice.oscIndex;
        
        if (this.p5Envelopes[oscIndex]) {
            try {
                this.p5Envelopes[oscIndex].triggerRelease();
            } catch (error) {
                console.error('Erro ao parar voz:', error);
            }
        }
        
        voice.isActive = false;
    }
    
    stopAllVoices() {
        for (let voice of this.verticalVoices) {
            this.stopVoice(voice);
        }
        for (let voice of this.horizontalVoices) {
            this.stopVoice(voice);
        }
    }
    
    // =====================================================
    // APLICAR TRATAMENTO SONORO
    // =====================================================
    
    applyTreatment(mouseXNorm, mouseYNorm) {
        this.updateLinePositions();
        
        switch (this.rhythmTreatment) {
            case 'chord':
                this.playChord(mouseXNorm, mouseYNorm);
                break;
            case 'arpeggio':
                this.playArpeggio(mouseXNorm, mouseYNorm);
                break;
            case 'line':
                this.playLine(mouseXNorm, mouseYNorm);
                break;
            case 'improvise':
                this.playImprovise(mouseXNorm, mouseYNorm);
                break;
            case 'phase':
                this.playPhase(mouseXNorm, mouseYNorm);
                break;
        }
    }
    
    updateLinePositions() {
        // Atualizar posições das linhas verticais
        const verticalPositions = this.calculateLinePositions(mouseX, this.verticalLines, true);
        for (let i = 0; i < this.verticalVoices.length; i++) {
            this.verticalVoices[i].position = verticalPositions[i];
        }
        
        // Atualizar posições das linhas horizontais
        const horizontalPositions = this.calculateLinePositions(mouseY, this.horizontalLines, false);
        for (let i = 0; i < this.horizontalVoices.length; i++) {
            this.horizontalVoices[i].position = horizontalPositions[i];
        }
    }
    
    playChord(mouseXNorm, mouseYNorm) {
        const freqX = this.mapToFrequency(mouseXNorm, 'x');
        const freqY = this.mapToFrequency(mouseYNorm, 'y');
        
        // Tocar todas as linhas verticais
        for (let i = 0; i < this.verticalVoices.length; i++) {
            const voice = this.verticalVoices[i];
            const offset = i / Math.max(this.verticalLines, 1);
            const modFreq = freqY * (1 + offset * 0.3);
            this.playNote(voice, modFreq);
        }
        
        // Tocar todas as linhas horizontais
        for (let i = 0; i < this.horizontalVoices.length; i++) {
            const voice = this.horizontalVoices[i];
            const offset = i / Math.max(this.horizontalLines, 1);
            const modFreq = freqX * (1 + offset * 0.3);
            this.playNote(voice, modFreq);
        }
    }
    
    playArpeggio(mouseXNorm, mouseYNorm) {
        const time = millis();
        const speed = 120;
        const freqX = this.mapToFrequency(mouseXNorm, 'x');
        const freqY = this.mapToFrequency(mouseYNorm, 'y');
        
        for (let i = 0; i < this.verticalVoices.length; i++) {
            const phase = (time + i * speed) % (speed * this.verticalLines);
            if (phase < speed) {
                const voice = this.verticalVoices[i];
                const offset = i / Math.max(this.verticalLines, 1);
                const modFreq = freqY * (1 + offset * 0.3);
                this.playNote(voice, modFreq);
            } else {
                this.stopVoice(this.verticalVoices[i]);
            }
        }
        
        for (let i = 0; i < this.horizontalVoices.length; i++) {
            const phase = (time + (i + this.verticalLines) * speed) % (speed * this.horizontalLines);
            if (phase < speed) {
                const voice = this.horizontalVoices[i];
                const offset = i / Math.max(this.horizontalLines, 1);
                const modFreq = freqX * (1 + offset * 0.3);
                this.playNote(voice, modFreq);
            } else {
                this.stopVoice(this.horizontalVoices[i]);
            }
        }
    }
    
    playLine(mouseXNorm, mouseYNorm) {
        const freqX = this.mapToFrequency(mouseXNorm, 'x');
        const freqY = this.mapToFrequency(mouseYNorm, 'y');
        
        for (let i = 0; i < this.verticalVoices.length; i++) {
            const voice = this.verticalVoices[i];
            const direction = i % 2 === 0 ? 1 : -1;
            const offset = 1 + (i * 0.1 * direction);
            this.playNote(voice, freqY * offset);
        }
        
        for (let i = 0; i < this.horizontalVoices.length; i++) {
            const voice = this.horizontalVoices[i];
            const direction = i % 2 === 0 ? -1 : 1;
            const offset = 1 + (i * 0.1 * direction);
            this.playNote(voice, freqX * offset);
        }
    }
    
    playImprovise(mouseXNorm, mouseYNorm) {
        const freqX = this.mapToFrequency(mouseXNorm, 'x');
        const freqY = this.mapToFrequency(mouseYNorm, 'y');
        
        for (let voice of this.verticalVoices) {
            if (random() > 0.4) {
                const intervals = [1, 1.125, 1.25, 1.33, 1.5];
                const interval = random(intervals);
                this.playNote(voice, freqY * interval);
            } else {
                this.stopVoice(voice);
            }
        }
        
        for (let voice of this.horizontalVoices) {
            if (random() > 0.4) {
                const intervals = [1, 1.125, 1.25, 1.33, 1.5];
                const interval = random(intervals);
                this.playNote(voice, freqX * interval);
            } else {
                this.stopVoice(voice);
            }
        }
    }
    
    playPhase(mouseXNorm, mouseYNorm) {
        const time = millis() / 1000;
        const freqX = this.mapToFrequency(mouseXNorm, 'x');
        const freqY = this.mapToFrequency(mouseYNorm, 'y');
        
        for (let i = 0; i < this.verticalVoices.length; i++) {
            const voice = this.verticalVoices[i];
            const phaseShift = i * 0.25;
            const rate = 1 + (i * 0.05);
            const modulation = sin(time * rate + phaseShift);
            const modFreq = freqY * (1 + modulation * 0.1);
            this.playNote(voice, modFreq);
        }
        
        for (let i = 0; i < this.horizontalVoices.length; i++) {
            const voice = this.horizontalVoices[i];
            const phaseShift = i * 0.25 + PI;
            const rate = 1 + (i * 0.05);
            const modulation = cos(time * rate + phaseShift);
            const modFreq = freqX * (1 + modulation * 0.1);
            this.playNote(voice, modFreq);
        }
    }
    
    // =====================================================
    // CONTROLES
    // =====================================================
    
    getSelectedVoice() {
        if (this.selectedLineType === 'vertical') {
            return this.verticalVoices[this.selectedLineIndex];
        } else {
            return this.horizontalVoices[this.selectedLineIndex];
        }
    }
    
    changeSelectedLineWaveform(waveType) {
        const voice = this.getSelectedVoice();
        if (!voice) return;
        
        const oscIndex = voice.oscIndex;
        voice.waveType = waveType;
        
        // Atualizar oscilador p5.sound
        if (this.p5Oscillators[oscIndex]) {
            this.p5Oscillators[oscIndex].setType(waveType);
        }
        
        // Atualizar sintetizador Tone.js
        if (this.toneAvailable && this.toneInitialized && this.toneSynths[oscIndex]) {
            try {
                this.toneSynths[oscIndex].set({
                    oscillator: { type: waveType }
                });
            } catch (error) {
                console.error('Erro ao mudar waveform:', error);
            }
        }
        
        const lineDesc = `${this.selectedLineType === 'vertical' ? 'Vertical' : 'Horizontal'} ${this.selectedLineIndex + 1}`;
        console.log(`${lineDesc}: ${waveType}`);
    }
    
    nextVerticalLine() {
        if (this.verticalLines > 0) {
            this.selectedLineType = 'vertical';
            this.selectedLineIndex = (this.selectedLineIndex + 1) % this.verticalLines;
            console.log(`Linha vertical selecionada: ${this.selectedLineIndex + 1}`);
        }
    }
    
    previousVerticalLine() {
        if (this.verticalLines > 0) {
            this.selectedLineType = 'vertical';
            this.selectedLineIndex = (this.selectedLineIndex - 1 + this.verticalLines) % this.verticalLines;
            console.log(`Linha vertical selecionada: ${this.selectedLineIndex + 1}`);
        }
    }
    
    nextHorizontalLine() {
        if (this.horizontalLines > 0) {
            this.selectedLineType = 'horizontal';
            this.selectedLineIndex = (this.selectedLineIndex + 1) % this.horizontalLines;
            console.log(`Linha horizontal selecionada: ${this.selectedLineIndex + 1}`);
        }
    }
    
    previousHorizontalLine() {
        if (this.horizontalLines > 0) {
            this.selectedLineType = 'horizontal';
            this.selectedLineIndex = (this.selectedLineIndex - 1 + this.horizontalLines) % this.horizontalLines;
            console.log(`Linha horizontal selecionada: ${this.selectedLineIndex + 1}`);
        }
    }
    
    toggleLineType() {
        this.selectedLineType = this.selectedLineType === 'vertical' ? 'horizontal' : 'vertical';
        this.selectedLineIndex = 0;
        const lineDesc = `${this.selectedLineType === 'vertical' ? 'Vertical' : 'Horizontal'} ${this.selectedLineIndex + 1}`;
        console.log(`Tipo alterado. Linha selecionada: ${lineDesc}`);
    }
    
    // =====================================================
    // SISTEMA DE MEMÓRIA E AUTOMAÇÃO
    // =====================================================
    
    toggleRecording() {
        if (this.isPlayingBack) {
            console.log('Não é possível gravar durante a reprodução');
            return;
        }
        
        this.isRecording = !this.isRecording;
        
        if (this.isRecording) {
            this.recordedMovements = [];
            this.recordingStartTime = millis();
            console.log('🔴 Gravação iniciada - mova o mouse e clique/arraste');
        } else {
            console.log(`⏹️ Gravação finalizada - ${this.recordedMovements.length} movimentos gravados`);
        }
    }
    
    togglePlayback() {
        if (this.isRecording) {
            console.log('Não é possível reproduzir durante a gravação');
            return;
        }
        
        if (this.recordedMovements.length === 0) {
            console.log('Nenhum movimento gravado para reproduzir');
            return;
        }
        
        this.isPlayingBack = !this.isPlayingBack;
        
        if (this.isPlayingBack) {
            this.playbackIndex = 0;
            this.playbackStartTime = millis();
            console.log(`▶️ Reprodução iniciada - ${this.recordedMovements.length} movimentos`);
        } else {
            this.playbackIndex = 0;
            console.log('⏸️ Reprodução pausada');
        }
    }
    
    recordMovement(x, y, isInteracting) {
        if (!this.isRecording) return;
        
        const currentTime = millis();
        const timeOffset = currentTime - this.recordingStartTime;
        
        this.recordedMovements.push({
            x: x,
            y: y,
            isInteracting: isInteracting,
            time: timeOffset
        });
    }
    
    updatePlayback() {
        if (!this.isPlayingBack || this.recordedMovements.length === 0) {
            return { x: mouseX, y: mouseY, isInteracting: false };
        }
        
        const currentTime = millis();
        const playbackTime = currentTime - this.playbackStartTime;
        
        // Encontrar movimento atual baseado no tempo
        while (this.playbackIndex < this.recordedMovements.length - 1) {
            const nextMovement = this.recordedMovements[this.playbackIndex + 1];
            if (playbackTime >= nextMovement.time) {
                this.playbackIndex++;
            } else {
                break;
            }
        }
        
        // Reiniciar se chegou ao final
        if (this.playbackIndex >= this.recordedMovements.length - 1) {
            this.playbackIndex = 0;
            this.playbackStartTime = currentTime;
        }
        
        const movement = this.recordedMovements[this.playbackIndex];
        return {
            x: movement.x,
            y: movement.y,
            isInteracting: movement.isInteracting
        };
    }
    
    // =====================================================
    // CONFIGURAÇÕES
    // =====================================================
    
    changeScale(scaleName) {
        if (SCALES[scaleName]) {
            this.currentScale = SCALES[scaleName];
        }
    }
    
    changeRhythmTreatment(treatment) {
        this.rhythmTreatment = treatment;
    }
    
    setTranspose(value) {
        this.transpose = constrain(value, -24, 24);
    }
}

// =====================================================
// SISTEMA DE GRAVAÇÃO DE MÍDIA
// =====================================================

function initializeRecordingSystem() {
    if (!MediaRecorder.isTypeSupported) {
        console.warn('MediaRecorder não suportado neste navegador');
        return;
    }
    console.log('Sistema de gravação inicializado');
}

async function startVideoRecording() {
    if (isRecordingVideo) {
        stopVideoRecording();
        return;
    }
    
    try {
        const canvasStream = canvas.elt.captureStream(30);
        let combinedStream = canvasStream;
        
        try {
            const audioStream = await navigator.mediaDevices.getDisplayMedia({
                video: false,
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                    sampleRate: 44100
                }
            });
            
            combinedStream = new MediaStream([
                ...canvasStream.getVideoTracks(),
                ...audioStream.getAudioTracks()
            ]);
            
            console.log('🎵 Áudio do sistema capturado para vídeo');
            
        } catch (systemAudioError) {
            try {
                const micStream = await navigator.mediaDevices.getUserMedia({ 
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false,
                        sampleRate: 44100
                    }
                });
                
                combinedStream = new MediaStream([
                    ...canvasStream.getVideoTracks(),
                    ...micStream.getAudioTracks()
                ]);
                
                console.log('🎵 Áudio do microfone capturado para vídeo');
                
            } catch (micError) {
                console.warn('Gravação apenas com vídeo (sem áudio)');
                combinedStream = canvasStream;
            }
        }
        
        const options = {
            mimeType: 'video/webm;codecs=vp9,opus',
            videoBitsPerSecond: 2500000,
            audioBitsPerSecond: 128000
        };
        
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options.mimeType = 'video/webm';
        }
        
        videoRecorder = new MediaRecorder(combinedStream, options);
        recordedChunks = [];
        
        videoRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        
        videoRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            downloadBlob(blob, `music-mouse-video-${getTimestamp()}.webm`);
            recordedChunks = [];
        };
        
        videoRecorder.start(1000);
        isRecordingVideo = true;
        recordingStartTime = Date.now();
        
        console.log('🎥 Gravação de vídeo iniciada');
        
    } catch (error) {
        console.error('Erro ao iniciar gravação de vídeo:', error);
        alert('Erro ao iniciar gravação de vídeo. Verifique as permissões do navegador.');
    }
}

function stopVideoRecording() {
    if (videoRecorder && videoRecorder.state !== 'inactive') {
        videoRecorder.stop();
        videoRecorder.stream.getTracks().forEach(track => track.stop());
    }
    isRecordingVideo = false;
    console.log('⏹️ Gravação de vídeo finalizada');
}

async function startAudioRecording() {
    if (isRecordingAudio) {
        stopAudioRecording();
        return;
    }
    
    try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            }
        });
        
        const options = {
            mimeType: 'audio/webm;codecs=opus',
            audioBitsPerSecond: 128000
        };
        
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options.mimeType = 'audio/webm';
        }
        
        audioRecorder = new MediaRecorder(audioStream, options);
        recordedChunks = [];
        
        audioRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        
        audioRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'audio/webm' });
            downloadBlob(blob, `music-mouse-audio-${getTimestamp()}.webm`);
            recordedChunks = [];
        };
        
        audioRecorder.start(1000);
        isRecordingAudio = true;
        recordingStartTime = Date.now();
        
        console.log('🎵 Gravação de áudio iniciada');
        
    } catch (error) {
        console.error('Erro ao iniciar gravação de áudio:', error);
        alert('Erro ao iniciar gravação de áudio. Verifique as permissões do navegador.');
    }
}

function stopAudioRecording() {
    if (audioRecorder && audioRecorder.state !== 'inactive') {
        audioRecorder.stop();
        audioRecorder.stream.getTracks().forEach(track => track.stop());
    }
    isRecordingAudio = false;
    console.log('⏹️ Gravação de áudio finalizada');
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
}

// =====================================================
// SISTEMA DE INSTRUÇÕES MELHORADO
// =====================================================

function toggleInstructions(language = null) {
    if (showInstructions && language === null) {
        // Se já está mostrando e não especificou idioma, apenas fechar
        showInstructions = false;
        console.log('Instruções fechadas');
        return;
    }
    
    if (showInstructions && language !== null) {
        // Se já está mostrando e especificou idioma, apenas trocar idioma
        instructionsLanguage = language;
    } else {
        // Se não está mostrando, abrir com idioma especificado ou alternar
        showInstructions = true;
        if (language !== null) {
            instructionsLanguage = language;
        } else {
            // Alternar idioma se não especificado
            instructionsLanguage = instructionsLanguage === 'pt' ? 'en' : 'pt';
        }
    }
    
    instructionsScroll = 0;
    console.log(`Instruções ${showInstructions ? 'abertas' : 'fechadas'} em ${instructionsLanguage === 'pt' ? 'Português' : 'English'}`);
}

function getInstructionsContent() {
    if (instructionsLanguage === 'pt') {
        return getPortugueseInstructions();
    } else {
        return getEnglishInstructions();
    }
}

function getPortugueseInstructions() {
    return {
        title: "🎹 Music Mouse 🎵",
        subtitle: "Grade de Frequências Interativa baseada no trabalho pioneiro de Laurie Spiegel",
        sections: [
            {
                title: "🌐 Sobre o Music Mouse",
                content: [
                    "O Music Mouse foi originalmente criado por Laurie Spiegel em 1986,",
                    "uma ferramenta pioneira de composição musical assistida por computador.",
                    "Esta implementação é uma homenagem ao seu trabalho inovador.",
                    "",
                    "🔗 Saiba mais:",
                    "• Wikipedia: Music Mouse (link abaixo)",
                    "• Vídeo demonstração no YouTube (link abaixo)"
                ]
            },
            {
                title: "🎮 Como Usar",
                content: [
                    "• Clique e arraste: Toque música em tempo real",
                    "• Movimento horizontal: Controla frequências no eixo X",
                    "• Movimento vertical: Controla frequências no eixo Y",
                    "• Cada linha representa uma voz musical independente",
                    "• Tecla H: Mostra/oculta interface completa"
                ]
            },
            {
                title: "📏 Gerenciar Linhas",
                content: [
                    "• Setas ↑/↓: Adiciona/remove linhas verticais",
                    "• Setas ←/→: Adiciona/remove linhas horizontais",
                    "• Tecla G: Alterna modos de espaçamento",
                    "• Máximo: 8 linhas por direção",
                    "• Cada linha mantém sua configuração individual"
                ]
            },
            {
                title: "🎵 Escalas Musicais",
                content: [
                    "• 0 - Contínua (Hz Linear) - Frequências suaves",
                    "• 1 - Cromática (12 semitons)",
                    "• 2 - Maior (do-ré-mi-fá-sol-lá-si)",
                    "• 3 - Menor Natural",
                    "• 4 - Menor Harmônica", 
                    "• 5 - Pentatônica (5 notas)",
                    "• 6 - Blues (escala blues tradicional)",
                    "• 7 - Oriente Médio (modos árabes)",
                    "• 8 - Japonesa (escala tradicional)",
                    "• 9 - Tons Inteiros (Debussy)"
                ]
            },
            {
                title: "🎼 Tratamentos Rítmicos",
                content: [
                    "• Q - Acorde: Todas as linhas tocam simultaneamente",
                    "• W - Arpejo: Linhas tocam em sequência",
                    "• E - Linha: Movimento linear das vozes",
                    "• R - Improvisação: Padrões aleatórios",
                    "• T - Fase: Estilo minimalista (Steve Reich)"
                ]
            },
            {
                title: "🔊 Navegação entre Linhas",
                content: [
                    "• [ / ] - Navegar entre linhas verticais",
                    "• , / . - Navegar entre linhas horizontais",
                    "• TAB - Alternar tipo de linha (vertical/horizontal)",
                    "• Linha selecionada aparece destacada"
                ]
            },
            {
                title: "🎛️ Formas de Onda Individuais",
                content: [
                    "• Z - Senoide (∿) - Som suave e puro",
                    "• X - Triangular (△) - Som doce, harmônicos ímpares",
                    "• C - Dente de Serra (⋮) - Som rico, todos harmônicos",
                    "• V - Quadrada (⊔) - Som eletrônico, harmônicos ímpares",
                    "• Cada linha pode ter sua própria forma de onda"
                ]
            },
            {
                title: "🎚️ Controles de Transposição",
                content: [
                    "• A - Diminuir transposição (-1 semitom)",
                    "• S - Aumentar transposição (+1 semitom)",
                    "• D - Resetar transposição (0)",
                    "• Faixa: -24 a +24 semitons (2 oitavas)"
                ]
            },
            {
                title: "🎬 Gravação e Automação",
                content: [
                    "• M - Inicia/para gravação de movimentos",
                    "• P - Reproduz/pausa movimentos gravados",
                    "• Durante reprodução você pode tocar junto!",
                    "• Botão 'Gravar Vídeo' - Captura vídeo + áudio",
                    "• Botão 'Gravar Áudio' - Captura apenas áudio"
                ]
            },
            {
                title: "⚙️ Modos de Espaçamento",
                content: [
                    "• Igualmente Espaçadas: Distância fixa entre linhas",
                    "• Movimento Contrário: Espaçamento varia com mouse",
                    "• Espaçamento Aleatório: Posições aleatórias fixas"
                ]
            },
            {
                title: "💡 Dicas Avançadas",
                content: [
                    "• Experimente diferentes escalas para estilos musicais variados",
                    "• Use a escala contínua (0) para efeitos sonoros especiais",
                    "• Combine tratamentos diferentes durante a reprodução",
                    "• Grave sequências e toque por cima para criar camadas",
                    "• Cada linha mantém sua forma de onda ao adicionar/remover linhas"
                ]
            }
        ],
        links: [
            {
                title: "📖 Wikipedia - Music Mouse",
                url: "https://en.wikipedia.org/wiki/Music_Mouse",
                description: "Artigo completo sobre o Music Mouse original de Laurie Spiegel"
            },
            {
                title: "🎥 Demonstração no YouTube",
                url: "https://www.youtube.com/watch?v=CuVwEfvJ1YY",
                description: "Vídeo mostrando o Music Mouse original em funcionamento"
            }
        ]
    };
}

function getEnglishInstructions() {
    return {
        title: "🎹 Music Mouse 🎵",
        subtitle: "Interactive Frequency Grid based on Laurie Spiegel's pioneering work",
        sections: [
            {
                title: "🌐 About Music Mouse",
                content: [
                    "Music Mouse was originally created by Laurie Spiegel in 1986,",
                    "a pioneering computer-assisted music composition tool.",
                    "This implementation is a tribute to her innovative work.",
                    "",
                    "🔗 Learn more:",
                    "• Wikipedia: Music Mouse (link below)",
                    "• YouTube demonstration video (link below)"
                ]
            },
            {
                title: "🎮 How to Use",
                content: [
                    "• Click and drag: Play music in real-time",
                    "• Horizontal movement: Controls frequencies on X-axis",
                    "• Vertical movement: Controls frequencies on Y-axis",
                    "• Each line represents an independent musical voice",
                    "• Key H: Show/hide complete interface"
                ]
            },
            {
                title: "📏 Manage Lines",
                content: [
                    "• Arrow keys ↑/↓: Add/remove vertical lines",
                    "• Arrow keys ←/→: Add/remove horizontal lines",
                    "• Key G: Toggle spacing modes",
                    "• Maximum: 8 lines per direction",
                    "• Each line maintains its individual configuration"
                ]
            },
            {
                title: "🎵 Musical Scales",
                content: [
                    "• 0 - Continuous (Linear Hz) - Smooth frequencies",
                    "• 1 - Chromatic (12 semitones)",
                    "• 2 - Major (do-re-mi-fa-sol-la-ti)",
                    "• 3 - Natural Minor",
                    "• 4 - Harmonic Minor",
                    "• 5 - Pentatonic (5 notes)",
                    "• 6 - Blues (traditional blues scale)",
                    "• 7 - Middle Eastern (Arabic modes)",
                    "• 8 - Japanese (traditional scale)",
                    "• 9 - Whole Tone (Debussy style)"
                ]
            },
            {
                title: "🎼 Rhythmic Treatments",
                content: [
                    "• Q - Chord: All lines play simultaneously",
                    "• W - Arpeggio: Lines play in sequence",
                    "• E - Line: Linear voice movement",
                    "• R - Improvisation: Random patterns",
                    "• T - Phase: Minimalist style (Steve Reich)"
                ]
            },
            {
                title: "🔊 Navigate Between Lines",
                content: [
                    "• [ / ] - Navigate through vertical lines",
                    "• , / . - Navigate through horizontal lines",
                    "• TAB - Toggle line type (vertical/horizontal)",
                    "• Selected line appears highlighted"
                ]
            },
            {
                title: "🎛️ Individual Waveforms",
                content: [
                    "• Z - Sine wave (∿) - Smooth, pure sound",
                    "• X - Triangle wave (△) - Sweet, odd harmonics",
                    "• C - Sawtooth wave (⋮) - Rich, all harmonics",
                    "• V - Square wave (⊔) - Electronic, odd harmonics",
                    "• Each line can have its own waveform"
                ]
            },
            {
                title: "🎚️ Transposition Controls",
                content: [
                    "• A - Decrease transposition (-1 semitone)",
                    "• S - Increase transposition (+1 semitone)",
                    "• D - Reset transposition (0)",
                    "• Range: -24 to +24 semitones (2 octaves)"
                ]
            },
            {
                title: "🎬 Recording and Automation",
                content: [
                    "• M - Start/stop movement recording",
                    "• P - Play/pause recorded movements",
                    "• During playback you can still play along!",
                    "• 'Record Video' button - Captures video + audio",
                    "• 'Record Audio' button - Captures audio only"
                ]
            },
            {
                title: "⚙️ Spacing Modes",
                content: [
                    "• Equally Spaced: Fixed distance between lines",
                    "• Contrary Motion: Spacing varies with mouse",
                    "• Random Spacing: Fixed random positions"
                ]
            },
            {
                title: "💡 Advanced Tips",
                content: [
                    "• Try different scales for varied musical styles",
                    "• Use continuous scale (0) for special sound effects",
                    "• Combine different treatments during playback",
                    "• Record sequences and play over them to create layers",
                    "• Each line preserves its waveform when adding/removing lines"
                ]
            }
        ],
        links: [
            {
                title: "📖 Wikipedia - Music Mouse",
                url: "https://en.wikipedia.org/wiki/Music_Mouse",
                description: "Complete article about Laurie Spiegel's original Music Mouse"
            },
            {
                title: "🎥 YouTube Demonstration",
                url: "https://www.youtube.com/watch?v=CuVwEfvJ1YY",
                description: "Video showing the original Music Mouse in action"
            }
        ]
    };
}

function drawInstructions() {
    if (!showInstructions) return;
    
    push();
    
    // Fundo semi-transparente
    fill(0, 0, 0, 85);
    noStroke();
    rect(0, 0, width, height);
    
    // Painel de instruções
    const panelWidth = min(width - 40, 800);
    const panelHeight = height - 40;
    const panelX = (width - panelWidth) / 2;
    const panelY = 20;
    
    fill(0, 0, 95);
    stroke(0, 0, 70);
    strokeWeight(1);
    rect(panelX, panelY, panelWidth, panelHeight, 10);
    
    // Cabeçalho com botões
    fill(240, 60, 30);
    noStroke();
    rect(panelX, panelY, panelWidth, 50, 10, 10, 0, 0);
    
    // Botão de fechar
    fill(0, 100, 100);
    noStroke();
    circle(panelX + panelWidth - 25, panelY + 25, 30);
    fill(0, 0, 100);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    text('×', panelX + panelWidth - 25, panelY + 25);
    
    // Botão de alternância de idioma
    fill(instructionsLanguage === 'pt' ? [120, 80, 80] : [60, 80, 80]);
    noStroke();
    rect(panelX + panelWidth - 120, panelY + 10, 80, 30, 5);
    fill(0, 0, 100);
    noStroke();
    textSize(12);
    const langText = instructionsLanguage === 'pt' ? '🇧🇷 PT/EN' : '🇺🇸 EN/PT';
    text(langText, panelX + panelWidth - 80, panelY + 25);
    
    // Área de scroll
    const contentX = panelX + 20;
    const contentY = panelY + 70;
    const contentWidth = panelWidth - 40;
    const contentHeight = panelHeight - 90;
    
    // Máscara de clipping
    push();
    
    const instructions = getInstructionsContent();
    
    // Título
    fill(0, 0, 100);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(26);
    textStyle(BOLD);
    
    let currentY = contentY + instructionsScroll;
    if (currentY > contentY - 40 && currentY < contentY + contentHeight + 20) {
        text(instructions.title, width / 2, currentY);
    }
    currentY += 40;
    
    // Subtítulo
    fill(0, 0, 70);
    noStroke();
    textSize(14);
    textStyle(NORMAL);
    if (currentY > contentY - 20 && currentY < contentY + contentHeight + 10) {
        text(instructions.subtitle, width / 2, currentY);
    }
    currentY += 35;
    
    // Seções
    textAlign(LEFT, TOP);
    for (let section of instructions.sections) {
        // Título da seção
        fill(240, 80, 80);
        noStroke();
        textSize(16);
        textStyle(BOLD);
        if (currentY > contentY - 25 && currentY < contentY + contentHeight + 10) {
            text(section.title, contentX, currentY);
        }
        currentY += 25;
        
        // Conteúdo da seção
        fill(0, 0, 30);
        noStroke();
        textSize(12);
        textStyle(NORMAL);
        for (let line of section.content) {
            if (currentY > contentY - 18 && currentY < contentY + contentHeight + 10) {
                text(line, contentX + 15, currentY);
            }
            currentY += 16;
        }
        currentY += 15;
    }
    
    // Links
    if (instructions.links) {
        fill(180, 100, 100);
        noStroke();
        textSize(16);
        textStyle(BOLD);
        if (currentY > contentY - 25 && currentY < contentY + contentHeight + 10) {
            text('🔗 Links Úteis', contentX, currentY);
        }
        currentY += 25;
        
        for (let link of instructions.links) {
            // Área clicável do link
            const linkY = currentY;
            const linkHeight = 35;
            
            // Fundo do link (hover effect)
            if (mouseX >= contentX && mouseX <= contentX + contentWidth - 20 &&
                mouseY >= linkY - 5 && mouseY <= linkY + linkHeight) {
                fill(240, 30, 95);
                noStroke();
                rect(contentX - 5, linkY - 5, contentWidth - 10, linkHeight, 5);
            }
            
            // Título do link
            fill(60, 100, 100);
            noStroke();
            textSize(14);
            textStyle(BOLD);
            if (currentY > contentY - 20 && currentY < contentY + contentHeight + 10) {
                text(link.title, contentX + 10, currentY);
            }
            currentY += 18;
            
            // Descrição do link
            fill(0, 0, 50);
            noStroke();
            textSize(11);
            textStyle(NORMAL);
            if (currentY > contentY - 15 && currentY < contentY + contentHeight + 10) {
                text(link.description, contentX + 10, currentY);
            }
            currentY += 20;
        }
    }
    
    pop();
    
    // Indicador de scroll
    const totalContentHeight = currentY - (contentY + instructionsScroll);
    if (totalContentHeight > contentHeight) {
        const scrollBarHeight = max(20, (contentHeight / totalContentHeight) * contentHeight);
        const scrollProgress = -instructionsScroll / (totalContentHeight - contentHeight);
        const scrollBarY = contentY + scrollProgress * (contentHeight - scrollBarHeight);
        
        fill(0, 0, 60);
        noStroke();
        rect(panelX + panelWidth - 15, contentY, 10, contentHeight, 5);
        
        fill(240, 80, 80);
        noStroke();
        rect(panelX + panelWidth - 15, scrollBarY, 10, scrollBarHeight, 5);
    }
    
    // Rodapé com dicas de navegação
    fill(240, 60, 30);
    noStroke();
    rect(panelX, panelY + panelHeight - 30, panelWidth, 30, 0, 0, 10, 10);
    
    fill(0, 0, 100);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(10);
    text('Scroll: roda do mouse • ESC ou × para fechar • Clique nos links para abrir', width / 2, panelY + panelHeight - 15);
    
    pop();
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
}

// =====================================================
// BOTÃO FLUTUANTE DE INSTRUÇÕES
// =====================================================

function drawInstructionsButton() {
    if (showInstructions) return; // Não mostrar se as instruções já estão abertas
    
    push();
    
    // Posição do botão (canto inferior direito)
    const buttonX = width - 70;
    const buttonY = height - 70;
    const buttonSize = 50;
    
    // Efeito hover
    const isHovered = dist(mouseX, mouseY, buttonX, buttonY) < buttonSize / 2;
    
    // Sombra
    fill(0, 0, 0, 30);
    noStroke();
    circle(buttonX + 3, buttonY + 3, buttonSize);
    
    // Botão principal
    fill(isHovered ? [60, 100, 90] : [60, 80, 80]);
    stroke(0, 0, 100);
    strokeWeight(2);
    circle(buttonX, buttonY, buttonSize);
    
    // Ícone de ajuda
    fill(0, 0, 100);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(24);
    text('?', buttonX, buttonY - 2);
    
    // Texto indicativo
    if (isHovered) {
        fill(0, 0, 0, 80);
        noStroke();
        const textWidth = 100;
        const textHeight = 25;
        rect(buttonX - textWidth/2, buttonY - 70, textWidth, textHeight, 5);
        
        fill(0, 0, 100);
        noStroke();
        textSize(12);
        text('Instruções', buttonX, buttonY - 57);
    }
    
    pop();
    textAlign(LEFT, TOP);
}

// =====================================================
// FUNÇÃO PARA ABRIR LINKS
// =====================================================

function openLink(url) {
    window.open(url, '_blank');
}

// =====================================================
// P5.JS SETUP
// =====================================================

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    
    canvas.elt.tabIndex = 0;
    canvas.elt.focus();
    
    canvas.mouseClicked(() => {
        canvas.elt.focus();
    });
    
    colorMode(HSB, 360, 100, 100, 100);
    frameRate(30);
    
    musicMouse = new MusicMouseFrequencyGrid();
    
    textAlign(LEFT, TOP);
    
    console.log(`
MUSIC MOUSE - GRADE DE FREQUÊNCIAS
==================================
Pressione 'H' para mostrar/ocultar interface
Clique no canvas para garantir o foco do teclado

NOVIDADES:
- Sistema de instruções melhorado com links
- Botão flutuante de ajuda (?)
- Alternância automática de idioma
- Links para Wikipedia e YouTube
- Interface mais profissional

INSTRUÇÕES:
- Botão ?: Abrir instruções
- I: Instruções em português  
- U: Instruções em inglês
- Clique nos links para abrir no navegador
    `);

    initializeRecordingSystem();
}

// =====================================================
// P5.JS DRAW
// =====================================================

function draw() {
    drawBackground();
    drawGrid();
    
    if (musicMouse.isPlayingBack) {
        updateSound();
    }
    
    drawFrequencyLines();
    drawWaveforms();
    
    if (showInterface) {
        drawInterface();
    } else {
        drawMinimalHint();
    }
    
    drawRecordingIndicators();
    drawInstructionsButton(); // Novo botão flutuante
    drawInstructions();
}

// =====================================================
// FUNÇÕES DE DESENHO (mantidas iguais)
// =====================================================

function drawBackground() {
    for (let i = 0; i <= height; i++) {
        const inter = map(i, 0, height, 0, 1);
        const h = 240;
        const s = 80 - inter * 40;
        const b = 10 - inter * 10;
        stroke(h, s, b);
        line(0, i, width, i);
    }
}

function drawGrid() {
    strokeWeight(1);
    
    for (let i = 0; i <= CONFIG.GRID_SIZE_X; i++) {
        const x = map(i, 0, CONFIG.GRID_SIZE_X, 0, width);
        
        if (i % 12 === 0) {
            stroke(60, 50, 50);
            strokeWeight(2);
        } else if (i % 12 === 7) {
            stroke(120, 30, 40);
            strokeWeight(1);
        } else {
            stroke(0, 0, 30);
            strokeWeight(1);
        }
        
        line(x, 0, x, height);
    }
    
    for (let i = 0; i <= CONFIG.GRID_SIZE_Y; i++) {
        const y = map(i, 0, CONFIG.GRID_SIZE_Y, 0, height);
        
        if (i % 6 === 0) {
            stroke(0, 0, 40);
            strokeWeight(2);
        } else {
            stroke(0, 0, 30);
            strokeWeight(1);
        }
        
        line(0, y, width, y);
    }
}

function drawFrequencyLines() {
    // Linhas verticais
    for (let i = 0; i < musicMouse.verticalLines; i++) {
        const voice = musicMouse.verticalVoices[i];
        const x = voice ? voice.position : mouseX;
        
        const colorIndex = i % musicMouse.lineColors.length;
        const isSelected = (musicMouse.selectedLineType === 'vertical' && musicMouse.selectedLineIndex === i);
        
        if (isSelected) {
            stroke(musicMouse.lineColors[colorIndex][0], 100, 100);
            strokeWeight(5);
        } else {
            stroke(musicMouse.lineColors[colorIndex]);
            strokeWeight(3);
        }
        
        line(x, 0, x, height);
        
        if (isSelected) {
            fill(0, 0, 100);
            noStroke();
            textSize(12);
            text(voice.waveType.toUpperCase(), x + 5, 25);
        }
        
        // Apenas mostrar frequência como texto, sem círculos
        if (isInteracting && voice && voice.isActive) {
            fill(0, 0, 100);
            noStroke();
            textSize(10);
            text(`${voice.frequency.toFixed(0)}Hz`, x + 10, mouseY - 20);
        }
    }
    
    // Linhas horizontais
    for (let i = 0; i < musicMouse.horizontalLines; i++) {
        const voice = musicMouse.horizontalVoices[i];
        const y = voice ? voice.position : mouseY;
        
        const colorIndex = (i + musicMouse.verticalLines) % musicMouse.lineColors.length;
        const isSelected = (musicMouse.selectedLineType === 'horizontal' && musicMouse.selectedLineIndex === i);
        
        if (isSelected) {
            stroke(musicMouse.lineColors[colorIndex][0], 100, 100);
            strokeWeight(5);
        } else {
            stroke(musicMouse.lineColors[colorIndex]);
            strokeWeight(3);
        }
        
        line(0, y, width, y);
        
        if (isSelected) {
            fill(0, 0, 100);
            noStroke();
            textSize(12);
            text(voice.waveType.toUpperCase(), 10, y - 5);
        }
        
        // Apenas mostrar frequência como texto, sem círculos
        if (isInteracting && voice && voice.isActive) {
            fill(0, 0, 100);
            noStroke();
            textSize(10);
            text(`${voice.frequency.toFixed(0)}Hz`, mouseX + 10, y - 20);
        }
    }
    
    // Ponto central do mouse (mantido)
    push();
    noStroke();
    fill(0, 0, 100, 80);
    circle(mouseX, mouseY, 8);
    pop();
}

function drawWaveforms() {
    if (!musicMouse.isAudioStarted || !musicMouse.fft) return;
    
    push();
    translate(0, height * 0.75);
    
    try {
        const waveform = musicMouse.fft.waveform();
        
        noFill();
        stroke(120, 100, 80, 60);
        strokeWeight(2);
        
        beginShape();
        for (let i = 0; i < waveform.length; i += 2) {
            const x = map(i, 0, waveform.length, 0, width);
            const y = map(waveform[i], -1, 1, -80, 80);
            vertex(x, y);
        }
        endShape();
    } catch (error) {
        // Ignorar erros de visualização
    }
    
    pop();
}

function drawRecordingIndicators() {
    push();
    
    let indicatorX = width - 50;
    
    if (isRecordingVideo) {
        fill(0, 100, 100, 80);
        const pulse = sin(millis() * 0.01) * 0.3 + 0.7;
        fill(0, 100, 100 * pulse);
        noStroke();
        circle(indicatorX, 30, 25);
        
        fill(0, 0, 100);
        noStroke();
        textSize(10);
        textAlign(CENTER);
        text('🎥', indicatorX, 35);
        
        const elapsed = Math.round((Date.now() - recordingStartTime) / 1000);
        text(`${elapsed}s`, indicatorX, 50);
        
        indicatorX -= 60;
    }
    
    if (isRecordingAudio) {
        fill(300, 100, 100, 80);
        const pulse = sin(millis() * 0.015) * 0.3 + 0.7;
        fill(300, 100, 100 * pulse);
        noStroke();
        circle(indicatorX, 30, 25);
        
        fill(0, 0, 100);
        noStroke();
        textSize(10);
        textAlign(CENTER);
        text('🎵', indicatorX, 35);
        
        const elapsed = Math.round((Date.now() - recordingStartTime) / 1000);
        text(`${elapsed}s`, indicatorX, 50);
        
        indicatorX -= 60;
    }
    
    if (musicMouse.isRecording) {
        fill(0, 100, 100, 80);
        const pulse = sin(millis() * 0.01) * 0.3 + 0.7;
        fill(0, 100, 100 * pulse);
        noStroke();
        circle(indicatorX, 30, 20);
        
        fill(0, 0, 100);
        noStroke();
        textSize(12);
        textAlign(CENTER);
        text('REC', indicatorX, 35);
        text(`${musicMouse.recordedMovements.length}`, indicatorX, 50);
        
        indicatorX -= 60;
    }
    
    if (musicMouse.isPlayingBack) {
        fill(120, 100, 100, 80);
        noStroke();
        circle(indicatorX, 30, 20);
        
        fill(0, 0, 100);
        noStroke();
        textSize(12);
        textAlign(CENTER);
        text('PLAY', indicatorX, 35);
        
        const progress = musicMouse.playbackIndex / Math.max(musicMouse.recordedMovements.length - 1, 1);
        text(`${Math.round(progress * 100)}%`, indicatorX, 50);
        
        // Mostrar cursor de reprodução sem círculo extra
        if (musicMouse.recordedMovements.length > 0) {
            const playbackData = musicMouse.updatePlayback();
            if (playbackData) {
                fill(120, 100, 100, 40);
                noStroke();
                circle(playbackData.x, playbackData.y, 12);
            }
        }
    }
    
    pop();
    textAlign(LEFT, TOP);
}

function drawMinimalHint() {
    push();
    fill(0, 0, 100, 80);
    textSize(12);
    text('H: interface | M: gravar | P: reproduzir | ?: instruções completas', 10, height - 100);
    text('[]: navegar verticais | ,.: navegar horizontais | Z-V: forma de onda', 10, height - 80);
    text('G: espaçamento | TAB: selecionar tipo | Setas: +/- linhas', 10, height - 60);
    
    const selectedDesc = `${musicMouse.selectedLineType === 'vertical' ? 'V' : 'H'}${musicMouse.selectedLineIndex + 1}`;
    const selectedVoice = musicMouse.getSelectedVoice();
    const waveType = selectedVoice ? selectedVoice.waveType : 'sine';
    
    text(`Vozes: ${musicMouse.p5Oscillators.length} | ${SPACING_MODES[musicMouse.spacingMode]}`, 10, height - 40);
    text(`Selecionada: ${selectedDesc} (${waveType})`, 10, height - 20);
    
    let statusText = '';
    let statusColor = [0, 0, 100];
    
    if (isRecordingVideo) {
        const elapsed = Math.round((Date.now() - recordingStartTime) / 1000);
        statusText = `🎥 GRAVANDO VÍDEO (${elapsed}s)`;
        statusColor = [0, 100, 100];
    } else if (isRecordingAudio) {
        const elapsed = Math.round((Date.now() - recordingStartTime) / 1000);
        statusText = `🎵 GRAVANDO ÁUDIO (${elapsed}s)`;
        statusColor = [0, 100, 100];
    } else if (musicMouse.isRecording) {
        statusText = `🔴 GRAVANDO MOVIMENTOS (${musicMouse.recordedMovements.length})`;
        statusColor = [0, 100, 100];
    } else if (musicMouse.isPlayingBack) {
        const progress = Math.round((musicMouse.playbackIndex / Math.max(musicMouse.recordedMovements.length - 1, 1)) * 100);
        statusText = `▶️ REPRODUZINDO (${progress}%)`;
        statusColor = [120, 100, 100];
    } else {
        statusText = musicMouse.isAudioStarted ? 'Áudio: Iniciado' : 'Clique para iniciar';
        statusColor = musicMouse.isAudioStarted ? [120, 100, 100] : [0, 100, 100];
    }
    
    fill(statusColor);
    text(statusText, width - 300, height - 40);
    
    let toneStatus = 'Não encontrado';
    if (musicMouse.toneAvailable && musicMouse.toneInitialized) {
        toneStatus = 'Inicializado';
    } else if (musicMouse.toneAvailable) {
        toneStatus = 'Disponível';
    }
    fill(musicMouse.toneInitialized ? [120, 100, 100] : [60, 100, 100]);
    text(`Tone.js: ${toneStatus}`, width - 150, height - 20);
    pop();
}

function drawInterface() {
    push();
    
    fill(0, 0, 0, 90);
    noStroke();
    rect(10, 10, 520, 420, 5);
    
    fill(0, 100, 100);
    noStroke();
    textSize(16);
    text('× Pressione H para ocultar', 480, 20);
    
    fill(180, 100, 100);
    noStroke();
    textSize(18);
    textStyle(BOLD);
    text('MUSIC MOUSE - GRADE DE FREQUÊNCIAS', 20, 30);
    textStyle(NORMAL);
    textSize(12);
    text('Baseado no trabalho de Laurie Spiegel', 20, 50);
    
    fill(0, 0, 100);
    noStroke();
    textSize(14);
    
    text(`Escala: ${musicMouse.currentScale.name}`, 20, 80);
    
    // Indicação especial para escala contínua
    if (musicMouse.currentScale.isContinuous) {
        fill(60, 100, 100);
        noStroke();
        textSize(12);
        text('⚡ Modo Contínuo: Frequências lineares em Hz', 20, 95);
        fill(0, 0, 100);
        noStroke();
        textSize(14);
    }
    
    const treatmentNames = {
        'chord': 'Acorde',
        'arpeggio': 'Arpejo', 
        'line': 'Linha',
        'improvise': 'Improvisação',
        'phase': 'Fase (Reich)'
    };
    const treatmentY = musicMouse.currentScale.isContinuous ? 115 : 100;
    text(`Tratamento: ${treatmentNames[musicMouse.rhythmTreatment]}`, 20, treatmentY);
    
    const transposeY = treatmentY + 20;
    text(`Transposição: ${musicMouse.transpose > 0 ? '+' : ''}${musicMouse.transpose}`, 20, transposeY);
    
    const linesY = transposeY + 20;
    text(`Linhas: ${musicMouse.verticalLines} verticais, ${musicMouse.horizontalLines} horizontais`, 20, linesY);
    
    const spacingY = linesY + 20;
    text(`Espaçamento: ${SPACING_MODES[musicMouse.spacingMode]}`, 20, spacingY);
    
    fill(60, 100, 100);
    noStroke();
    const statusY = spacingY + 20;
    if (musicMouse.isRecording) {
        text(`🔴 GRAVANDO MOVIMENTOS - ${musicMouse.recordedMovements.length}`, 20, statusY);
    } else if (musicMouse.isPlayingBack) {
        const progress = Math.round((musicMouse.playbackIndex / Math.max(musicMouse.recordedMovements.length - 1, 1)) * 100);
        text(`▶️ REPRODUZINDO - ${progress}%`, 20, statusY);
    } else if (musicMouse.recordedMovements.length > 0) {
        text(`⏸️ ${musicMouse.recordedMovements.length} movimentos gravados`, 20, statusY);
    } else {
        text(`💾 Nenhuma gravação de movimento`, 20, statusY);
    }
    
    const recordingY = statusY + 20;
    if (isRecordingVideo) {
        const elapsed = Math.round((Date.now() - recordingStartTime) / 1000);
        fill(0, 100, 100);
        noStroke();
        text(`🎥 GRAVANDO VÍDEO - ${elapsed}s`, 20, recordingY);
    } else if (isRecordingAudio) {
        const elapsed = Math.round((Date.now() - recordingStartTime) / 1000);
        fill(0, 100, 100);
        noStroke();
        text(`🎵 GRAVANDO ÁUDIO - ${elapsed}s`, 20, recordingY);
    }
    
    // Botões de gravação de mídia
    drawRecordingButtons();
    
    // Linha selecionada
    const selectedVoice = musicMouse.getSelectedVoice();
    const selectedDesc = `${musicMouse.selectedLineType === 'vertical' ? 'Vertical' : 'Horizontal'} ${musicMouse.selectedLineIndex + 1}`;
    fill(60, 100, 100);
    noStroke();
    const selectedY = recordingY + 40;
    text(`Linha selecionada: ${selectedDesc}`, 20, selectedY);
    if (selectedVoice) {
        text(`Forma de onda: ${selectedVoice.waveType}`, 20, selectedY + 20);
    }
    
    // Frequências das linhas verticais
    fill(0, 100, 100);
    noStroke();
    textSize(12);
    const verticalFreqY = selectedY + 50;
    text('FREQUÊNCIAS VERTICAIS:', 20, verticalFreqY);
    for (let i = 0; i < musicMouse.verticalVoices.length; i++) {
        const voice = musicMouse.verticalVoices[i];
        const colorIndex = i % musicMouse.lineColors.length;
        const isSelected = (musicMouse.selectedLineType === 'vertical' && musicMouse.selectedLineIndex === i);
        
        fill(isSelected ? [60, 100, 100] : musicMouse.lineColors[colorIndex]);
        noStroke();
        const freq = voice.isActive ? voice.frequency.toFixed(1) : '---';
        const waveSymbol = voice.waveType === 'sine' ? '∿' : 
                          voice.waveType === 'square' ? '⊔' : 
                          voice.waveType === 'triangle' ? '△' : '⋮';
        text(`V${i+1}: ${freq}Hz ${waveSymbol}`, 20 + (i % 3) * 120, verticalFreqY + 15 + Math.floor(i / 3) * 15);
    }
    
    // Frequências das linhas horizontais
    fill(180, 100, 100);
    noStroke();
    const horizontalFreqY = verticalFreqY + 60;
    text('FREQUÊNCIAS HORIZONTAIS:', 20, horizontalFreqY);
    for (let i = 0; i < musicMouse.horizontalVoices.length; i++) {
        const voice = musicMouse.horizontalVoices[i];
        const colorIndex = (i + musicMouse.verticalLines) % musicMouse.lineColors.length;
        const isSelected = (musicMouse.selectedLineType === 'horizontal' && musicMouse.selectedLineIndex === i);
        
        fill(isSelected ? [60, 100, 100] : musicMouse.lineColors[colorIndex]);
        noStroke();
        const freq = voice.isActive ? voice.frequency.toFixed(1) : '---';
        const waveSymbol = voice.waveType === 'sine' ? '∿' : 
                          voice.waveType === 'square' ? '⊔' : 
                          voice.waveType === 'triangle' ? '△' : '⋮';
        text(`H${i+1}: ${freq}Hz ${waveSymbol}`, 20 + (i % 3) * 120, horizontalFreqY + 15 + Math.floor(i / 3) * 15);
    }
    
    // Controles
    fill(120, 50, 80);
    noStroke();
    textSize(11);
    text('CONTROLES:', 320, 80);
    text('0-9: Escalas | Q-T: Tratamentos', 320, 95);
    text('A/S/D: Transpor -/+/0', 320, 110);
    text('↑/↓: +/- Linhas verticais', 320, 125);
    text('←/→: +/- Linhas horizontais', 320, 140);
    text('G: Modo de espaçamento', 320, 155);
    
    text('FORMAS DE ONDA:', 320, 180);
    text('Z-V: Linha selecionada', 320, 195);
    text('TAB: Selecionar tipo', 320, 210);
    
    text('NAVEGAÇÃO:', 320, 235);
    text('[/]: Linhas verticais ←/→', 320, 250);
    text(',/.: Linhas horizontais ←/→', 320, 265);
    
    text('AUTOMAÇÃO:', 320, 290);
    text('M: Gravar/Parar movimentos', 320, 305);
    text('P: Reproduzir/Pausar', 320, 320);
    
    text('INSTRUÇÕES:', 320, 345);
    text('?: Ajuda completa com links', 320, 360);
    text('I: Ajuda PT | U: Ajuda EN', 320, 375);
    text('H: Toggle interface', 320, 390);
    text('Clique/arraste: Tocar', 320, 405);
    
    // Frequências atuais do mouse
    const mouseXNorm = constrain(mouseX / width, 0, 1);
    const mouseYNorm = constrain(mouseY / height, 0, 1);
    const freqX = musicMouse.mapToFrequency(mouseXNorm, 'x');
    const freqY = musicMouse.mapToFrequency(mouseYNorm, 'y');
    
    fill(60, 100, 100);
    noStroke();
    const mouseFreqY = horizontalFreqY + 60;
    text(`Mouse X: ${freqX.toFixed(1)} Hz`, 20, mouseFreqY);
    text(`Mouse Y: ${freqY.toFixed(1)} Hz`, 20, mouseFreqY + 15);
    
    // Status de áudio
    fill(musicMouse.isAudioStarted ? [120, 100, 100] : [0, 100, 100]);
    noStroke();
    text(`Áudio: ${musicMouse.isAudioStarted ? 'Iniciado' : 'Clique para iniciar'}`, 20, mouseFreqY + 35);
    
    if (musicMouse.toneAvailable && musicMouse.toneInitialized) {
        fill(120, 100, 100);
        noStroke();
        text('Tone.js: Inicializado', 20, mouseFreqY + 50);
    } else if (musicMouse.toneAvailable) {
        fill(60, 100, 100);
        noStroke();
        text('Tone.js: Disponível', 20, mouseFreqY + 50);
    } else {
        fill(0, 100, 100);
        noStroke();
        text('Tone.js: Não encontrado', 20, mouseFreqY + 50);
    }
    
    pop();
}

function drawRecordingButtons() {
    push();
    
    // Botão de gravação de vídeo
    const videoButtonColor = isRecordingVideo ? [0, 100, 100] : [0, 0, 70];
    fill(videoButtonColor);
    stroke(0, 0, 100);
    strokeWeight(1);
    rect(380, 220, 100, 25, 5);
    
    fill(0, 0, 100);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(11);
    text(isRecordingVideo ? '⏹️ Parar Vídeo' : '🎥 Gravar Vídeo', 430, 232);
    
    // Botão de gravação de áudio
    const audioButtonColor = isRecordingAudio ? [0, 100, 100] : [0, 0, 70];
    fill(audioButtonColor);
    stroke(0, 0, 100);
    strokeWeight(1);
    rect(380, 250, 100, 25, 5);
    
    fill(0, 0, 100);
    noStroke();
    text(isRecordingAudio ? '⏹️ Parar Áudio' : '🎵 Gravar Áudio', 430, 262);
    
    // Botão de instruções em português
    fill(240, 80, 80);
    stroke(0, 0, 100);
    strokeWeight(1);
    rect(380, 280, 48, 25, 5);
    
    fill(0, 0, 100);
    noStroke();
    textSize(10);
    text('📚 PT', 404, 292);
    
    // Botão de instruções em inglês
    fill(120, 80, 80);
    stroke(0, 0, 100);
    strokeWeight(1);
    rect(432, 280, 48, 25, 5);
    
    fill(0, 0, 100);
    noStroke();
    text('📚 EN', 456, 292);
    
    textAlign(LEFT, TOP);
    pop();
}

// =====================================================
// INTERAÇÃO
// =====================================================

function mousePressed() {
    if (canvas) canvas.elt.focus();
    
    // Verificar clique no botão de instruções flutuante
    if (!showInstructions) {
        const buttonX = width - 70;
        const buttonY = height - 70;
        if (dist(mouseX, mouseY, buttonX, buttonY) < 25) {
            toggleInstructions(instructionsLanguage);
            return false;
        }
    }
    
    if (showInstructions) {
        const panelWidth = min(width - 40, 800);
        const panelX = (width - panelWidth) / 2;
        const panelY = 20;
        
        // Botão fechar (×)
        if (dist(mouseX, mouseY, panelX + panelWidth - 25, panelY + 25) < 15) {
            showInstructions = false;
            return false;
        }
        
        // Botão de idioma
        if (mouseX >= panelX + panelWidth - 120 && mouseX <= panelX + panelWidth - 40 && 
            mouseY >= panelY + 10 && mouseY <= panelY + 40) {
            instructionsLanguage = instructionsLanguage === 'pt' ? 'en' : 'pt';
            instructionsScroll = 0;
            return false;
        }
        
        // Verificar cliques nos links
        const instructions = getInstructionsContent();
        if (instructions.links) {
            const contentX = panelX + 20;
            const contentY = panelY + 70;
            const contentWidth = panelWidth - 40;
            
            let currentY = contentY + instructionsScroll + 40 + 35; // Título + subtítulo
            
            // Pular seções
            for (let section of instructions.sections) {
                currentY += 25; // Título da seção
                currentY += section.content.length * 16; // Conteúdo
                currentY += 15; // Espaço
            }
            
            currentY += 25; // Título dos links
            
            for (let link of instructions.links) {
                const linkY = currentY;
                const linkHeight = 35;
                
                if (mouseX >= contentX && mouseX <= contentX + contentWidth - 20 &&
                    mouseY >= linkY - 5 && mouseY <= linkY + linkHeight) {
                    openLink(link.url);
                    return false;
                }
                currentY += 38; // Altura do link
            }
        }
        
        return false;
    }
    
    if (showInterface) {
        // Botão de gravação de vídeo
        if (mouseX >= 380 && mouseX <= 480 && mouseY >= 220 && mouseY <= 245) {
            startVideoRecording();
            return false;
        }
        
        // Botão de gravação de áudio
        if (mouseX >= 380 && mouseX <= 480 && mouseY >= 250 && mouseY <= 275) {
            startAudioRecording();
            return false;
        }
        
        // Botão de instruções em português
        if (mouseX >= 380 && mouseX <= 428 && mouseY >= 280 && mouseY <= 305) {
            toggleInstructions('pt');
            return false;
        }
        
        // Botão de instruções em inglês
        if (mouseX >= 432 && mouseX <= 480 && mouseY >= 280 && mouseY <= 305) {
            toggleInstructions('en');
            return false;
        }
    }
    
    musicMouse.startAudio();
    isInteracting = true;
    
    musicMouse.recordMovement(mouseX, mouseY, true);
    updateSound();
    return false;
}

function mouseDragged() {
    if (isInteracting) {
        musicMouse.recordMovement(mouseX, mouseY, true);
        updateSound();
    }
    return false;
}

function mouseReleased() {
    isInteracting = false;
    musicMouse.recordMovement(mouseX, mouseY, false);
    musicMouse.stopAllVoices();
    return false;
}

function mouseMoved() {
    if (canvas && document.activeElement !== canvas.elt) {
        canvas.elt.focus();
    }
    
    if (musicMouse.isRecording) {
        musicMouse.recordMovement(mouseX, mouseY, isInteracting);
    }
    
    return false;
}

function updateSound() {
    const playbackData = musicMouse.updatePlayback();
    
    let currentX, currentY, shouldPlay;
    let isPlaybackActive = false;
    
    if (musicMouse.isPlayingBack && playbackData) {
        currentX = playbackData.x;
        currentY = playbackData.y;
        isPlaybackActive = playbackData.isInteracting;
    }
    
    if (isInteracting) {
        currentX = mouseX;
        currentY = mouseY;
        shouldPlay = true;
    } else if (isPlaybackActive) {
        shouldPlay = true;
    } else {
        shouldPlay = false;
    }
    
    if (shouldPlay) {
        const x = constrain(currentX / width, 0, 1);
        const y = constrain(currentY / height, 0, 1);
        
        musicMouse.applyTreatment(x, y);
    }
}

// Touch support
function touchStarted() {
    if (touches.length > 0) {
        mouseX = touches[0].x;
        mouseY = touches[0].y;
    }
    return mousePressed();
}

function touchMoved() {
    if (touches.length > 0) {
        mouseX = touches[0].x;
        mouseY = touches[0].y;
    }
    return mouseDragged();
}

function touchEnded() {
    return mouseReleased();
}

// =====================================================
// CONTROLES DE TECLADO
// =====================================================

function keyPressed() {
    if (canvas) canvas.elt.focus();
    
    if (keyCode === ESCAPE) {
        if (showInstructions) {
            showInstructions = false;
            return false;
        }
    }
    
    if (showInstructions) {
        return false;
    }
    
    // Toggle interface
    if (key.toLowerCase() === 'h') {
        showInterface = !showInterface;
        console.log(`Interface: ${showInterface ? 'visível' : 'oculta'}`);
        return false;
    }
    
    // Modo de espaçamento
    if (key.toLowerCase() === 'g') {
        musicMouse.changeSpacingMode();
        return false;
    }
    
    // Sistema de gravação/reprodução
    if (key.toLowerCase() === 'm') {
        musicMouse.toggleRecording();
        return false;
    }
    
    if (key.toLowerCase() === 'p') {
        musicMouse.togglePlayback();
        return false;
    }
    
    // Abrir instruções
    if (key.toLowerCase() === 'i') {
        toggleInstructions('pt');
        return false;
    }
    
    if (key.toLowerCase() === 'u') {
        toggleInstructions('en');
        return false;
    }
    
    // Alternar tipo de linha selecionada
    if (keyCode === TAB) {
        musicMouse.toggleLineType();
        return false;
    }
    
    // Navegar entre linhas VERTICAIS
    if (key === '[') {
        musicMouse.previousVerticalLine();
        return false;
    }
    
    if (key === ']') {
        musicMouse.nextVerticalLine();
        return false;
    }
    
    // Navegar entre linhas HORIZONTAIS
    if (key === ',') {
        musicMouse.previousHorizontalLine();
        return false;
    }
    
    if (key === '.') {
        musicMouse.nextHorizontalLine();
        return false;
    }
    
    // Escalas (0-9)
    if (key >= '0' && key <= '9') {
        const scaleNames = Object.keys(SCALES);
        let index;
        
        if (key === '0') {
            // Tecla 0 mapeia para a última escala (contínua)
            index = scaleNames.length - 1;
        } else {
            // Teclas 1-9 mapeiam para as primeiras escalas
            index = parseInt(key) - 1;
        }
        
        if (index < scaleNames.length) {
            musicMouse.changeScale(scaleNames[index]);
            console.log(`Escala: ${SCALES[scaleNames[index]].name}`);
        }
        return false;
    }
    
    // Tratamentos (Q-T)
    const treatments = {
        'q': 'chord',
        'w': 'arpeggio',
        'e': 'line',
        'r': 'improvise',
        't': 'phase'
    };
    
    if (treatments[key.toLowerCase()]) {
        musicMouse.changeRhythmTreatment(treatments[key.toLowerCase()]);
        console.log(`Tratamento: ${treatments[key.toLowerCase()]}`);
        return false;
    }
    
    // Transposição (A/S/D)
    if (key.toLowerCase() === 'a') {
        musicMouse.setTranspose(musicMouse.transpose - 1);
        console.log(`Transposição: ${musicMouse.transpose}`);
        return false;
    }
    
    if (key.toLowerCase() === 's') {
        musicMouse.setTranspose(musicMouse.transpose + 1);
        console.log(`Transposição: ${musicMouse.transpose}`);
        return false;
    }
    
    if (key.toLowerCase() === 'd') {
        musicMouse.setTranspose(0);
        console.log(`Transposição: 0`);
        return false;
    }
    
    // Tipos de onda para linha selecionada
    const waveTypes = {
        'z': 'sine',
        'x': 'triangle',
        'c': 'sawtooth',
        'v': 'square'
    };
    
    if (waveTypes[key.toLowerCase()]) {
        musicMouse.changeSelectedLineWaveform(waveTypes[key.toLowerCase()]);
        return false;
    }
    
    // Setas
    if (keyCode === UP_ARROW) {
        musicMouse.addVerticalLine();
        return false;
    }
    
    if (keyCode === DOWN_ARROW) {
        musicMouse.removeVerticalLine();
        return false;
    }
    
    if (keyCode === LEFT_ARROW) {
        musicMouse.removeHorizontalLine();
        return false;
    }
    
    if (keyCode === RIGHT_ARROW) {
        musicMouse.addHorizontalLine();
        return false;
    }
    
    return false;
}

function keyTyped() {
    return false;
}

// Suporte para scroll nas instruções
function mouseWheel(event) {
    if (showInstructions) {
        instructionsScroll += event.delta * 3;
        instructionsScroll = min(instructionsScroll, 50);
        instructionsScroll = max(instructionsScroll, -2000);
        return false;
    }
    return true;
}

// =====================================================
// RESPONSIVIDADE
// =====================================================

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}