
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus,
  Calendar,
  CreditCard,
  Phone,
  Plane,
  X,
  Save,
  MapPin,
  Building2,
  Ticket,
  Check,
  RotateCcw,
  Edit,
  Trash2,
  Printer,
  FileText,
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Download,
  Eye,
  Info,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  debit: number; // Bard (Service/Charge)
  credit: number; // Rasid (Payment)
}

interface Traveler {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  name: string;
  tripType: 'عمره' | 'حج';
  passport: string;
  phone: string;
  status: 'تایید شده' | 'در انتظار' | 'لغو شده';
  date: string;
  tripDate: string;
  specialType: string;
  specialCost: string;
  flightRoute: string;
  flightPurchase: string;
  flightSelling: string;
  hotelName: string;
  hotelNights: string;
  hotelPurchase: string;
  hotelSelling: string;
  totalReceived: string;
  ledger: LedgerEntry[];
}

const Travelers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTravelerForLedger, setSelectedTravelerForLedger] = useState<Traveler | null>(null);
  const [selectedTravelerForDetails, setSelectedTravelerForDetails] = useState<Traveler | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingTravelerId, setEditingTravelerId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const [travelers, setTravelers] = useState<Traveler[]>([
    {
      id: '1',
      code: 'TRV-1042',
      firstName: 'احمد',
      lastName: 'رحمانی',
      name: 'احمد رحمانی',
      tripType: 'عمره',
      passport: 'P1234567',
      phone: '۰۷۸۸۸۸۸۸۸۸',
      status: 'تایید شده',
      date: '۱۴۰۳/۰۲/۱۵',
      tripDate: '1403/05/20',
      specialType: 'سعودی',
      specialCost: '15,000',
      flightRoute: 'کابل-جده',
      flightPurchase: '45,000',
      flightSelling: '52,000',
      hotelName: 'زمزم',
      hotelNights: '10',
      hotelPurchase: '2,000',
      hotelSelling: '2,500',
      totalReceived: '100,000',
      ledger: [
        { id: 'l1', date: '۱۴۰۳/۰۲/۱۵', description: 'هزینه پکیج عمره', debit: 100000, credit: 0 },
        { id: 'l2', date: '۱۴۰۳/۰۲/۱۶', description: 'رسید قسط اول', debit: 0, credit: 50000 }
      ]
    },
    {
      id: '2',
      code: 'TRV-1055',
      firstName: 'مریم',
      lastName: 'کریمی',
      name: 'مریم کریمی',
      tripType: 'حج',
      passport: 'P9876543',
      phone: '۰۷۹۹۹۹۹۹۹۹',
      status: 'در انتظار',
      date: '۱۴۰۳/۰۳/۰۱',
      tripDate: '1403/05/20',
      specialType: 'سعودی',
      specialCost: '15,000',
      flightRoute: 'کابل-جده',
      flightPurchase: '45,000',
      flightSelling: '52,000',
      hotelName: 'انوار',
      hotelNights: '15',
      hotelPurchase: '2,000',
      hotelSelling: '2,500',
      totalReceived: '120,000',
      ledger: [
        { id: 'l3', date: '۱۴۰۳/۰۳/۰۱', description: 'هزینه پکیج حج کامل', debit: 120000, credit: 0 }
      ]
    }
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    passport: '',
    phone: '',
    tripType: 'حج' as 'عمره' | 'حج',
    tripDate: '1403/05/20',
    specialType: 'سعودی',
    specialCost: '',
    flightRoute: 'کابل-جده',
    flightPurchase: '',
    flightSelling: '',
    hotelName: '',
    hotelNights: '',
    hotelPurchase: '',
    hotelSelling: '',
    totalReceived: ''
  });

  const [ledgerFormData, setLedgerFormData] = useState({
    description: '',
    debit: '',
    credit: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLedgerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLedgerFormData(prev => ({ ...prev, [name]: value }));
  };

  const approveTraveler = (id: string) => {
    setTravelers(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'تایید شده' } : t
    ));
    setOpenMenuId(null);
  };

  const cancelTraveler = (id: string) => {
    setTravelers(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'لغو شده' } : t
    ));
    setOpenMenuId(null);
  };

  const deleteTraveler = (id: string) => {
    setTravelers(prev => prev.filter(t => t.id !== id));
    setOpenMenuId(null);
  };

  const startEdit = (traveler: Traveler) => {
    setEditingTravelerId(traveler.id);
    setFormData({
      firstName: traveler.firstName,
      lastName: traveler.lastName,
      passport: traveler.passport,
      phone: traveler.phone,
      tripType: traveler.tripType,
      tripDate: traveler.tripDate,
      specialType: traveler.specialType,
      specialCost: traveler.specialCost,
      flightRoute: traveler.flightRoute,
      flightPurchase: traveler.flightPurchase,
      flightSelling: traveler.flightSelling,
      hotelName: traveler.hotelName,
      hotelNights: traveler.hotelNights,
      hotelPurchase: traveler.hotelPurchase,
      hotelSelling: traveler.hotelSelling,
      totalReceived: traveler.totalReceived
    });
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const openLedger = (traveler: Traveler) => {
    setSelectedTravelerForLedger(traveler);
    setIsLedgerOpen(true);
    setOpenMenuId(null);
  };

  const openDetails = (traveler: Traveler) => {
    setSelectedTravelerForDetails(traveler);
    setIsDetailsOpen(true);
    setOpenMenuId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTravelerId) {
      setTravelers(prev => prev.map(t => 
        t.id === editingTravelerId 
          ? { 
              ...t, 
              ...formData, 
              name: `${formData.firstName} ${formData.lastName}`.trim() 
            } 
          : t
      ));
    } else {
      const newEntry: Traveler = {
        ...formData,
        id: Date.now().toString(),
        code: `TRV-${Math.floor(Math.random() * 9000) + 1000}`,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        status: 'در انتظار',
        date: new Intl.DateTimeFormat('fa-AF').format(new Date()),
        ledger: [
          {
            id: Date.now().toString() + '-init',
            date: new Intl.DateTimeFormat('fa-AF').format(new Date()),
            description: `ثبت اولیه پکیج ${formData.tripType}`,
            debit: parseFloat(formData.totalReceived.replace(/,/g, '')) || 0,
            credit: 0
          }
        ]
      };
      setTravelers([newEntry, ...travelers]);
    }
    closeModal();
  };

  const handleAddLedgerEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTravelerForLedger) return;

    const newEntry: LedgerEntry = {
      id: Date.now().toString(),
      date: new Intl.DateTimeFormat('fa-AF').format(new Date()),
      description: ledgerFormData.description,
      debit: parseFloat(ledgerFormData.debit) || 0,
      credit: parseFloat(ledgerFormData.credit) || 0,
    };

    const updatedTravelers = travelers.map(t => {
      if (t.id === selectedTravelerForLedger.id) {
        const updatedLedger = [...t.ledger, newEntry];
        const updatedTraveler = { ...t, ledger: updatedLedger };
        setSelectedTravelerForLedger(updatedTraveler);
        return updatedTraveler;
      }
      return t;
    });

    setTravelers(updatedTravelers);
    setLedgerFormData({ description: '', debit: '', credit: '' });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTravelerId(null);
    setFormData({
      firstName: '', lastName: '', passport: '', phone: '', tripType: 'حج', tripDate: '1403/05/20',
      specialType: 'سعودی', specialCost: '', flightRoute: 'کابل-جده', flightPurchase: '',
      flightSelling: '', hotelName: '', hotelNights: '', hotelPurchase: '', hotelSelling: '', totalReceived: ''
    });
  };

  const filteredTravelers = travelers.filter(t => 
    t.name.includes(searchTerm) || t.passport.includes(searchTerm) || t.code.includes(searchTerm)
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-8 justify-end">
      <h4 className="text-[#108548] font-black text-lg">{title}</h4>
      <div className="w-1.5 h-6 bg-[#108548] rounded-full"></div>
    </div>
  );

  const DetailRow = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
    <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs font-bold">{label}</span>
      </div>
      <span className="text-sm font-black text-slate-700">{value || '-'}</span>
    </div>
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">مدیریت مسافران</h2>
          <p className="text-slate-500 mt-1 font-medium">لیست تمامی مسافران و دفتر حساب مالی</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#108548] hover:bg-[#0d6e3c] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-green-100"
        >
          <UserPlus size={20} />
          ثبت مسافر جدید
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="جستجو بر اساس نام، پاسپورت یا کد مسافر..." 
            className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#108548] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-medium">
          <Filter size={18} />
          فیلتر پیشرفته
        </button>
      </div>

      {/* Traveler Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-bold text-slate-600">نام و کد مسافر</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">نوع سفر</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">باقیمانده حساب</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">شماره تماس</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">تاریخ ثبت</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">وضعیت</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTravelers.map((traveler) => {
                const totalDebit = traveler.ledger.reduce((sum, entry) => sum + entry.debit, 0);
                const totalCredit = traveler.ledger.reduce((sum, entry) => sum + entry.credit, 0);
                const balance = totalDebit - totalCredit;

                return (
                  <tr key={traveler.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-[#e7f3ec] group-hover:text-[#108548] transition-colors">
                          {traveler.name.charAt(0)}
                        </div>
                        <div>
                          <span className="block font-bold text-slate-700">{traveler.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{traveler.code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Plane size={16} className="text-slate-400" />
                        <span className="text-sm">{traveler.tripType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-sm font-black ${balance > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                        {balance.toLocaleString()} AFN
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={16} className="text-slate-400" />
                        <span className="text-sm">{traveler.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={16} className="text-slate-400" />
                        <span className="text-sm">{traveler.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        traveler.status === 'تایید شده' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : traveler.status === 'در انتظار'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {traveler.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 relative">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === traveler.id ? null : traveler.id)}
                          className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {openMenuId === traveler.id && (
                          <div 
                            ref={menuRef}
                            className="absolute left-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                            style={{ top: '100%' }}
                          >
                            <button 
                              onClick={() => openDetails(traveler)}
                              className="w-full text-right px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                            >
                              <Eye size={16} className="text-blue-500" /> مشاهده جزئیات
                            </button>
                            <button 
                              onClick={() => openLedger(traveler)}
                              className="w-full text-right px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-3"
                            >
                              <BookOpen size={16} /> دفتر حساب مسافر
                            </button>
                            {traveler.status === 'در انتظار' && (
                              <button 
                                onClick={() => approveTraveler(traveler.id)}
                                className="w-full text-right px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-3"
                              >
                                <Check size={16} /> تایید مسافر
                              </button>
                            )}
                            <button 
                              onClick={() => startEdit(traveler)}
                              className="w-full text-right px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                            >
                              <Edit size={16} className="text-slate-400" /> ویرایش اطلاعات
                            </button>
                            <button className="w-full text-right px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3">
                              <Printer size={16} className="text-slate-400" /> چاپ صورت حساب
                            </button>
                            <div className="h-px bg-slate-50 my-1"></div>
                            <button 
                              onClick={() => cancelTraveler(traveler.id)}
                              className="w-full text-right px-4 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-3"
                            >
                              <X size={16} /> لغو سفر
                            </button>
                            <button 
                              onClick={() => deleteTraveler(traveler.id)}
                              className="w-full text-right px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3"
                            >
                              <Trash2 size={16} /> حذف از سیستم
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Traveler Details Modal */}
      {isDetailsOpen && selectedTravelerForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-[#108548]/5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#108548] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
                  <UserPlus size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">{selectedTravelerForDetails.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedTravelerForDetails.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      selectedTravelerForDetails.status === 'تایید شده' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {selectedTravelerForDetails.status}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsDetailsOpen(false)}
                className="p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 text-right custom-scrollbar" dir="rtl">
              
              <div>
                <SectionHeader title="مشخصات فردی" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <DetailRow label="نام" value={selectedTravelerForDetails.firstName} />
                  <DetailRow label="تخلص" value={selectedTravelerForDetails.lastName} />
                  <DetailRow label="پاسپورت" value={selectedTravelerForDetails.passport} icon={<CreditCard size={14}/>} />
                  <DetailRow label="تماس" value={selectedTravelerForDetails.phone} icon={<Phone size={14}/>} />
                </div>
              </div>

              <div>
                <SectionHeader title="اطلاعات سفر" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <DetailRow label="نوع سفر" value={selectedTravelerForDetails.tripType} icon={<Plane size={14}/>} />
                  <DetailRow label="تاریخ پرواز" value={selectedTravelerForDetails.tripDate} icon={<Calendar size={14}/>} />
                  <DetailRow label="تاریخ ثبت نام" value={selectedTravelerForDetails.date} icon={<Clock size={14}/>} />
                </div>
              </div>

              <div>
                <SectionHeader title="خدمات ویزه" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <DetailRow label="نوع ویزه" value={selectedTravelerForDetails.specialType} icon={<ShieldCheck size={14}/>} />
                  <DetailRow label="هزینه ویزه" value={`${selectedTravelerForDetails.specialCost} AFN`} />
                </div>
              </div>

              <div>
                <SectionHeader title="تکت هواپیما" />
                <div className="grid grid-cols-1 gap-4 mt-4">
                   <DetailRow label="مسیر پرواز" value={selectedTravelerForDetails.flightRoute} icon={<MapPin size={14}/>} />
                   <div className="grid grid-cols-2 gap-4">
                      <DetailRow label="قیمت خرید" value={`${selectedTravelerForDetails.flightPurchase} AFN`} />
                      <DetailRow label="قیمت فروش" value={`${selectedTravelerForDetails.flightSelling} AFN`} />
                   </div>
                </div>
              </div>

              <div>
                <SectionHeader title="هوتل و اقامت" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <DetailRow label="نام هوتل" value={selectedTravelerForDetails.hotelName} icon={<Building2 size={14}/>} />
                  <DetailRow label="تعداد شب" value={selectedTravelerForDetails.hotelNights} />
                  <DetailRow label="خرید هر شب" value={`${selectedTravelerForDetails.hotelPurchase} AFN`} />
                  <DetailRow label="فروش هر شب" value={`${selectedTravelerForDetails.hotelSelling} AFN`} />
                </div>
              </div>

              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-500 block mb-1">مجموع هزینه پکیج (دریافتی)</span>
                  <span className="text-2xl font-black text-emerald-700">{selectedTravelerForDetails.totalReceived} AFN</span>
                </div>
                <div className="p-4 bg-white rounded-2xl text-emerald-600 shadow-sm">
                   <DollarSign size={24} />
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
               <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    <Printer size={18} /> چاپ مشخصات
                  </button>
                  <button 
                    onClick={() => {
                       setIsDetailsOpen(false);
                       startEdit(selectedTravelerForDetails);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all"
                  >
                    <Edit size={18} /> ویرایش سریع
                  </button>
               </div>
               <button 
                 onClick={() => setIsDetailsOpen(false)}
                 className="px-10 py-3 bg-[#108548] text-white rounded-xl font-black hover:bg-[#0d6e3c] transition-all shadow-lg shadow-green-50"
               >
                 بستن جزییات
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Traveler Ledger Modal */}
      {isLedgerOpen && selectedTravelerForLedger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">دفتر حساب: {selectedTravelerForLedger.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedTravelerForLedger.code}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsLedgerOpen(false)}
                className="p-3 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Financial Quick Summary */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                  <span className="text-xs font-bold text-rose-400 block mb-1">مجموع برد (خدمات)</span>
                  <span className="text-2xl font-black text-rose-600">
                    {selectedTravelerForLedger.ledger.reduce((sum, e) => sum + e.debit, 0).toLocaleString()} AFN
                  </span>
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-400 block mb-1">مجموع رسید (پرداختی)</span>
                  <span className="text-2xl font-black text-emerald-600">
                    {selectedTravelerForLedger.ledger.reduce((sum, e) => sum + e.credit, 0).toLocaleString()} AFN
                  </span>
                </div>
                <div className="bg-slate-900 p-6 rounded-3xl text-white">
                  <span className="text-xs font-bold text-slate-400 block mb-1">باقیمانده حساب</span>
                  <span className="text-2xl font-black">
                    {(selectedTravelerForLedger.ledger.reduce((sum, e) => sum + e.debit, 0) - 
                      selectedTravelerForLedger.ledger.reduce((sum, e) => sum + e.credit, 0)).toLocaleString()} AFN
                  </span>
                </div>
              </div>

              {/* Add New Ledger Entry Form */}
              <form onSubmit={handleAddLedgerEntry} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px] space-y-1.5">
                  <label className="text-xs font-black text-slate-500 mr-2">شرح تراکنش</label>
                  <input 
                    required 
                    name="description" 
                    value={ledgerFormData.description} 
                    onChange={handleLedgerInputChange}
                    placeholder="مثال: پرداخت قسط دوم"
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  />
                </div>
                <div className="w-40 space-y-1.5">
                  <label className="text-xs font-black text-slate-500 mr-2">مبلغ برد (بدهی)</label>
                  <input 
                    type="number" 
                    name="debit" 
                    value={ledgerFormData.debit} 
                    onChange={handleLedgerInputChange}
                    placeholder="۰"
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-black text-rose-600"
                  />
                </div>
                <div className="w-40 space-y-1.5">
                  <label className="text-xs font-black text-slate-500 mr-2">مبلغ رسید (طلب)</label>
                  <input 
                    type="number" 
                    name="credit" 
                    value={ledgerFormData.credit} 
                    onChange={handleLedgerInputChange}
                    placeholder="۰"
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-black text-emerald-600"
                  />
                </div>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all">
                  <Plus size={24} />
                </button>
              </form>

              {/* Ledger Table */}
              <div className="border border-slate-100 rounded-3xl overflow-hidden">
                <table className="w-full text-right">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-sm font-black text-slate-500">تاریخ</th>
                      <th className="px-6 py-4 text-sm font-black text-slate-500">شرح</th>
                      <th className="px-6 py-4 text-sm font-black text-rose-500">برد (Bard)</th>
                      <th className="px-6 py-4 text-sm font-black text-emerald-600">رسید (Rasid)</th>
                      <th className="px-6 py-4 text-sm font-black text-slate-800">مانده</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(() => {
                      let runningBalance = 0;
                      return selectedTravelerForLedger.ledger.map((entry) => {
                        runningBalance += (entry.debit - entry.credit);
                        return (
                          <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-slate-400">{entry.date}</td>
                            <td className="px-6 py-4 font-bold text-slate-700">{entry.description}</td>
                            <td className="px-6 py-4 font-black text-rose-500">{entry.debit > 0 ? entry.debit.toLocaleString() : '-'}</td>
                            <td className="px-6 py-4 font-black text-emerald-600">{entry.credit > 0 ? entry.credit.toLocaleString() : '-'}</td>
                            <td className={`px-6 py-4 font-black ${runningBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {runningBalance.toLocaleString()}
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
               <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    <Printer size={18} /> چاپ صورت حساب
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    <Download size={18} /> دریافت PDF
                  </button>
               </div>
               <button 
                 onClick={() => setIsLedgerOpen(false)}
                 className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-slate-800 transition-all"
               >
                 بستن دفتر
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Traveler Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
            <div className="flex items-center justify-between p-6 border-b border-slate-50">
              <h3 className="text-xl font-black text-slate-800">
                {editingTravelerId ? 'ویرایش اطلاعات مسافر' : 'ثبت نام مسافر جدید'}
              </h3>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[85vh] custom-scrollbar text-right" dir="rtl">
              
              <SectionHeader title="مشخصات فردی" />
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block font-bold">نام</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block font-bold">تخلص</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block font-bold">شماره پاسپورت</label>
                  <input required name="passport" value={formData.passport} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block font-bold">شماره تماس</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none" />
                </div>
              </div>

              <SectionHeader title="اطلاعات سفر" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block font-bold">نوع سفر</label>
                  <select name="tripType" value={formData.tripType} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none font-bold">
                    <option value="عمره">عمره</option>
                    <option value="حج">حج</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block font-bold">تاریخ سفر</label>
                  <input name="tripDate" value={formData.tripDate} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none text-center" />
                </div>
              </div>

              <SectionHeader title="خدمات ویزه" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block font-bold">نوع ویزه</label>
                  <input name="specialType" value={formData.specialType} onChange={handleInputChange} placeholder="سعودی" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block font-bold">هزینه ویزه (AFN)</label>
                  <input name="specialCost" value={formData.specialCost} onChange={handleInputChange} placeholder="." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none text-center" />
                </div>
              </div>

              <SectionHeader title="تکت هواپیما" />
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block font-bold">مسیر پرواز</label>
                  <input name="flightRoute" value={formData.flightRoute} onChange={handleInputChange} placeholder="کابل-جده" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 block font-bold">قیمت خرید</label>
                    <input name="flightPurchase" value={formData.flightPurchase} onChange={handleInputChange} placeholder="." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none text-center" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 block font-bold">قیمت فروش</label>
                    <input name="flightSelling" value={formData.flightSelling} onChange={handleInputChange} placeholder="." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none text-center" />
                  </div>
                </div>
              </div>

              <SectionHeader title="هوتل (مدینه منوره)" />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 block font-bold">نام هوتل</label>
                    <input name="hotelName" value={formData.hotelName} onChange={handleInputChange} placeholder="." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 block font-bold">تعداد شب</label>
                    <input name="hotelNights" value={formData.hotelNights} onChange={handleInputChange} placeholder="." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none text-center" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 block font-bold">خرید هر شب</label>
                    <input name="hotelPurchase" value={formData.hotelPurchase} onChange={handleInputChange} placeholder="." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none text-center" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 block font-bold">فروش هر شب</label>
                    <input name="hotelSelling" value={formData.hotelSelling} onChange={handleInputChange} placeholder="." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#108548] transition-all outline-none text-center" />
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-black text-slate-500">مجموع دریافتی:</label>
                    <div className="relative">
                       <input name="totalReceived" value={formData.totalReceived} onChange={handleInputChange} placeholder="." className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-[#108548] outline-none text-center font-bold text-emerald-600" />
                       <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-[10px] text-slate-300 font-bold uppercase">AFN</span>
                    </div>
                  </div>
                  <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                    انصراف
                  </button>
                </div>
                
                <button type="submit" className="w-full md:w-auto bg-[#108548] hover:bg-[#0d6e3c] text-white font-black px-10 py-4 rounded-2xl transition-all shadow-xl shadow-green-50 flex items-center justify-center gap-3">
                  <Save size={20} />
                  ذخیره اطلاعات مسافر
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Travelers;
