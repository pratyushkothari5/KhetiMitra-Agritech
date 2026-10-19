const WeatherData = require('../models/WeatherData');
// Live forecast from Open-Meteo (free, no API key); cached in MongoDB; falls back to cache if offline.
async function getDays(req) {
  const lat = req.query.lat || 23.26, lon = req.query.lon || 77.41, loc = req.query.location || 'Bhopal';
  try {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_probability_max&hourly=relative_humidity_2m&timezone=auto&forecast_days=7`);
    const j = await r.json();
    const days = j.daily.time.map((date, i) => ({ date, location: loc, tempC: j.daily.temperature_2m_max[i], rainProb: j.daily.precipitation_probability_max[i], humidity: j.hourly.relative_humidity_2m[i * 24 + 12] }));
    await WeatherData.deleteMany({ location: loc });
    await WeatherData.insertMany(days);
    return { source: 'live', days };
  } catch { return { source: 'cache', days: await WeatherData.find({ location: loc }).sort('date') }; }
}
exports.forecast = async (req, res) => res.json(await getDays(req));
exports.alerts = async (req, res) => {
  const { days } = await getDays(req); const out = [];
  days.forEach(d => {
    if (d.rainProb > 60) out.push({ date: d.date, level: 'medium', title: 'Heavy rain expected', action: 'Delay spraying and fertiliser application.' });
    if (d.humidity > 75 && d.tempC >= 22 && d.tempC <= 32) out.push({ date: d.date, level: 'high', title: 'Fungal disease / rust risk', action: 'Inspect leaves; apply recommended fungicide early.' });
    if (d.humidity < 50 && d.tempC > 28) out.push({ date: d.date, level: 'medium', title: 'Aphid / mite risk', action: 'Monitor sticky traps; spray neem oil if needed.' });
    if (d.tempC > 38) out.push({ date: d.date, level: 'high', title: 'Heat stress', action: 'Irrigate in the evening and mulch the soil.' });
  });
  res.json(out);
};
exports.add = async (req, res) => res.status(201).json(await WeatherData.create(req.body));
