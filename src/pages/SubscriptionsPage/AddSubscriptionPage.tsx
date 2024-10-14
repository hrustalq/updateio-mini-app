import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Button,
  Input,
  Image,
  Badge,
  IconButton,
  Spinner,
} from '@telegram-apps/telegram-ui';
import { CardCell } from '@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardCell/CardCell';
import { CardChip } from '@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardChip/CardChip';
import { motion, AnimatePresence } from 'framer-motion';
import './AddSubscriptionPage.css';
import { useSubscriptionStore } from '@/stores/subscribtion.store';
import { Check } from 'lucide-react';
import debounce from 'lodash/debounce';
import $api from '@/api';

const ApplicationStep: React.FC = () => {
  const { application, setApplication } = useSubscriptionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10; // Количество элементов на странице

  // Создаем объект параметров запроса
  const queryParams = useMemo(() => {
    const params: { search?: string; page: number; pageSize: number } = {
      page,
      pageSize,
    };
    if (searchTerm) {
      params.search = searchTerm;
    }
    return params;
  }, [searchTerm, page]);

  // Используем useQuery с параметрами
  const { data: appsData, isLoading, isError } = $api.useQuery('get', '/api/apps', {
    params: {
      query: queryParams
    },
  });

  const apps = appsData?.data;
  const totalPages = appsData?.pageCount || 1;

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setPage(1); // Сбрасываем страницу при новом поиске
    }, 300),
    []
  );

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input
        placeholder="Поиск приложений"
        className="search-input"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedSearch(e.target.value)}
      />
      {isLoading && page === 1 ? (
        <div className="loading-container">
          <Spinner size="l" />
        </div>
      ) : isError ? (
        <Typography className="error-message" style={{ textAlign: 'center', display: 'block' }}>Произошла ошибка при загрузке приложений</Typography>
      ) : apps?.length === 0 ? (
        <Typography className="no-results">Приложения не найдены</Typography>
      ) : (
        <div style={{ height: '55dvh', overflow: 'auto', padding: '5px' }}>
          {apps?.map((app) => (
            <Card 
              key={app.id}
              onClick={() => setApplication(app)}
              className="application-card"
              style={{ 
                outline: application?.id === app.id ? '2px solid #3390EC' : '2px solid transparent',
                marginBottom: '16px',
              }}
            >
              <React.Fragment>
                {application?.id === app.id && (
                  <CardChip readOnly style={{ zIndex: 2000 }}>
                    Выбрано
                  </CardChip>
                )}
                <Image
                  src={app.image || '/fallback-app-image.webp'}
                  alt={app.name}
                  className="application-logo"
                />
                <CardCell readOnly>
                  {app.name}
                </CardCell>
              </React.Fragment>
            </Card>
          ))}
          {page < totalPages && (
            <Button onClick={handleLoadMore} style={{ width: '100%', marginTop: '1rem' }}>
              Загрузить еще
            </Button>
          )}
          {isLoading && page > 1 && (
            <div className="loading-container" style={{ marginTop: '1rem' }}>
              <Spinner size="m" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const GameStep: React.FC = () => {
  const { setGame, game, application } = useSubscriptionStore();
  const [searchTerm, setSearchTerm] = useState('');

  const query = useMemo(() => {
    const appId = application.id;
    const search = searchTerm.length > 0 && searchTerm;
    if (search) {
      return {
        appId,
        search,
      }
    } else return {
      appId,
    }
  }, [application.id, searchTerm])

  const  { data: games, isLoading, isError } = 
    $api.useQuery('get', '/api/games', {
      params: {
        query
      },
    },
    {
      enabled: !!application
    }
  );

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    [setSearchTerm]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input
        placeholder="Поиск игр"
        className="search-input"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedSearch(e.target.value)}
      />
      {isLoading ? (
        <div className="loading-container">
          <Spinner size="l" />
        </div>
      ) : isError ? (
        <Typography className="error-message" style={{ textAlign: 'center', display: 'block' }}>Произошла ошибка при загрузке игр</Typography>
      ) : games && games?.data?.length === 0 ? (
        <Typography className="no-results">Игры не найдены</Typography>
      ) : (
        <div style={{ height: '55dvh', overflow: 'auto', padding: '5px' }}>
          {games?.data?.map((currentGame) => (
            <Card 
              key={currentGame.id}
              onClick={() => setGame(currentGame)}
              className="game-card"
              style={{ 
                outline: game?.id === currentGame.id ? '2px solid #3390EC' : '2px solid transparent',
                marginBottom: '16px',
              }}
            >
              <React.Fragment>
                <Badge style={{ position: 'absolute', top: '1.5rem', left: '0.5rem', zIndex: 2000 }} type="number">{application?.name}</Badge>
                {game?.id === currentGame.id && (
                  <CardChip readOnly style={{ zIndex: 2000 }}>
                    Выбрано
                  </CardChip>
                )}
                { currentGame.image && (
                  <Image
                    src={currentGame.image}
                    alt={currentGame.name}
                    className="game-logo"
                  />
                ) }
                <CardCell readOnly>
                  {currentGame.name}
                </CardCell>
              </React.Fragment>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const SuccessStep: React.FC = () => {
  const { game, application, reset } = useSubscriptionStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending, isSuccess } = $api.useMutation('post', '/api/subscriptions');

  const handleCreateSubscription = () => {
    if (!game || !application) {
      setError("Игра или приложение не выбраны");
      return;
    }

    mutate({
      body: {
        appId: application.id,
        gameId: game.id,
        isSubscribed: true,
      }
    });
  };

  const handleReturnHome = () => {
    reset();
    navigate('/');
  };

  if (isPending) {
    return (
      <div className="loading-container">
        <Spinner size="l" />
        <Typography>Создание подписки...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <Typography>{error}</Typography>
        <Button onClick={handleCreateSubscription}>Попробовать снова</Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="success-message">
        <IconButton name="check-circle" size="l" color="var(--tgui--primary_color)">
          <Check size={64} className="success-icon" />
        </IconButton>
        <Typography className="success-message__title">
          Подписка успешно добавлена!
        </Typography>
        <Typography>
          Вы будете получать уведомления об обновлениях для игры {game?.name} в приложении {application?.name}.
        </Typography>
        <Button onClick={handleReturnHome} className="home-link">
          Вернуться на главную
        </Button>
      </div>
    );
  }

  return (
    <div className="confirm-subscription">
      <Card className="confirm-subscription__card">
        <Typography weight='2' className="confirm-subscription__title">
          Подтверждение подписки
        </Typography>
        <div className="confirm-subscription__details">
          <div className="confirm-subscription__app">
            <Image
              src={application?.image || '/fallback-app-image.webp'}
              alt={application?.name}
              className="confirm-subscription__app-logo"
            />
            <Typography>{application?.name}</Typography>
          </div>
          <div className="confirm-subscription__game">
            <Image
              src={game?.image || '/fallback-game-image.webp'}
              alt={game?.name}
              className="confirm-subscription__game-logo"
            />
            <Typography>{game?.name}</Typography>
          </div>
        </div>
        <Typography className="confirm-subscription__message">
          Вы уверены, что хотите подписаться на обновления для этой игры?
        </Typography>
        <div className="confirm-subscription__actions">
          <Button onClick={handleCreateSubscription} color="primary">
            Подтвердить подписку
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const AddSubscriptionPage: React.FC = () => {
  const { step, setStep, application, game } = useSubscriptionStore();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isNextDisabled = (step === 1 && !application) || (step === 2 && !game);

  return (
    <div className="add-subscription-page">
      <Typography className="add-subscription-page__title">
        {step === 3 ? 'Подтверждение подписки' : 'Добавить подписку'}
      </Typography>
      <div className="add-subscription-page__step-info">
        <Typography style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Шаг {step} из 3: {
          step === 1 ? 'Выбор приложения' : 
          step === 2 ? 'Выбор игры' : 
          'Подтверждение'
        }</Typography>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="add-subscription-page__content"
        >
          {step === 1 && <ApplicationStep />}
          {step === 2 && <GameStep />}
          {step === 3 && <SuccessStep />}
        </motion.div>
      </AnimatePresence>
      {step < 3 && (
        <div className="add-subscription-page__buttons">
          <Button onClick={handleBack} disabled={step === 1}>
            Назад
          </Button>
          <Button onClick={handleNext} disabled={isNextDisabled}>
            Далее
          </Button>
        </div>
      )}
    </div>
  );
};
