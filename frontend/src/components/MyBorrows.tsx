import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Borrow {
  id?: number;
  book?: { title?: string };
  status?: string;
}

export default function MyBorrows({ onReturn }: { onReturn: () => void }) {
  const [borrows, setBorrows] = useState<Borrow[]>([]);

  useEffect(() => {
    api().getMyBorrows()
      .then(res => setBorrows(res.data))
      .catch(() => alert('فشل جلب الإعارات'));
  }, []);

  const handleReturn = async (id: number) => {
    try {
      await api().returnBorrow(id);
      onReturn();
    } catch {
      alert('فشل الإرجاع');
    }
  };

  return (
    <div>
      <h2>إعاراتي</h2>
      {borrows.map(b => (
        <div key={b.id}>
          <strong>{b.book?.title}</strong> - {b.status}
          {b.status === 'borrowed' && (
            <button onClick={() => handleReturn(b.id!)}>إرجاع</button>
          )}
        </div>
      ))}
    </div>
  );
}