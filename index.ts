export type UserRole = 'customer' | 'technician' | 'admin';

export interface GeoLocation {
  lat: number;
  lng: number;
  city: string;
  district: string;
  addressText: string;
}

export interface AppUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar: string;
  city: string;
  district?: string;
  address?: string;
  location?: GeoLocation;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  unit?: string;
  description?: string;
}

export interface TechnicianProfile {
  id: string; // matches userId
  name: string;
  avatar: string;
  phone: string;
  email?: string;
  city: string;
  district: string;
  specialtyId: string;
  specialtyName: string;
  services: ServiceItem[];
  experienceYears: number;
  bio: string;
  basePrice: number;
  workingHours: string;
  location: GeoLocation;
  isAvailable: boolean;
  rating: number;
  reviewsCount: number;
  completedOrders: number;
  portfolioImages: string[];
  verificationStatus: 'verified' | 'pending' | 'rejected';
  identityNumber?: string;
}

export interface ServiceCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  iconName: string;
  image: string;
  description: string;
  isPopular: boolean;
  techniciansCount: number;
  startingPrice: number;
  color: string;
}

export type BookingStatus =
  | 'new'
  | 'pending_acceptance'
  | 'accepted'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'bank_transfer' | 'card';
export type PaymentStatus = 'unpaid' | 'pending_verification' | 'paid' | 'refunded';

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar: string;
  technicianId: string;
  technicianName: string;
  technicianPhone: string;
  technicianAvatar: string;
  specialtyId: string;
  specialtyName: string;
  serviceItems: string[];
  problemDescription: string;
  problemImages: string[];
  location: GeoLocation;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalPrice: number;
  estimatedPrice?: number;
  createdAt: string;
  completedAt?: string;
  cancellationReason?: string;
  rating?: number;
  reviewComment?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  technicianId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  isFlagged?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  image?: string;
  timestamp: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  bookingId?: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  technicianId: string;
  technicianName: string;
  technicianAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCountCustomer: number;
  unreadCountTechnician: number;
  messages: ChatMessage[];
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'booking' | 'system' | 'offer' | 'chat' | 'review';
  read: boolean;
  createdAt: string;
  linkId?: string;
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  bookingId?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  problemType: string;
  description: string;
  images: string[];
  notes?: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  createdAt: string;
  resolutionNotes?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  serviceCategoryId?: string;
  serviceCategoryName?: string;
  code: string;
  validUntil: string;
  bannerImage: string;
  active: boolean;
}

export interface FilterOptions {
  categoryId?: string;
  city?: string;
  minRating?: number;
  maxPrice?: number;
  onlyAvailable?: boolean;
  searchQuery?: string;
  sortBy?: 'rating' | 'price_low' | 'price_high' | 'experience' | 'completed';
}
