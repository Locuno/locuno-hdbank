import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { FamilyDashboard } from '@/pages/family/FamilyDashboard';
import { CommunityDashboard } from '@/pages/community/CommunityDashboard';
import { RewardsPage } from '@/pages/RewardsPage';
import { MyAuctionsPage } from './pages/MyAuctionsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/family" element={<FamilyDashboard />} />
        <Route path="/community" element={<CommunityDashboard />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/my-auctions" element={<MyAuctionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
