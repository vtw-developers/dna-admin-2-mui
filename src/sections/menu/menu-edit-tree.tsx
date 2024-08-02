import { v4 as uuidv4 } from 'uuid';
import { ReactSortable } from 'react-sortablejs';
import { useState, useEffect, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';

import * as index from './index';
import * as graph from './graph';
import { Iconify } from '../../components/iconify';
import { useGetPageInfos } from '../../actions/page-info';
import { defaultPagination } from '../../utils/pagination';
import { defaultPageInfoFilters } from '../../types/page-info';
import { ConfirmDialog } from '../../components/custom-dialog';
import { DnaSelectBox } from '../../components/form/dna-select-box';
import { useBoolean, type UseBooleanReturn } from '../../hooks/use-boolean';

import type { Menu } from '../../types/menu';
import type { PageInfo } from '../../types/page-info';

type Props = {
  entity: Menu[];
};

type functionProps = {
  menu: MenuView;
  menuIndex: number[];
  setMenus: any;
  selectedMenu: MenuView;
  setSelectedMenu: any;
  setPlainMenus: any;
  confirm: UseBooleanReturn;
};

interface MenuView {
  id: string;
  name: string;
  icon: string | null;
  pageInfoId?: number;
  parentId?: string;
  type: string;
  children?: MenuView[];
}

function Container({
  menu,
  menuIndex,
  setMenus,
  selectedMenu,
  setSelectedMenu,
  confirm,
}: functionProps) {
  return (
    <ReactSortable
      key={menu.id}
      list={menu.children}
      setList={(currentList) => {
        setMenus((sourceList: any) => {
          const tempList = [...sourceList];
          const _blockIndex = [...menuIndex];
          const lastIndex = _blockIndex.pop();
          const lastArr = _blockIndex.reduce((arr, i) => arr[i].children, tempList);
          lastArr[lastIndex].children = currentList;
          return tempList;
        });
      }}
      animation={150}
      fallbackOnBody
      swapThreshold={0.65}
      ghostClass="ghost"
      group="shared"
    >
      {menu.children &&
        menu.children.map((childBlock, idx) => (
          <BlockWrapper
            key={childBlock.id}
            menu={childBlock}
            menuIndex={[...menuIndex, idx]}
            setMenus={setMenus}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            confirm={confirm}
          />
        ))}
    </ReactSortable>
  );
}

function BlockWrapper({
  menu,
  menuIndex,
  setMenus,
  selectedMenu,
  setSelectedMenu,
  setPlainMenus,
  confirm,
}: functionProps) {
  if (!menu) return null;
  const defaultPage = {
    icon: '',
    index: '',
    id: '',
    menuId: uuidv4(),
    name: 'new Page',
    pageInfoId: '',
    path: '',
    type: 'page',
    upperMenuId: menu.id,
  };

  const addPage = () => {
    console.log('addPage');
    setPlainMenus((prev: any) => [defaultPage, ...prev]);
  };

  const selectItem = (item) => {
    setSelectedMenu(item);
  };

  if (menu.type === 'group') {
    return (
      <Box
        className={`block group ${selectedMenu?.id === menu.id ? 'selected' : ''}`}
        onClick={() => selectItem(menu)}
      >
        <div className="header">
          {menu.name}
          <div>
            <Iconify icon="mingcute:add-line" onClick={addPage} />
            <Iconify icon="mingcute:delete-2-line" onClick={confirm.onTrue} />
          </div>
        </div>
        <Container
          menu={menu}
          setMenus={setMenus}
          menuIndex={menuIndex}
          confirm={confirm}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          setPlainMenus={setPlainMenus}
        />
      </Box>
    );
  }
  return (
    <Box
      className={`block page ${selectedMenu?.id === menu.id ? 'selected' : ''}`}
      onClick={(e) => {
        selectItem(menu);
        e.stopPropagation();
      }}
    >
      <Iconify icon="mingcute:selector-vertical-line" />
      {menu.name}
      <Iconify icon="mingcute:delete-2-line" onClick={confirm.onTrue} />
    </Box>
  );
}

const defaultMenu = {
  icon: '',
  index: '',
  id: '',
  menuId: uuidv4(),
  name: 'new Group',
  pageInfoId: '',
  path: '',
  type: 'group',
  upperMenuId: '0',
  parentId: '0',
};

const types = [
  { id: 'group', name: 'Group' },
  { id: 'page', name: 'Page' },
];

const icons = [
  { text: 'none', icon: '' },
  { text: 'Folder', icon: 'folder' },
  { text: 'Box', icon: 'box' },
  { text: 'Check', icon: 'check' },
  { text: 'User', icon: 'user' },
  { text: 'Like', icon: 'like' },
];

export function MenuEditTree({ entity }: Props) {
  const [plainMenus, setPlainMenus] = useState(entity);
  const [menuViews, setMenuViews] = useState<MenuView[]>([]);
  const [selectedMenu, setSelectedMenu] = useState(defaultMenu);
  const { data } = useGetPageInfos(defaultPagination, [], defaultPageInfoFilters);
  const [pageInfos, setPageInfos] = useState<PageInfo[]>([]);
  const confirm = useBoolean();

  useEffect(() => {
    console.log(plainMenus);
    changeFormat();
  }, [plainMenus]);

  useEffect(() => {
    setPageInfos(data);
  }, [data]);

  const changeFormat = useCallback(() => {
    console.log(plainMenus);
    const formattedData = plainMenus.map((e) => ({
      id: e.menuId,
      name: e.name,
      icon: e.icon,
      pageInfoId: e.pageInfoId,
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
    setMenuViews(tree);
  }, [plainMenus]);

  const confirmDelete = () => {
    console.log('삭제하세요');
    setPlainMenus((prev: any) => [...prev.filter((e) => e.menuId !== selectedMenu.id)]);
    confirm.onFalse();
  };

  useEffect(() => {
    console.log(menuViews);
  }, [menuViews]);

  useEffect(() => {
    console.log(selectedMenu);
    console.log(menuViews);
  }, [selectedMenu]);

  const addGroup = () => {
    console.log('addGroup');
    setPlainMenus((prev: any) => [defaultMenu, ...prev]);
  };

  const handleFilterName = useCallback(
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setSelectedMenu({ ...selectedMenu, [field]: event.target.value });
      setPlainMenus((menus) =>
        menus.map((menu) => {
          if (menu.menuId === selectedMenu?.id) {
            const test = { ...menu, [field]: event.target.value };
            return test;
          }
          return menu;
        })
      );
    },
    [selectedMenu]
  );

  return (
    <Grid container spacing={3} className="menu-edit-tree">
      <Grid item xs={12} md={6} lg={4}>
        <Card sx={{ p: 2 }}>
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            onClick={addGroup}
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mb: 2 }}
          >
            그룹 추가
          </Button>
          <ReactSortable
            list={menuViews}
            setList={setMenuViews}
            animation={150}
            fallbackOnBody
            swapThreshold={0.65}
            ghostClass="ghost"
            group="shared"
          >
            {menuViews.map((block, blockIndex) => (
              <BlockWrapper
                key={block.id}
                menu={block}
                menuIndex={[blockIndex]}
                confirm={confirm}
                setMenus={setMenuViews}
                selectedMenu={selectedMenu}
                setPlainMenus={setPlainMenus}
                setSelectedMenu={setSelectedMenu}
              />
            ))}
          </ReactSortable>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <Card>
          <CardHeader title="상세 정보" subheader="상세 정보를 설정합니다." sx={{ mb: 3 }} />
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Grid container spacing={3} sx={{ p: 3 }}>
            <Grid item xs={12} md={12}>
              <TextField
                label="메뉴명"
                value={selectedMenu.name || ''}
                fullWidth
                onChange={handleFilterName('name')}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <DnaSelectBox
                label="메뉴 유형"
                items={types}
                value={selectedMenu.type || ''}
                onValueChange={handleFilterName('type')}
                valueField="id"
                textField="name"
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <DnaSelectBox
                label="아이콘"
                items={icons}
                value={selectedMenu.icon || ''}
                onValueChange={handleFilterName('icon')}
                valueField="id"
                textField="text"
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <DnaSelectBox
                label="페이지"
                items={pageInfos}
                value={selectedMenu.pageInfoId || ''}
                onValueChange={handleFilterName('pageInfoId')}
                valueField="id"
                textField="name"
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Button
                size="medium"
                color="primary"
                onClick={addGroup}
                startIcon={<Iconify icon="mingcute:check-line" />}
                sx={{ mb: 2 }}
              >
                저장
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="삭제"
        content={<>선택한 항목을 삭제하시겠습니까?</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirmDelete();
            }}
          >
            삭제
          </Button>
        }
      />
    </Grid>
  );
}
