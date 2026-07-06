import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, documentId, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';

const TrackOrder = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

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
        
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', color: '#111', letterSpacing: '-1px' }}>My Orders</h1>
            <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>
              View your order history and current status.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '5px', backgroundColor: '#f1f5f9', padding: '5px', borderRadius: '10px' }}>
            {['all', 'active', 'delivered', 'cancelled'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{ 
                  padding: '8px 16px', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: activeFilter === filter ? '#fff' : 'transparent',
                  color: activeFilter === filter ? '#111' : '#64748b',
                  boxShadow: activeFilter === filter ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {filter === 'active' ? 'Active Orders' : filter}
              </button>
            ))}
          </div>
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
            {orders.filter(order => {
              if (activeFilter === 'active') return order.status === 'pending' || order.status === 'shipped';
              if (activeFilter === 'delivered') return order.status === 'delivered';
              if (activeFilter === 'cancelled') return order.status === 'cancelled';
              return true;
            }).map((order) => (
              <div key={order.id} style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #eee', overflow: 'hidden' }}>
                <div style={{ padding: '15px 20px', backgroundColor: '#f8fafc', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Order Placed</p>
                    <h3 style={{ margin: '3px 0 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: '700' }}>#{order.id.slice(-6).toUpperCase()}</h3>
                  </div>
                  <div>
                    <span style={{ 
                      padding: '8px 16px', 
                      borderRadius: '30px', 
                      fontSize: '0.85rem', 
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      backgroundColor: order.status === 'pending' ? '#fef3c7' : order.status === 'cancelled' ? '#fee2e2' : order.status === 'shipped' ? '#dbeafe' : '#d1fae5', 
                      color: order.status === 'pending' ? '#92400e' : order.status === 'cancelled' ? '#ef4444' : order.status === 'shipped' ? '#1e40af' : '#065f46'
                    }}>
                      {order.status || 'PENDING'}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                    <div>
                      <p style={{ margin: '0 0 5px', fontSize: '0.85rem', color: '#64748b' }}>Date Placed</p>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: '#1e293b' }}>
                        {order.createdAt ? new Date(order.createdAt.toMillis()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 5px', fontSize: '0.85rem', color: '#64748b' }}>Total Amount</p>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: '#1e293b' }}>{formatPrice(order.totalAmount)}</p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 5px', fontSize: '0.85rem', color: '#64748b' }}>Payment Method</p>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: '#1e293b', textTransform: 'capitalize' }}>
                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}
                      </p>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '15px', color: '#111', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    Items in this order {order.items?.length > 1 && <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: '#8b5cf6', color: '#fff', borderRadius: '4px', marginLeft: '10px', verticalAlign: 'middle' }}>GROUP ORDER</span>}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                        <img src={item.image} alt={item.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 3px', fontWeight: '600', fontSize: '0.95rem', color: '#1e293b' }}>{item.name}</p>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Qty: {item.quantity}</p>
                        </div>
                        <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#111' }}>
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
