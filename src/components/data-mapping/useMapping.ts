import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { linkHorizontal } from 'd3-shape';

// type DataMap = {
//   source;
//   target: null;
//   connections: [];
// };

export enum MappingPosition {
  SOURCE,
  TARGET,
}

export enum ConnectionState {
  DRAGGED,
  DONE,
  SELECTED,
}

export const useMapping = (dataMap) => {
  console.log(dataMap);

  const [source, setSource] = useState(dataMap.source);
  const [target, setTarget] = useState(dataMap.target);
  const [connections, setConnections] = useState(dataMap.connections);

  const [sourceColumn, setSourceColumn] = useState<any>(null);
  const [targetColumn, setTargetColumn] = useState<any>(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const canvas = document.createElement('canvas');
  const img = document.createElement('img');

  const dataItemHeight = 40;
  const lineDivWidth = 120;

  const getFromTo = (position: MappingPosition) => {
    if (position === MappingPosition.SOURCE) {
      return 'from';
    }
    if (position === MappingPosition.TARGET) {
      return 'to';
    }
  };

  const getReverseFromTo = (position: MappingPosition) => {
    if (position === MappingPosition.SOURCE) {
      return 'to';
    }
    if (position === MappingPosition.TARGET) {
      return 'from';
    }
  };

  const mouseDown = (event: any, iIndex: number) => {
    // 클릭시작 eIndex-entity Index, iIndex-item Index
    const column = source.columns[iIndex];
    const ctx = canvas.getContext('2d'); // canvas 내부 context 속성
    drawTextBG(ctx, column.name, '16px Arial', 10, 10);
    img.src = canvas.toDataURL();
  };

  const dragStart = (event: any, position: MappingPosition, iIndex: number) => {
    console.log('dragStart');
    const entity = position === MappingPosition.SOURCE ? source : target;
    const column = entity.columns[iIndex];
    console.log(entity);
    console.log(column);
    if (position === MappingPosition.SOURCE) {
      console.log(column);
      setSourceColumn(column);
    } else {
      setTargetColumn(column);
    }

    event.dataTransfer.setDragImage(img, 30, 30);
  };

  const dragOver = (event: any, position: MappingPosition, iIndex: number) => {
    console.log(position === MappingPosition.TARGET);
    console.log(sourceColumn);
    event.preventDefault();
    if (position === MappingPosition.TARGET && !sourceColumn) {
      return;
    }
    if (position === MappingPosition.SOURCE && !targetColumn) {
      return;
    }

    const entity = position === MappingPosition.TARGET ? target : source;
    const column = entity.columns[iIndex];

    if (position === MappingPosition.TARGET) {
      drawDraggedLine(sourceColumn, column);
    } else if (position === MappingPosition.SOURCE) {
      drawDraggedLine(column, targetColumn);
    }
  };

  function drop(): void {}

  function dragEnd(): void {
    // 드래그하다 마우스 놓는 순간
    // 데이터항목 아이콘 되돌리기
    setSourceColumn(undefined);
    setTargetColumn(undefined);
  }

  // 메시지매핑 곡선값 구하기
  function link(sourceOrder: number, targetOrder: number): string {
    const topLabelHeight = 52;
    const link = linkHorizontal()
      .source((data) => [data.source[0], data.source[1]])
      .target((data) => [data.target[0], data.target[1]]);
    return link({
      source: [0, topLabelHeight + dataItemHeight / 2 + dataItemHeight * sourceOrder],
      target: [lineDivWidth, topLabelHeight + dataItemHeight / 2 + dataItemHeight * targetOrder],
    });
  }

  function selectConnection(connection: any): void {
    console.log(connection);
    connection.state = ConnectionState.SELECTED;
    connection.stroke = 'rgb(20, 94, 141)';

    setConnections([...connections]);
    setSelectedConnection(connection);
  }

  function removeConnection(position: MappingPosition, column: any): void {}

  function drawTextBG(ctx: any, txt: any, font: any, x: any, y: any): void {
    // 드래그 시 아이템 명 표기
    ctx.save();
    ctx.font = font;
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'gray';
    const { width } = ctx.measureText(txt);
    ctx.fillRect(0, 0, width + 20, parseInt(font, 10) + 16);
    ctx.fillStyle = 'white';
    ctx.fillText(txt, x, y);
    ctx.restore();
  }

  function removeDraggedLine(): void {
    setConnections(
      connections.map((conn, i) => {
        if (conn.state === ConnectionState.DRAGGED) {
          connections.splice(i, 1);
        }
        return connections;
      })
    );
  }

  function drawDraggedLine(fromItem: any, toItem: any): void {
    // 드래그 중일때 하늘색 라인
    removeDraggedLine();

    const from = source.columns.findIndex((i) => i.name == fromItem.name);
    const to = target.columns.findIndex((i) => i.name == toItem.name);
    const d = link(from, to);

    const messageConnection = {
      id: uuidv4(),
      state: ConnectionState.DRAGGED,
      from: fromItem.name,
      to: toItem.name,
      path: d,
      stroke: '#91e3ff',
      transformations: [],
    };

    setConnections([...connections, messageConnection]);
  }

  function typeCheck(e) {
    if (e === null) return null;
    if (
      e.toUpperCase() === 'VARCHAR' ||
      e.toUpperCase() === 'CHAR' ||
      e.toUpperCase() === 'VARCHAR2' ||
      e.toUpperCase() === 'STRING' ||
      e.toUpperCase() === 'TEXT'
    )
      return 'String';
    if (
      e.toUpperCase() === 'INTEGER' ||
      e.toUpperCase() === 'BIGINT' ||
      e.toUpperCase() === 'NUMBER' ||
      e.toUpperCase() === 'DECIMAL' ||
      e.toUpperCase() === 'FLOAT' ||
      e.toUpperCase() === 'INT4' ||
      e.toUpperCase() === 'INT8' ||
      e.toUpperCase() === 'FLOAT8'
    )
      return 'Number';
    if (
      e.toUpperCase() === 'DATE' ||
      e.toUpperCase() === 'TIMESTAMP' ||
      e.toUpperCase() === 'TIME' ||
      e.toUpperCase() === 'YEAR' ||
      e.toUpperCase() === 'DATETIME'
    )
      return 'Date';
    return null;
  }

  const addTransformation = (connection: any) => {
    connection.transformations.push({ id: uuidv4(), type: 'Prefix' });
    return connection.transformations;
  };

  const updateTransformation = (connection: any, transformation: any) => {
    const found = connection.transformations.find((t) => t.id === transformation.id);
    found.type = transformation.type;
    return connection.transformations;
  };

  const removeTransformation = (connection: any, transformation: any) => {
    connection.transformations = connection.transformations.filter(
      (t) => t.id !== transformation.id
    );
    return connection.transformations;
  };

  return {
    dragStart,
    dragOver,
    mouseDown,
    connections,
    selectedConnection,
    addTransformation,
    updateTransformation,
    removeTransformation,
    source,
    target,
    setSource,
    setTarget,
    setConnections,
  };
};
