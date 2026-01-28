import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'POST') {
    const { email, password, name, mode } = req.body;
    if (mode === 'signup') {
      // Sign up
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already in use' });
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hash, full_name: name });
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({ user, token });
    } else {
      // Sign in
      const user = await User.findOne({ email });
      if (!user || !user.password) return res.status(400).json({ error: 'Invalid credentials' });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({ user, token });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
