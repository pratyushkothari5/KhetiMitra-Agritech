exports.analyse = (req, res) => {
  const ph = Number(req.body.ph), n = Number(req.body.nitrogen), m = Number(req.body.moisture ?? 60);
  if ([ph, n, m].some(Number.isNaN)) return res.status(400).json({ message: 'ph, nitrogen and moisture must be numbers' });
  const advice = [];
  advice.push(ph < 6 ? 'Soil is acidic: apply agricultural lime (about 2 quintal/acre).' : ph > 7.5 ? 'Soil is alkaline: add gypsum and organic compost.' : 'pH is in the ideal range.');
  advice.push(n < 180 ? 'Low nitrogen: top-dress with urea (about 20 kg/acre).' : 'Nitrogen level is adequate.');
  advice.push(m < 40 ? 'Moisture is low: irrigate within 24 hours.' : m > 75 ? 'Soil is waterlogged: improve drainage.' : 'Moisture is optimal.');
  const score = Math.round(Math.max(20, Math.min(100, 100 - Math.abs(ph - 6.8) * 18 - (n < 180 ? 15 : 0) - (m < 40 || m > 75 ? 12 : 0))));
  res.json({ score, rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs attention', advice });
};
