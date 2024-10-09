import React, { useContext } from 'react';

import { MappingContext } from './data-mapping';

export default function MappingTable({ entity, position }) {
  const { dragStart, dragOver, mouseDown } = useContext(MappingContext);

  return (
    <>
      <div
        style={{
          backgroundColor: 'var(--base-bg)',
          color: 'var(--base-text-color)',
          display: 'flex',
          padding: '8px 0px 4px 12px',
          borderBottom: 'var(--base-bg-darken-5) 1px solid',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            verticalAlign: 'middle',
            lineHeight: 2,
            marginLeft: '8px',
          }}
        >
          {entity.name}
        </div>
      </div>
      <div className="item-block item-block-list">
        {entity.columns.map((column, i) => (
          <div
            key={i}
            className="link-parent"
            draggable
            onDragStart={(e) => dragStart(e, position, i)}
            onDragOver={(e) => dragOver(e, position, i)}
            onMouseDown={(e) => mouseDown(e, i)}
          >
            <div
              style={{
                display: 'table',
                width: '100%',
              }}
            >
              <div style={{ width: '50%', float: 'left' }}>{column.name}</div>
              <div
                style={{
                  width: '30%',
                  float: 'left',
                  color: 'gray',
                  fontStyle: 'italic',
                }}
              >
                {column.type}
              </div>
              <div
                style={{
                  width: '20%',
                  float: 'left',
                  color: 'gray',
                  fontStyle: 'italic',
                }}
              >
                {column.length}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
