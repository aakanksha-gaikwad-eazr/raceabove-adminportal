import React from 'react';

const SvgIcon = ({ src, width = 24, height = 24, color = 'currentColor', ...props }) => {
  return (
    <img
      src={src}
      width={width}
      height={height}
      style={{ color }}
      alt="icon"
      {...props}
    />
  );
};

export default SvgIcon; 