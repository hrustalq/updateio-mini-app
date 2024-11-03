import React, { useState, useCallback } from 'react';
import { Button, Section, Skeleton, Typography } from '@telegram-apps/telegram-ui';
import { useZxing } from "react-zxing";
import { Check, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import $api from '@/api';
import jsQR from 'jsqr';

export const QRAuthPage: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
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

  const { mutateAsync, isPending, status } = $api.useMutation('post', `/api/auth/qr-code/confirm`, { retry: false });

  const handleQRData = async (qrData: string) => {
    if (!qrData) return;
    try {
      await mutateAsync({
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

  const processQRImage = async (file: File) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = async (e) => {
      image.src = e.target?.result as string;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setResult(code.data);
          handleQRData(code.data);
        } else {
          setError("QR-код не найден в изображении");
        }
      };
    };

    reader.readAsDataURL(file);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processQRImage(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processQRImage(file);
    }
  }, []);

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography style={{ marginBottom: '20px', textAlign: 'center' }}>
        Отсканируйте QR-код через камеру или загрузите изображение
      </Typography>

      {isScanning && !result && status !== 'pending' ? (
        <>
          <div
            style={{
              width: '80vw',
              height: '50vh',
              position: 'relative',
              borderRadius: '50px',
              overflow: 'hidden',
              margin: '0 auto',
              border: isDragging ? '2px dashed #007AFF' : '2px dashed #ccc',
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <video 
              style={{ 
                display: 'block', 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
              ref={ref} 
            />
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '10px'
            }}>
              <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                <Button>
                  <Upload size={20} style={{ marginRight: '8px' }} />
                  Загрузить QR-код
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <Typography style={{ marginTop: '10px', textAlign: 'center', color: '#666' }}>
            Перетащите изображение QR-кода сюда или используйте камеру
          </Typography>
        </>
      ) : (
        <Skeleton style={{ width: '100%', maxWidth: '30rem', maxHeight: '10rem', margin: '0 auto' }} />
      )}

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
          <Button style={{ marginTop: '20px' }} onClick={() => window.location.reload()}>
            Перезагрузить страницу
          </Button>
        </Section>
      )}
    </div>
  );
};