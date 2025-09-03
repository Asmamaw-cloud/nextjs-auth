'use client';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';

export default function MfaSetup({ userId }: { userId: string }) {
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    axios.post('/api/auth/mfa/setup', { userId }).then(res => setQrCode(res.data.qrCodeDataURL));
  }, [userId]);

  return qrCode ? <QRCode value={qrCode} /> : <p>Loading QR Code...</p>;
}
