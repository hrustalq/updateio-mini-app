import { FC } from 'react';
import { List, Section, Cell, Title, Text } from '@telegram-apps/telegram-ui';

export const GameDetailsPage: FC = () => {
  return (
    <List>
      <Section>
        <Title level="2" style={{ margin: '16px' }}>Dota 2</Title>
        <Cell multiline>
          <Text>Последнее обновление: 15 мая 2023</Text>
        </Cell>
        <Cell multiline>
          <Text>Версия: 7.33c</Text>
        </Cell>
      </Section>
      <Section header="Последние патчи">
        <Cell multiline>
          <Text weight="2">Патч 7.33c (15 мая 2023)</Text>
          <Text>- Изменения баланса героев</Text>
          <Text>- Обновление карты</Text>
        </Cell>
        <Cell multiline>
          <Text weight="2">Патч 7.33b (1 мая 2023)</Text>
          <Text>- Исправление ошибок</Text>
          <Text>- Улучшение производительности</Text>
        </Cell>
      </Section>
    </List>
  );
};