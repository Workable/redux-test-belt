import React, { PropTypes } from 'react';

const Link = ({ active, id, children, onClick }) => {
  if (active) {
    return <span id={id}>{children}</span>;
  }

  return (
    <a
      href="#"
      id={id}
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};

Link.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Link;
