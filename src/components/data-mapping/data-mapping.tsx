import React from 'react';

import MappingTable from './mapping-table';
import MappingDetails from './mapping-details';
import MappingConnection from './mapping-connection';
import { useMapping, MappingPosition } from './useMapping';

const source = {
  name: 'Source',
  columns: [
    {
      name: 'id',
      notNull: true,
      type: 'String',
      primaryKey: false,
      length: '50',
    },
    {
      name: 'name',
      notNull: true,
      type: 'String',
      primaryKey: false,
      length: '100',
    },
    {
      name: 'age',
      notNull: true,
      type: 'Integer',
      primaryKey: false,
      length: '',
    },
    {
      name: 'gender',
      notNull: true,
      type: 'string',
      primaryKey: false,
      length: '1',
    },
  ],
};

const target = {
  name: 'Target',
  columns: [
    {
      name: 'PID',
      notNull: true,
      type: 'String',
      primaryKey: true,
      length: '10',
    },
    {
      name: 'USER_NM',
      notNull: true,
      type: 'String',
      primaryKey: false,
      length: '100',
    },
    {
      name: 'BIRTH',
      notNull: true,
      type: 'String',
      primaryKey: false,
      length: '5',
    },
  ],
};

const dataMap = {
  source: null,
  target: null,
  connections: [],
};
// eslint-disable-next-line react-hooks/rules-of-hooks
const mappingHook = useMapping(dataMap);

export const MappingContext = React.createContext(null);

function DataMapping() {
  return (
    <div className="cti-transform">
      <MappingContext.Provider value={mappingHook}>
        <div className="mapping-container">
          <div className="item-block mapping-table">
            <MappingTable entity={source} position={MappingPosition.SOURCE} />
          </div>
          <div id="item-block mapping-div">
            <MappingConnection />
          </div>
          <div className="item-block mapping-table">
            <MappingTable entity={target} position={MappingPosition.TARGET} />
          </div>
        </div>
        <MappingDetails />
      </MappingContext.Provider>
    </div>
  );
}

export default DataMapping;
