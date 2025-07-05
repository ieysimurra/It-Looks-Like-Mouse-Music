# 🚀 Deployment Guide - Music Mouse Interactive

[🇧🇷 Português](#português) | [🇺🇸 English](#english)

---

## English

This guide provides comprehensive instructions for deploying Music Mouse Interactive to various hosting platforms and environments.

### 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] **Tested the application** in multiple browsers
- [ ] **Verified audio functionality** across different devices
- [ ] **Optimized assets** (images, audio files)
- [ ] **Updated documentation** (README, CHANGELOG)
- [ ] **Ran security checks** (npm audit, dependency scanning)
- [ ] **Tested mobile compatibility**
- [ ] **Verified performance metrics** (Lighthouse scores)
- [ ] **Updated version numbers** in package.json

### 🌐 Static Hosting Platforms

#### GitHub Pages (Free)

**Pros**: Free, automatic deployment, custom domains
**Cons**: Public repositories only for free tier, limited compute

**Setup Steps**:

1. **Enable GitHub Pages**
   ```bash
   # In your repository settings
   Settings → Pages → Source: Deploy from branch → main
   ```

2. **Automatic Deployment Workflow** (already configured in `.github/workflows/`)
   ```yaml
   # The CI/CD pipeline automatically deploys on push to main
   ```

3. **Access Your Site**
   ```
   https://yourusername.github.io/music-mouse/
   ```

4. **Custom Domain** (optional)
   - Add `CNAME` file with your domain
   - Configure DNS settings
   - Enable HTTPS in repository settings

#### Netlify (Free Tier + Pro)

**Pros**: Great performance, branch previews, form handling
**Cons**: Build minutes limited on free tier

**Setup Steps**:

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect GitHub account
   - Select repository

2. **Build Configuration**
   ```toml
   # netlify.toml (already included)
   [build]
   publish = "."
   command = "echo 'No build needed'"
   ```

3. **Deploy Settings**
   - Build command: (leave empty)
   - Publish directory: `.` (root)
   - Node version: 18

4. **Custom Domain**
   - Domain settings → Add custom domain
   - Configure DNS
   - SSL automatically provided

**Advanced Netlify Features**:
```toml
# Branch deploys
[context.branch-deploy]
command = "echo 'Branch deploy'"

# Environment variables
[build.environment]
NODE_ENV = "production"

# Headers for performance
[[headers]]
for = "*.js"
[headers.values]
Cache-Control = "public, max-age=86400"
```

#### Vercel (Free Tier + Pro)

**Pros**: Excellent performance, global CDN, automatic HTTPS
**Cons**: Function execution limits on free tier

**Setup Steps**:

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect GitHub
   - Select repository

2. **Configuration**
   ```json
   // vercel.json (optional)
   {
     "builds": [
       {
         "src": "*.html",
         "use": "@vercel/static"
       }
     ],
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           }
         ]
       }
     ]
   }
   ```

3. **Automatic Deployment**
   - Deploys automatically on git push
   - Preview deployments for PRs
   - Production deployment from main branch

#### Firebase Hosting (Free Tier + Paid)

**Pros**: Google infrastructure, good analytics, PWA support
**Cons**: Requires Firebase project setup

**Setup Steps**:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Project**
   ```bash
   firebase init hosting
   # Select existing project or create new
   # Public directory: . (current directory)
   # Single page app: No
   # Overwrite index.html: No
   ```

3. **Deploy**
   ```bash
   firebase deploy --only hosting
   ```

4. **Automatic Deployment**
   ```yaml
   # .github/workflows/firebase.yml
   name: Deploy to Firebase
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: w9jds/firebase-action@master
           with:
             args: deploy --only hosting
           env:
             FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
   ```

### 🏗️ Self-Hosted Deployment

#### Basic Web Server

**Requirements**:
- Web server (Apache, Nginx, IIS)
- HTTPS certificate (required for Web Audio API)
- Proper MIME types configured

**Nginx Configuration**:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /var/www/music-mouse;
    index index.html;
    
    # MIME types for audio
    location ~* \.(mp3|wav|ogg|m4a)$ {
        add_header Cache-Control "public, max-age=604800";
        add_header Access-Control-Allow-Origin "*";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript;
    
    # Fallback for SPA behavior
    try_files $uri $uri/ /index.html;
}
```

**Apache Configuration**:
```apache
<VirtualHost *:443>
    ServerName yourdomain.com
    DocumentRoot /var/www/music-mouse
    
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    # MIME types
    AddType audio/mpeg .mp3
    AddType audio/wav .wav
    AddType audio/ogg .ogg
    
    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    
    # Compression
    LoadModule deflate_module modules/mod_deflate.so
    SetOutputFilter DEFLATE
    
    # Cache control
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType audio/* "access plus 1 week"
</VirtualHost>
```

#### Docker Deployment

**Dockerfile**:
```dockerfile
FROM nginx:alpine

# Copy application files
COPY . /usr/share/nginx/html

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Add security headers
RUN echo 'add_header X-Frame-Options "SAMEORIGIN";' >> /etc/nginx/conf.d/security.conf
RUN echo 'add_header X-Content-Type-Options "nosniff";' >> /etc/nginx/conf.d/security.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose**:
```yaml
version: '3.8'
services:
  music-mouse:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
    environment:
      - NGINX_HOST=yourdomain.com
    restart: unless-stopped
```

**Deploy Commands**:
```bash
# Build and run
docker-compose up -d

# Update deployment
docker-compose pull
docker-compose up -d --force-recreate
```

#### Node.js Server (Development)

**Simple Server** (`server.js`):
```javascript
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Serve static files
app.use(express.static('.'));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Music Mouse server running on port ${PORT}`);
});
```

### 🔧 Performance Optimization

#### Asset Optimization

**Image Optimization**:
```bash
# Install optimization tools
npm install -g imagemin-cli

# Optimize images
imagemin assets/images/* --out-dir=assets/images/optimized

# WebP conversion
cwebp assets/images/screenshot.png -o assets/images/screenshot.webp
```

**Audio Optimization**:
```bash
# Compress audio files
ffmpeg -i input.wav -c:a libvorbis -q:a 4 output.ogg
ffmpeg -i input.wav -c:a aac -b:a 128k output.m4a
```

**JavaScript Minification** (if needed):
```bash
# Install terser
npm install -g terser

# Minify JavaScript
terser sketch.js -o sketch.min.js --compress --mangle
```

#### CDN Configuration

**Cloudflare Setup**:
1. Add site to Cloudflare
2. Update DNS records
3. Enable caching rules:
   - HTML: Cache everything, edge TTL 2 hours
   - CSS/JS: Cache everything, edge TTL 1 month
   - Images: Cache everything, edge TTL 1 month
   - Audio: Cache everything, edge TTL 1 week

**AWS CloudFront Setup**:
```json
{
  "Origins": [{
    "DomainName": "yourdomain.com",
    "Id": "music-mouse-origin",
    "CustomOriginConfig": {
      "HTTPPort": 443,
      "OriginProtocolPolicy": "https-only"
    }
  }],
  "DefaultCacheBehavior": {
    "TargetOriginId": "music-mouse-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "optimized-caching"
  }
}
```

### 📊 Monitoring and Analytics

#### Google Analytics Setup

1. **Add tracking code** to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

2. **Track custom events**:
```javascript
// Track scale changes
gtag('event', 'scale_change', {
  'event_category': 'music',
  'event_label': scaleName
});

// Track audio start
gtag('event', 'audio_start', {
  'event_category': 'engagement'
});
```

#### Performance Monitoring

**Lighthouse CI** (already configured):
```yaml
# .github/workflows/lighthouse.yml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v8
  with:
    configPath: '.github/lighthouse-config.json'
```

**Web Vitals Monitoring**:
```javascript
// Add to index.html
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### 🔒 Security Considerations

#### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  media-src 'self' blob: data:;
  connect-src 'self' https://cdnjs.cloudflare.com;
  worker-src 'self' blob:;
">
```

#### HTTPS Configuration

**Let's Encrypt (Certbot)**:
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Security Headers

```nginx
# Nginx security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### 🧪 Testing Deployment

#### Pre-deployment Testing

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run tests
npm test

# Check for security vulnerabilities
npm audit

# Test in multiple browsers
npm run test:browsers
```

#### Post-deployment Verification

```bash
# Check HTTPS
curl -I https://yourdomain.com

# Test audio loading
curl -I https://yourdomain.com/assets/audio/demo.mp3

# Verify headers
curl -I https://yourdomain.com | grep -i security

# Test mobile
# Use browser dev tools or BrowserStack
```

#### Load Testing

```bash
# Install artillery
npm install -g artillery

# Create load test config
# artillery.yml
config:
  target: 'https://yourdomain.com'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - flow:
    - get:
        url: '/'

# Run load test
artillery run artillery.yml
```

### 🔄 Continuous Deployment

#### GitHub Actions Workflow

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Security audit
        run: npm audit --audit-level moderate
        
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
        run: |
          # Your deployment script here
          ./deploy.sh
```

#### Blue-Green Deployment

```bash
#!/bin/bash
# deploy.sh

# Build new version
docker build -t music-mouse:new .

# Test new version
docker run -d --name music-mouse-test -p 8080:80 music-mouse:new
sleep 10
if curl -f http://localhost:8080/health; then
  echo "Health check passed"
else
  echo "Health check failed"
  docker stop music-mouse-test
  docker rm music-mouse-test
  exit 1
fi

# Switch traffic
docker stop music-mouse-current || true
docker rm music-mouse-current || true
docker run -d --name music-mouse-current -p 80:80 music-mouse:new

# Cleanup
docker stop music-mouse-test
docker rm music-mouse-test
```

### 📱 Mobile-Specific Deployment

#### Progressive Web App (PWA)

**Manifest** (`manifest.json`):
```json
{
  "name": "Music Mouse Interactive",
  "short_name": "Music Mouse",
  "description": "Interactive frequency grid for musical exploration",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#e91e63",
  "icons": [
    {
      "src": "assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Service Worker** (`sw.js`):
```javascript
const CACHE_NAME = 'music-mouse-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/sketch.js',
  '/style.css',
  'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### 🆘 Troubleshooting Deployment

#### Common Issues

**HTTPS Required for Web Audio**:
```bash
# Symptoms: Audio doesn't work in production
# Solution: Ensure HTTPS is properly configured
curl -I https://yourdomain.com | grep -i "strict-transport-security"
```

**CORS Issues with Audio Files**:
```nginx
# Add to nginx config
location ~* \.(mp3|wav|ogg)$ {
    add_header Access-Control-Allow-Origin "*";
    add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS";
}
```

**Missing MIME Types**:
```apache
# Add to .htaccess or apache config
AddType audio/mpeg .mp3
AddType audio/wav .wav
AddType audio/ogg .ogg
AddType application/json .json
```

**Performance Issues**:
```bash
# Check gzip compression
curl -H "Accept-Encoding: gzip" -I https://yourdomain.com

# Check caching headers
curl -I https://yourdomain.com/sketch.js | grep -i cache
```

---

## Português

Este guia fornece instruções abrangentes para fazer deploy do Music Mouse Interactive em várias plataformas de hospedagem e ambientes.

### 📋 Lista de Verificação Pré-Deploy

Antes de fazer o deploy, certifique-se de que você tem:

- [ ] **Testou a aplicação** em múltiplos navegadores
- [ ] **Verificou funcionalidade de áudio** em diferentes dispositivos
- [ ] **Otimizou assets** (imagens, arquivos de áudio)
- [ ] **Atualizou documentação** (README, CHANGELOG)
- [ ] **Executou verificações de segurança** (npm audit, escaneamento de dependências)
- [ ] **Testou compatibilidade móvel**
- [ ] **Verificou métricas de performance** (pontuações Lighthouse)
- [ ] **Atualizou números de versão** no package.json

### 🌐 Plataformas de Hospedagem Estática

#### GitHub Pages (Gratuito)

**Prós**: Gratuito, deploy automático, domínios customizados
**Contras**: Apenas repositórios públicos no tier gratuito, computação limitada

**Passos de Configuração**:

1. **Habilitar GitHub Pages**
   ```bash
   # Nas configurações do seu repositório
   Settings → Pages → Source: Deploy from branch → main
   ```

2. **Workflow de Deploy Automático** (já configurado em `.github/workflows/`)
   ```yaml
   # O pipeline CI/CD automaticamente faz deploy no push para main
   ```

3. **Acessar Seu Site**
   ```
   https://yourusername.github.io/music-mouse/
   ```

#### Netlify (Tier Gratuito + Pro)

**Prós**: Excelente performance, previews de branch, manipulação de formulários
**Contras**: Minutos de build limitados no tier gratuito

**Passos de Configuração**:

1. **Conectar Repositório**
   - Vá para [netlify.com](https://netlify.com)
   - Clique "New site from Git"
   - Conecte conta GitHub
   - Selecione repositório

2. **Configuração de Build**
   ```toml
   # netlify.toml (já incluído)
   [build]
   publish = "."
   command = "echo 'No build needed'"
   ```

### 🔧 Otimização de Performance

#### Otimização de Assets

**Otimização de Imagens**:
```bash
# Instalar ferramentas de otimização
npm install -g imagemin-cli

# Otimizar imagens
imagemin assets/images/* --out-dir=assets/images/optimized
```

**Otimização de Áudio**:
```bash
# Comprimir arquivos de áudio
ffmpeg -i input.wav -c:a libvorbis -q:a 4 output.ogg
ffmpeg -i input.wav -c:a aac -b:a 128k output.m4a
```

### 🔒 Considerações de Segurança

#### Política de Segurança de Conteúdo

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline';
  media-src 'self' blob: data:;
">
```

### 📱 Deploy Específico para Mobile

#### Progressive Web App (PWA)

**Manifest** (`manifest.json`):
```json
{
  "name": "Music Mouse Interactive",
  "short_name": "Music Mouse",
  "description": "Grade de frequências interativa para exploração musical",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#e91e63"
}
```

### 🆘 Solução de Problemas de Deploy

#### Problemas Comuns

**HTTPS Obrigatório para Web Audio**:
```bash
# Sintomas: Áudio não funciona em produção
# Solução: Garantir que HTTPS está configurado corretamente
curl -I https://seudominio.com | grep -i "strict-transport-security"
```

**Problemas de CORS com Arquivos de Áudio**:
```nginx
# Adicionar ao config nginx
location ~* \.(mp3|wav|ogg)$ {
    add_header Access-Control-Allow-Origin "*";
    add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS";
}
```

---

*Para suporte adicional com deploy, consulte nossa [documentação completa](../README.md) ou entre em contato através dos canais da comunidade.*