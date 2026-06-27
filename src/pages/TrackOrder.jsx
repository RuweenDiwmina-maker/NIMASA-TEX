import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, documentId, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';

const TrackOrder = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserOrders();
  }, [user]);

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const ordersRef = collection(db, 'orders');
      let fetchedOrders = [];

      if (user) {
        // Fetch logged in user's orders
        const q = query(ordersRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() });
        });
      }

      // Sort by newest first
      fetchedOrders.sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });

      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(price);
  };

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', padding: '120px 20px 60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', color: '#111', letterSpacing: '-1px' }}>My Orders</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            View your order history and current status.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #eee' }}>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#94a3b8' }}>
              <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#1e293b' }}>No orders found</h3>
            <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '30px' }}>
              You haven't placed any orders yet.
            </p>
            <Link to="/" style={{ display: 'inline-block', padding: '12px 30px', backgroundColor: '#111', color: '#fff', borderRadius: '30px', fontWeight: '600', textDecoration: 'none' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {orders.map((order) => (
              <div key={order.id} style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #eee', overflow: 'hidden' }}>
                <div style={{ padding: '20px 30px', backgroundColor: '#f8fafc', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Order Placed</p>
                    <h3 style={{ margin: '5px 0 0', fontSize: '1.4rem', color: '#0f172a', fontWeight: '700' }}>#{order.id.slice(-6).toUpperCase()}</h3>
                  </div>
                  <div>
                    <span style={{ 
                      padding: '8px 16px', 
                      borderRadius: '30px', 
                      fontSize: '0.85rem', 
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      backgroundColor: order.status === 'pending' ? '#fef3c7' : '#d1fae5', 
                      color: order.status === 'pending' ? '#92400e' : '#065f46'
                    }}>
                      {order.status || 'PENDING'}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '30px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                    <div>
                      <p style={{ margin: '0 0 5px', fontSize: '0.9rem', color: '#64748b' }}>Date Placed</p>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>
                        {order.createdAt ? new Date(order.createdAt.toMillis()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 5px', fontSize: '0.9rem', color: '#64748b' }}>Total Amount</p>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{formatPrice(order.totalAmount)}</p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 5px', fontSize: '0.9rem', color: '#64748b' }}>Payment Method</p>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', textTransform: 'capitalize' }}>
                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}
                      </p>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: '#111', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>Items in this order</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                        <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 5px', fontWeight: '600', color: '#1e293b' }}>{item.name}</p>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Qty: {item.quantity}</p>
                        </div>
                        <div style={{ fontWeight: '600', color: '#111' }}>
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default TrackOrder;
