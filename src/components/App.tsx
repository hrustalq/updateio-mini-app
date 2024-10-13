import { useIntegration } from '@telegram-apps/react-router-integration';
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  initNavigator, useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
} from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useMemo } from 'react';
import {
  Route,
  Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import { BottomMenuBar } from '@/components/BottomMenuBar/BottomMenuBar';
import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { GestureNavigation } from '@/components/GestureNavigation';

import { routes, Route as AppRoute } from '@/navigation/routes.tsx';

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 1.02,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

const renderRoutes = (routes: AppRoute[]) => {
  return routes.map((route) => {
    if ('index' in route) {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={<route.Component />}
          index={route.index}
        />
      );
    } else {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={route.Component && <route.Component />}
        >
          {route.children && renderRoutes(route.children)}
        </Route>
      );
    }
  });
};

const AnimatedRoutes: FC<{ routes: AppRoute[] }> = ({ routes }) => {
  const location = useLocation();
  const routing = useMemo(() => renderRoutes(routes), [routes]);

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', overflowY: 'auto', width: '100%', height: 'var(--layout-height)' }}>
      <AnimatePresence mode="wait">
        <GestureNavigation>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
            style={{ 
              width: '100%', 
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <Routes location={location}>
              {routing}
            </Routes>
          </motion.div>
        </GestureNavigation>
      </AnimatePresence>
    </div>
  );
};

export const App: FC = () => {
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);

  const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
  const [location, reactNavigator] = useIntegration(navigator);

  useEffect(() => {
    navigator.attach();
    return () => navigator.detach();
  }, [navigator]);

  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
      style={{ 
        minHeight: 'var(--layout-height)', 
        paddingLeft: '1rem', 
        paddingRight: '1rem', 
        paddingTop: 'var(--breadcrumb-height)', 
        paddingBottom: 'var(--bottom-menu-height)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Router location={location} navigator={reactNavigator}>
        <Breadcrumbs />
        <AnimatedRoutes routes={routes} />
        <BottomMenuBar />
      </Router>
    </AppRoot>
  );
};