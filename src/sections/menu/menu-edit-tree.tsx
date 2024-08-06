import { toast } from 'sonner';
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
import { saveMenu } from '../../actions/menu';
import { BlockWrapper } from './block-wrapper';
import { Iconify } from '../../components/iconify';
import { useBoolean } from '../../hooks/use-boolean';
import { ICONS } from '../../layouts/config-nav-dashboard';
import { useGetPageInfos } from '../../actions/page-info';
import { defaultPagination } from '../../utils/pagination';
import { defaultTree, defaultGroup } from '../../types/menu';
import { defaultPageInfoFilters } from '../../types/page-info';
import { ConfirmDialog } from '../../components/custom-dialog';
import { DnaSelectBox } from '../../components/form/dna-select-box';

import type { Menu, MenuTree } from '../../types/menu';

const types = [
  { id: 'group', name: 'Group' },
  { id: 'page', name: 'Page' },
];

const icons = [
  { text: 'job', icon: ICONS.job },
  { text: 'Folder', icon: 'folder' },
  { text: 'Box', icon: 'box' },
  { text: 'Check', icon: 'check' },
  { text: 'User', icon: 'user' },
  { text: 'Like', icon: 'like' },
];

type Props = {
  entity?: Menu[];
};

export const sortableOptions = {
  animation: 150,
  fallbackOnBody: true,
  swapThreshold: 0.2,
  ghostClass: 'ghost',
  group: 'shared',
};

export function MenuEditTree({ entity }: Props) {
  const [menuList, setMenuList] = useState<Menu[]>(entity || []);
  const [menuTree, setMenuTree] = useState<MenuTree[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuTree>(defaultTree(uuidv4()));
  const { data: pageInfos } = useGetPageInfos(defaultPagination, [], defaultPageInfoFilters);
  const confirm = useBoolean();

  const changeFormat = useCallback(() => {
    const formattedData = menuList.map((e) => ({
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
    setMenuTree(tree);
  }, [menuList]);

  useEffect(() => {
    changeFormat();
  }, [changeFormat, menuList]);

  const confirmDelete = () => {
    setMenuList((prev: any) => [
      ...prev.filter(
        (e: Menu) => e.menuId !== selectedMenu.id && e.upperMenuId !== selectedMenu.id
      ),
    ]);
    confirm.onFalse();
  };

  const addGroup = () => {
    setMenuList((prev: any) => [defaultGroup(uuidv4()), ...prev]);
  };

  const handleFilterName = useCallback(
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setSelectedMenu({ ...selectedMenu, [field]: event.target.value });
      setMenuList((menus) =>
        menus.map((menu) => {
          if (menu.menuId === selectedMenu?.id) {
            return { ...menu, [field]: event.target.value };
          }
          return menu;
        })
      );
    },
    [selectedMenu]
  );
  const save = () => {
    const seq = { number: 0 };
    const arr: any[] = [];
    menuTree.forEach((e) => {
      recursive(e, seq, arr);
    });

    const menus = menuList.map((menu) => {
      menu.index = arr.find((e) => e.id === menu.menuId).index;
      return menu;
    });

    saveMenu(menus).then(() => {
      toast.success('저장되었습니다.');
    });
  };

  function recursive(parent: MenuTree, seq: any, arr: any[]) {
    parent.seq = seq.number;
    arr.push({ id: parent.id, index: seq.number });
    seq.number += 1;

    parent.children?.forEach((child: MenuTree) => {
      recursive(child, seq, arr);
    });
  }

  return (
    <Grid container spacing={3} className="menu-edit-tree">
      <Grid item xs={12} md={6} lg={4}>
        <Card sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="text"
              size="medium"
              color="inherit"
              onClick={addGroup}
              startIcon={<Iconify icon="mingcute:add-line" />}
              sx={{ mb: 2 }}
            >
              그룹 추가
            </Button>
            <Button
              size="medium"
              color="primary"
              variant="contained"
              onClick={save}
              startIcon={<Iconify icon="mingcute:save-2-line" />}
              sx={{ mb: 2 }}
            >
              저장
            </Button>
          </Box>
          <ReactSortable list={menuTree} setList={setMenuTree} {...sortableOptions}>
            {menuTree.map((block, blockIndex) => (
              <BlockWrapper
                key={block.id}
                menu={block}
                menuIndex={[blockIndex]}
                confirm={confirm}
                setMenus={setMenuTree}
                selectedMenu={selectedMenu}
                setPlainMenus={setMenuList}
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
