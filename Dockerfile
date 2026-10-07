FROM node:22-bookworm-slim AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:22-bookworm-slim

ENV NODE_ENV=production \
    PUPPETEER_SKIP_DOWNLOAD=true \
    TECTONIC_PATH=/usr/local/bin/tectonic \
    XDG_CACHE_HOME=/home/node/.cache

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl fontconfig \
    && rm -rf /var/lib/apt/lists/*

# Pin and verify the official Linux x86_64 compiler release.
RUN curl -fL --retry 3 \
    "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.17.0/tectonic-0.17.0-x86_64-unknown-linux-musl.tar.gz" \
    -o /tmp/tectonic.tar.gz \
    && echo "8533d07f9ccbd7a65824b9e0459041bca34af1eb33daba48f59215593753a3b7  /tmp/tectonic.tar.gz" | sha256sum -c - \
    && tar -xzf /tmp/tectonic.tar.gz -C /usr/local/bin tectonic \
    && chmod +x /usr/local/bin/tectonic \
    && rm /tmp/tectonic.tar.gz \
    && tectonic --version

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

RUN mkdir -p /home/node/.cache \
    && chown -R node:node /home/node/.cache
USER node

# Bake the resume template's TeX cache into the image before serving users.
RUN mkdir -p /tmp/latex-warm \
    && node -e "const fs = require('node:fs'); const { renderResumeLatex } = require('./src/services/resume-latex.service'); fs.writeFileSync('/tmp/latex-warm/resume.tex', renderResumeLatex({ name: 'Deployment Test', skills: [{ category: 'Languages', items: 'JavaScript' }], suggestedAdditions: [{ skill: 'Docker', recommendation: 'Build a practice project.' }] }, { highlighted: true }));" \
    && tectonic -X compile --untrusted --outdir /tmp/latex-warm /tmp/latex-warm/resume.tex \
    && rm -rf /tmp/latex-warm

EXPOSE 3000
CMD ["node", "server.js"]
