import React, { useState } from 'react';
import { Button, Section, Skeleton, Typography } from '@telegram-apps/telegram-ui';
import { useZxing } from "react-zxing";
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import $api from '@/api';

export const QRAuthPage: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const navigate = useNavigate();

  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
      handleQRData(result.getText());
      setIsScanning(false);
    },
    onError() {
      setError("Ошибка при сканировании QR-кода");
    },
  });

  const { mutateAsync, isPending, status } = $api.useMutation('post', `/api/auth/qr-code/confirm`, { retry: false })

  const handleQRData = async (qrData: string) => {
    if (isScanning) return;
    try {
      mutateAsync({
        body: {
          code: qrData,
        }
      });
    } catch (err) {
      setError("Произошла ошибка при выполненнии запроса");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography style={{ marginBottom: '20px', textAlign: 'center' }}>
        Нажмите кнопку для сканирования QR-кода и авторизации в другом приложении
      </Typography>

      {isScanning && !result && status !== 'pending' ? (
        <video style={{ display: 'block', width: '80vw', height: '50vh', borderRadius: '50px', overflow: 'hidden', objectFit: 'cover', margin: '0 auto' }} ref={ref} />
      ) :
        (
          <Skeleton style={{ width: '100%', maxWidth: '30rem', maxHeight: '10rem', margin: '0 auto' }} />
        )
      }

      {result && !isPending && status === 'success' && (
        <Section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Check width={32} height={32} style={{ color: 'green' }} />
            <Typography style={{ marginTop: '20px', textAlign: 'center' }}>
              Авторизация успешна!
            </Typography>
          </div>
          <div style={{ marginTop: '20px' }}>
            <Button onClick={() => navigate('/')}>
              Вернуться на главную страницу
            </Button>
          </div>
        </Section>
      )}

      {error && (
        <Section>
          <Typography style={{ marginTop: '20px', color: 'red', textAlign: 'center' }}>
            {error}
          </Typography>
          <Button style={{ marginTop: '20px' }} onClick={() => window.location.reload()}>Перезагрузить страницу</Button>
        </Section>
      )}
    </div>
  );
};