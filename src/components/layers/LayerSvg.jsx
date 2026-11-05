import { forwardRef } from 'react';
import { STAGE_W, STAGE_H } from '../../hooks/useStageFit.js';

// Every layer shares the same 1600×900 coordinate space, so painted PNG
// replacements can be exported at the exact same canvas size and dropped in.
const LayerSvg = forwardRef(function LayerSvg({ children, className = '', ...rest }, ref) {
  return (
    <svg
      ref={ref}
      className={`layer-svg ${className}`}
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      width={STAGE_W}
      height={STAGE_H}
      {...rest}
    >
      {children}
    </svg>
  );
});

export default LayerSvg;
