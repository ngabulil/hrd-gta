import { createRoot } from "react-dom/client";
import "./index.css";
import 'swiper/css';
import 'swiper/css/pagination';
import App from "./App.jsx";

// 🌙 Apply dark mode from saved or system preference
if (
  localStorage.theme === 'dark' ||
  (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById("root")).render(<App />);
