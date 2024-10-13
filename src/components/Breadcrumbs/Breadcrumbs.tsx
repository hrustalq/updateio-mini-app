import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Route, routes } from '@/navigation/routes';
import './Breadcrumbs.css';

const findRouteByPath = (path: string, routeList = routes): Route | undefined => {
  for (const route of routeList) {
    if (route.path === path) return route;
    if ('children' in route) {
      const childRoute = findRouteByPath(path, route.children);
      if (childRoute) return childRoute;
    }
  }
  return undefined;
};

const getBreadcrumbs = (path: string): { path: string; route: Route | undefined }[] => {
  const pathnames = path.split('/').filter((x) => x);
  const breadcrumbs: { path: string; route: Route | undefined }[] = [];

  let currentPath = '';
  for (const segment of pathnames) {
    currentPath += `/${segment}`;
    const route = findRouteByPath(currentPath);
    if (route) {
      breadcrumbs.push({ path: currentPath, route });
    }
  }

  if (breadcrumbs.length === 0) {
    const homeRoute = findRouteByPath('/');
    if (homeRoute) {
      breadcrumbs.push({ path: '/', route: homeRoute });
    }
  }

  return breadcrumbs;
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <nav className="breadcrumbs">
      <div className='breadcrumbs__wrapper'>
        <ol>
          {breadcrumbs.map(({ path, route }, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return route ? (
              <li key={path}>
                {index > 0 && <span className="breadcrumb-separator">/</span>}
                {isLast ? (
                  <span className="breadcrumb-current">
                    {route.icon}
                    <span className="breadcrumb-text">{route.title}</span>
                  </span>
                ) : (
                  <Link to={path} className="breadcrumb-link">
                    {route.icon}
                    <span className="breadcrumb-text">{route.title}</span>
                  </Link>
                )}
              </li>
            ) : null;
          })}
        </ol>
      </div>
    </nav>
  );
};