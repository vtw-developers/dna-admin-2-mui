import React from 'react';

export default function MappingConnection() {
  return (
    <svg className="mapping-canvas">
      {/*      {connections.map((conn, i) => (
        <path
          key={i}
          className={conn.state === ConnectionState.SELECTED ? 'selected-connection' : ''}
          onClick={() => selectConnection(conn)}
          d={conn.path}
          stroke={conn.stroke}
        />
      ))} */}
    </svg>
  );
}
