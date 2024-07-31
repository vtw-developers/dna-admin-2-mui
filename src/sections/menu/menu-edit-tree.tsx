import { ReactSortable } from 'react-sortablejs';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';

import * as index from './index';
import * as graph from './graph';
import { Iconify } from '../../components/iconify';

import type { Menu } from '../../types/menu';

type Props = {
  entity: Menu[];
};

type functionProps = {
  block: MenuView;
  blockIndex: number[];
  setBlocks: any;
};

interface MenuView {
  id: string;
  name: string;
  icon: string | null;
  parentId: string | null;
  type: string;
  children?: MenuView[];
}

function Container({ block, blockIndex, setBlocks }: functionProps) {
  return (
    <ReactSortable
      key={block.id}
      list={block.children}
      setList={(currentList) => {
        setBlocks((sourceList: any) => {
          const tempList = [...sourceList];
          const _blockIndex = [...blockIndex];
          const lastIndex = _blockIndex.pop();
          const lastArr = _blockIndex.reduce((arr, i) => arr[i].children, tempList);
          if (lastIndex) lastArr[lastIndex].children = currentList;
          return tempList;
        });
      }}
      animation={150}
      fallbackOnBody
      swapThreshold={0.65}
      ghostClass="ghost"
      group="shared"
    >
      {block.children &&
        block.children.map((childBlock, idx) => (
          <BlockWrapper
            key={childBlock.id}
            block={childBlock}
            blockIndex={[...blockIndex, idx]}
            setBlocks={setBlocks}
          />
        ))}
    </ReactSortable>
  );
}

function BlockWrapper({ block, blockIndex, setBlocks }: functionProps) {
  if (!block) return null;
  if (block.type === 'group') {
    return (
      <div className="block group">
        <div className="header">
          {block.name}
          <Iconify icon="mingcute:add-line" />
        </div>
        <Container block={block} setBlocks={setBlocks} blockIndex={blockIndex} />
      </div>
    );
  }
  return (
    <div className="block page">
      <Iconify icon="mingcute:selector-vertical-line" />
      {block.name}
      <Iconify icon="mingcute:delete-2-line" />
    </div>
  );
}

export function MenuEditTree({ entity }: Props) {
  const [blocks, setBlocks] = useState<MenuView[]>([]);

  const changeFormat = useCallback(() => {
    const formattedData = entity.map((e) => ({
      id: e.menuId,
      name: e.name,
      icon: e.icon,
      parentId: e.upperMenuId === '0' ? null : e.upperMenuId,
      type: e.type,
      children: [],
    }));

    const tree = graph._new(
      index._new(formattedData, (node: { parentId: any }) => node.parentId),
      (node: { id: any }, children: (arg0: any) => any) => ({
        ...node,
        children: children(node.id),
      })
    );
    setBlocks(tree);
    console.log(tree);
  }, [entity]);

  useEffect(() => {
    changeFormat();
  }, [changeFormat, entity]);

  return (
    <>
      {/*  <Button
        variant="outlined"
        size="medium"
        color="error"
        onClick={confirm.onTrue}
        startIcon={<Iconify icon="mingcute:delete-2-line" />}
      >
        삭제
      </Button> */}
      <Card sx={{ p: 2 }}>
        <ReactSortable
          list={blocks}
          setList={setBlocks}
          animation={150}
          fallbackOnBody
          swapThreshold={0.65}
          ghostClass="ghost"
          group="shared"
        >
          {blocks.map((block, blockIndex) => (
            <BlockWrapper
              key={block.id}
              block={block}
              blockIndex={[blockIndex]}
              setBlocks={setBlocks}
            />
          ))}
        </ReactSortable>
      </Card>
    </>
  );
}
