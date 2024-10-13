import React, { useCallback, useState } from 'react';
import { Button, Section, Skeleton, Typography } from '@telegram-apps/telegram-ui';
import { useZxing } from "react-zxing";
import { useMutation } from '@tanstack/react-query';
import { confirmQr } from '@/api';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  const { mutateAsync, isPending } = useMutation({
    mutationFn: confirmQr
  })

  const handleQRData = async (qrData: string) => {
    if (isScanning) return;
    try {
      await mutateAsync(qrData);
    } catch (err) {
      setError("Произошла ошибка при выполненнии запроса");
    } finally {
      setIsScanning(false);
    }
  };

  const retry = useCallback(() => {
    setResult(null);
    setError(null);
    setIsScanning(true);
  }, [])

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography style={{ marginBottom: '20px', textAlign: 'center' }}>
        Нажмите кнопку для сканирования QR-кода и авторизации в другом приложении
      </Typography>

      {isScanning && !result ? (
        <video style={{ display: 'block', width: '80vw', height: '50vh', borderRadius: '50px', overflow: 'hidden', objectFit: 'cover', margin: '0 auto' }} ref={ref} />
      ) :
        (
          <Skeleton style={{ width: '100%', maxWidth: '30rem', maxHeight: '10rem', margin: '0 auto' }} />
        )
      }

      {result && !isPending && (
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
          <Button style={{ marginTop: '20px' }} onClick={() => retry()}>Попробовать еще раз</Button>
        </Section>
      )}
    </div>
  );
};