import { useState } from 'react';
import { api, updateToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('admin@lib.ps');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api().loginUser({ email, password });

      const token = res.data.token;
      if (!token) {
        throw new Error('لم يتم إرجاع توكن من الخادم');
      }

      updateToken(token); 
      alert('تم تسجيل الدخول بنجاح!');
      navigate('/books');
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'فشل تسجيل الدخول';
      setError(message);
      console.error('خطأ في تسجيل الدخول:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, textAlign: 'center' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>تسجيل الدخول - مكتبة فلسطين</h2>
      
      <form onSubmit={handleLogin} style={{ display: 'grid', gap: 15 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="البريد الإلكتروني"
          required
          style={{ padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="كلمة المرور"
          required
          style={{ padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            background: loading ? '#95a5a6' : '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 16,
            fontWeight: 'bold'
          }}
        >
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>

      {error && (
        <p style={{ color: '#e74c3c', marginTop: 15, fontWeight: 'bold' }}>
          {error}
        </p>
      )}

      <p style={{ marginTop: 20, color: '#7f8c8d', fontSize: '0.9rem' }}>
        جرب: <strong>admin@lib.ps</strong> / <strong>123456</strong>
      </p>
    </div>
  );
}