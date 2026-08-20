import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppUser,
  TechnicianProfile,
  ServiceCategory,
  Booking,
  BookingStatus,
  Review,
  ChatConversation,
  ChatMessage,
  AppNotification,
  Complaint,
  Offer,
  FilterOptions,
  PaymentStatus,
  UserRole,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_TECHNICIANS,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COMPLAINTS,
  INITIAL_OFFERS,
} from '../data/mockData';

export type ScreenType =
  | 'home'
  | 'categories'
  | 'search'
  | 'technician_detail'
  | 'book_service'
  | 'orders'
  | 'order_detail'
  | 'chats'
  | 'chat_room'
  | 'favorites'
  | 'notifications'
  | 'complaints'
  | 'profile'
  | 'about'
  | 'settings'
  | 'tech_dashboard'
  | 'tech_services'
  | 'tech_profile_edit'
  | 'admin_dashboard'
  | 'admin_users'
  | 'admin_technicians'
  | 'admin_categories'
  | 'admin_orders'
  | 'admin_complaints'
  | 'admin_offers'
  | 'admin_stats'
  | 'flutter_export'
  | 'auth_login'
  | 'auth_register';

interface AppContextType {
  // Navigation
  currentScreen: ScreenType;
  navigateTo: (screen: ScreenType, params?: Record<string, any>) => void;
  screenParams: Record<string, any>;
  goBack: () => void;
  history: ScreenType[];

  // Auth & User
  currentUser: AppUser;
  switchUser: (userId: string) => void;
  loginUser: (phoneOrEmail: string, role: UserRole) => boolean;
  registerUser: (userData: Partial<AppUser>) => AppUser;
  logoutUser: () => void;
  updateCurrentUserProfile: (data: Partial<AppUser>) => void;

  // Data Collections
  users: AppUser[];
  categories: ServiceCategory[];
  technicians: TechnicianProfile[];
  bookings: Booking[];
  reviews: Review[];
  conversations: ChatConversation[];
  notifications: AppNotification[];
  complaints: Complaint[];
  offers: Offer[];
  favorites: string[]; // technician IDs

  // Selected entities
  selectedTechnicianId: string | null;
  setSelectedTechnicianId: (id: string | null) => void;
  selectedBookingId: string | null;
  setSelectedBookingId: (id: string | null) => void;
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;

  // Search & Filter
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilter: () => void;

  // Actions
  toggleFavorite: (techId: string) => void;
  isFavorite: (techId: string) => boolean;

  // Bookings
  createBooking: (data: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus, reason?: string) => void;
  updateBookingPayment: (bookingId: string, paymentStatus: PaymentStatus) => void;
  submitBookingReview: (bookingId: string, rating: number, comment: string) => void;

  // Chat
  sendMessage: (conversationId: string, text: string, image?: string) => void;
  startOrOpenChat: (technicianId: string, customerId?: string, bookingId?: string) => string;
  markConversationAsRead: (conversationId: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  sendSystemNotification: (userId: string, title: string, body: string, type?: AppNotification['type'], linkId?: string) => void;
  broadcastNotification: (title: string, body: string, targetRole?: UserRole | 'all') => void;

  // Technicians
  toggleTechnicianAvailability: (techId: string) => void;
  updateTechnicianProfileData: (techId: string, data: Partial<TechnicianProfile>) => void;
  approveTechnician: (techId: string) => void;
  rejectTechnician: (techId: string) => void;

  // Complaints
  submitComplaint: (data: Omit<Complaint, 'id' | 'complaintNumber' | 'createdAt' | 'status'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status'], resolutionNotes?: string) => void;

  // Admin Categories & Offers
  addCategory: (cat: Omit<ServiceCategory, 'id' | 'techniciansCount'>) => void;
  updateCategory: (id: string, cat: Partial<ServiceCategory>) => void;
  deleteCategory: (id: string) => void;
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  deleteOffer: (id: string) => void;
  toggleOfferActive: (id: string) => void;
  toggleUserStatus: (userId: string, status: 'active' | 'suspended') => void;

  // Reset
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'khadamati_users_v1',
  CATEGORIES: 'khadamati_cats_v1',
  TECHNICIANS: 'khadamati_techs_v1',
  BOOKINGS: 'khadamati_books_v1',
  REVIEWS: 'khadamati_revs_v1',
  CONVERSATIONS: 'khadamati_convs_v1',
  NOTIFICATIONS: 'khadamati_notifs_v1',
  COMPLAINTS: 'khadamati_comps_v1',
  OFFERS: 'khadamati_offers_v1',
  FAVORITES: 'khadamati_favs_v1',
  CURRENT_USER_ID: 'khadamati_current_uid_v1',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Failed to load localStorage for key:', key, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage for key:', key, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [history, setHistory] = useState<ScreenType[]>(['home']);
  const [screenParams, setScreenParams] = useState<Record<string, any>>({});

  // Core Data Collections
  const [users, setUsers] = useState<AppUser[]>(() => loadStorage(STORAGE_KEYS.USERS, INITIAL_USERS));
  const [categories, setCategories] = useState<ServiceCategory[]>(() => loadStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES));
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>(() => loadStorage(STORAGE_KEYS.TECHNICIANS, INITIAL_TECHNICIANS));
  const [bookings, setBookings] = useState<Booking[]>(() => loadStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS));
  const [reviews, setReviews] = useState<Review[]>(() => loadStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS));
  const [conversations, setConversations] = useState<ChatConversation[]>(() => loadStorage(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS));
  const [complaints, setComplaints] = useState<Complaint[]>(() => loadStorage(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS));
  const [offers, setOffers] = useState<Offer[]>(() => loadStorage(STORAGE_KEYS.OFFERS, INITIAL_OFFERS));
  const [favorites, setFavorites] = useState<string[]>(() => loadStorage(STORAGE_KEYS.FAVORITES, ['user_tech_1', 'user_tech_2']));

  // Active User
  const [currentUserId, setCurrentUserId] = useState<string>(() => loadStorage(STORAGE_KEYS.CURRENT_USER_ID, 'user_cust_1'));

  // Selected State
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | null>('user_tech_1');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>('book_101');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('conv_1');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Filters
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sortBy: 'rating',
  });

  // Current User Object
  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || INITIAL_USERS[0];

  // Sync to localStorage
  useEffect(() => saveStorage(STORAGE_KEYS.USERS, users), [users]);
  useEffect(() => saveStorage(STORAGE_KEYS.CATEGORIES, categories), [categories]);
  useEffect(() => saveStorage(STORAGE_KEYS.TECHNICIANS, technicians), [technicians]);
  useEffect(() => saveStorage(STORAGE_KEYS.BOOKINGS, bookings), [bookings]);
  useEffect(() => saveStorage(STORAGE_KEYS.REVIEWS, reviews), [reviews]);
  useEffect(() => saveStorage(STORAGE_KEYS.CONVERSATIONS, conversations), [conversations]);
  useEffect(() => saveStorage(STORAGE_KEYS.NOTIFICATIONS, notifications), [notifications]);
  useEffect(() => saveStorage(STORAGE_KEYS.COMPLAINTS, complaints), [complaints]);
  useEffect(() => saveStorage(STORAGE_KEYS.OFFERS, offers), [offers]);
  useEffect(() => saveStorage(STORAGE_KEYS.FAVORITES, favorites), [favorites]);
  useEffect(() => saveStorage(STORAGE_KEYS.CURRENT_USER_ID, currentUserId), [currentUserId]);

  // Navigation handlers
  const navigateTo = (screen: ScreenType, params?: Record<string, any>) => {
    setHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    if (params) {
      setScreenParams(params);
      if (params.technicianId) setSelectedTechnicianId(params.technicianId);
      if (params.bookingId) setSelectedBookingId(params.bookingId);
      if (params.conversationId) setSelectedConversationId(params.conversationId);
      if (params.categoryId) setSelectedCategoryId(params.categoryId);
    }
    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const prevScreen = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    const u = users.find((item) => item.id === userId);
    if (u) {
      if (u.role === 'admin') {
        setCurrentScreen('admin_dashboard');
      } else if (u.role === 'technician') {
        setCurrentScreen('tech_dashboard');
      } else {
        setCurrentScreen('home');
      }
    }
  };

  const loginUser = (phoneOrEmail: string, role: UserRole): boolean => {
    const existing = users.find(
      (u) => (u.phone === phoneOrEmail || u.email?.toLowerCase() === phoneOrEmail.toLowerCase()) && u.role === role
    );
    if (existing) {
      setCurrentUserId(existing.id);
      if (role === 'admin') navigateTo('admin_dashboard');
      else if (role === 'technician') navigateTo('tech_dashboard');
      else navigateTo('home');
      return true;
    }
    return false;
  };

  const registerUser = (userData: Partial<AppUser>): AppUser => {
    const newId = `user_${Date.now()}`;
    const newUser: AppUser = {
      id: newId,
      name: userData.name || 'مستخدم جديد',
      phone: userData.phone || '0500000000',
      email: userData.email,
      role: userData.role || 'customer',
      avatar:
        userData.avatar ||
        `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 100)}?w=300&auto=format&fit=crop&q=80`,
      city: userData.city || 'الرياض',
      district: userData.district || 'حي النرجس',
      address: userData.address || '',
      location: userData.location || {
        lat: 24.7742,
        lng: 46.6384,
        city: userData.city || 'الرياض',
        district: userData.district || 'وسط المدينة',
        addressText: userData.address || 'العنوان الرئيسي',
      },
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newId);

    // If registered as technician, create technician profile too
    if (newUser.role === 'technician') {
      const newTech: TechnicianProfile = {
        id: newId,
        name: newUser.name,
        avatar: newUser.avatar,
        phone: newUser.phone,
        email: newUser.email,
        city: newUser.city,
        district: newUser.district || 'حي النرجس',
        specialtyId: 'cat_electric',
        specialtyName: 'كهرباء وإنارة',
        services: [
          { id: `s_${Date.now()}`, name: 'فحص وصيانة عامة', price: 100, unit: 'زيارة' },
        ],
        experienceYears: 3,
        bio: 'فني خدمات معتمد وجاهز لتقديم أفضل جودة لعملائنا الكرام.',
        basePrice: 100,
        workingHours: '8:00 ص - 10:00 م',
        location: newUser.location!,
        isAvailable: true,
        rating: 5.0,
        reviewsCount: 1,
        completedOrders: 0,
        portfolioImages: [
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
        ],
        verificationStatus: 'verified',
      };
      setTechnicians((prev) => [newTech, ...prev]);
      navigateTo('tech_dashboard');
    } else {
      navigateTo('home');
    }

    return newUser;
  };

  const logoutUser = () => {
    // Default to first customer
    setCurrentUserId('user_cust_1');
    navigateTo('home');
  };

  const updateCurrentUserProfile = (data: Partial<AppUser>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUserId ? { ...u, ...data } : u))
    );
    if (currentUser.role === 'technician') {
      setTechnicians((prev) =>
        prev.map((t) => (t.id === currentUserId ? { ...t, ...data } : t))
      );
    }
  };

  const resetFilter = () => {
    setFilterOptions({ sortBy: 'rating' });
  };

  const toggleFavorite = (techId: string) => {
    setFavorites((prev) =>
      prev.includes(techId) ? prev.filter((id) => id !== techId) : [...prev, techId]
    );
  };

  const isFavorite = (techId: string) => favorites.includes(techId);

  // Bookings
  const createBooking = (data: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>): Booking => {
    const orderNum = `KD-2025-${Math.floor(100 + Math.random() * 900)}`;
    const newBooking: Booking = {
      ...data,
      id: `book_${Date.now()}`,
      bookingNumber: orderNum,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Send notification to technician
    sendSystemNotification(
      data.technicianId,
      `طلب خدمة جديد! 🔔 (${orderNum})`,
      `طلب جديد من العميل ${data.customerName} في تخصص ${data.specialtyName}.`,
      'booking',
      newBooking.id
    );

    // Send confirmation to customer
    sendSystemNotification(
      data.customerId,
      `تم إرسال طلبك بنجاح! 🎉 (${orderNum})`,
      `تم إرسال طلبك إلى ${data.technicianName}. بانتظار موافقة الفني.`,
      'booking',
      newBooking.id
    );

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updated: Booking = {
            ...b,
            status,
            cancellationReason: reason || b.cancellationReason,
            completedAt: status === 'completed' ? new Date().toISOString() : b.completedAt,
          };

          // Increment tech completed count if completed
          if (status === 'completed') {
            setTechnicians((techList) =>
              techList.map((t) =>
                t.id === b.technicianId
                  ? { ...t, completedOrders: t.completedOrders + 1 }
                  : t
              )
            );
          }

          // Trigger notifications
          const statusArabic: Record<BookingStatus, string> = {
            new: 'جديد',
            pending_acceptance: 'بانتظار القبول',
            accepted: 'تم قبول الطلب',
            on_the_way: 'الفني في الطريق إليك 🚗',
            in_progress: 'بدأ تنفيذ الخدمة ⚙️',
            completed: 'اكتمل تنفيذ الخدمة بنجاح ✅',
            cancelled: 'تم إلغاء الطلب ❌',
          };

          sendSystemNotification(
            b.customerId,
            `تحديث الطلب #${b.bookingNumber}`,
            `حالة طلبك تغيرت إلى: ${statusArabic[status]} ${reason ? `(السبب: ${reason})` : ''}`,
            'booking',
            bookingId
          );

          return updated;
        }
        return b;
      })
    );
  };

  const updateBookingPayment = (bookingId: string, paymentStatus: PaymentStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, paymentStatus } : b))
    );
  };

  const submitBookingReview = (bookingId: string, rating: number, comment: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      bookingId,
      technicianId: booking.technicianId,
      customerId: booking.customerId,
      customerName: booking.customerName,
      customerAvatar: booking.customerAvatar,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    // Update booking rating
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, rating, reviewComment: comment } : b
      )
    );

    // Recalculate technician rating
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id === booking.technicianId) {
          const techReviews = [...reviews.filter((r) => r.technicianId === t.id), newReview];
          const avg = techReviews.reduce((acc, curr) => acc + curr.rating, 0) / techReviews.length;
          return {
            ...t,
            rating: Number(avg.toFixed(1)),
            reviewsCount: techReviews.length,
          };
        }
        return t;
      })
    );

    // Notify technician
    sendSystemNotification(
      booking.technicianId,
      `تقييم جديد خمس نجوم! ⭐`,
      `قيمك العميل ${booking.customerName} بـ ${rating} من 5: "${comment}"`,
      'review',
      bookingId
    );
  };

  // Chat
  const startOrOpenChat = (techId: string, custId?: string, bookId?: string): string => {
    const customerId = custId || currentUser.id;
    const tech = technicians.find((t) => t.id === techId);
    const cust = users.find((u) => u.id === customerId);

    const existing = conversations.find(
      (c) => c.customerId === customerId && c.technicianId === techId
    );

    if (existing) {
      setSelectedConversationId(existing.id);
      navigateTo('chat_room', { conversationId: existing.id });
      return existing.id;
    }

    const newConvId = `conv_${Date.now()}`;
    const newConversation: ChatConversation = {
      id: newConvId,
      bookingId: bookId,
      customerId,
      customerName: cust?.name || 'العميل',
      customerAvatar: cust?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      technicianId: techId,
      technicianName: tech?.name || 'الفني',
      technicianAvatar: tech?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      lastMessage: 'مرحباً، أود الاستفسار عن تفاصيل الخدمة.',
      lastMessageTime: new Date().toISOString(),
      unreadCountCustomer: 0,
      unreadCountTechnician: 1,
      messages: [
        {
          id: `m_${Date.now()}`,
          senderId: customerId,
          senderName: cust?.name || 'العميل',
          senderRole: 'customer',
          text: 'مرحباً، أود الاستفسار عن تفاصيل الخدمة وحجز موعد مناسب.',
          timestamp: new Date().toISOString(),
          read: false,
        },
      ],
    };

    setConversations((prev) => [newConversation, ...prev]);
    setSelectedConversationId(newConvId);
    navigateTo('chat_room', { conversationId: newConvId });
    return newConvId;
  };

  const sendMessage = (conversationId: string, text: string, image?: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      image,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const isFromCustomer = currentUser.role === 'customer';
          return {
            ...c,
            lastMessage: text || (image ? '📷 صورة مرفقة' : ''),
            lastMessageTime: new Date().toISOString(),
            unreadCountCustomer: isFromCustomer ? c.unreadCountCustomer : c.unreadCountCustomer + 1,
            unreadCountTechnician: isFromCustomer ? c.unreadCountTechnician + 1 : c.unreadCountTechnician,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const isCustomer = currentUser.role === 'customer';
          return {
            ...c,
            unreadCountCustomer: isCustomer ? 0 : c.unreadCountCustomer,
            unreadCountTechnician: !isCustomer ? 0 : c.unreadCountTechnician,
            messages: c.messages.map((m) =>
              m.senderId !== currentUser.id ? { ...m, read: true } : m
            ),
          };
        }
        return c;
      })
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  const sendSystemNotification = (
    userId: string,
    title: string,
    body: string,
    type: AppNotification['type'] = 'system',
    linkId?: string
  ) => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId,
      title,
      body,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      linkId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const broadcastNotification = (title: string, body: string, targetRole: UserRole | 'all' = 'all') => {
    const targetUsers = targetRole === 'all' ? users : users.filter((u) => u.role === targetRole);
    const newNotifs: AppNotification[] = targetUsers.map((u) => ({
      id: `notif_b_${Date.now()}_${u.id}`,
      userId: u.id,
      title,
      body,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString(),
    }));
    setNotifications((prev) => [...newNotifs, ...prev]);
  };

  // Technician controls
  const toggleTechnicianAvailability = (techId: string) => {
    setTechnicians((prev) =>
      prev.map((t) => (t.id === techId ? { ...t, isAvailable: !t.isAvailable } : t))
    );
  };

  const updateTechnicianProfileData = (techId: string, data: Partial<TechnicianProfile>) => {
    setTechnicians((prev) =>
      prev.map((t) => (t.id === techId ? { ...t, ...data } : t))
    );
  };

  const approveTechnician = (techId: string) => {
    setTechnicians((prev) =>
      prev.map((t) => (t.id === techId ? { ...t, verificationStatus: 'verified' } : t))
    );
    sendSystemNotification(
      techId,
      'تم اعتماد حسابك بنجاح! 🏅',
      'مبروك، تم مراجعة بياناتك واعتماد حسابك المهني في تطبيق خدمتي. يمكنك الآن استقبال الطلبات.'
    );
  };

  const rejectTechnician = (techId: string) => {
    setTechnicians((prev) =>
      prev.map((t) => (t.id === techId ? { ...t, verificationStatus: 'rejected' } : t))
    );
    sendSystemNotification(
      techId,
      'تنبيه بخصوص الحساب المهني',
      'نعتذر، لم يتم اعتماد حسابك لوجود نقص في الوثائق. يرجى مراجعة الإدارة.'
    );
  };

  // Complaints
  const submitComplaint = (
    data: Omit<Complaint, 'id' | 'complaintNumber' | 'createdAt' | 'status'>
  ) => {
    const num = `CMP-2025-${Math.floor(100 + Math.random() * 900)}`;
    const newComp: Complaint = {
      ...data,
      id: `comp_${Date.now()}`,
      complaintNumber: num,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setComplaints((prev) => [newComp, ...prev]);

    sendSystemNotification(
      data.customerId,
      `تم استلام الشكوى #${num}`,
      'شكراً لتواصلك، تم تحويل الشكوى إلى فريق الدعم وسيتم التواصل معك خلال 24 ساعة.'
    );
  };

  const updateComplaintStatus = (
    id: string,
    status: Complaint['status'],
    resolutionNotes?: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated: Complaint = { ...c, status, resolutionNotes };
          sendSystemNotification(
            c.customerId,
            `تحديث الشكوى #${c.complaintNumber}`,
            `تم تغيير حالة الشكوى إلى: ${status === 'resolved' ? 'تم الحل بنجاح ✅' : status === 'closed' ? 'مغلقة' : 'قيد المراجعة'}`
          );
          return updated;
        }
        return c;
      })
    );
  };

  // Admin Categories & Offers
  const addCategory = (cat: Omit<ServiceCategory, 'id' | 'techniciansCount'>) => {
    const newCat: ServiceCategory = {
      ...cat,
      id: `cat_${Date.now()}`,
      techniciansCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = (id: string, cat: Partial<ServiceCategory>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...cat } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const addOffer = (offer: Omit<Offer, 'id'>) => {
    const newOffer: Offer = {
      ...offer,
      id: `off_${Date.now()}`,
    };
    setOffers((prev) => [newOffer, ...prev]);
    broadcastNotification(`🔥 عرض جديد: ${offer.title}`, offer.description);
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  const toggleOfferActive = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o))
    );
  };

  const toggleUserStatus = (userId: string, status: 'active' | 'suspended') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCategories(INITIAL_CATEGORIES);
    setTechnicians(INITIAL_TECHNICIANS);
    setBookings(INITIAL_BOOKINGS);
    setReviews(INITIAL_REVIEWS);
    setConversations(INITIAL_CONVERSATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setComplaints(INITIAL_COMPLAINTS);
    setOffers(INITIAL_OFFERS);
    setFavorites(['user_tech_1', 'user_tech_2']);
    setCurrentUserId('user_cust_1');
    setCurrentScreen('home');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        screenParams,
        goBack,
        history,
        currentUser,
        switchUser,
        loginUser,
        registerUser,
        logoutUser,
        updateCurrentUserProfile,
        users,
        categories,
        technicians,
        bookings,
        reviews,
        conversations,
        notifications,
        complaints,
        offers,
        favorites,
        selectedTechnicianId,
        setSelectedTechnicianId,
        selectedBookingId,
        setSelectedBookingId,
        selectedConversationId,
        setSelectedConversationId,
        selectedCategoryId,
        setSelectedCategoryId,
        filterOptions,
        setFilterOptions,
        resetFilter,
        toggleFavorite,
        isFavorite,
        createBooking,
        updateBookingStatus,
        updateBookingPayment,
        submitBookingReview,
        sendMessage,
        startOrOpenChat,
        markConversationAsRead,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendSystemNotification,
        broadcastNotification,
        toggleTechnicianAvailability,
        updateTechnicianProfileData,
        approveTechnician,
        rejectTechnician,
        submitComplaint,
        updateComplaintStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        addOffer,
        deleteOffer,
        toggleOfferActive,
        toggleUserStatus,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
