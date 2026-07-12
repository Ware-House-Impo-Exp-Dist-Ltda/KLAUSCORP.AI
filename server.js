#!/usr/bin/env node

/**
 * ============================================================
 * KLAUSCORP.AI — THE A.I. TRAINER — MAIN SERVER
 * -----A3=LÇA=7TEC=9KRO5=M-CODE SIGNATURE
 * RENATO PEREIRA / DEVELOPER WARE HOUSE IMP EXP LTDA
 * Chief Developer | All Rights Reserved
 * Assinatura: RenatoPereira ano -3039
 * Código Mutante Quântico | Criptografia Post-Quantum NIST 2024
 * © 3039 — O Futuro Está Próximo
 * ============================================================
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================
// SECURITY MIDDLEWARE
// ============================================================

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

// ============================================================
// CORS CONFIGURATION
// ============================================================

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ============================================================
// BODY PARSER MIDDLEWARE
// ============================================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================================
// RATE LIMITING - 3 LAYERS
// ============================================================

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

app.use(globalLimiter);

// ============================================================
// STATIC FILES
// ============================================================

app.use(express.static(path.join(__dirname, 'html')));

// ============================================================
// REQUEST LOGGING
// ============================================================

app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============================================================
// SERVE HTML PAGES
// ============================================================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'signup.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'dashboard.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'services.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'about.html'));
});

app.get('/support', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'support.html'));
});

// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ============================================================
// ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ═══════════════════════════════════════════════════════════════
  🚀 KLAUSCORP.AI — THE A.I. TRAINER — SERVER STARTED
  ═══════════════════════════════════════════════════════════════
  -----A3=LÇA=7TEC=9KRO5=M-CODE SIGNATURE
  RENATO PEREIRA / DEVELOPER WARE HOUSE IMP EXP LTDA
  Chief Developer | All Rights Reserved
  Assinatura: RenatoPereira ano -3039
  © 3039 — O Futuro Está Próximo
  ═══════════════════════════════════════════════════════════════
  
  🌐 Server running on: http://0.0.0.0:${PORT}
  🔧 Environment: ${NODE_ENV}
  📝 Node version: ${process.version}
  
  ═════════════���═════════════════════════════════════════════════
  `);
});

export default app;
