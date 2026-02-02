import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './features/dashboard/Dashboard';
import { LearningList } from './features/learning-list/LearningList';
import { ActivityLog } from './features/activity-log/ActivityLog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="items" element={<LearningList />} />
          <Route path="history" element={<ActivityLog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
