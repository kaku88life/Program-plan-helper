import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LanguageProvider } from './context/LanguageContext';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';

function App() {
  return (
    <LanguageProvider>
      <ReactFlowProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/project/:projectId" element={<Editor />} />
          </Routes>
        </BrowserRouter>
      </ReactFlowProvider>
    </LanguageProvider>
  );
}

export default App;
