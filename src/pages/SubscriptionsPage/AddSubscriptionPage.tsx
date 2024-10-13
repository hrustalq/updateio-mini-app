import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { getApps, searchApps } from '@/api/apps';
import { getGames, searchGames, createSubscription } from '@/api/games';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import debounce from 'lodash/debounce';
import { Subscription, CreateSubscriptionDto } from '@/api/types';

const ApplicationStep: React.FC = () => {
  const { application, setApplication } = useSubscriptionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const parentRef = React.useRef<HTMLDivElement>(null);

  const fetchApps = useCallback(async ({ pageParam = 1 }) => {
    try {
      const result = searchTerm
        ? await searchApps(searchTerm, pageParam, 20)
        : await getApps(pageParam, 20);
      return result;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }, [searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['apps', searchTerm],
    queryFn: fetchApps,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta) return undefined;
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
  });

  const allApps = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const ROW_GAP = 16;

  const rowVirtualizer = useVirtualizer({
    count: allApps.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200 + ROW_GAP,
    overscan: 5,
  });

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    [setSearchTerm]
  );

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allApps.length - 1 &&
      hasNextPage &&
      !isFetching
    ) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, allApps.length, isFetching, rowVirtualizer]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input
        placeholder="Поиск приложений"
        className="search-input"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedSearch(e.target.value)}
      />
      {isLoading ? (
        <div className="loading-container">
          <Spinner size="l" />
        </div>
      ) : isError ? (
        <Typography className="error-message" style={{ textAlign: 'center', display: 'block' }}>Произошла ошибка при загрузке приложений</Typography>
      ) : allApps.length === 0 ? (
        <Typography className="no-results">Приложения не найдены</Typography>
      ) : (
        <div ref={parentRef} style={{ height: '55dvh', overflow: 'auto', padding: '5px' }}>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
              width: '100%',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const app = allApps[virtualRow.index];

              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    padding: `${ROW_GAP / 2}px 0`,
                  }}
                >
                  <Card 
                    onClick={() => setApplication(app)}
                    className="application-card"
                    style={{ 
                      outline: application?.id === app.id ? '2px solid #3390EC' : '2px solid transparent',
                      height: `${virtualRow.size - ROW_GAP}px`,
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
                </div>
              );
            })}
          </div>
        </div>
      )}
      {isFetching && !isLoading && (
        <div className="loading-container">
          <Spinner size="m" />
        </div>
      )}
    </div>
  );
};

const GameStep: React.FC = () => {
  const { setGame, game, application } = useSubscriptionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const parentRef = React.useRef<HTMLDivElement>(null);

  const fetchGames = useCallback(async ({ pageParam = 1 }) => {
    if (!application) {
      throw new Error("Application is not selected");
    }
    try {
      const result = searchTerm
        ? await searchGames(application.id, searchTerm, pageParam, 20)
        : await getGames(application.id, pageParam, 20);
      return result;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }, [application, searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['games', application?.id, searchTerm],
    queryFn: fetchGames,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.page) return undefined;
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: !!application,
  });

  const allGames = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((v) => v.data);
  }, [data]);

  const ROW_GAP = 16; // Оставляем тот же отступ между строками

  const rowVirtualizer = useVirtualizer({
    count: allGames.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200 + ROW_GAP, // Оставляем тот же размер
    overscan: 5,
  });

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    [setSearchTerm]
  );

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allGames.length - 1 &&
      hasNextPage &&
      !isFetching
    ) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, allGames.length, isFetching, rowVirtualizer]);

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
      ) : allGames.length === 0 ? (
        <Typography className="no-results">Игры не найдены</Typography>
      ) : (
        <div ref={parentRef} style={{ height: '55dvh', overflow: 'auto', padding: '5px' }}>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
              width: '100%',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const currentGame = allGames[virtualRow.index];

              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`, // Убираем вычитание ROW_GAP
                    transform: `translateY(${virtualRow.start}px)`,
                    padding: `${ROW_GAP / 2}px 0`, // Добавляем отступ сверху и снизу
                  }}
                >
                  <Card 
                    onClick={() => setGame(currentGame)}
                    className="game-card"
                    style={{ 
                      outline: game?.id === currentGame.id ? '2px solid #3390EC' : '2px solid transparent',
                      height: `${virtualRow.size - ROW_GAP}px`, // Уменьшаем высоту карточки на величину отступа
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
                </div>
              );
            })}
          </div>
        </div>
      )}
      {isFetching && !isLoading && (
        <div className="loading-container">
          <Spinner size="m" />
        </div>
      )}
    </div>
  );
};

const SuccessStep: React.FC = () => {
  const { game, application, reset } = useSubscriptionStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const handleCreateSubscription = async () => {
    if (!game || !application) {
      setError("Игра или приложение не выбраны");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const subscriptionData: CreateSubscriptionDto = {
        gameId: game.id,
        appId: application.id,
        isSubscribed: true,
      };
      const newSubscription = await createSubscription(subscriptionData);
      setSubscription(newSubscription);
    } catch (err) {
      setError("Не удалось создать подписку. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnHome = () => {
    reset();
    navigate('/');
  };

  if (isLoading) {
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

  if (subscription) {
    return (
      <div className="success-message">
        <IconButton name="check-circle" size="l" color="var(--tgui--primary_color)">
          <Check size={64} className="success-icon" />
        </IconButton>
        <Typography className="success-message__title">
          Подписка успешно добавлена!
        </Typography>
        <Typography>
          Вы будете получать уведомления об обновлениях для игры {subscription.game.name} в приложении {subscription.app.name}.
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