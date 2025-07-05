# 🎹 Music Mouse - Grade de Frequências Interativa

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![p5.js](https://img.shields.io/badge/p5.js-1.7.0-pink.svg)](https://p5js.org/)
[![Tone.js](https://img.shields.io/badge/Tone.js-14.8.49-blue.svg)](https://tonejs.github.io/)
[![Status](https://img.shields.io/badge/Status-Ativo-green.svg)]()

[🇺🇸 English](README.md) | [🇧🇷 Português](#português)

---

## Visão Geral

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

### 🎮 Controles Principais

#### Interação Básica
- **Clique e Arraste**: Toque música em tempo real
- **H**: Alternar interface completa
- **?**: Mostrar instruções de ajuda

#### Escalas e Tratamentos
- **0-9**: Selecionar escalas musicais
- **Q-T**: Selecionar tratamentos rítmicos
  - Q: Acorde
  - W: Arpejo
  - E: Linha
  - R: Improvisação
  - T: Fase

#### Gerenciamento de Linhas
- **↑/↓**: Adicionar/Remover linhas verticais
- **←/→**: Adicionar/Remover linhas horizontais
- **G**: Alternar modos de espaçamento

#### Navegação de Linhas
- **[ / ]**: Navegar pelas linhas verticais
- **, / .**: Navegar pelas linhas horizontais
- **Tab**: Alternar tipo de linha selecionada

#### Formas de Onda (linha selecionada)
- **Z**: Onda senoidal (∿)
- **X**: Onda triangular (△)
- **C**: Onda dente de serra (⋮)
- **V**: Onda quadrada (⊔)

#### Transposição
- **A/S/D**: Transpor -/+/resetar

#### Gravação e Automação
- **M**: Iniciar/Parar gravação de movimentos
- **P**: Reproduzir/Pausar movimentos gravados

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
├── README.md               # Versão em inglês
├── README-pt.md            # Este arquivo
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

## 🎨 Sobre Laurie Spiegel

Laurie Spiegel é uma compositora americana e pioneira da música computacional. Seu Music Mouse original (1986) foi um software revolucionário que tornou a composição algorítmica acessível a não-programadores. Esta implementação honra sua visão enquanto a traz para navegadores web modernos.

**Saiba Mais**:
- [Wikipedia: Music Mouse](https://en.wikipedia.org/wiki/Music_Mouse)
- [YouTube: Demo Original](https://www.youtube.com/watch?v=CuVwEfvJ1YY)
- [Website de Laurie Spiegel](http://lauriespiegel.net/)

## 🎼 Guia de Uso Musical

### Para Iniciantes

1. **Primeiros Passos**
   - Comece com a escala Maior (tecla 2)
   - Use o tratamento Acorde (tecla Q)
   - Mova o mouse lentamente para ouvir as mudanças harmônicas

2. **Explorando Escalas**
   - Pentatônica (5): "Sempre soa bem"
   - Blues (6): Para sons expressivos
   - Contínua (0): Para efeitos especiais

3. **Tratamentos Rítmicos**
   - Acorde (Q): Para harmonia completa
   - Arpejo (W): Para padrões melódicos
   - Fase (T): Para texturas ambientes

### Para Músicos Experientes

1. **Composição Avançada**
   - Grave padrões com M e construa camadas
   - Use transposição (A/S) para modulações
   - Combine diferentes formas de onda para timbres únicos

2. **Performance ao Vivo**
   - Configure teclas de atalho familiares
   - Use a interface oculta (H) para apresentações
   - Pratique transições suaves entre escalas

3. **Aplicações Educacionais**
   - Demonstre intervalos e progressões harmônicas
   - Ensine conceitos de frequência com a escala contínua
   - Explore tradições musicais mundiais

## 📚 Documentação Completa

- **[Controles Detalhados](docs/CONTROLS.md)**: Referência completa de todos os controles
- **[Documentação da API](docs/API.md)**: Detalhes técnicos para desenvolvedores  
- **[Exemplos e Tutoriais](docs/EXAMPLES.md)**: Guias práticos e técnicas criativas
- **[Diretrizes de Contribuição](CONTRIBUTING.md)**: Como colaborar com o projeto

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Este projeto prospera com a colaboração da comunidade. Veja como você pode ajudar:

### Formas de Contribuir
- **🐛 Relatórios de Bug**: Encontrou um problema? Nos conte!
- **✨ Ideias de Funcionalidades**: Tem uma ideia? Compartilhe!
- **💻 Código**: Envie pull requests com melhorias
- **📚 Documentação**: Ajude a melhorar guias e tutoriais
- **🎵 Exemplos Musicais**: Crie e compartilhe composições
- **🌍 Traduções**: Ajude com outros idiomas
- **🧪 Testes**: Teste em diferentes dispositivos e navegadores

### Começando
1. Leia as [Diretrizes de Contribuição](CONTRIBUTING.md)
2. Veja os [Issues Abertos](https://github.com/yourusername/music-mouse/issues)
3. Participe das [Discussões](https://github.com/yourusername/music-mouse/discussions)

## 🌟 Destaques do Projeto

### Inovações Técnicas
- **Sistema de Áudio Híbrido**: Combina p5.sound e Tone.js para melhor qualidade
- **Interface Bilíngue**: Suporte nativo para português e inglês
- **Gravação Avançada**: Capture áudio, vídeo e automação de movimentos
- **Escalas Personalizáveis**: Sistema flexível para diferentes tradições musicais

### Aspectos Educacionais
- **Teoria Musical Visual**: Veja conceitos musicais em ação
- **Aprendizado Interativo**: Experimente diferentes escalas e tratamentos
- **Acessibilidade**: Funciona para músicos e não-músicos
- **Preservação Cultural**: Mantém vivo o legado da música computacional pioneira

### Aplicações Criativas
- **Composição Algorítmica**: Crie música através de movimento e automação
- **Performance ao Vivo**: Use em apresentações e instalações
- **Arte Sonora**: Explore sons não-convencionais e texturas
- **Educação Musical**: Ferramenta poderosa para ensino e aprendizado

## 🔧 Desenvolvimento e Tecnologia

### Stack Tecnológico
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Gráficos**: p5.js para renderização e interação
- **Áudio**: p5.sound + Tone.js para síntese e processamento
- **Build**: Sistema simples sem compilação necessária
- **Deploy**: GitHub Pages, qualquer servidor estático

### Arquitetura
```
Interface do Usuário (p5.js)
    ↓
Motor Musical (Escalas + Tratamentos)
    ↓
Sistema de Áudio (p5.sound + Tone.js)
    ↓
Saída de Áudio (Web Audio API)
```

### Performance
- **30 FPS sustentados**: Otimizado para interação em tempo real
- **Baixa latência**: <10ms em sistemas suportados
- **Uso eficiente de memória**: <100MB para operação normal
- **Cross-browser**: Testado em Chrome, Firefox, Safari, Edge

## 🎯 Roadmap Futuro

### Versão 2.1 (Q1 2025)
- [ ] Suporte MIDI (entrada e saída)
- [ ] Exportação para WAV/MP3
- [ ] Sistema de presets salvos
- [ ] Modo colaborativo online

### Versão 2.2 (Q2 2025)
- [ ] Aplicativo mobile nativo
- [ ] Efeitos de áudio avançados
- [ ] Sistema de plugins
- [ ] Análise espectral em tempo real

### Versão 3.0 (2025)
- [ ] Inteligência artificial para sugestões musicais
- [ ] Realidade aumentada para performance
- [ ] Integração com DAWs populares
- [ ] Comunidade online integrada

## 📊 Estatísticas do Projeto

- **🌟 Stars**: [![GitHub Stars](https://img.shields.io/github/stars/yourusername/music-mouse)](https://github.com/yourusername/music-mouse/stargazers)
- **🍴 Forks**: [![GitHub Forks](https://img.shields.io/github/forks/yourusername/music-mouse)](https://github.com/yourusername/music-mouse/network)
- **🐛 Issues**: [![GitHub Issues](https://img.shields.io/github/issues/yourusername/music-mouse)](https://github.com/yourusername/music-mouse/issues)
- **📈 Commits**: [![GitHub Commits](https://img.shields.io/github/commits-since/yourusername/music-mouse/v1.0.0)](https://github.com/yourusername/music-mouse/commits)

## 📄 Licença

Este projeto é licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

### Reconhecimentos
- **Laurie Spiegel** - Criadora do Music Mouse original e fonte de inspiração
- **Comunidade p5.js** - Framework incrível de programação criativa
- **Equipe Tone.js** - Excelente biblioteca de áudio web
- **Colaboradores** - Todos que ajudam a melhorar este projeto

## 🙏 Agradecimentos Especiais

Este projeto existe graças ao trabalho pioneiro de Laurie Spiegel e ao apoio contínuo da comunidade de código aberto. Agradecimentos especiais a:

- **Pioneiros da Música Computacional**: Por abrirem caminho
- **Comunidade Educacional**: Por usar e melhorar o projeto
- **Contribuidores**: Por código, documentação e feedback
- **Usuários**: Por criar música e compartilhar suas experiências

## 📞 Suporte e Comunidade

### Onde Encontrar Ajuda
- **📖 Documentação**: Guias completos na pasta `docs/`
- **💬 Discussões**: [GitHub Discussions](https://github.com/yourusername/music-mouse/discussions)
- **🐛 Problemas**: [GitHub Issues](https://github.com/yourusername/music-mouse/issues)
- **📧 Email**: contact@musicmouse.example.com

### Comunidade
- **🎵 Showcase**: Compartilhe suas criações
- **🎓 Educadores**: Recursos especiais para ensino
- **💻 Desenvolvedores**: Colaboração técnica
- **🌍 Tradutores**: Ajuda com internacionalização

---

**Crie, explore e compartilhe música de formas nunca antes imaginadas!** 🎶✨

*Music Mouse Interactive - Onde a tecnologia encontra a criatividade musical.*