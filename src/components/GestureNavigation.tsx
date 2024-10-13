import type { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

interface GestureNavigationProps {
  children: ReactNode;
}

export const GestureNavigation: FC<GestureNavigationProps> = ({ children }) => {
  const navigate = useNavigate();
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useDrag(({ movement: [mx], velocity: [vx], direction: [dx], distance, cancel }) => {
    if (distance[1] > 50 || Math.abs(vx) > 0.5) {
      cancel();
      if (dx > 0) {
        navigate(-1); // Go back
      } else if (dx < 0) {
        navigate(1); // Go forward
      }
    } else {
      api.start({ x: mx, immediate: true });
    }
  }, { 
    axis: 'x', 
    bounds: { left: -50, right: 50 }, 
    rubberband: true,
    from: () => [x.get(), 0],
    filterTaps: true,
    threshold: 5,
  });

  return (
    <animated.div {...bind()} style={{ x, touchAction: 'pan-y' }}>
      {children}
    </animated.div>
  );
};