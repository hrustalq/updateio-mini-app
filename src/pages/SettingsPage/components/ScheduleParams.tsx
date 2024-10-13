import React, { useState } from 'react';
import { 
  Section, 
  Cell, 
  Switch, 
  Select, 
  Button 
} from '@telegram-apps/telegram-ui';
import { Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Добавьте этот импорт

const daysOfWeek = [
  'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'
];

const timeOptions = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString(),
  label: `${i.toString().padStart(2, '0')}:00`
}));

export const ScheduleParams: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('12');

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    // Здесь будет логика сохранения настроек
    console.log('Сохранено:', { isEnabled, selectedDays, selectedTime });
  };

  return (
    <Section header="Расписание обновлений">
      <Cell
        before={<Clock size={24} />}
        after={<Switch checked={isEnabled} onChange={() => setIsEnabled(!isEnabled)} />}
      >
        Автоматические обновления
      </Cell>
      
      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Select
              header="Выберите время"
              value={selectedTime}
              style={{
                flexGrow: 1,
                flexBasis: '100%',
              }}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              {timeOptions.map((option) => (
                <option key={option.label} value={option.value}>{option.label}</option>
              ))}
            </Select>
        
            {daysOfWeek.map((day) => (
              <Cell
                key={day}
                after={
                  <Switch
                    checked={selectedDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                }
              >
                {day}
              </Cell>
            ))}
            
            <div style={{ padding: '1rem' }}>
              <Button onClick={handleSave} stretched size="m">
                Сохранить настройки
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};
