import { FC } from 'react';
import { List, Section, Cell, Button } from '@telegram-apps/telegram-ui';
import { useNavigate } from 'react-router-dom';
import { Plus, List as ListIcon, Settings, Gamepad } from 'lucide-react';

export const IndexPage: FC = () => {
  const navigate = useNavigate();

  return (
    <List style={{ paddingBottom: '1rem' }}>
      <Section header="Добро пожаловать в Game Patch Notifier!">
        <Cell multiline>
          Подписывайтесь на обновления ваших любимых игр и получайте мгновенные уведомления о новых патчах, дополнениях и событиях.
        </Cell>
      </Section>

      <Section header="Быстрые действия">
        <Cell
          before={<Plus size={24} />}
          onClick={() => navigate('/subscriptions/add')}
        >
          Добавить подписку
        </Cell>
        <Cell
          before={<ListIcon size={24} />}
          onClick={() => navigate('/subscriptions')}
        >
          Мои подписки
        </Cell>
        <Cell
          before={<Settings size={24} />}
          onClick={() => navigate('/settings')}
        >
          Настройки уведомлений
        </Cell>
      </Section>

      <Section header="Популярные игры">
        <Cell
          before={<Gamepad size={24} />}
          onClick={() => navigate('/game/1')}
        >
          Cyberpunk 2077
        </Cell>
        <Cell
          before={<Gamepad size={24} />}
          onClick={() => navigate('/game/2')}
        >
          Elden Ring
        </Cell>
        <Cell
          before={<Gamepad size={24} />}
          onClick={() => navigate('/game/3')}
        >
          Baldur&apos;s Gate 3
        </Cell>
      </Section>

      <Section style={{ padding: '1rem' }}>
        <Button style={{ width: '100%' }} stretched size="m" onClick={() => navigate('/explore')}>
          Исследовать все игры
        </Button>
      </Section>

      <Section header="О сервисе">
        <Cell multiline>
          Game Patch Notifier - ваш надежный помощник в мире игровых обновлений. Будьте в курсе всех изменений и никогда не пропускайте важные патчи!
        </Cell>
        <Cell onClick={() => navigate('/faq')}>
          Часто задаваемые вопросы
        </Cell>
        <Cell onClick={() => navigate('/contact')}>
          Связаться с нами
        </Cell>
      </Section>
    </List>
  );
};
