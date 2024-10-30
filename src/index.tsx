import ReactDOM from 'react-dom/client';

import { Root } from '@/components/Root/Root.tsx';

import '@telegram-apps/telegram-ui/dist/styles.css';
import './index.css';
import '@/components/Breadcrumbs/Breadcrumbs.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<Root/>);
