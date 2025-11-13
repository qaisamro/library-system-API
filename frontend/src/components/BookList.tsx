import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Book {
  id?: number;
  title?: string;
  author?: string;
  availableCopies?: number;
  totalCopies?: number;
}

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api()
      .getBooks()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setBooks(data);
      })
      .catch(() => {
        alert('فشل جلب الكتب');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '30px', fontSize: '1.2rem' }}>جاري تحميل الكتب...</p>;
  }

  if (books.length === 0) {
    return <p style={{ textAlign: 'center', color: '#95a5a6', fontSize: '1.1rem' }}>لا توجد كتب متاحة حاليًا</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px', fontSize: '1.8rem' }}>
        الكتب المتاحة في مكتبة فلسطين
      </h2>
      <div style={{
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
      }}>
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '16px',
              padding: '20px',
              backgroundColor: '#fdfdfd',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}
          >
            <h3 style={{ margin: '0 0 12px', color: '#2c3e50', fontSize: '1.25rem', fontWeight: '600' }}>
              {book.title || 'بدون عنوان'}
            </h3>
            <p style={{ margin: '8px 0', color: '#7f8c8d', fontSize: '1rem' }}>
              <strong>المؤلف:</strong> {book.author || 'غير معروف'}
            </p>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontWeight: 'bold',
                color: book.availableCopies! > 0 ? '#27ae60' : '#e74c3c',
                fontSize: '1.1rem'
              }}>
                متاح: {book.availableCopies} / {book.totalCopies}
              </span>
              {book.availableCopies! > 0 ? (
                <span style={{
                  background: '#27ae60',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  متاح للاستعارة
                </span>
              ) : (
                <span style={{
                  background: '#e74c3c',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  غير متاح
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}