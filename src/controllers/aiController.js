import { generateDescription } from '../services/aiService.js';


async function generateDescriptionHandler(req, res) {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'title is required' });
    const { description } = await generateDescription({ title });
    return res.json({ description });
  } catch (err) {
    console.error('AI generation error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export { generateDescriptionHandler };