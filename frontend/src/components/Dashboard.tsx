import BookList from './BookList';
import { api } from '../services/api';

export default function Dashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>مكتبة فلسطين</h1>
        <button onClick={handleLogout} style={{ background: '#d32f2f', color: 'white', padding: '10px 20px', border: 'none' }}>
          تسجيل الخروج
        </button>
      </div>
      <BookList />
    </div>
  );
}