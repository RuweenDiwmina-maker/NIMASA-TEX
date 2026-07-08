import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Lightweight pure JS MD5 helper
function md5(string) {
  function RotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function AddUnsigned(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  }
  function F(x, y, z) { return (x & y) | ((~x) & z); }
  function G(x, y, z) { return (x & z) | (y & (~z)); }
  function H(x, y, z) { return (x ^ y ^ z); }
  function I(x, y, z) { return (y ^ (x | (~z))); }
  function FF(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function GG(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function HH(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function II(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }
  function ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lMessageLength + 8 - ((lMessageLength + 8) % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = Array(lNumberOfWords);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  function WordToHex(lValue) {
    var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }
  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }
  var x = Array();
  var k, AA, BB, CC, DD, a, b, c, d;
  var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
  string = Utf8Encode(string);
  x = ConvertToWordArray(string);
  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  for (k = 0; k < x.length; k += 16) {
    AA = a; BB = b; CC = c; DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = AddUnsigned(a, AA); b = AddUnsigned(b, BB); c = AddUnsigned(c, CC); d = AddUnsigned(d, DD);
  }
  var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
  return temp.toLowerCase();
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalItems, clearCart } = useCart();
  const { user, updateUserPoints } = useAuth();
  
  const [deliveryMethod, setDeliveryMethod] = useState('deliver');
  const [shippingOption, setShippingOption] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formValid, setFormValid] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);
  const [targetRoute, setTargetRoute] = useState('');
  const [usePoints, setUsePoints] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    phone: ''
  });

  // Load PayHere script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sandbox.payhere.lk/lib/payhere.js";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Auto-fill checkout form if user is logged in
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: firstName || prev.firstName,
        lastName: lastName || prev.lastName,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        city: user.city !== undefined ? user.city : prev.city
      }));
    }
  }, [user]);

  const [billingOption, setBillingOption] = useState('same');
  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Check if basic customer details are filled
    const basicValid = !!(formData.firstName && formData.lastName && formData.address && formData.phone);
    if (!basicValid) {
      setFormValid(false);
      return;
    }
    
    if (paymentMethod === 'cod') {
      setFormValid(!!user); // COD is only for logged in users
    } else {
      setFormValid(true); // for PayHere card payment or other methods
    }
  }, [formData, paymentMethod, user]);

  // Lock body scroll when leave modal is open
  useEffect(() => {
    if (showLeaveModal || showSuccessModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLeaveModal, showSuccessModal]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = shippingOption === 'standard' ? 500 : 1000;
  
  const userPoints = user?.isLoyaltyMember ? (user?.points || 0) : 0;
  const pointsDiscount = (user?.isLoyaltyMember && usePoints) ? Math.min(userPoints, subtotal) : 0;
  const codFee = paymentMethod === 'cod' ? 40 : 0;
  const total = subtotal + deliveryFee - pointsDiscount + codFee;
  const earnedPoints = user?.isLoyaltyMember ? Math.floor((subtotal - pointsDiscount) / 100) : 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(price);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBillingChange = (e) => {
    setBillingData({ ...billingData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!formValid) return;
    
    if (paymentMethod === 'cod' && !user) {
      alert("Members only feature: Please log in to use Cash on Delivery.");
      return;
    }

    if (paymentMethod === 'card') {
      if (!window.payhere) {
        alert("Payment gateway is loading, please try again in a moment.");
        return;
      }

      // Generate a unique order ID
      const orderId = `NT-${Date.now()}`;
      const merchantId = "1236780";
      const merchantSecret = "MTAyNzY0Nzg0MDQxMzI2Mjc3ODA0MDU5MTIxNjIzMjIwNTk1NjM2Mw==";
      
      // Calculate the PayHere hash
      // hash = uppercase(md5(merchant_id + order_id + amount + currency + uppercase(md5(merchant_secret))))
      const amountFormatted = total.toFixed(2);
      const currency = "LKR";
      const hashedSecret = md5(merchantSecret).toUpperCase();
      const inputStr = merchantId + orderId + amountFormatted + currency + hashedSecret;
      const paymentHash = md5(inputStr).toUpperCase();

      const payment = {
        sandbox: true,
        merchant_id: merchantId,
        return_url: "https://www.nimasatex.com/checkout",
        cancel_url: "https://www.nimasatex.com/checkout",
        notify_url: "https://www.nimasatex.com/checkout",
        order_id: orderId,
        items: `Nimasa Tex Order #${orderId}`,
        amount: amountFormatted,
        currency: currency,
        hash: paymentHash,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email || (user ? user.email : 'guest@nimasatex.com'),
        phone: formData.phone,
        address: formData.address,
        city: formData.city || 'Colombo',
        country: "Sri Lanka",
        delivery_address: formData.address,
        delivery_city: formData.city || 'Colombo',
        delivery_country: "Sri Lanka"
      };

      // Set callbacks
      window.payhere.onCompleted = async function (payhereOrderId) {
        try {
          const orderData = {
            items: cartItems,
            totalAmount: total,
            customerDetails: { ...formData, email: user ? user.email : '' },
            shippingMethod: deliveryMethod,
            shippingOption: deliveryMethod === 'deliver' ? shippingOption : null,
            paymentMethod: 'card',
            paymentDetails: {
              payhereOrderId: payhereOrderId,
              orderId: orderId,
              status: 'paid'
            },
            billingDetails: billingOption === 'different' ? billingData : null,
            userId: user ? user.uid : null,
            createdAt: serverTimestamp(),
            status: 'paid'
          };

          const docRef = await addDoc(collection(db, 'orders'), orderData);
          setPlacedOrderId(docRef.id);
          setCompletedOrder(orderData);

          if (user && user.isLoyaltyMember) {
            const finalPoints = userPoints - pointsDiscount + earnedPoints;
            await updateUserPoints(user.uid, finalPoints);
          }

          setSuccessMessage(`Payment successful! Order placed successfully!${user?.isLoyaltyMember ? ` You earned ${earnedPoints} points.` : ''} Thank you for shopping with Nimasa Tex.`);
          setShowSuccessModal(true);
          clearCart();
        } catch (error) {
          console.error("Error creating order after payment: ", error);
          alert("Payment was successful but there was an error saving your order. Please contact our support team.");
        }
      };

      window.payhere.onDismissed = function () {
        console.log("Payment dismissed");
      };

      window.payhere.onError = function (error) {
        console.error("Payment error:", error);
        alert("Payment failed: " + error);
      };

      window.payhere.startPayment(payment);
    } else {
      // Cash on Delivery (COD) payment
      try {
        const orderData = {
          items: cartItems,
          totalAmount: total,
          customerDetails: { ...formData, email: user ? user.email : '' },
          shippingMethod: deliveryMethod,
          shippingOption: deliveryMethod === 'deliver' ? shippingOption : null,
          paymentMethod: paymentMethod,
          paymentDetails: null,
          billingDetails: billingOption === 'different' ? billingData : null,
          userId: user ? user.uid : null,
          createdAt: serverTimestamp(),
          status: 'pending'
        };

        const docRef = await addDoc(collection(db, 'orders'), orderData);
        setPlacedOrderId(docRef.id);
        setCompletedOrder(orderData);

        if (user && user.isLoyaltyMember) {
          const finalPoints = userPoints - pointsDiscount + earnedPoints;
          await updateUserPoints(user.uid, finalPoints);
        }

        setSuccessMessage(`Order placed successfully!${user?.isLoyaltyMember ? ` You earned ${earnedPoints} points.` : ''} Thank you for shopping with Nimasa Tex.`);
        setShowSuccessModal(true);
        clearCart();
      } catch (error) {
        console.error("Error placing order: ", error);
        setSuccessMessage("There was an error placing your order. Please try again.");
        setShowSuccessModal(true);
      }
    }
  };

  const handleLeaveClick = (e, route) => {
    e.preventDefault();
    setTargetRoute(route);
    setShowLeaveModal(true);
  };
  
  const confirmLeave = () => {
    navigate(targetRoute);
  };

  const generateReceipt = () => {
    if (!completedOrder || !placedOrderId) return;
    
    const receiptWin = window.open('', '_blank');
    if (!receiptWin) {
      alert("Please allow popups to download the receipt.");
      return;
    }

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    let itemsHtml = '';
    completedOrder.items.forEach(item => {
      itemsHtml += `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px dashed #ccc;">
            <div style="font-weight: 600;">${item.name}</div>
            <div style="font-size: 12px; color: #555;">Size: ${item.size || 'N/A'}</div>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px dashed #ccc; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 0; border-bottom: 1px dashed #ccc; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
        </tr>
      `;
    });

    const subtotal = completedOrder.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = completedOrder.shippingMethod === 'deliver' ? (completedOrder.shippingOption === 'standard' ? 500 : 1000) : 0;
    const codFee = completedOrder.paymentMethod === 'cod' ? 40 : 0;

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - Nimasa Tex #${placedOrderId.slice(-6).toUpperCase()}</title>
        <style>
          body { font-family: 'Courier New', Courier, monospace; margin: 0; padding: 40px; color: #000; background: #fff; }
          .receipt-container { max-width: 400px; margin: 0 auto; border: 1px solid #eee; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
          .header { text-align: center; margin-bottom: 30px; }
          .header img { height: 40px; margin-bottom: 10px; }
          .header h1 { font-family: sans-serif; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; margin: 0 0 5px; text-transform: uppercase; }
          .header p { margin: 0; font-size: 14px; color: #555; }
          .divider { border-top: 2px dashed #000; margin: 20px 0; }
          .info { margin-bottom: 20px; font-size: 14px; line-height: 1.6; }
          .info-row { display: flex; justify-content: space-between; }
          table { width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px; }
          th { text-align: left; padding-bottom: 10px; border-bottom: 2px dashed #000; }
          .totals { font-size: 14px; line-height: 1.6; }
          .totals-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .totals-row.grand-total { font-size: 18px; font-weight: bold; border-top: 2px dashed #000; padding-top: 10px; margin-top: 10px; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #555; }
          @media print {
            body { padding: 0; }
            .receipt-container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="no-print" style="text-align: center; margin-bottom: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #111; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Print / Save as PDF</button>
          </div>
          <div class="header">
            <h1>NIMASA TEX</h1>
            <p>Premium Fashion Store</p>
            <p>123 Fashion Street, Colombo 03</p>
            <p>Tel: +94 11 234 5678</p>
          </div>
          
          <div class="info">
            <div class="info-row"><span>Order ID:</span> <strong>#${placedOrderId.slice(-6).toUpperCase()}</strong></div>
            <div class="info-row"><span>Date:</span> <span>${today}</span></div>
            <div class="info-row"><span>Customer:</span> <span>${completedOrder.customerDetails.firstName} ${completedOrder.customerDetails.lastName}</span></div>
            <div class="info-row"><span>Payment:</span> <span style="text-transform: uppercase;">${completedOrder.paymentMethod}</span></div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>${formatPrice(subtotal)}</span>
            </div>
            <div class="totals-row">
              <span>Shipping:</span>
              <span>${formatPrice(shipping)}</span>
            </div>
            ${codFee > 0 ? `
            <div class="totals-row">
              <span>COD Fee:</span>
              <span>${formatPrice(codFee)}</span>
            </div>` : ''}
            <div class="totals-row grand-total">
              <span>TOTAL:</span>
              <span>${formatPrice(completedOrder.totalAmount)}</span>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <div class="footer">
            <p style="font-weight: bold; font-size: 16px; margin-bottom: 5px; color: #000;">Thank you for shopping!</p>
            <p>Exchange within 14 days with original receipt and tags attached.</p>
            <p>www.nimasatex.com</p>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    
    receiptWin.document.open();
    receiptWin.document.write(receiptHtml);
    receiptWin.document.close();
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '0' }}>
      {/* Minimal Header */}
      <header className="checkout-header">
        <a href="/" className="logo" onClick={(e) => handleLeaveClick(e, '/')}>
          <img src="/images/full_logo.png" alt="Nimasa Tex" style={{ height: '40px', objectFit: 'contain' }} />
        </a>
        <div className="checkout-header-actions">
          <a href="/cart.html" style={{ color: 'var(--color-black)' }} onClick={(e) => handleLeaveClick(e, '/cart.html')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </a>
        </div>
      </header>

      <main className="checkout-container">
        
        {/* Summary Accordion - Mobile Only */}
        <div className="checkout-mobile-summary">
          <div className="checkout-summary-accordion">
            <div className="summary-accordion-header">
              <span>Summary</span>
              <span className="summary-accordion-price">{formatPrice(total)} ({totalItems} item{totalItems !== 1 && 's'}) ▾</span>
            </div>
            {usePoints && (
              <div style={{ color: '#00C896', fontSize: '0.9rem', marginBottom: '10px' }}>
                Points Discount Applied: -{formatPrice(pointsDiscount)}
              </div>
            )}
            <div className="summary-free-shipping">
              Add {formatPrice(15000)} more to earn Free Shipping!
            </div>
            <div className="shipping-progress-bar">
              <div className="shipping-progress-fill" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-left-col">
          {/* Delivery Section */}
          <div className="checkout-section">
          <h2 className="checkout-section-title">Delivery</h2>
          
          <div className="toggle-group">
            <button 
              className={`toggle-btn ${deliveryMethod === 'deliver' ? 'active' : ''}`}
              onClick={() => setDeliveryMethod('deliver')}
            >
              <span style={{ fontSize: '20px' }}>🚚</span>
              Deliver It
            </button>
            <button 
              className={`toggle-btn ${deliveryMethod === 'pickup' ? 'active' : ''}`}
              onClick={() => setDeliveryMethod('pickup')}
            >
              <span style={{ fontSize: '20px' }}>🏬</span>
              Pick It Up
            </button>
          </div>



          <div className="floating-input-group">
            <input type="text" name="firstName" className="floating-input" placeholder=" " value={formData.firstName} onChange={handleChange} required />
            <label className="floating-label">First Name *</label>
          </div>

          <div className="floating-input-group">
            <input type="text" name="lastName" className="floating-input" placeholder=" " value={formData.lastName} onChange={handleChange} required />
            <label className="floating-label">Last Name *</label>
          </div>

          <div className="floating-input-group">
            <input type="text" name="address" className="floating-input" placeholder=" " value={formData.address} onChange={handleChange} required />
            <label className="floating-label">Start typing a street address or postcode *</label>
            <div className="input-helper-text">We do not ship to P.O. boxes</div>
          </div>
          


          <div className="floating-input-group">
            <input type="tel" name="phone" className="floating-input" placeholder=" " value={formData.phone} onChange={handleChange} required />
            <label className="floating-label">Phone Number *</label>
            <div className="input-helper-text">A carrier might contact you to confirm delivery.</div>
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="billingMatch" defaultChecked />
            <label htmlFor="billingMatch">Billing matches shipping address</label>
          </div>
        </div>

        {/* Shipping Options */}
        <div className="checkout-section">
          <h2 className="checkout-section-title">Shipping</h2>

          <div className="selection-box" style={{ marginBottom: '1.5rem', cursor: 'default' }}>
            <div className="selection-box-left">
              <span className="selection-box-title">Free shipping and returns for members</span>
              <span className="selection-box-desc">Become a Member</span>
            </div>
          </div>

          <div 
            className={`selection-box ${shippingOption === 'standard' ? 'active' : ''}`}
            onClick={() => setShippingOption('standard')}
          >
            <div className="selection-box-left">
              <span className="selection-box-title">Arrives in 2-4 Business Days</span>
            </div>
            <div className="selection-box-right">{formatPrice(500)}</div>
          </div>

          <div 
            className={`selection-box ${shippingOption === 'express' ? 'active' : ''}`}
            onClick={() => setShippingOption('express')}
          >
            <div className="selection-box-left">
              <span className="selection-box-title">Arrives Next Business Day</span>
            </div>
            <div className="selection-box-right">{formatPrice(1000)}</div>
          </div>
        </div>

        {/* Payment */}
        <div className="checkout-section">
          <h2 className="checkout-section-title">Payment</h2>
          
          <div className="checkout-payment-accordion">
            {/* Payzy */}
            <label className={`payment-accordion-item ${paymentMethod === 'card' ? 'active' : ''}`}>
              <div className="payment-accordion-header">
                <div className="payment-radio-left">
                  <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                  <span>Credit or Debit Card</span>
                </div>
                <div className="payment-icons">
                  <span className="payment-icon-badge" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                    <img src="/images/icons8-visa-144.png" alt="Visa" style={{ height: '24px', width: '38px', objectFit: 'contain', borderRadius: '3px' }} />
                  </span>
                  <span className="payment-icon-badge" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                    <img src="/images/ma_symbol_opt_73_1x.png" alt="Mastercard" style={{ height: '24px', width: '38px', objectFit: 'contain', borderRadius: '3px' }} />
                  </span>
                </div>
              </div>
              {paymentMethod === 'card' && (
                <div className="payment-accordion-body" style={{ backgroundColor: '#f6f8fb', padding: '1rem', borderTop: '1px solid var(--color-gray-200)', fontSize: '0.9rem', color: '#555', lineHeight: '1.5' }}>
                  🔒 <strong>Secure Payment via PayHere:</strong> Click "Place Order" below to pay securely using your Credit/Debit Card (Visa, Mastercard) via PayHere payment gateway.
                </div>
              )}
            </label>

            {/* Koko */}
            <label className={`payment-accordion-item ${paymentMethod === 'koko' ? 'active' : ''}`}>
              <div className="payment-accordion-header">
                <div className="payment-radio-left">
                  <input type="radio" name="payment" checked={paymentMethod === 'koko'} onChange={() => setPaymentMethod('koko')} />
                  <span>Koko: Buy Now Pay Later</span>
                </div>
                <div className="payment-icons">
                  <span className="payment-icon-badge"><span style={{ fontWeight: 800, color: '#f36', fontSize: '0.8rem' }}>Koko</span></span>
                </div>
              </div>
              {paymentMethod === 'koko' && (
                <div className="payment-accordion-body">
                  You'll be redirected to Koko to complete your purchase in 3 installments.
                </div>
              )}
            </label>


            {/* Cash on Delivery */}
            <label className={`payment-accordion-item ${paymentMethod === 'cod' ? 'active' : ''}`}>
              <div className="payment-accordion-header">
                <div className="payment-radio-left">
                  <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <span>Cash on Delivery (COD)</span>
                </div>
              </div>
              {paymentMethod === 'cod' && (
                <div className="payment-accordion-body">
                  {!user ? (
                    <div style={{ padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '8px', color: '#856404', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem', marginTop: '-2px' }}>⚠️</span>
                      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>
                        <strong>Members Only Feature:</strong> Cash on Delivery (COD) is exclusively available for registered Nimasa Tex members. Please <Link to="/login" style={{ color: '#856404', textDecoration: 'underline', fontWeight: '600', margin: '0 4px' }}>log in</Link> or <Link to="/signup" style={{ color: '#856404', textDecoration: 'underline', fontWeight: '600', marginLeft: '4px' }}>sign up</Link> to use this payment method.
                      </p>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', lineHeight: '1.4' }}>
                      The Cash on Delivery payment method requires an additional fee of Rs. 40.00 that you will have to pay at delivery. This fee will be added to your order total automatically and is required by our courier. If you have questions, feel free to contact us.
                    </p>
                  )}
                </div>
              )}
            </label>
            </div>
          </div>
          
          {/* Billing Address Section */}
          {paymentMethod === 'cod' && user && (
            <div className="checkout-section">
              <h2 className="checkout-section-title">Billing address</h2>
              <div className="checkout-payment-accordion">
                <label className={`payment-accordion-item ${billingOption === 'same' ? 'active' : ''}`}>
                  <div className="payment-accordion-header">
                    <div className="payment-radio-left">
                      <input type="radio" name="billing" checked={billingOption === 'same'} onChange={() => setBillingOption('same')} />
                      <span>Same as shipping address</span>
                    </div>
                  </div>
                </label>
                
                <label className={`payment-accordion-item ${billingOption === 'different' ? 'active' : ''}`}>
                  <div className="payment-accordion-header">
                    <div className="payment-radio-left">
                      <input type="radio" name="billing" checked={billingOption === 'different'} onChange={() => setBillingOption('different')} />
                      <span>Use a different billing address</span>
                    </div>
                  </div>
                  {billingOption === 'different' && (
                    <div className="payment-accordion-body" style={{ backgroundColor: '#f6f8fb', padding: '1rem', borderTop: '1px solid var(--color-gray-200)' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <select style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--color-gray-400)' }}>
                          <option>Sri Lanka</option>
                        </select>
                      </div>
                      <div className="form-row">
                        <div className="floating-input-group">
                          <input type="text" name="firstName" className="floating-input" placeholder=" " value={billingData.firstName} onChange={handleBillingChange} />
                          <label className="floating-label">First name</label>
                        </div>
                        <div className="floating-input-group">
                          <input type="text" name="lastName" className="floating-input" placeholder=" " value={billingData.lastName} onChange={handleBillingChange} />
                          <label className="floating-label">Last name</label>
                        </div>
                      </div>
                      <div className="floating-input-group">
                        <input type="text" name="address" className="floating-input" placeholder=" " value={billingData.address} onChange={handleBillingChange} />
                        <label className="floating-label">Address</label>
                      </div>
                      <div className="floating-input-group">
                        <input type="text" name="apartment" className="floating-input" placeholder=" " value={billingData.apartment} onChange={handleBillingChange} />
                        <label className="floating-label">Apartment, suite, etc. (optional)</label>
                      </div>
                      <div className="form-row">
                        <div className="floating-input-group">
                          <input type="text" name="city" className="floating-input" placeholder=" " value={billingData.city} onChange={handleBillingChange} />
                          <label className="floating-label">City</label>
                        </div>
                        <div className="floating-input-group">
                          <input type="text" name="postalCode" className="floating-input" placeholder=" " value={billingData.postalCode} onChange={handleBillingChange} />
                          <label className="floating-label">Postal code (optional)</label>
                        </div>
                      </div>
                      <div className="floating-input-group">
                        <input type="tel" name="phone" className="floating-input" placeholder=" " value={billingData.phone} onChange={handleBillingChange} />
                        <label className="floating-label">Phone (optional)</label>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-right-col">
          <div className="checkout-desktop-summary">
            {/* Loyalty Points */}
            {user && user.isLoyaltyMember && (
              <div className="points-redemption-box" style={{ padding: '1.2rem', border: '1px solid var(--color-gray-200)', borderRadius: '8px', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>Loyalty Points</span>
                  <span style={{ fontWeight: 700, color: '#00C896' }}>{userPoints} Available</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', marginBottom: '1rem' }}>
                  You can use your points for a discount! (1 Point = 1 LKR). 
                  You will also earn <strong>{earnedPoints} points</strong> on this order.
                </p>
                {userPoints > 0 ? (
                  <div className="checkbox-group" style={{ marginBottom: 0 }}>
                    <input 
                      type="checkbox" 
                      id="usePoints" 
                      checked={usePoints} 
                      onChange={(e) => setUsePoints(e.target.checked)} 
                    />
                    <label htmlFor="usePoints">Use points for {formatPrice(Math.min(userPoints, subtotal))} discount</label>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', fontStyle: 'italic' }}>
                    No points available to redeem yet.
                  </div>
                )}
              </div>
            )}

            {/* Item Summary (Actual Cart Items) */}
            <div className="checkout-items-summary" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="checkout-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {cartItems.map((item, index) => (
                  <div className="checkout-item-row" key={`${item.id}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative', width: '64px', height: '64px', border: '1px solid var(--color-gray-200)', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={item.image || '/images/default.jpg'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }} />
                      <span style={{
                        position: 'absolute', top: '-10px', right: '-10px', background: '#000', 
                        color: '#fff', fontSize: '12px', fontWeight: '500', width: '22px', height: '22px', borderRadius: '50%', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #fafafa'
                      }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className="checkout-item-details" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--color-gray-900)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>{item.size}</div>
                    </div>
                    <div className="checkout-item-price" style={{ fontWeight: 500, fontSize: '0.95rem' }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>


              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--color-gray-700)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem' }}>Subtotal</span>
                  <span style={{ fontWeight: 500 }}>{formatPrice(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    Shipping
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-gray-500)' }}><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </span>
                  <span style={{ fontWeight: 500 }}>{formatPrice(deliveryFee)}</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.95rem' }}>COD Fee</span>
                    <span style={{ fontWeight: 500 }}>{formatPrice(40)}</span>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-gray-900)' }}>Total</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>LKR</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-gray-900)' }}>{formatPrice(total).replace('LKR', '').trim()}</span>
                </div>
              </div>
            </div>

        {/* Place Order */}
        <div className="terms-text">
          By clicking Place Order, you agree to the Nimasa Tex <a href="#">Terms and Conditions</a>.
        </div>
          <button 
            className={`btn-place-order ${formValid && !(paymentMethod === 'cod' && !user) ? 'enabled' : ''}`} 
            onClick={handlePlaceOrder}
            disabled={!formValid || (paymentMethod === 'cod' && !user)}
          >
            Place Order
          </button>
          </div>
        </div>
        </div>

      </main>

      <footer className="checkout-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Sri Lanka
        </div>
        <div className="checkout-footer-links">
          <a href="#">Terms of Use</a>
          <a href="#">Terms of Sale</a>
          <a href="#">Privacy Policy</a>
        </div>
      </footer>

      {/* Leave Checkout Modal */}
      {showLeaveModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            background: 'white', padding: '2.5rem 2rem', borderRadius: '16px',
            width: '90%', maxWidth: '400px', textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 500, marginBottom: '1rem' }}>Leaving Checkout</h2>
            <p style={{ color: 'var(--color-gray-800)', marginBottom: '2rem', lineHeight: '1.5', fontSize: '0.95rem' }}>
              Your checkout session will be lost. Do you want to leave checkout?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button 
                onClick={confirmLeave}
                style={{ padding: '1.1rem', background: 'var(--color-black)', color: 'white', borderRadius: '30px', border: 'none', fontWeight: '500', fontSize: '1rem', cursor: 'pointer' }}
              >
                Leave Checkout
              </button>
              <button 
                onClick={() => setShowLeaveModal(false)}
                style={{ padding: '1.1rem', background: 'white', color: 'var(--color-black)', borderRadius: '30px', border: '1px solid var(--color-gray-400)', fontWeight: '500', fontSize: '1rem', cursor: 'pointer' }}
              >
                Resume Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '40px 30px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: successMessage.includes('error') ? '#fee2e2' : '#dcfce7', color: successMessage.includes('error') ? '#ef4444' : '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              {successMessage.includes('error') ? (
                <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              )}
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#111' }}>
              {successMessage.includes('error') ? 'Oops!' : 'Success!'}
            </h3>
            <p style={{ color: '#555', fontSize: '1rem', lineHeight: '1.6', marginBottom: placedOrderId ? '15px' : '30px' }}>
              {successMessage}
            </p>
            {placedOrderId && (
              <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px dashed #cbd5e1', marginBottom: '30px' }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '5px', fontWeight: '600', textTransform: 'uppercase' }}>Your Order ID</p>
                <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', margin: 0, letterSpacing: '1px' }}>
                  #{placedOrderId.slice(-6).toUpperCase()}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>Save this ID to track your order.</p>
                {completedOrder && (
                  <button
                    onClick={generateReceipt}
                    style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#fff', color: '#111', border: '1px solid #111', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#111'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#111'; }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Receipt
                  </button>
                )}
              </div>
            )}
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                if (!successMessage.includes('error')) {
                  navigate('/');
                }
              }}
              style={{ width: '100%', padding: '15px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#111'}
            >
              {successMessage.includes('error') ? 'Try Again' : 'Continue Shopping'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
