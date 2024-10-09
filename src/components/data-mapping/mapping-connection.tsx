import React, { useContext } from 'react';

import { ConnectionState } from './useMapping';
import { MappingContext } from './data-mapping';

export default function MappingConnection() {
  const { connections, selectConnection } = useContext(MappingContext);
  return (
    <svg className="mapping-canvas">
      {connections.map((conn, i) => (
        <path
          key={i}
          className={conn.state === ConnectionState.SELECTED ? 'selected-connection' : ''}
          onClick={() => selectConnection(conn)}
          d={conn.path}
          stroke={conn.stroke}
        />
      ))}
    </svg>
  );
}
