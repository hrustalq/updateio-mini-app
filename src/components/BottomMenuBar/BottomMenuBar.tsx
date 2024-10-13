import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { routes } from '@/navigation/routes';

import './BottomMenuBar.css';

const isActiveRoute = (currentPath: string, routePath: string): boolean => {
  if (routePath === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(routePath);
};

export const BottomMenuBar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.div
      className="bottom-menu-bar"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <nav className="instagram-style-nav">
        {routes.map((route) => (
          <button
            key={route.path}
            onClick={() => navigate(route.path)}
            className={isActiveRoute(location.pathname, route.path) ? 'active' : ''}
          >
            {route.icon}
            <span className="nav-label">{route.title}</span>
          </button>
        ))}
      </nav>
    </motion.div>
  );
};