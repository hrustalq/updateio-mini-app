import { FC, useState, useEffect } from 'react';
import { List, Section, Cell, Avatar, Button, Spinner, Typography } from '@telegram-apps/telegram-ui';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { getUserSubscriptions, unsubscribeFromGame } from '@/api/games';
import { Subscription, PaginatedResponse } from '@/api/types';

export const SubscriptionsPage: FC = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Subscription> = await getUserSubscriptions();
      setSubscriptions(response.data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить подписки. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (subscription: Subscription) => {
    try {
      await unsubscribeFromGame(subscription.id);
      
      // Remove the subscription from the list
      setSubscriptions(prevSubscriptions => 
        prevSubscriptions.filter(sub => sub.id !== subscription.id)
      );
    } catch (err) {
      setError('Не удалось отменить подписку. Пожалуйста, попробуйте позже.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'var(--layout-height)' }}>
        <Spinner size="l" />
      </div>
    );
  }

  return (
    <List>
      <Section>
        <Cell
          after={<Button size="s">Добавить</Button>}
          onClick={() => navigate('/subscriptions/add')}
        >
          Добавить подписку
        </Cell>
      </Section>

      {subscriptions.length > 0 ? (
        <Section header="Мои подписки">
          {subscriptions.map((subscription) => (
            <Cell
              key={subscription.id}
              before={
                <Avatar
                  size={40}
                  src={subscription.game.image || '/fallback-game-image.webp'}
                  alt={subscription.game.name}
                />
              }
              after={
                <Button
                  size="s"
                  onClick={() => handleUnsubscribe(subscription)}
                >
                  Отписаться
                </Button>
              }
              description={`${subscription.app.name}`}
            >
              {subscription.game.name}
            </Cell>
          ))}
        </Section>
      ) : (
        <Section>
          <Cell multiline>
            <Typography>
              У вас пока нет подписок. <br /> Добавьте первую подписку, чтобы начать получать уведомления об обновлениях игр.
            </Typography>
          </Cell>
        </Section>
      )}       
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: '#fef1f1',
          border: '1px solid #fcd2d2',
          borderRadius: '8px',
          color: '#d63031',
          margin: '16px'
        }}>
          <AlertCircle size={48} style={{ marginRight: '8px' }} />
          <Typography>{error}</Typography>
        </div>
      )}
    </List>
  );
};