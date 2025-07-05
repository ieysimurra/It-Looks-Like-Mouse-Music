# Contributing to Music Mouse

[🇧🇷 Português](#português) | [🇺🇸 English](#english)

---

## English

Thank you for your interest in contributing to Music Mouse! This project aims to honor Laurie Spiegel's pioneering work while bringing it to modern web platforms.

### 🌟 Ways to Contribute

- **Bug Reports**: Found a bug? Let us know!
- **Feature Requests**: Have an idea for improvement?
- **Code Contributions**: Submit pull requests
- **Documentation**: Help improve our docs
- **Examples**: Create usage examples
- **Testing**: Help test on different platforms
- **Translations**: Help with internationalization

### 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/music-mouse.git
   cd music-mouse
   ```
3. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes**
5. **Test thoroughly**
6. **Submit a pull request**

### 📋 Development Guidelines

#### Code Style
- Use **camelCase** for JavaScript variables and functions
- Use **PascalCase** for classes
- Use **UPPER_CASE** for constants
- Add meaningful comments for complex algorithms
- Follow existing indentation (2 spaces)

#### Audio Development
- Always test audio features in multiple browsers
- Consider performance impact of audio processing
- Use try-catch blocks for audio operations
- Test with different audio hardware setups

#### p5.js Best Practices
- Use `push()` and `pop()` for isolated transformations
- Minimize object creation in `draw()` loop
- Use appropriate data structures for performance
- Follow p5.js naming conventions

#### Documentation
- Update README.md for new features
- Add inline comments for complex functions
- Include usage examples for new features
- Keep documentation in both English and Portuguese

### 🐛 Bug Reports

When reporting bugs, please include:

- **Browser and version**
- **Operating system**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots or recordings** (if applicable)
- **Console errors** (if any)

### ✨ Feature Requests

For feature requests, please provide:

- **Clear description** of the feature
- **Use case** - why is this needed?
- **Possible implementation** ideas
- **References** to similar features elsewhere
- **Mockups or sketches** (if applicable)

### 🔧 Technical Requirements

#### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

#### Audio Requirements
- Web Audio API support
- Microphone access (for recording features)
- Low-latency audio preferred

#### Performance Targets
- 30 FPS sustained performance
- <10ms audio latency where possible
- <100MB memory usage
- Responsive on 1920x1080 displays

### 🎵 Musical Guidelines

When adding musical features:

- **Respect music theory** - ensure scales are accurate
- **Consider accessibility** - not all users are musicians
- **Test with musicians** - get feedback from actual users
- **Honor Spiegel's vision** - stay true to the original concept
- **Document musical concepts** - explain theory in comments

### 📚 Code Organization

```
sketch.js structure:
├── Constants and Configuration
├── Class Definitions
│   ├── MusicMouseFrequencyGrid
│   ├── Audio System Methods
│   ├── UI and Drawing Methods
│   └── Control Methods
├── p5.js Functions
│   ├── setup()
│   ├── draw()
│   ├── Mouse/Touch Events
│   └── Keyboard Events
└── Utility Functions
```

### 🧪 Testing

#### Manual Testing Checklist
- [ ] Audio initializes correctly
- [ ] All scales play correct frequencies
- [ ] Recording/playback works
- [ ] All keyboard shortcuts function
- [ ] Interface is responsive
- [ ] Works in multiple browsers
- [ ] Performance is acceptable

#### Audio Testing
- [ ] No audio artifacts or glitches
- [ ] Latency is acceptable
- [ ] Volume levels are appropriate
- [ ] Works with/without headphones
- [ ] Works on mobile devices

### 📝 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure backwards compatibility**
4. **Update CHANGELOG.md**
5. **Add yourself to contributors** if desired
6. **Link to relevant issues**

#### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tested in multiple browsers
- [ ] Audio functionality verified
- [ ] No performance regressions
- [ ] Documentation updated

## Screenshots
(if applicable)

## Related Issues
Fixes #(issue number)
```

### 🎨 Design Guidelines

#### Visual Design
- **Maintain dark theme** aesthetic
- **Use HSB color mode** consistently
- **Ensure accessibility** (contrast, color-blind friendly)
- **Keep interface minimal** when possible
- **Use consistent spacing** and typography

#### UX Principles
- **Immediate feedback** for all interactions
- **Progressive disclosure** of advanced features
- **Keyboard accessibility** for all functions
- **Mobile-friendly** touch interactions
- **Clear visual hierarchy**

### 🌍 Internationalization

#### Adding Translations
1. Add text to both language functions
2. Test with longer text strings
3. Consider cultural context
4. Maintain technical accuracy
5. Use appropriate encoding

#### Current Languages
- **Portuguese (Brazil)** - pt-BR
- **English** - en-US

#### Future Language Support
We welcome translations to other languages!

### 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

### 🙏 Recognition

Contributors will be:
- Listed in README.md
- Added to package.json contributors
- Mentioned in CHANGELOG.md
- Credited in any future publications

### 📞 Communication

- **GitHub Issues**: For bugs and features
- **GitHub Discussions**: For questions and ideas
- **Email**: For sensitive issues

---

## Português

Obrigado pelo seu interesse em contribuir para o Music Mouse! Este projeto visa honrar o trabalho pioneiro de Laurie Spiegel enquanto o traz para plataformas web modernas.

### 🌟 Formas de Contribuir

- **Relatórios de Bug**: Encontrou um bug? Nos informe!
- **Solicitações de Funcionalidade**: Tem uma ideia de melhoria?
- **Contribuições de Código**: Envie pull requests
- **Documentação**: Ajude a melhorar nossa documentação
- **Exemplos**: Crie exemplos de uso
- **Testes**: Ajude a testar em diferentes plataformas
- **Traduções**: Ajude com internacionalização

### 🚀 Começando

1. **Faça fork do repositório**
2. **Clone seu fork**:
   ```bash
   git clone https://github.com/yourusername/music-mouse.git
   cd music-mouse
   ```
3. **Crie uma branch**:
   ```bash
   git checkout -b feature/nome-da-sua-funcionalidade
   ```
4. **Faça suas alterações**
5. **Teste completamente**
6. **Envie um pull request**

### 📋 Diretrizes de Desenvolvimento

#### Estilo de Código
- Use **camelCase** para variáveis e funções JavaScript
- Use **PascalCase** para classes
- Use **UPPER_CASE** para constantes
- Adicione comentários significativos para algoritmos complexos
- Siga a indentação existente (2 espaços)

#### Desenvolvimento de Áudio
- Sempre teste recursos de áudio em múltiplos navegadores
- Considere o impacto na performance do processamento de áudio
- Use blocos try-catch para operações de áudio
- Teste com diferentes configurações de hardware de áudio

#### Melhores Práticas p5.js
- Use `push()` e `pop()` para transformações isoladas
- Minimize criação de objetos no loop `draw()`
- Use estruturas de dados apropriadas para performance
- Siga convenções de nomenclatura do p5.js

#### Documentação
- Atualize README.md para novas funcionalidades
- Adicione comentários inline para funções complexas
- Inclua exemplos de uso para novas funcionalidades
- Mantenha documentação em inglês e português

### 🐛 Relatórios de Bug

Ao relatar bugs, por favor inclua:

- **Navegador e versão**
- **Sistema operacional**
- **Passos para reproduzir**
- **Comportamento esperado**
- **Comportamento atual**
- **Screenshots ou gravações** (se aplicável)
- **Erros do console** (se houver)

### ✨ Solicitações de Funcionalidade

Para solicitações de funcionalidade, por favor forneça:

- **Descrição clara** da funcionalidade
- **Caso de uso** - por que isso é necessário?
- **Ideias de implementação** possíveis
- **Referências** a funcionalidades similares em outros lugares
- **Mockups ou esboços** (se aplicável)

### 🔧 Requisitos Técnicos

#### Suporte a Navegadores
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

#### Requisitos de Áudio
- Suporte à Web Audio API
- Acesso ao microfone (para recursos de gravação)
- Áudio de baixa latência preferível

#### Metas de Performance
- Performance sustentada de 30 FPS
- Latência de áudio <10ms quando possível
- Uso de memória <100MB
- Responsivo em displays 1920x1080

### 🎵 Diretrizes Musicais

Ao adicionar funcionalidades musicais:

- **Respeite a teoria musical** - garanta que as escalas sejam precisas
- **Considere acessibilidade** - nem todos os usuários são músicos
- **Teste com músicos** - obtenha feedback de usuários reais
- **Honre a visão da Spiegel** - mantenha-se fiel ao conceito original
- **Documente conceitos musicais** - explique teoria nos comentários

### 📚 Organização do Código

```
Estrutura do sketch.js:
├── Constantes e Configuração
├── Definições de Classes
│   ├── MusicMouseFrequencyGrid
│   ├── Métodos do Sistema de Áudio
│   ├── Métodos de UI e Desenho
│   └── Métodos de Controle
├── Funções p5.js
│   ├── setup()
│   ├── draw()
│   ├── Eventos Mouse/Touch
│   └── Eventos de Teclado
└── Funções Utilitárias
```

### 🧪 Testes

#### Lista de Verificação de Testes Manuais
- [ ] Áudio inicializa corretamente
- [ ] Todas as escalas tocam frequências corretas
- [ ] Gravação/reprodução funciona
- [ ] Todos os atalhos de teclado funcionam
- [ ] Interface é responsiva
- [ ] Funciona em múltiplos navegadores
- [ ] Performance é aceitável

#### Testes de Áudio
- [ ] Sem artefatos ou falhas de áudio
- [ ] Latência é aceitável
- [ ] Níveis de volume são apropriados
- [ ] Funciona com/sem fones de ouvido
- [ ] Funciona em dispositivos móveis

### 📝 Processo de Pull Request

1. **Atualize documentação** se necessário
2. **Adicione testes** para novas funcionalidades
3. **Garanta compatibilidade reversa**
4. **Atualize CHANGELOG.md**
5. **Adicione-se aos contribuidores** se desejar
6. **Vincule a issues relevantes**

### 🎨 Diretrizes de Design

#### Design Visual
- **Mantenha estética de tema escuro**
- **Use modo de cor HSB** consistentemente
- **Garanta acessibilidade** (contraste, amigável para daltônicos)
- **Mantenha interface minimal** quando possível
- **Use espaçamento e tipografia** consistentes

#### Princípios de UX
- **Feedback imediato** para todas as interações
- **Divulgação progressiva** de funcionalidades avançadas
- **Acessibilidade por teclado** para todas as funções
- **Interações touch amigáveis** para mobile
- **Hierarquia visual clara**

### 🌍 Internacionalização

#### Adicionando Traduções
1. Adicione texto a ambas as funções de idioma
2. Teste com strings de texto mais longas
3. Considere contexto cultural
4. Mantenha precisão técnica
5. Use codificação apropriada

#### Idiomas Atuais
- **Português (Brasil)** - pt-BR
- **Inglês** - en-US

#### Suporte Futuro a Idiomas
Recebemos bem traduções para outros idiomas!

### 📜 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a Licença MIT.

### 🙏 Reconhecimento

Contribuidores serão:
- Listados no README.md
- Adicionados aos contribuidores do package.json
- Mencionados no CHANGELOG.md
- Creditados em futuras publicações

### 📞 Comunicação

- **GitHub Issues**: Para bugs e funcionalidades
- **GitHub Discussions**: Para perguntas e ideias
- **Email**: Para questões sensíveis