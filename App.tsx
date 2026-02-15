
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Travelers from './components/Travelers';
import Services from './components/Services';
import Accounts from './components/Accounts';
import Expenses from './components/Expenses';
import Commission from './components/Commission';
import History from './components/History';
import Reports from './components/Reports';
import GeneralLedger from './components/GeneralLedger';
import CashBox from './components/CashBox';
import ArabicCompanies, { ArabicCompany } from './components/ArabicCompanies';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [companies, setCompanies] = useState<ArabicCompany[]>([
    {
      id: '1',
      name: 'شركة مكة للفنادق والخدمات',
      code: 'SA-101',
      location: 'مکه مکرمه',
      phone: '+966 12 345 6789',
      email: 'info@makkah-hotels.sa',
      balance: 2500.50,
      ledger: [
        { id: 'l1', date: '۱۴۰۳/۰۳/۰۱', description: 'رزرو گروهی هتل مکه - ۲۰ نفر', debit: 3000, credit: 0 },
        { id: 'l2', date: '۱۴۰۳/۰۳/۰۵', description: 'پرداخت قسط اول حواله', debit: 0, credit: 499.50 }
      ]
    },
    {
      id: '2',
      name: 'مجموعة المدينة للنقل والخدمات',
      code: 'SA-202',
      location: 'مدینه منوره',
      phone: '+966 14 987 6543',
      email: 'contact@madina-trans.sa',
      balance: 1200,
      ledger: [
        { id: 'l3', date: '۱۴۰۳/۰۳/۰۸', description: 'ترانسپورت جده-مدینه', debit: 1200, credit: 0 }
      ]
    }
  ]);

  const [travelers, setTravelers] = useState<any[]>([
    {
      id: '1',
      code: 'TRV-1042',
      name: 'احمد رحمانی',
      tripType: 'عمره',
      passport: 'P1234567',
      phone: '0788888888',
      status: 'تایید شده',
      date: '1403/02/15',
      tripDate: '1403/05/20',
      saudiRepresentative: 'شركة مكة للفنادق والخدمات',
      representativeFee: '50',
      visaProviderCompany: 'شركة مكة للفنادق والخدمات',
      visaPurchase: '350',
      visaSelling: '400',
      flightRoute: 'کابل-جده',
      flightPurchase: '450',
      flightSelling: '520',
      hotelNights: '5',
      hotelPurchase: '40',
      hotelSelling: '50',
      hotelMakkahNights: '5',
      hotelMakkahPurchase: '60',
      hotelMakkahSelling: '70',
      transportPurchase: '80',
      transportSelling: '100',
      totalReceived: '500',
      totalPayable: '1520',
      ledger: [
        { id: 'l1', date: '1403/02/15', description: 'فروش پکیج عمره', debit: 1520, credit: 0 },
        { id: 'l2', date: '1403/02/16', description: 'رسید قسط اول', debit: 0, credit: 500 }
      ]
    }
  ]);

  const [expenses, setExpenses] = useState<any[]>([
    { id: '1', description: 'کرایه دفتر مرکزی - ماه جوزا', amount: '400', category: 'کرایه', date: '1403/03/01', payee: 'مالک ساختمان' },
    { id: '2', description: 'معاشات کارمندان بخش فروش', amount: '1200', category: 'معاشات', date: '1403/03/05', payee: 'کارمندان' },
    { id: '3', description: 'بیل برق و انترنت دفتر', amount: '60', category: 'خدمات', date: '1403/03/08', payee: 'شرکت برشنا / افغان تلیکام' }
  ]);

  const [transactions, setTransactions] = useState<any[]>([
    { id: '1', date: '1403/05/01', type: 'دریافت', category: 'دریافت از حاجی', amount: 500, person: 'احمد رحمانی', period: 'دوره حج 1403 - کاروان اول', description: 'پیش‌پرداخت قسط اول', status: 'تأیید شده' },
    { id: '2', date: '1403/05/02', type: 'پرداخت', category: 'مصرف دوا', amount: 100, person: 'دواخانه مرکزی', period: 'دوره حج 1403 - کاروان اول', description: 'خرید تجهیزات صحی اولیه', status: 'تأیید شده' }
  ]);

  const handleUpdateCompanies = (updatedCompanies: ArabicCompany[]) => {
    setCompanies(updatedCompanies);
  };

  const handleUpdateTravelers = (updatedTravelers: any[]) => {
    setTravelers(updatedTravelers);
  };

  const handleAddExpense = (newExpense: any) => {
    setExpenses([newExpense, ...expenses]);
    
    // Auto-sync with CashBox
    const newTransaction = {
      id: Date.now().toString() + '-sync',
      date: newExpense.date,
      type: 'پرداخت',
      category: newExpense.category === 'معاشات' ? 'معاش' : (newExpense.category === 'کرایه' ? 'پرداخت کرایه' : 'سایر مصارف'),
      amount: parseFloat(newExpense.amount.replace(/,/g, '')),
      person: newExpense.payee,
      period: 'دوره جاری',
      description: `ثبت خودکار از مصارف: ${newExpense.description}`,
      status: 'تأیید شده'
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleAddTransaction = (newTransaction: any) => {
    setTransactions([newTransaction, ...transactions]);

    // Auto-sync with Expenses if it's an expense category
    const expenseCategories = ['مصرف دوا', 'پرداخت کرایه', 'معاش', 'مصارف فوری حج'];
    if (newTransaction.type === 'پرداخت' && expenseCategories.includes(newTransaction.category)) {
      const categoryMapping: any = {
        'مصرف دوا': 'خدمات',
        'پرداخت کرایه': 'کرایه',
        'معاش': 'معاشات',
        'مصارف فوری حج': 'عمومی'
      };
      
      const newExpense = {
        id: Date.now().toString() + '-sync-exp',
        description: newTransaction.description,
        amount: newTransaction.amount.toString(),
        category: categoryMapping[newTransaction.category] || 'عمومی',
        date: newTransaction.date,
        payee: newTransaction.person
      };
      setExpenses([newExpense, ...expenses]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-right" dir="rtl">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' ? (
          <Dashboard />
        ) : activeTab === 'travelers' ? (
          <Travelers 
            companies={companies} 
            travelers={travelers} 
            onUpdateTravelers={handleUpdateTravelers}
            onUpdateCompanies={handleUpdateCompanies}
          />
        ) : activeTab === 'ledger' ? (
          <GeneralLedger />
        ) : activeTab === 'cashbox' ? (
          <CashBox 
            transactions={transactions} 
            onAddTransaction={handleAddTransaction} 
            onDeleteTransaction={handleDeleteTransaction}
          />
        ) : activeTab === 'arabic-companies' ? (
          <ArabicCompanies 
            companies={companies} 
            onUpdateCompanies={handleUpdateCompanies} 
          />
        ) : activeTab === 'reports' ? (
          <Reports travelers={travelers} />
        ) : activeTab === 'services' ? (
          <Services />
        ) : activeTab === 'accounts' ? (
          <Accounts />
        ) : activeTab === 'expenses' ? (
          <Expenses 
            expenses={expenses} 
            onAddExpense={handleAddExpense} 
            onDeleteExpense={handleDeleteExpense}
          />
        ) : activeTab === 'commission' ? (
          <Commission />
        ) : activeTab === 'history' ? (
          <History />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 font-medium">
             این بخش در حال توسعه است
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
