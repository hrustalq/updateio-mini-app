import { FC, useState, useEffect } from 'react';
import { List, Section, Cell, Avatar, Button, Text } from '@telegram-apps/telegram-ui';
import { useInitData } from '@telegram-apps/sdk-react';
import { Settings, Bell, Newspaper } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const ProfilePage: FC = () => {
  const initData = useInitData();
  const navigate = useNavigate();
  const [subscriptionsCount, setSubscriptionsCount] = useState(0);

  useEffect(() => {
    // Здесь можно добавить запрос к API для получения количества подписок
    // Пока что используем моковые данные
    setSubscriptionsCount(3);
  }, []);

  return (
    <List>
      <Section>
        <Cell
          before={
            <Avatar
              size={40}
              src={initData?.user?.photoUrl}
              alt={initData?.user?.firstName}
            />
          }
          multiline
        >
          <Text weight="2">{`${initData?.user?.firstName} ${initData?.user?.lastName || ''}`}</Text>
          <Text>@{initData?.user?.username}</Text>
        </Cell>
      </Section>

      <Section header="Информация">
        <Cell>ID пользователя: {initData?.user?.id}</Cell>
        <Cell>Язык: {initData?.user?.languageCode}</Cell>
        <Cell>Количество подписок: {subscriptionsCount}</Cell>
      </Section>

      <Section header="Действия">
        <Cell
          before={<Settings size={24} />}
          after={<Button size="s">Открыть</Button>}
          onClick={() => navigate('/settings')}
        >
          Настройки
        </Cell>
        <Cell
          before={<Bell size={24} />}
          after={<Button size="s">Открыть</Button>}
          onClick={() => navigate('/notifications')}
        >
          Уведомления
        </Cell>
        <Link to="/subscriptions" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Cell
            before={<Newspaper size={24} />}
            after={<Button size="s">Открыть</Button>}
          >
            Подписки
          </Cell>
        </Link>
      </Section>
    </List>
  );
};