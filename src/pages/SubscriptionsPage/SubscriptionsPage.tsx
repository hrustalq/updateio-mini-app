import { FC } from 'react';
import { List, Section, Cell, Avatar, Button, Spinner, Typography } from '@telegram-apps/telegram-ui';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Plus } from 'lucide-react';
import $api from '@/api';

export const SubscriptionsPage: FC = () => {
  const navigate = useNavigate();

  const { data: subscriptions, isLoading, error } = $api.useQuery('get', '/api/subscriptions');
  const { mutateAsync: unsubscribe } = $api.useMutation('delete', '/api/subscriptions/{id}');

  const handleUnsubscribe = async (id: string) => {
    await unsubscribe({
      params: {
        path: {
          id
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'var(--layout-height)' }}>
        <Spinner size="l" />
      </div>
    );
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  if (error) {
    return (
      <div className='h-full flex-grow flex items-center justify-center flex-col'>
        <Section>
          <Cell
            before={<AlertCircle size={32} color="#d63031" />}
            multiline
          >
            <Typography style={{ color: '#d63031' }}>
              Произошла ошибка при выполнении запроса. Пожалуйста, попробуйте еще раз.
            </Typography>
          </Cell>
          <div className='flex items-center w-full py-3'>
            <Button onClick={handleRefresh} className='mx-auto block'>Перезагрузить</Button>
          </div>
        </Section>
      </div>
    );
  }

  const hasSubscriptions = subscriptions && subscriptions.data?.length > 0;

  return (
    <List>
      {hasSubscriptions ? (
        <>
          <Section>
            <Cell
              before={<Plus size={24} />}
              after={<Button size="s">Добавить</Button>}
              onClick={() => navigate('/subscriptions/add')}
            >
              Добавить подписку
            </Cell>
          </Section>
          <Section header="Мои подписки">
            {subscriptions.data.map((subscription) => (
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
                    onClick={() => handleUnsubscribe(subscription.id)}
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
        </>
      ) : (
        <Section>
          <Cell multiline>
            <Typography style={{ marginBottom: '16px' }}>
              У вас пока нет подписок. Добавьте первую подписку, чтобы начать получать уведомления об обновлениях игр.
            </Typography>
            <Button
              size="m"
              before={<Plus size={20} />}
              onClick={() => navigate('/subscriptions/add')}
            >
              Добавить подписку
            </Button>
          </Cell>
        </Section>
      )}
    </List>
  );
};
