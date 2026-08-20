import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/layout/RoleSwitcherBar';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';

// Views
import { HomeScreen } from './views/HomeScreen';
import { CategoriesScreen } from './views/CategoriesScreen';
import { SearchScreen } from './views/SearchScreen';
import { TechnicianDetailScreen } from './views/TechnicianDetailScreen';
import { BookServiceScreen } from './views/BookServiceScreen';
import { OrdersScreen } from './views/OrdersScreen';
import { OrderDetailScreen } from './views/OrderDetailScreen';
import { ChatsScreen } from './views/ChatsScreen';
import { ChatRoomScreen } from './views/ChatRoomScreen';
import { FavoritesScreen } from './views/FavoritesScreen';
import { NotificationsScreen } from './views/NotificationsScreen';
import { ComplaintsScreen } from './views/ComplaintsScreen';
import { ProfileScreen } from './views/ProfileScreen';
import { AboutScreen } from './views/AboutScreen';
import { AuthLoginScreen } from './views/AuthLoginScreen';
import { AuthRegisterScreen } from './views/AuthRegisterScreen';
import { AdminDashboardScreen } from './views/admin/AdminDashboardScreen';
import { TechDashboardScreen } from './views/tech/TechDashboardScreen';
import { TechServicesScreen } from './views/tech/TechServicesScreen';
import { SettingsScreen } from './views/SettingsScreen';
import { FlutterExportScreen } from './views/FlutterExportScreen';

const MainRouter: React.FC = () => {
  const { currentScreen } = useApp();

  const isAuthScreen = currentScreen === 'auth_login' || currentScreen === 'auth_register';

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'search':
        return <SearchScreen />;
      case 'technician_detail':
        return <TechnicianDetailScreen />;
      case 'book_service':
        return <BookServiceScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'order_detail':
        return <OrderDetailScreen />;
      case 'chats':
        return <ChatsScreen />;
      case 'chat_room':
        return <ChatRoomScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'complaints':
        return <ComplaintsScreen />;
      case 'profile':
      case 'tech_profile_edit':
        return <ProfileScreen />;
      case 'tech_dashboard':
        return <TechDashboardScreen />;
      case 'tech_services':
        return <TechServicesScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'flutter_export':
        return <FlutterExportScreen />;
      case 'about':
        return <AboutScreen />;
      case 'auth_login':
        return <AuthLoginScreen />;
      case 'auth_register':
        return <AuthRegisterScreen />;
      case 'admin_dashboard':
      case 'admin_users':
      case 'admin_technicians':
      case 'admin_categories':
      case 'admin_orders':
      case 'admin_complaints':
      case 'admin_offers':
      case 'admin_stats':
        return <AdminDashboardScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white" dir="rtl">
      {/* Top Testing Role Switcher */}
      <RoleSwitcherBar />

      {/* Main App Navbar (except full auth pages if desired) */}
      <Navbar />

      {/* Primary Page Canvas Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 pt-4 pb-20 sm:pb-10">
        {renderScreen()}
      </main>

      {/* Bottom Navigation for Mobile & Responsive */}
      {!isAuthScreen && currentScreen !== 'chat_room' && <BottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
