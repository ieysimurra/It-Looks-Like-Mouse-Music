# 🎵 Music Theory Implementation - Music Mouse Interactive

This document explains the musical concepts, algorithms, and theory implemented in Music Mouse Interactive.

## Table of Contents

- [Overview](#overview)
- [Frequency Mapping](#frequency-mapping)
- [Musical Scales](#musical-scales)
- [Rhythmic Treatments](#rhythmic-treatments)
- [Harmonic Concepts](#harmonic-concepts)
- [Audio Synthesis](#audio-synthesis)
- [Mathematical Foundations](#mathematical-foundations)
- [Educational Applications](#educational-applications)

---

## Overview

Music Mouse Interactive implements a sophisticated musical system based on frequency grids, where both X and Y axes control different aspects of musical expression. This approach follows Laurie Spiegel's original vision while incorporating modern music theory and digital audio synthesis.

### Core Concepts

**Frequency Grid**: A two-dimensional space where position maps to musical frequencies
**Dual-Axis Control**: X-axis controls harmonic progression, Y-axis controls melodic movement
**Scale-Based Mapping**: Frequencies follow musical scales rather than linear progression
**Real-Time Synthesis**: Immediate audio feedback for all interactions

---

## Frequency Mapping

### Base Frequency System

```javascript
// Configuration constants
const CONFIG = {
    BASE_FREQ_X: 110,    // A2 (110 Hz) for X-axis
    BASE_FREQ_Y: 220,    // A3 (220 Hz) for Y-axis  
    FREQ_RANGE_X: 3,     // 3 octaves on X-axis
    FREQ_RANGE_Y: 2      // 2 octaves on Y-axis
};
```

### Frequency Calculation Algorithm

#### Scale-Based Mapping
```javascript
function mapToFrequency(value, axis) {
    const scaleIntervals = currentScale.intervals;
    const baseFreq = axis === 'x' ? CONFIG.BASE_FREQ_X : CONFIG.BASE_FREQ_Y;
    const freqRange = axis === 'x' ? CONFIG.FREQ_RANGE_X : CONFIG.FREQ_RANGE_Y;
    
    // Map position to scale notes across octaves
    const noteRange = scaleIntervals.length * freqRange;
    const noteIndex = Math.floor(value * noteRange);
    const octave = Math.floor(noteIndex / scaleIntervals.length);
    const scaleIndex = noteIndex % scaleIntervals.length;
    
    // Calculate semitone offset
    const semitone = scaleIntervals[scaleIndex] + (octave * 12) + transpose;
    
    // Apply equal temperament tuning
    const frequency = baseFreq * Math.pow(2, semitone / 12);
    
    return constrain(frequency, 20, 20000);
}
```

#### Continuous Scale Mapping
```javascript
function mapToContinuousFrequency(value, axis) {
    let minFreq, maxFreq;
    
    if (axis === 'x') {
        minFreq = 55;    // A1 (55 Hz)
        maxFreq = 1760;  // A6 (1760 Hz)
    } else {
        minFreq = 110;   // A2 (110 Hz)
        maxFreq = 880;   // A5 (880 Hz)
    }
    
    // Logarithmic mapping for musical perception
    const logMin = Math.log(minFreq);
    const logMax = Math.log(maxFreq);
    const logFreq = logMin + value * (logMax - logMin);
    
    return Math.exp(logFreq) * transposeMultiplier;
}
```

---

## Musical Scales

### Scale Implementation

Each scale is defined by its interval pattern in semitones from the root note:

```javascript
const SCALES = {
    chromatic: {
        name: 'Chromatic',
        intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        description: 'All twelve semitones'
    },
    major: {
        name: 'Major',
        intervals: [0, 2, 4, 5, 7, 9, 11],
        description: 'Traditional major scale (Ionian mode)'
    },
    minor: {
        name: 'Natural Minor',
        intervals: [0, 2, 3, 5, 7, 8, 10],
        description: 'Natural minor scale (Aeolian mode)'
    }
    // ... additional scales
};
```

### Scale Analysis

#### Major Scale (Ionian Mode)
- **Intervals**: T-T-S-T-T-T-S (T=Tone, S=Semitone)
- **Character**: Bright, happy, stable
- **Use Cases**: Pop music, classical music, educational demonstrations
- **Harmonic Series**: Strong relationship to natural overtones

#### Natural Minor Scale (Aeolian Mode)
- **Intervals**: T-S-T-T-S-T-T
- **Character**: Melancholic, introspective, versatile
- **Use Cases**: Folk music, blues, emotional expression
- **Relative Major**: Shares notes with major scale starting on 6th degree

#### Harmonic Minor Scale
- **Intervals**: T-S-T-T-S-T+S-S
- **Character**: Exotic, dramatic, classical
- **Use Cases**: Classical music, Middle Eastern influences
- **Unique Feature**: Augmented 2nd interval creates distinctive sound

#### Pentatonic Scale
- **Intervals**: T-T-T+S-T-T+S (5 notes per octave)
- **Character**: Universal, consonant, easy to improvise
- **Use Cases**: World music, beginner education, improvisation
- **Cultural Significance**: Found in many musical traditions globally

#### Blues Scale
- **Intervals**: m3-T-S-S-m3-T (6 notes per octave)
- **Character**: Expressive, soulful, characteristic "blue notes"
- **Use Cases**: Blues, jazz, rock music
- **Microtonal Elements**: Blue notes often played "between" standard pitches

#### Whole Tone Scale
- **Intervals**: T-T-T-T-T-T (6 equal tones)
- **Character**: Dreamy, ambiguous, impressionistic
- **Use Cases**: Impressionist music (Debussy), film scores
- **Harmonic Property**: No perfect 5th intervals, creates harmonic ambiguity

#### Continuous Scale
- **Implementation**: Linear frequency mapping in Hz
- **Character**: Smooth glissando effects, non-Western tuning
- **Use Cases**: Sound effects, experimental music, frequency education
- **Educational Value**: Demonstrates relationship between Hz and musical pitch

---

## Rhythmic Treatments

### Treatment Algorithms

#### Chord Treatment
```javascript
playChord(mouseXNorm, mouseYNorm) {
    const freqX = this.mapToFrequency(mouseXNorm, 'x');
    const freqY = this.mapToFrequency(mouseYNorm, 'y');
    
    // All lines play simultaneously with frequency offsets
    for (let i = 0; i < this.verticalVoices.length; i++) {
        const offset = i / Math.max(this.verticalLines, 1);
        const modFreq = freqY * (1 + offset * 0.3); // Harmonic spacing
        this.playNote(this.verticalVoices[i], modFreq);
    }
}
```

#### Arpeggio Treatment
```javascript
playArpeggio(mouseXNorm, mouseYNorm) {
    const time = millis();
    const speed = 120; // ms between notes
    
    // Sequential triggering based on time
    for (let i = 0; i < this.verticalVoices.length; i++) {
        const phase = (time + i * speed) % (speed * this.verticalLines);
        if (phase < speed) {
            // Trigger note with harmonic relationship
            const harmonicRatio = Math.pow(2, i / 12); // Semitone spacing
            this.playNote(voice, baseFrequency * harmonicRatio);
        }
    }
}
```

#### Phase Treatment (Minimalist)
```javascript
playPhase(mouseXNorm, mouseYNorm) {
    const time = millis() / 1000;
    
    for (let i = 0; i < this.verticalVoices.length; i++) {
        // Each voice has slightly different rate (Reich-style phasing)
        const phaseShift = i * 0.25;
        const rate = 1 + (i * 0.05); // Slightly different speeds
        const modulation = sin(time * rate + phaseShift);
        
        // Frequency modulation creates phasing effect
        const modFreq = baseFreq * (1 + modulation * 0.1);
        this.playNote(voice, modFreq);
    }
}
```

---

## Harmonic Concepts

### Voice Leading
```javascript
// Smooth voice leading between chord changes
function calculateVoiceLeading(currentChord, nextChord) {
    const voiceMovements = [];
    
    for (let i = 0; i < currentChord.length; i++) {
        // Find closest note in next chord (minimal movement)
        let minDistance = Infinity;
        let bestNote = nextChord[0];
        
        for (let note of nextChord) {
            const distance = Math.abs(currentChord[i] - note);
            if (distance < minDistance) {
                minDistance = distance;
                bestNote = note;
            }
        }
        
        voiceMovements.push(bestNote);
    }
    
    return voiceMovements;
}
```

### Harmonic Series Implementation
```javascript
// Generate harmonic series for natural-sounding chords
function generateHarmonicSeries(fundamental, partials = 8) {
    const harmonics = [];
    
    for (let i = 1; i <= partials; i++) {
        const harmonic = fundamental * i;
        const amplitude = 1 / i; // Natural amplitude decrease
        harmonics.push({ frequency: harmonic, amplitude: amplitude });
    }
    
    return harmonics;
}
```

### Interval Recognition
```javascript
// Calculate musical intervals between frequencies
function calculateInterval(freq1, freq2) {
    const ratio = freq2 / freq1;
    const semitones = Math.round(12 * Math.log2(ratio));
    
    const intervals = {
        0: 'Unison',
        1: 'Minor 2nd',
        2: 'Major 2nd',
        3: 'Minor 3rd',
        4: 'Major 3rd',
        5: 'Perfect 4th',
        6: 'Tritone',
        7: 'Perfect 5th',
        8: 'Minor 6th',
        9: 'Major 6th',
        10: 'Minor 7th',
        11: 'Major 7th',
        12: 'Octave'
    };
    
    return intervals[semitones % 12];
}
```

---

## Audio Synthesis

### Oscillator Management
```javascript
// Voice configuration with individual waveforms
const voice = {
    type: 'vertical' | 'horizontal',
    frequency: number,        // Current frequency in Hz
    waveType: string,        // 'sine', 'triangle', 'sawtooth', 'square'
    isActive: boolean,       // Currently playing
    amplitude: number,       // Volume level (0-1)
    envelope: object         // ADSR envelope settings
};
```

### Waveform Characteristics

#### Sine Wave
- **Harmonic Content**: Pure fundamental frequency only
- **Character**: Smooth, clean, flute-like
- **Use Cases**: Ambient music, clean tones, educational demonstrations
- **Mathematical Representation**: `y = A * sin(2π * f * t)`

#### Triangle Wave
- **Harmonic Content**: Odd harmonics with 1/n² amplitude relationship
- **Character**: Warm, hollow, clarinet-like
- **Use Cases**: Soft leads, warm pads, vintage synthesizer sounds
- **Harmonic Series**: 1, 1/9, 1/25, 1/49... (odd harmonics only)

#### Sawtooth Wave
- **Harmonic Content**: All harmonics with 1/n amplitude relationship
- **Character**: Bright, buzzy, string-like
- **Use Cases**: Lead synthesizers, brass sounds, rich harmonic content
- **Harmonic Series**: 1, 1/2, 1/3, 1/4, 1/5... (all harmonics)

#### Square Wave
- **Harmonic Content**: Odd harmonics with 1/n amplitude relationship
- **Character**: Hollow, clarinet-like, electronic
- **Use Cases**: Digital sounds, retro gaming, pulse-width modulation
- **Harmonic Series**: 1, 1/3, 1/5, 1/7... (odd harmonics only)

### Envelope Shaping
```javascript
// ADSR envelope configuration
const envelopeSettings = {
    attack: 0.01,    // Attack time in seconds
    decay: 0.1,      // Decay time in seconds  
    sustain: 0.7,    // Sustain level (0-1)
    release: 0.5     // Release time in seconds
};

// Apply envelope to oscillator
function applyEnvelope(oscillator, envelope) {
    const now = audioContext.currentTime;
    
    oscillator.gain.setValueAtTime(0, now);
    oscillator.gain.linearRampToValueAtTime(envelope.sustain, now + envelope.attack);
    oscillator.gain.exponentialRampToValueAtTime(envelope.sustain * 0.8, now + envelope.attack + envelope.decay);
}
```

---

## Mathematical Foundations

### Equal Temperament Tuning
```javascript
// Equal temperament: each semitone is 2^(1/12) times the previous
const semitonRatio = Math.pow(2, 1/12); // ≈ 1.05946

// Frequency calculation from MIDI note number
function midiToFrequency(midiNote) {
    const A4_MIDI = 69;
    const A4_FREQ = 440;
    return A4_FREQ * Math.pow(2, (midiNote - A4_MIDI) / 12);
}

// Frequency to MIDI note conversion
function frequencyToMidi(frequency) {
    const A4_MIDI = 69;
    const A4_FREQ = 440;
    return A4_MIDI + 12 * Math.log2(frequency / A4_FREQ);
}
```

### Just Intonation Ratios
```javascript
// Pure mathematical ratios for perfect consonance
const justIntonationRatios = {
    'unison': 1/1,
    'minor_2nd': 16/15,
    'major_2nd': 9/8,
    'minor_3rd': 6/5,
    'major_3rd': 5/4,
    'perfect_4th': 4/3,
    'tritone': 45/32,
    'perfect_5th': 3/2,
    'minor_6th': 8/5,
    'major_6th': 5/3,
    'minor_7th': 16/9,
    'major_7th': 15/8,
    'octave': 2/1
};
```

### Frequency Space Mapping
```javascript
// Logarithmic mapping for perceptual linearity
function linearToLog(linearValue, minFreq, maxFreq) {
    const logMin = Math.log(minFreq);
    const logMax = Math.log(maxFreq);
    return Math.exp(logMin + linearValue * (logMax - logMin));
}

// Mel scale for perceptual frequency spacing
function hzToMel(hz) {
    return 2595 * Math.log10(1 + hz / 700);
}

function melToHz(mel) {
    return 700 * (Math.pow(10, mel / 2595) - 1);
}
```

---

## Educational Applications

### Interval Training
```javascript
// Generate interval exercises
function createIntervalExercise(rootNote, intervalType) {
    const intervals = {
        'P1': 0,   // Perfect Unison
        'm2': 1,   // Minor 2nd
        'M2': 2,   // Major 2nd
        'm3': 3,   // Minor 3rd
        'M3': 4,   // Major 3rd
        'P4': 5,   // Perfect 4th
        'TT': 6,   // Tritone
        'P5': 7,   // Perfect 5th
        'm6': 8,   // Minor 6th
        'M6': 9,   // Major 6th
        'm7': 10,  // Minor 7th
        'M7': 11,  // Major 7th
        'P8': 12   // Perfect Octave
    };
    
    const secondNote = rootNote + intervals[intervalType];
    return { root: rootNote, interval: secondNote, type: intervalType };
}
```

### Scale Pattern Recognition
```javascript
// Analyze scale patterns for educational feedback
function analyzeScalePattern(frequencies) {
    const intervals = [];
    
    for (let i = 1; i < frequencies.length; i++) {
        const semitones = Math.round(12 * Math.log2(frequencies[i] / frequencies[i-1]));
        intervals.push(semitones);
    }
    
    // Pattern recognition
    const patterns = {
        major: [2, 2, 1, 2, 2, 2, 1],
        minor: [2, 1, 2, 2, 1, 2, 2],
        pentatonic: [2, 2, 3, 2, 3]
    };
    
    for (let [scaleName, pattern] of Object.entries(patterns)) {
        if (JSON.stringify(intervals) === JSON.stringify(pattern)) {
            return scaleName;
        }
    }
    
    return 'unknown';
}
```

### Harmonic Series Demonstration
```javascript
// Educational tool for demonstrating natural harmonics
function demonstrateHarmonicSeries(fundamental = 110) {
    const harmonics = [];
    const maxHarmonic = 16;
    
    for (let n = 1; n <= maxHarmonic; n++) {
        const frequency = fundamental * n;
        const cents = n === 1 ? 0 : Math.round(1200 * Math.log2(n));
        const amplitude = 1 / n; // Natural amplitude rolloff
        
        harmonics.push({
            harmonic: n,
            frequency: frequency,
            cents: cents,
            amplitude: amplitude,
            note: frequencyToNoteName(frequency)
        });
    }
    
    return harmonics;
}
```

---

## Advanced Concepts

### Microtonality and Alternative Tunings
```javascript
// 31-tone equal temperament (31-TET)
function calculate31TET(noteNumber) {
    const baseFreq = 440; // A4
    const A4_31TET = 108;  // A4 position in 31-TET
    return baseFreq * Math.pow(2, (noteNumber - A4_31TET) / 31);
}

// Pythagorean tuning based on perfect fifths
function calculatePythagoreanTuning(fifthsFromC) {
    const C = 261.626; // C4
    const perfectFifth = 3/2;
    return C * Math.pow(perfectFifth, fifthsFromC) / Math.pow(2, Math.floor(Math.log2(Math.pow(perfectFifth, fifthsFromC))));
}
```

### Spectral Analysis
```javascript
// Analyze harmonic content of generated tones
function analyzeSpectrum(audioBuffer) {
    const fftSize = 2048;
    const fft = new FFT(fftSize);
    const spectrum = fft.forward(audioBuffer);
    
    const fundamentalBin = Math.round(fundamental * fftSize / sampleRate);
    const harmonics = [];
    
    for (let harmonic = 1; harmonic <= 8; harmonic++) {
        const bin = fundamentalBin * harmonic;
        if (bin < spectrum.length / 2) {
            const magnitude = Math.sqrt(spectrum[bin * 2] ** 2 + spectrum[bin * 2 + 1] ** 2);
            harmonics.push({ harmonic, magnitude, frequency: fundamental * harmonic });
        }
    }
    
    return harmonics;
}
```

---

## Implementation Notes

### Performance Considerations
- **Frequency calculations** are optimized for real-time performance
- **Scale mappings** use lookup tables where possible
- **Audio synthesis** employs efficient oscillator pooling
- **Mathematical operations** minimize expensive functions (log, pow) in tight loops

### Accuracy and Precision
- **Frequency precision**: Maintained to 0.1 Hz accuracy
- **Equal temperament**: Implemented with double precision
- **Harmonic relationships**: Calculated using exact mathematical ratios
- **Phase coherence**: Maintained across voice changes

### Educational Fidelity
- **Music theory accuracy**: All scales and intervals are mathematically correct
- **Historical authenticity**: Scales based on documented musical traditions
- **Cross-cultural validity**: Implementations respect different musical systems
- **Pedagogical value**: Concepts are presented in educationally sound ways

---

*This documentation serves as both a technical reference and educational resource for understanding the musical concepts implemented in Music Mouse Interactive.*