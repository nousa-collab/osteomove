import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) throw new Error('JWT_SECRET doit contenir au moins 32 caractères.');
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

interface AuthRequest extends Request { userId?: string }
const userSchema = new Schema({ name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 }, email: { type: String, required: true, unique: true, lowercase: true, trim: true }, passwordHash: { type: String, required: true } }, { timestamps: true });
const User = mongoose.model('User', userSchema);
const logSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, exerciseId: { type: String, required: true }, date: { type: String, required: true }, durationMinutes: { type: Number, required: true, min: 1, max: 600 } }, { timestamps: true });
const Activity = mongoose.model('Activity', logSchema);
const goalSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, weeklySessions: { type: Number, min: 1, max: 7, default: 4 }, weeklyMinutes: { type: Number, min: 10, max: 300, default: 60 } });
const Goal = mongoose.model('Goal', goalSchema);

function setSession(res: Response, userId: string) {
  const token = jwt.sign({ sub: userId }, JWT_SECRET!, { expiresIn: '7d' });
  res.cookie('osteomove_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' });
}
function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.osteomove_session;
  if (!token) return res.status(401).json({ message: 'Connexion requise.' });
  try { const payload = jwt.verify(token, JWT_SECRET!) as jwt.JwtPayload; req.userId = String(payload.sub); next(); }
  catch { res.clearCookie('osteomove_session', { path: '/' }); return res.status(401).json({ message: 'Session expirée. Reconnectez-vous.' }); }
}
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Trop de tentatives. Réessayez dans quelques minutes.' } });
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) return res.status(400).json({ message: 'Nom invalide.' });
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Adresse e-mail invalide.' });
    if (typeof password !== 'string' || password.length < 10 || password.length > 128) return res.status(400).json({ message: 'Le mot de passe doit contenir entre 10 et 128 caractères.' });
    if (await User.exists({ email: email.toLowerCase().trim() })) return res.status(409).json({ message: 'Cette adresse e-mail est déjà utilisée.' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), passwordHash });
    setSession(res, String(user._id));
    res.status(201).json({ user: { name: user.name, email: user.email } });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Impossible de créer le compte pour le moment.' }); }
});
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string') return res.status(400).json({ message: 'E-mail et mot de passe requis.' });
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Adresse e-mail ou mot de passe incorrect.' });
    setSession(res, String(user._id)); res.json({ user: { name: user.name, email: user.email } });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Erreur de connexion.' }); }
});
app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res) => { const user = await User.findById(req.userId).select('name email'); if (!user) return res.status(401).json({ message: 'Compte introuvable.' }); res.json({ user }); });
app.post('/api/auth/logout', (_req, res) => { res.clearCookie('osteomove_session', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' }); res.json({ message: 'Déconnexion effectuée.' }); });

app.get('/api/progress', requireAuth, async (req: AuthRequest, res) => {
  const [logs, goal] = await Promise.all([Activity.find({ userId: req.userId }).sort({ date: -1 }).limit(500).lean(), Goal.findOne({ userId: req.userId }).lean()]);
  res.json({ logs: logs.map(({ exerciseId, date, durationMinutes }) => ({ exerciseId, date, durationMinutes })), goals: { weeklySessions: goal?.weeklySessions ?? 4, weeklyMinutes: goal?.weeklyMinutes ?? 60 } });
});
app.put('/api/progress', requireAuth, async (req: AuthRequest, res) => {
  const { logs, goals } = req.body ?? {};
  if (!Array.isArray(logs) || logs.length > 500 || !goals || !Number.isInteger(goals.weeklySessions) || goals.weeklySessions < 1 || goals.weeklySessions > 7 || !Number.isInteger(goals.weeklyMinutes) || goals.weeklyMinutes < 10 || goals.weeklyMinutes > 300) return res.status(400).json({ message: 'Données de progression invalides.' });
  const safeLogs = logs.filter((l: any) => typeof l.exerciseId === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(l.date) && Number.isInteger(l.durationMinutes) && l.durationMinutes >= 1 && l.durationMinutes <= 600);
  await Activity.deleteMany({ userId: req.userId });
  if (safeLogs.length) await Activity.insertMany(safeLogs.map((l: any) => ({ ...l, userId: req.userId })));
  await Goal.findOneAndUpdate({ userId: req.userId }, { ...goals, userId: req.userId }, { upsert: true, new: true, runValidators: true });
  res.json({ message: 'Progression synchronisée.', savedLogs: safeLogs.length });
});

const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false });
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body ?? {};
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 80 || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof message !== 'string' || message.trim().length < 10 || message.length > 5000) return res.status(400).json({ message: 'Veuillez vérifier les champs du formulaire.' });
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.CONTACT_TO) return res.status(503).json({ message: 'Le service de contact n’est pas encore configuré. Réessayez plus tard.' });
  try {
    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
    await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to: process.env.CONTACT_TO, replyTo: email, subject: `Message OsteoMove de ${name.trim()}`, text: `Nom : ${name.trim()}\nE-mail : ${email}\n\n${message.trim()}` });
    res.json({ message: 'Votre message a bien été envoyé.' });
  } catch (error) { console.error('Contact email error:', error); res.status(502).json({ message: 'L’envoi du message a échoué. Veuillez réessayer plus tard.' }); }
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => { console.error(err); res.status(500).json({ message: 'Erreur interne du serveur.' }); });
await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/osteomove');
app.listen(PORT, () => console.log(`OsteoMove API démarrée sur http://localhost:${PORT}`));
