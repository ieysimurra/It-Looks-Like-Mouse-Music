# 🎹 Music Mouse - Interactive Frequency Grid

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![p5.js](https://img.shields.io/badge/p5.js-1.7.0-pink.svg)](https://p5js.org/)
[![Tone.js](https://img.shields.io/badge/Tone.js-14.8.49-blue.svg)](https://tonejs.github.io/)
[![Status](https://img.shields.io/badge/Status-Active-green.svg)]()

[🇧🇷 Português](#português) | [🇺🇸 English](#english)

---

## English

### Overview

Music Mouse is an interactive frequency grid application inspired by the pioneering work of **Laurie Spiegel**. Originally created in 1986, Music Mouse was one of the first computer-assisted music composition tools. This modern implementation recreates the essence of Spiegel's innovative interface using p5.js and modern web technologies.

### ✨ Features

- **Interactive Frequency Grid**: Real-time music generation through mouse movement
- **Dual-Axis Control**: Both X and Y axes control independent frequency ranges
- **Multiple Musical Scales**: 10 different scales including chromatic, major, minor, pentatonic, blues, and continuous linear frequency
- **Rhythmic Treatments**: 5 different playback modes (Chord, Arpeggio, Line, Improvisation, Phase)
- **Dynamic Line System**: Up to 8 vertical and 8 horizontal lines with individual configurations
- **Waveform Control**: Individual waveform selection per line (Sine, Triangle, Sawtooth, Square)
- **Recording & Playback**: Record mouse movements and play them back with automation
- **Audio/Video Recording**: Capture your musical creations
- **Spacing Modes**: Three different line spacing algorithms
- **Transposition**: ±24 semitones range
- **Bilingual Interface**: Portuguese and English support

### 🎵 Musical Scales Available

| Number | Scale | Description |
|--------|-------|-------------|
| 0 | **Continuous** | Linear frequency mapping in Hz |
| 1 | **Chromatic** | All 12 semitones |
| 2 | **Major** | Traditional major scale (do-re-mi) |
| 3 | **Natural Minor** | Natural minor scale |
| 4 | **Harmonic Minor** | Minor scale with raised 7th |
| 5 | **Pentatonic** | 5-note scale |
| 6 | **Blues** | Traditional blues scale |
| 7 | **Middle Eastern** | Arabic modal scales |
| 8 | **Japanese** | Traditional Japanese scale |
| 9 | **Whole Tone** | Debussy-style whole tone scale |

### 🎮 Controls

#### Basic Interaction
- **Click & Drag**: Play music in real-time
- **H**: Toggle complete interface
- **?**: Show help instructions

#### Lines Management
- **↑/↓**: Add/Remove vertical lines
- **←/→**: Add/Remove horizontal lines
- **G**: Toggle spacing modes
- **Tab**: Switch line type selection

#### Line Navigation
- **[ / ]**: Navigate through vertical lines
- **, / .**: Navigate through horizontal lines

#### Musical Controls
- **0-9**: Select musical scales
- **Q-T**: Select rhythmic treatments
  - Q: Chord
  - W: Arpeggio
  - E: Line
  - R: Improvisation
  - T: Phase
- **A/S/D**: Transpose -/+/reset

#### Waveforms (for selected line)
- **Z**: Sine wave (∿)
- **X**: Triangle wave (△)
- **C**: Sawtooth wave (⋮)
- **V**: Square wave (⊔)

#### Recording & Automation
- **M**: Start/Stop movement recording
- **P**: Play/Pause recorded movements
- **I**: Instructions in Portuguese
- **U**: Instructions in English

### 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/music-mouse.git
   cd music-mouse
   ```

2. **Serve the files** (required for audio libraries):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**:
   ```
   http://localhost:8000
   ```

4. **Start creating music**:
   - Click "🔊 Start Audio" button
   - Move your mouse and click/drag to play

### 📁 Project Structure

```
music-mouse/
├── index.html              # Main HTML file
├── sketch.js               # Main p5.js application
├── style.css               # Minimal styling
├── assets/                 # Media assets
│   ├── images/
│   ├── audio/
│   └── videos/
├── docs/                   # Documentation
│   ├── API.md
│   ├── CONTROLS.md
│   └── EXAMPLES.md
├── examples/               # Usage examples
├── tests/                  # Test files
├── README.md               # This file
├── README-pt.md            # Portuguese version
├── LICENSE                 # MIT License
├── CONTRIBUTING.md         # Contribution guidelines
├── CHANGELOG.md            # Version history
└── package.json            # Project metadata
```

### 🎛️ Technical Specifications

- **Audio Engine**: p5.sound + Tone.js hybrid system
- **Graphics**: p5.js with HSB color mode
- **Browser Compatibility**: Modern browsers with Web Audio API support
- **Performance**: 30 FPS target, optimized for real-time audio
- **Audio Features**: 
  - Sample Rate: 44.1kHz
  - Bit Depth: 16-bit
  - Polyphony: Up to 16 simultaneous voices
  - Latency: <10ms on supported systems

### 🎨 About Laurie Spiegel

Laurie Spiegel is an American composer and computer music pioneer. Her original Music Mouse (1986) was groundbreaking software that made algorithmic composition accessible to non-programmers. This implementation honors her vision while bringing it to modern web browsers.

**Learn More**:
- [Wikipedia: Music Mouse](https://en.wikipedia.org/wiki/Music_Mouse)
- [YouTube: Original Demo](https://www.youtube.com/watch?v=CuVwEfvJ1YY)
- [Laurie Spiegel's Website](http://lauriespiegel.net/)

### 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- **Laurie Spiegel** - Original Music Mouse creator
- **p5.js Community** - Amazing creative coding framework
- **Tone.js Team** - Excellent web audio library
- **Contributors** - Everyone who helps improve this project

### 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/music-mouse/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/music-mouse/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/music-mouse/wiki)

---

## Português

### Visão Geral

O Music Mouse é uma aplicação de grade de frequências interativa inspirada no trabalho pioneiro de **Laurie Spiegel**. Originalmente criado em 1986, o Music Mouse foi uma das primeiras ferramentas de composição musical assistida por computador. Esta implementação moderna recria a essência da interface inovadora da Spiegel usando p5.js e tecnologias web modernas.

### ✨ Funcionalidades

- **Grade de Frequências Interativa**: Geração musical em tempo real através do movimento do mouse
- **Controle de Eixo Duplo**: Ambos os eixos X e Y controlam faixas de frequência independentes
- **Múltiplas Escalas Musicais**: 10 escalas diferentes incluindo cromática, maior, menor, pentatônica, blues e frequência linear contínua
- **Tratamentos Rítmicos**: 5 modos de reprodução diferentes (Acorde, Arpejo, Linha, Improvisação, Fase)
- **Sistema de Linhas Dinâmico**: Até 8 linhas verticais e 8 horizontais com configurações individuais
- **Controle de Forma de Onda**: Seleção individual de forma de onda por linha (Senoidal, Triangular, Dente de Serra, Quadrada)
- **Gravação e Reprodução**: Grave movimentos do mouse e reproduza-os com automação
- **Gravação de Áudio/Vídeo**: Capture suas criações musicais
- **Modos de Espaçamento**: Três algoritmos diferentes de espaçamento de linhas
- **Transposição**: Faixa de ±24 semitons
- **Interface Bilíngue**: Suporte para português e inglês

### 🎵 Escalas Musicais Disponíveis

| Número | Escala | Descrição |
|--------|--------|-----------|
| 0 | **Contínua** | Mapeamento linear de frequência em Hz |
| 1 | **Cromática** | Todos os 12 semitons |
| 2 | **Maior** | Escala maior tradicional (dó-ré-mi) |
| 3 | **Menor Natural** | Escala menor natural |
| 4 | **Menor Harmônica** | Escala menor com 7ª aumentada |
| 5 | **Pentatônica** | Escala de 5 notas |
| 6 | **Blues** | Escala blues tradicional |
| 7 | **Oriente Médio** | Escalas modais árabes |
| 8 | **Japonesa** | Escala tradicional japonesa |
| 9 | **Tons Inteiros** | Escala de tons inteiros estilo Debussy |

### 🎮 Controles

#### Interação Básica
- **Clique e Arraste**: Toque música em tempo real
- **H**: Alternar interface completa
- **?**: Mostrar instruções de ajuda

#### Gerenciamento de Linhas
- **↑/↓**: Adicionar/Remover linhas verticais
- **←/→**: Adicionar/Remover linhas horizontais
- **G**: Alternar modos de espaçamento
- **Tab**: Alternar seleção de tipo de linha

#### Navegação de Linhas
- **[ / ]**: Navegar pelas linhas verticais
- **, / .**: Navegar pelas linhas horizontais

#### Controles Musicais
- **0-9**: Selecionar escalas musicais
- **Q-T**: Selecionar tratamentos rítmicos
  - Q: Acorde
  - W: Arpejo
  - E: Linha
  - R: Improvisação
  - T: Fase
- **A/S/D**: Transpor -/+/resetar

#### Formas de Onda (para linha selecionada)
- **Z**: Onda senoidal (∿)
- **X**: Onda triangular (△)
- **C**: Onda dente de serra (⋮)
- **V**: Onda quadrada (⊔)

#### Gravação e Automação
- **M**: Iniciar/Parar gravação de movimentos
- **P**: Reproduzir/Pausar movimentos gravados
- **I**: Instruções em português
- **U**: Instruções em inglês

### 🚀 Início Rápido

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/yourusername/music-mouse.git
   cd music-mouse
   ```

2. **Sirva os arquivos** (necessário para bibliotecas de áudio):
   ```bash
   # Usando Python 3
   python -m http.server 8000
   
   # Usando Node.js
   npx http-server
   
   # Usando PHP
   php -S localhost:8000
   ```

3. **Abra no navegador**:
   ```
   http://localhost:8000
   ```

4. **Comece a criar música**:
   - Clique no botão "🔊 Iniciar Áudio"
   - Mova o mouse e clique/arraste para tocar

### 📁 Estrutura do Projeto

```
music-mouse/
├── index.html              # Arquivo HTML principal
├── sketch.js               # Aplicação p5.js principal
├── style.css               # Estilização mínima
├── assets/                 # Recursos de mídia
│   ├── images/
│   ├── audio/
│   └── videos/
├── docs/                   # Documentação
│   ├── API.md
│   ├── CONTROLS.md
│   └── EXAMPLES.md
├── examples/               # Exemplos de uso
├── tests/                  # Arquivos de teste
├── README.md               # Este arquivo
├── README-pt.md            # Versão em português
├── LICENSE                 # Licença MIT
├── CONTRIBUTING.md         # Diretrizes de contribuição
├── CHANGELOG.md            # Histórico de versões
└── package.json            # Metadados do projeto
```

### 🎛️ Especificações Técnicas

- **Motor de Áudio**: Sistema híbrido p5.sound + Tone.js
- **Gráficos**: p5.js com modo de cor HSB
- **Compatibilidade do Navegador**: Navegadores modernos com suporte à Web Audio API
- **Performance**: Meta de 30 FPS, otimizado para áudio em tempo real
- **Recursos de Áudio**: 
  - Taxa de Amostragem: 44.1kHz
  - Profundidade de Bit: 16-bit
  - Polifonia: Até 16 vozes simultâneas
  - Latência: <10ms em sistemas suportados

### 🎨 Sobre Laurie Spiegel

Laurie Spiegel é uma compositora americana e pioneira da música computacional. Seu Music Mouse original (1986) foi um software revolucionário que tornou a composição algorítmica acessível a não-programadores. Esta implementação honra sua visão enquanto a traz para navegadores web modernos.

**Saiba Mais**:
- [Wikipedia: Music Mouse](https://en.wikipedia.org/wiki/Music_Mouse)
- [YouTube: Demo Original](https://www.youtube.com/watch?v=CuVwEfvJ1YY)
- [Website de Laurie Spiegel](http://lauriespiegel.net/)

### 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, veja [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes.

### 📄 Licença

Este projeto é licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

### 🙏 Agradecimentos

- **Laurie Spiegel** - Criadora do Music Mouse original
- **Comunidade p5.js** - Framework incrível de programação criativa
- **Equipe Tone.js** - Excelente biblioteca de áudio web
- **Colaboradores** - Todos que ajudam a melhorar este projeto

### 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/yourusername/music-mouse/issues)
- **Discussões**: [GitHub Discussions](https://github.com/yourusername/music-mouse/discussions)
- **Documentação**: [Wiki](https://github.com/yourusername/music-mouse/wiki)