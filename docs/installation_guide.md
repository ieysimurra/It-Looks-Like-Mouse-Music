# 🛠️ Installation Guide - Music Mouse Interactive

[🇧🇷 Português](#português) | [🇺🇸 English](#english)

---

## English

This guide provides detailed instructions for setting up Music Mouse Interactive in different environments and use cases.

### 🚀 Quick Start (Recommended)

The fastest way to get started is using the hosted version:

**🌐 Live Demo**: [https://yourusername.github.io/music-mouse/](https://yourusername.github.io/music-mouse/)

Simply open the link in a modern web browser and start creating music!

### 📋 System Requirements

#### Minimum Requirements
- **Browser**: Chrome 80+, Firefox 75+, Safari 13+, or Edge 80+
- **RAM**: 2GB available memory
- **Audio**: Working audio output (speakers or headphones)
- **Internet**: For initial loading of libraries (p5.js, Tone.js)

#### Recommended Requirements
- **Browser**: Latest version of Chrome or Firefox
- **RAM**: 4GB+ available memory
- **Audio**: Low-latency audio interface or quality headphones
- **Internet**: Stable broadband connection
- **Input**: Mouse or touchscreen for interaction

#### Optimal Performance Setup
- **Browser**: Chrome with hardware acceleration enabled
- **RAM**: 8GB+ system memory
- **Audio**: Dedicated audio interface with ASIO drivers
- **Internet**: High-speed connection for smooth media recording
- **Hardware**: Multi-core processor, dedicated graphics card

### 🔧 Local Installation Methods

#### Method 1: Simple Download (No Development Tools Required)

1. **Download the Project**
   ```bash
   # Option A: Download ZIP from GitHub
   # Go to: https://github.com/yourusername/music-mouse
   # Click "Code" → "Download ZIP"
   
   # Option B: Clone with Git
   git clone https://github.com/yourusername/music-mouse.git
   cd music-mouse
   ```

2. **Serve the Files**
   
   Since Music Mouse uses audio libraries, you need to serve the files through HTTP (not file://).
   
   **🐍 Using Python (Most Common)**
   ```bash
   # Python 3 (recommended)
   python -m http.server 8000
   
   # Python 2 (if Python 3 not available)
   python -m SimpleHTTPServer 8000
   ```
   
   **🟢 Using Node.js**
   ```bash
   # Install http-server globally
   npm install -g http-server
   
   # Serve the files
   http-server -p 8000
   ```
   
   **🐘 Using PHP**
   ```bash
   php -S localhost:8000
   ```
   
   **🦀 Using Rust (serve)**
   ```bash
   # Install serve
   cargo install basic-http-server
   
   # Serve the files
   basic-http-server -p 8000
   ```

3. **Open in Browser**
   ```
   http://localhost:8000
   ```

4. **Start Creating Music!**
   - Click "🔊 Start Audio"
   - Move mouse and click/drag to play

#### Method 2: Development Setup (For Contributors)

1. **Prerequisites**
   ```bash
   # Install Node.js (includes npm)
   # Download from: https://nodejs.org/
   
   # Verify installation
   node --version
   npm --version
   ```

2. **Clone and Setup**
   ```bash
   git clone https://github.com/yourusername/music-mouse.git
   cd music-mouse
   
   # Install development dependencies
   npm install
   ```

3. **Development Commands**
   ```bash
   # Start development server
   npm start
   
   # Run linting
   npm run lint
   
   # Format code
   npm run format
   
   # Run tests (when available)
   npm test
   ```

### 🌐 Web Hosting Options

#### GitHub Pages (Free)

1. **Fork the Repository**
   - Go to [https://github.com/yourusername/music-mouse](https://github.com/yourusername/music-mouse)
   - Click "Fork"

2. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"

3. **Access Your Site**
   - Your site will be available at: `https://yourusername.github.io/music-mouse/`

#### Netlify (Free Tier)

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your forked repository

2. **Deploy Settings**
   ```
   Build command: (leave empty)
   Publish directory: .
   ```

3. **Deploy**
   - Click "Deploy site"
   - Your site will be available at a netlify.app URL

#### Vercel (Free Tier)

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Import from GitHub

2. **Deploy**
   - No build configuration needed
   - Click "Deploy"

#### Custom Server

For custom servers, simply upload all files to your web directory and ensure:
- Files are served over HTTP/HTTPS (not file://)
- MIME types are correctly configured
- CORS headers allow audio loading (if needed)

### 📱 Mobile Installation

#### Progressive Web App (PWA) - Future Feature

Music Mouse can be installed as a PWA on mobile devices:

1. **Open in Mobile Browser**
   - Chrome (Android) or Safari (iOS)
   - Navigate to the Music Mouse URL

2. **Install as App**
   - Android: Tap "Add to Home Screen"
   - iOS: Tap Share → "Add to Home Screen"

3. **Launch**
   - Tap the icon on your home screen
   - Use touch gestures to create music

### 🔊 Audio Configuration

#### Browser Audio Settings

**Chrome (Recommended)**
```
1. Go to chrome://settings/content/sound
2. Ensure "Sites can play sound" is enabled
3. For best performance: chrome://flags/#enable-web-audio-api-thread-pool
```

**Firefox**
```
1. Go to about:preferences#privacy
2. Permissions → Autoplay → Allow Audio and Video
3. For latency: about:config → media.webaudio.enabled = true
```

**Safari**
```
1. Preferences → Websites → Auto-Play
2. Set to "Allow All Auto-Play" for Music Mouse domain
```

#### System Audio Optimization

**Windows**
```
1. Sound Settings → Device Properties
2. Set to 44.1kHz, 16-bit or 48kHz, 24-bit
3. Disable audio enhancements
4. Use ASIO drivers if available
```

**macOS**
```
1. Audio MIDI Setup
2. Set sample rate to 44.1kHz or 48kHz
3. Use built-in audio or professional interface
```

**Linux**
```
1. Use ALSA or JACK for low latency
2. Configure sample rate: 44.1kHz or 48kHz
3. Adjust buffer sizes for performance
```

### 🎯 Troubleshooting

#### Common Issues

**❌ No Sound**
```
✅ Solutions:
1. Click "Start Audio" button first
2. Check browser audio permissions
3. Try different browser (Chrome recommended)
4. Check system volume and output device
5. Refresh the page and try again
```

**❌ Audio Crackling/Glitches**
```
✅ Solutions:
1. Close other audio applications
2. Reduce number of active lines
3. Lower browser audio quality settings
4. Use Chrome for better performance
5. Check CPU usage and close unnecessary programs
```

**❌ High Latency**
```
✅ Solutions:
1. Use Chrome browser
2. Enable hardware acceleration
3. Use ASIO drivers (Windows)
4. Reduce buffer sizes
5. Close background applications
```

**❌ Interface Not Responsive**
```
✅ Solutions:
1. Refresh the page
2. Check browser console for errors (F12)
3. Clear browser cache
4. Try incognito/private mode
5. Update browser to latest version
```

**❌ Mobile Touch Issues**
```
✅ Solutions:
1. Tap screen to focus the application
2. Use landscape orientation
3. Ensure touch events are supported
4. Try different mobile browser
5. Update mobile browser
```

#### Performance Optimization

**Browser Settings**
```
Chrome:
- Enable hardware acceleration
- Disable unnecessary extensions
- Use --enable-features=VaapiVideoDecoder flag

Firefox:
- Enable hardware acceleration
- Set media.navigator.streams.fake to false
- Disable accessibility services if not needed
```

**System Settings**
```
Windows:
- Set power plan to "High Performance"
- Disable Windows Defender real-time protection temporarily
- Close Windows Audio Enhancements

macOS:
- Disable visual effects in Energy Saver
- Use Activity Monitor to check CPU usage
- Quit unnecessary applications

Linux:
- Use a real-time kernel if available
- Set CPU governor to "performance"
- Disable power management features
```

### 🧪 Testing Your Installation

#### Quick Test Checklist

- [ ] Audio initializes without errors
- [ ] Mouse movement generates visual feedback
- [ ] Click and drag produces sound
- [ ] All scales work (test keys 0-9)
- [ ] All treatments work (test keys Q-T)
- [ ] Recording functions work (M and P keys)
- [ ] Interface toggles work (H key)
- [ ] Performance is smooth (30 FPS)

#### Advanced Testing

```javascript
// Open browser console (F12) and run:
console.log('p5 version:', p5.VERSION);
console.log('Tone.js available:', typeof Tone !== 'undefined');
console.log('Audio context state:', Tone.context.state);
console.log('Sample rate:', Tone.context.sampleRate);
```

### 📚 Additional Resources

#### Documentation Links
- **[User Guide](CONTROLS.md)**: Complete control reference
- **[Examples](EXAMPLES.md)**: Usage examples and tutorials
- **[API Documentation](API.md)**: Technical details for developers
- **[Contributing Guide](../CONTRIBUTING.md)**: How to contribute to the project

#### External Resources
- **[p5.js Documentation](https://p5js.org/reference/)**
- **[Tone.js Documentation](https://tonejs.github.io/docs/)**
- **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)**
- **[Browser Compatibility](https://caniuse.com/audio-api)**

#### Community Support
- **[GitHub Issues](https://github.com/yourusername/music-mouse/issues)**: Report bugs or request features
- **[GitHub Discussions](https://github.com/yourusername/music-mouse/discussions)**: Community Q&A
- **[Project Wiki](https://github.com/yourusername/music-mouse/wiki)**: Additional documentation

---

## Português

Este guia fornece instruções detalhadas para configurar o Music Mouse Interactive em diferentes ambientes e casos de uso.

### 🚀 Início Rápido (Recomendado)

A forma mais rápida de começar é usando a versão hospedada:

**🌐 Demo Online**: [https://yourusername.github.io/music-mouse/](https://yourusername.github.io/music-mouse/)

Simplesmente abra o link em um navegador moderno e comece a criar música!

### 📋 Requisitos do Sistema

#### Requisitos Mínimos
- **Navegador**: Chrome 80+, Firefox 75+, Safari 13+, ou Edge 80+
- **RAM**: 2GB de memória disponível
- **Áudio**: Saída de áudio funcionando (alto-falantes ou fones)
- **Internet**: Para carregamento inicial das bibliotecas (p5.js, Tone.js)

#### Requisitos Recomendados
- **Navegador**: Versão mais recente do Chrome ou Firefox
- **RAM**: 4GB+ de memória disponível
- **Áudio**: Interface de áudio de baixa latência ou fones de qualidade
- **Internet**: Conexão de banda larga estável
- **Entrada**: Mouse ou tela sensível ao toque para interação

#### Configuração de Performance Ideal
- **Navegador**: Chrome com aceleração de hardware habilitada
- **RAM**: 8GB+ de memória do sistema
- **Áudio**: Interface de áudio dedicada com drivers ASIO
- **Internet**: Conexão de alta velocidade para gravação suave de mídia
- **Hardware**: Processador multi-core, placa gráfica dedicada

### 🔧 Métodos de Instalação Local

#### Método 1: Download Simples (Sem Ferramentas de Desenvolvimento)

1. **Baixar o Projeto**
   ```bash
   # Opção A: Baixar ZIP do GitHub
   # Ir para: https://github.com/yourusername/music-mouse
   # Clicar "Code" → "Download ZIP"
   
   # Opção B: Clonar com Git
   git clone https://github.com/yourusername/music-mouse.git
   cd music-mouse
   ```

2. **Servir os Arquivos**
   
   Como o Music Mouse usa bibliotecas de áudio, você precisa servir os arquivos via HTTP (não file://).
   
   **🐍 Usando Python (Mais Comum)**
   ```bash
   # Python 3 (recomendado)
   python -m http.server 8000
   
   # Python 2 (se Python 3 não estiver disponível)
   python -m SimpleHTTPServer 8000
   ```
   
   **🟢 Usando Node.js**
   ```bash
   # Instalar http-server globalmente
   npm install -g http-server
   
   # Servir os arquivos
   http-server -p 8000
   ```
   
   **🐘 Usando PHP**
   ```bash
   php -S localhost:8000
   ```

3. **Abrir no Navegador**
   ```
   http://localhost:8000
   ```

4. **Começar a Criar Música!**
   - Clicar "🔊 Iniciar Áudio"
   - Mover mouse e clicar/arrastar para tocar

#### Método 2: Configuração de Desenvolvimento (Para Contribuidores)

1. **Pré-requisitos**
   ```bash
   # Instalar Node.js (inclui npm)
   # Baixar de: https://nodejs.org/
   
   # Verificar instalação
   node --version
   npm --version
   ```

2. **Clonar e Configurar**
   ```bash
   git clone https://github.com/yourusername/music-mouse.git
   cd music-mouse
   
   # Instalar dependências de desenvolvimento
   npm install
   ```

3. **Comandos de Desenvolvimento**
   ```bash
   # Iniciar servidor de desenvolvimento
   npm start
   
   # Executar linting
   npm run lint
   
   # Formatar código
   npm run format
   
   # Executar testes (quando disponível)
   npm test
   ```

### 🔊 Configuração de Áudio

#### Configurações de Áudio do Navegador

**Chrome (Recomendado)**
```
1. Ir para chrome://settings/content/sound
2. Garantir que "Sites podem reproduzir som" esteja habilitado
3. Para melhor performance: chrome://flags/#enable-web-audio-api-thread-pool
```

**Firefox**
```
1. Ir para about:preferences#privacy
2. Permissões → Reprodução Automática → Permitir Áudio e Vídeo
3. Para latência: about:config → media.webaudio.enabled = true
```

**Safari**
```
1. Preferências → Sites → Reprodução Automática
2. Definir para "Permitir Toda Reprodução Automática" para o domínio do Music Mouse
```

### 🎯 Solução de Problemas

#### Problemas Comuns

**❌ Sem Som**
```
✅ Soluções:
1. Clicar no botão "Iniciar Áudio" primeiro
2. Verificar permissões de áudio do navegador
3. Tentar navegador diferente (Chrome recomendado)
4. Verificar volume do sistema e dispositivo de saída
5. Atualizar a página e tentar novamente
```

**❌ Áudio Crepitando/Falhando**
```
✅ Soluções:
1. Fechar outras aplicações de áudio
2. Reduzir número de linhas ativas
3. Diminuir configurações de qualidade de áudio do navegador
4. Usar Chrome para melhor performance
5. Verificar uso de CPU e fechar programas desnecessários
```

**❌ Interface Não Responsiva**
```
✅ Soluções:
1. Atualizar a página
2. Verificar console do navegador para erros (F12)
3. Limpar cache do navegador
4. Tentar modo incógnito/privado
5. Atualizar navegador para versão mais recente
```

### 📚 Recursos Adicionais

#### Links de Documentação
- **[Guia do Usuário](CONTROLS.md)**: Referência completa de controles
- **[Exemplos](EXAMPLES.md)**: Exemplos de uso e tutoriais
- **[Documentação da API](API.md)**: Detalhes técnicos para desenvolvedores
- **[Guia de Contribuição](../CONTRIBUTING.md)**: Como contribuir para o projeto

#### Suporte da Comunidade
- **[GitHub Issues](https://github.com/yourusername/music-mouse/issues)**: Relatar bugs ou solicitar funcionalidades
- **[GitHub Discussions](https://github.com/yourusername/music-mouse/discussions)**: Perguntas e respostas da comunidade
- **[Wiki do Projeto](https://github.com/yourusername/music-mouse/wiki)**: Documentação adicional

---

*Para suporte adicional, consulte nossa [documentação completa](../README.md) ou entre em contato através dos canais da comunidade.*