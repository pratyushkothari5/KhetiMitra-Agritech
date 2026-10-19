import { createContext, useContext, useState } from 'react';
const D = {
  en: { dashboard: 'Dashboard', farms: 'My Farm', soil: 'Soil', weather: 'Weather & Pests', market: 'Market', community: 'Community', admin: 'Admin', logout: 'Sign out', login: 'Sign in', register: 'Create account', namaste: 'Namaste', sub: 'Your farm at a glance today.', farmsN: 'Farms', cropsN: 'Crops', ordersN: 'Orders', yield: 'Expected yield (t/ha)', analyse: 'Analyse soil', addCart: 'Add to cart', checkout: 'Place order', ask: 'Post' },
  hi: { dashboard: 'डैशबोर्ड', farms: 'मेरा खेत', soil: 'मिट्टी', weather: 'मौसम और कीट', market: 'बाज़ार', community: 'समुदाय', admin: 'एडमिन', logout: 'साइन आउट', login: 'साइन इन', register: 'खाता बनाएँ', namaste: 'नमस्ते', sub: 'आज आपके खेत की झलक।', farmsN: 'खेत', cropsN: 'फ़सलें', ordersN: 'ऑर्डर', yield: 'अनुमानित उपज (टन/हे.)', analyse: 'मिट्टी जाँचें', addCart: 'कार्ट में जोड़ें', checkout: 'ऑर्डर करें', ask: 'पोस्ट करें' }
};
const Ctx = createContext();
export const LangProvider = ({ children }) => {
  const [lang, setLangState] = useState(localStorage.getItem('lang') || 'en');
  const setLang = l => { localStorage.setItem('lang', l); setLangState(l); };
  return <Ctx.Provider value={{ lang, setLang, t: k => D[lang][k] || k }}>{children}</Ctx.Provider>;
};
export const useLang = () => useContext(Ctx);
