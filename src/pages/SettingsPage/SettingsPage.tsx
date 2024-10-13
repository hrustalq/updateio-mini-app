import { FC } from 'react';
import { List, Section, Cell, Switch } from '@telegram-apps/telegram-ui';
import { ThemeParamsPage } from './components/ThemeParams';
import { ScheduleParams } from './components/ScheduleParams'; // Добавьте эту строку

export const SettingsPage: FC = () => {
  return (
    <List style={{ paddingBottom: '1rem' }}>
      <Section header="Настройки уведомлений">
        <Cell
          after={<Switch defaultChecked />}
        >
          Получать уведомления о патчах
        </Cell>
        <Cell
          after={<Switch defaultChecked />}
        >
          Уведомлять о крупных обновлениях
        </Cell>
        <Cell
          after={<Switch />}
        >
          Уведомлять о небольших исправлениях
        </Cell>
      </Section>
      <ScheduleParams />
      <Section header="Параметры темы">
        <ThemeParamsPage />
      </Section>
    </List>
  );
};