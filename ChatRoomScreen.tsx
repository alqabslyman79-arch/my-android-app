import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Camera,
  Image as ImageIcon,
  Phone,
  ArrowRight,
  CheckCheck,
  Sparkles,
  Paperclip,
} from 'lucide-react';

export const ChatRoomScreen: React.FC = () => {
  const {
    selectedConversationId,
    conversations,
    currentUser,
    sendMessage,
    markConversationAsRead,
    goBack,
    navigateTo,
    setSelectedBookingId,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find((c) => c.id === selectedConversationId) || conversations[0];

  useEffect(() => {
    if (conversation) {
      markConversationAsRead(conversation.id);
    }
  }, [conversation?.id, conversation?.messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl">
        <p>لم يتم العثور على المحادثة.</p>
        <button onClick={goBack} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl">
          رجوع
        </button>
      </div>
    );
  }

  const isCustomer = currentUser.role === 'customer';
  const partnerName = isCustomer ? conversation.technicianName : conversation.customerName;
  const partnerAvatar = isCustomer ? conversation.technicianAvatar : conversation.customerAvatar;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(conversation.id, inputText.trim());
    setInputText('');
  };

  const handleSendSampleImage = () => {
    const sampleImgs = [
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
    ];
    const img = sampleImgs[Math.floor(Math.random() * sampleImgs.length)];
    sendMessage(conversation.id, '📷 أرسلت لك صورة العطل للتوضيح', img);
  };

  const quickReplies = [
    'أهلاً بك، متى يمكنك الحضور؟',
    'أنا بانتظارك في الموقع المحدد.',
    'تم تحويل المبلغ وتأكيد الفاتورة.',
    'شكراً جزيلاً لخدمتك الممتازة.',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[650px] bg-slate-50 rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Top Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="p-1.5 -mr-1 text-slate-700 hover:bg-slate-100 rounded-xl"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <img
            src={partnerAvatar}
            alt={partnerName}
            className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
          />

          <div>
            <h3 className="font-extrabold text-sm text-slate-900 leading-tight">{partnerName}</h3>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              متصل الآن في التطبيق
            </span>
          </div>
        </div>

        {conversation.bookingId && (
          <button
            type="button"
            onClick={() => {
              setSelectedBookingId(conversation.bookingId!);
              navigateTo('order_detail', { bookingId: conversation.bookingId });
            }}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
          >
            عرض تفاصيل الطلب
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {conversation.messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 shadow-xs ${
                  isMe
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                {msg.image && (
                  <div className="mb-2 rounded-xl overflow-hidden max-h-48">
                    <img src={msg.image} alt="مرفق" className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <div
                  className={`flex items-center gap-1 text-[10px] mt-1 ${
                    isMe ? 'text-emerald-100 justify-start' : 'text-slate-400 justify-end'
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString('ar-SA', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickReplies.map((qr, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendMessage(conversation.id, qr)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-full text-[11px] font-medium text-slate-700 whitespace-nowrap transition-colors"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="bg-white p-3 border-t border-slate-200 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSendSampleImage}
          className="p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors"
          title="إرفاق صورة"
        >
          <Camera className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 px-4 py-2.5 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-2xl shadow transition-all"
          title="إرسال"
        >
          <Send className="w-5 h-5 -rotate-90" />
        </button>
      </form>
    </div>
  );
};
