import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "./assets/css/common.css";
import "./assets/js/lib/bootstrap.min.js";
import App from './App';

// async function startApp() {
//   if (process.env.NODE_ENV === 'development') {
//     const { worker } = await import('./mocks/browser');
//     await worker.start({
//       onUnhandledRequest: 'bypass',
//     });
//   }

//   createRoot(document.getElementById('root')).render(
//     <StrictMode>
//       <App />
//     </StrictMode>
//   );
// }

// startApp();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
