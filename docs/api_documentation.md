# Music Mouse API Documentation

This document provides technical details about the Music Mouse Interactive application's internal API and architecture.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Core Classes](#core-classes)
- [Audio System](#audio-system)
- [Configuration](#configuration)
- [Public Methods](#public-methods)
- [Events](#events)
- [Extensions](#extensions)

---

## Architecture Overview

Music Mouse Interactive follows a modular architecture:

```
Application Layer
├── p5.js Framework (Graphics & Interaction)
├── Audio Engine (p5.sound + Tone.js)
├── Music Theory Engine (Scales & Frequencies)
├── Recording System (Movement & Media)
└── UI System (Interface & Controls)
```

### Data Flow
1. **User Input** → Mouse/Keyboard Events
2. **Input Processing** → Coordinate Mapping
3. **Musical Translation** → Frequency Calculation
4. **Audio Generation** → Synthesis
5. **Visual Feedback** → Canvas Rendering

---

## Core Classes

### MusicMouseFrequencyGrid

Main application class that orchestrates all functionality.

```javascript
class MusicMouseFrequencyGrid {
    constructor()
    
    // Audio Management
    initializeAudio()
    startAudio()
    clearAllVoices()
    
    // Musical Functions
    mapToFrequency(value, axis)
    playNote(voice, frequency)
    applyTreatment(mouseXNorm, mouseYNorm)
    
    // Line Management
    addVerticalLine()
    removeVerticalLine()
    addHorizontalLine()
    removeHorizontalLine()
    
    // Configuration
    changeScale(scaleName)
    changeRhythmTreatment(treatment)
    setTranspose(value)
}
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `currentScale` | Object | Active musical scale configuration |
| `rhythmTreatment` | String | Current rhythmic treatment mode |
| `transpose` | Number | Transposition in semitones (-24 to +24) |
| `verticalLines` | Number | Count of vertical frequency lines |
| `horizontalLines` | Number | Count of horizontal frequency lines |
| `isAudioStarted` | Boolean | Audio system initialization status |
| `isRecording` | Boolean | Movement recording state |
| `isPlayingBack` | Boolean | Playback state |

---

## Audio System

### Dual Engine Architecture

Music Mouse uses a hybrid audio system combining two engines:

#### p5.sound Engine
- **Primary**: Real-time audio synthesis
- **Oscillators**: Individual voices with envelopes
- **Waveforms**: Sine, Triangle, Sawtooth, Square
- **Performance**: Optimized for real-time interaction

#### Tone.js Engine
- **Secondary**: Enhanced audio processing
- **Effects**: Reverb, delay, filters (future)
- **Scheduling**: Precise timing for complex patterns
- **Quality**: Higher fidelity synthesis

### Audio Configuration

```javascript
const AUDIO_CONFIG = {
    SAMPLE_RATE: 44100,
    BUFFER_SIZE: 512,
    MAX_VOICES: 16,
    DEFAULT_VOLUME: 0.2,
    ATTACK_TIME: 0.01,
    DECAY_TIME: 0.1,
    SUSTAIN_LEVEL: 0.7,
    RELEASE_TIME: 0.5
};
```

### Voice Management

Each voice (line) has independent configuration:

```javascript
const voice = {
    type: 'vertical' | 'horizontal',
    index: number,
    frequency: number,
    isActive: boolean,
    waveType: 'sine' | 'triangle' | 'sawtooth' | 'square',
    oscIndex: number,
    position: number
};
```

---

## Configuration

### Musical Scales

```javascript
const SCALES = {
    chromatic: {
        name: 'Chromatic',
        intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    },
    major: {
        name: 'Major',
        intervals: [0, 2, 4, 5, 7, 9, 11]
    },
    // ... additional scales
    continuous: {
        name: 'Continuous (Linear Hz)',
        intervals: [],
        isContinuous: true
    }
};
```

### Frequency Ranges

```javascript
const CONFIG = {
    GRID_SIZE_X: 32,        // Horizontal grid divisions
    GRID_SIZE_Y: 24,        // Vertical grid divisions
    BASE_FREQ_X: 110,       // A2 for X-axis (Hz)
    BASE_FREQ_Y: 220,       // A3 for Y-axis (Hz)
    FREQ_RANGE_X: 3,        // Octaves on X-axis
    FREQ_RANGE_Y: 2,        // Octaves on Y-axis
    MIN_LINES: 1,           // Minimum lines per axis
    MAX_LINES: 8            // Maximum lines per axis
};
```

### Rhythmic Treatments

| Treatment | Description | Algorithm |
|-----------|-------------|-----------|
| `chord` | All lines play simultaneously | Immediate trigger |
| `arpeggio` | Lines play in sequence | Time-based cycling |
| `line` | Linear voice movement | Directional patterns |
| `improvise` | Random patterns | Probability-based |
| `phase` | Minimalist phasing | Mathematical modulation |

---

## Public Methods

### Audio Control

#### `startAudio()`
Initializes the audio system and starts oscillators.

```javascript
async musicMouse.startAudio()
```

**Returns**: `Promise<void>`

#### `stopAllVoices()`
Stops all currently playing voices.

```javascript
musicMouse.stopAllVoices()
```

### Musical Control

#### `mapToFrequency(value, axis)`
Converts normalized position to frequency based on current scale.

```javascript
const frequency = musicMouse.mapToFrequency(0.5, 'x');
```

**Parameters**:
- `value` (number): Normalized position (0-1)
- `axis` (string): 'x' or 'y'

**Returns**: `number` - Frequency in Hz

#### `playNote(voice, frequency)`
Triggers a note on the specified voice.

```javascript
musicMouse.playNote(voice, 440);
```

**Parameters**:
- `voice` (Object): Voice configuration object
- `frequency` (number): Frequency in Hz

### Line Management

#### `addVerticalLine()` / `removeVerticalLine()`
Dynamically add or remove vertical frequency lines.

```javascript
musicMouse.addVerticalLine();
musicMouse.removeVerticalLine();
```

#### `addHorizontalLine()` / `removeHorizontalLine()`
Dynamically add or remove horizontal frequency lines.

```javascript
musicMouse.addHorizontalLine();
musicMouse.removeHorizontalLine();
```

### Configuration

#### `changeScale(scaleName)`
Switch to a different musical scale.

```javascript
musicMouse.changeScale('pentatonic');
```

**Parameters**:
- `scaleName` (string): Key from SCALES object

#### `changeRhythmTreatment(treatment)`
Change the rhythmic treatment mode.

```javascript
musicMouse.changeRhythmTreatment('arpeggio');
```

**Parameters**:
- `treatment` (string): 'chord', 'arpeggio', 'line', 'improvise', 'phase'

#### `setTranspose(value)`
Set transposition in semitones.

```javascript
musicMouse.setTranspose(7); // Up a fifth
```

**Parameters**:
- `value` (number): Semitones (-24 to +24)

### Recording System

#### `toggleRecording()`
Start or stop recording mouse movements.

```javascript
musicMouse.toggleRecording();
```

#### `togglePlayback()`
Start or stop playback of recorded movements.

```javascript
musicMouse.togglePlayback();
```

---

## Events

### Mouse Events

The application responds to standard p5.js mouse events:

- `mousePressed()` - Start interaction
- `mouseDragged()` - Continue interaction
- `mouseReleased()` - End interaction
- `mouseMoved()` - Track position for recording

### Keyboard Events

All keyboard shortcuts are handled in `keyPressed()`:

```javascript
function keyPressed() {
    // Scale selection (0-9)
    // Treatment selection (Q-T)
    // Transposition (A/S/D)
    // Waveforms (Z/X/C/V)
    // Line management (Arrow keys)
    // Navigation ([/], ,/.)
    // Interface (H, I, U)
    // Recording (M, P)
}
```

### Touch Events

Mobile support through touch events:

- `touchStarted()` - Begin touch interaction
- `touchMoved()` - Continue touch interaction
- `touchEnded()` - End touch interaction

---

## Extensions

### Adding New Scales

1. Define scale in `SCALES` object:

```javascript
SCALES.newScale = {
    name: 'My New Scale',
    intervals: [0, 2, 3, 6, 7, 9, 10]
};
```

2. Add keyboard mapping in `keyPressed()`
3. Update documentation

### Adding New Treatments

1. Add treatment logic in `applyTreatment()`:

```javascript
case 'newTreatment':
    this.playNewTreatment(mouseXNorm, mouseYNorm);
    break;
```

2. Implement treatment method:

```javascript
playNewTreatment(mouseXNorm, mouseYNorm) {
    // Custom algorithm
}
```

3. Add keyboard shortcut
4. Update UI and documentation

### Custom Waveforms

Add custom waveforms by extending the `waveTypes` object:

```javascript
const customWaveTypes = {
    'custom': 'custom',
    // Map to custom oscillator
};
```

### Audio Effects

Integrate Tone.js effects:

```javascript
const reverb = new Tone.Reverb(2).toDestination();
synth.connect(reverb);
```

---

## Performance Considerations

### Optimization Guidelines

1. **Minimize object creation** in `draw()` loop
2. **Use object pooling** for frequently created objects
3. **Limit active oscillators** to maximum supported
4. **Optimize frequency calculations** with lookup tables
5. **Use efficient drawing** methods

### Memory Management

- Properly dispose audio resources
- Clear event listeners on cleanup
- Use weak references where appropriate
- Monitor memory usage in development

### Browser Compatibility

- Test Web Audio API support
- Graceful degradation for unsupported features
- Optimize for different audio hardware
- Handle permission requirements

---

## Debugging

### Audio Debugging

```javascript
// Enable audio debugging
console.log('Active voices:', musicMouse.p5Oscillators.length);
console.log('Tone.js context:', Tone.context.state);
```

### Performance Monitoring

```javascript
// Monitor frame rate
console.log('FPS:', frameRate());

// Monitor memory usage
console.log('Memory:', performance.memory);
```

### Error Handling

The application includes comprehensive error handling:

- Audio initialization errors
- Browser compatibility issues
- Permission denied scenarios
- Resource loading failures

---

For more detailed implementation examples, see the [examples/](../examples/) directory.