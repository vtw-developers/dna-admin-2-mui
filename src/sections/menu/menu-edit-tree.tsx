import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';

import { icons, types } from './items';
import { saveMenu } from '../../actions/menu';
import { Container } from './menu-tree-block';
import { Iconify } from '../../components/iconify';
import { useBoolean } from '../../hooks/use-boolean';
import { useGetPageInfos } from '../../actions/page-info';
import { defaultPageInfoFilters } from '../../types/page-info';
import { ConfirmDialog } from '../../components/custom-dialog';
import { DnaSelectBox } from '../../components/form/dna-select-box';
import { defaultPage, defaultTree, defaultGroup } from '../../types/menu';

import type { Menu, MenuTree } from '../../types/menu';

type Props = {
  entity?: Menu[];
};

export function MenuEditTree({ entity }: Props) {
  const [selectedMenu, setSelectedMenu] = useState<MenuTree>(defaultTree(uuidv4()));
  const [rootMenuTree, setRootMenuTree] = useState<MenuTree>();

  const { data: pageInfos } = useGetPageInfos(
    { page: 0, pageSize: 100 },
    [],
    defaultPageInfoFilters
  );
  const confirm = useBoolean();

  function arrayToTree(array: Menu[]) {
    const formattedArray = array.map((e) => ({
      id: e.menuId,
      name: e.name,
      icon: e.icon,
      pageInfoId: e.pageInfoId,
      pageInfoPath: e.pageInfoPath,
      parentId: e.upperMenuId === '0' ? undefined : e.upperMenuId,
      type: e.type,
      children: [],
    }));

    const nodeMap: any = {};
    const result: MenuTree[] = [];

    formattedArray.forEach((item: MenuTree) => {
      nodeMap[item.id] = { ...item, children: [] };
    });

    formattedArray.forEach((item: MenuTree) => {
      const node = nodeMap[item.id];
      if (item.parentId !== null && item.parentId) {
        nodeMap[item.parentId].children.push(node);
      } else {
        result.push(node);
      }
    });

    return result;
  }

  const treeToArray = useCallback((menu: MenuTree, seq: any, arr: any[], parentId: string) => {
    if (menu.id !== '0') {
      menu.seq = seq.number;
      arr.push({
        menuId: menu.id,
        name: menu.name,
        type: menu.type,
        icon: menu.icon,
        index: seq.number,
        upperMenuId: parentId || 0,
        pageInfoPath: menu.pageInfoPath,
        pageInfoId: menu.pageInfoId,
      });
      seq.number += 1;
    }

    menu.children?.forEach((child: MenuTree) => {
      treeToArray(child, seq, arr, menu.id);
    });
  }, []);

  const setRootTree = (formattedData: MenuTree[]) => {
    setRootMenuTree({ id: '0', name: 'root', type: 'group', children: formattedData });
  };

  useEffect(() => {
    if (entity) setRootTree(arrayToTree(entity));
  }, [entity]);

  const confirmDelete = () => {
    let menuArray: any[] = [];
    if (rootMenuTree) treeToArray(rootMenuTree, { number: 0 }, menuArray, '0');
    menuArray = [
      ...menuArray.filter(
        (e: Menu) => e.menuId !== selectedMenu.id && e.upperMenuId !== selectedMenu.id
      ),
    ];

    setRootTree(arrayToTree(menuArray));
    confirm.onFalse();
  };

  const addGroup = () => {
    const newId = uuidv4();
    setSelectedMenu({ id: newId, name: 'New Group', type: 'group' });

    let menuArray: any[] = [];
    if (rootMenuTree) treeToArray(rootMenuTree, { number: 0 }, menuArray, '0');
    menuArray = [defaultGroup(newId), ...menuArray];

    setRootTree(arrayToTree(menuArray));
  };

  const addPage = () => {
    const newId = uuidv4();
    setSelectedMenu({ id: newId, name: 'New Page', type: 'page' });

    let menuArray: any[] = [];
    if (rootMenuTree) {
      treeToArray(rootMenuTree, { number: 0 }, menuArray, '0');
      menuArray = [defaultPage(rootMenuTree.id, uuidv4()), ...menuArray];
    }

    setRootTree(arrayToTree(menuArray));
  };

  const handleFilterName = useCallback(
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setSelectedMenu({ ...selectedMenu, [field]: event.target.value });

      const menuArray: any[] = [];
      if (rootMenuTree) treeToArray(rootMenuTree, { number: 0 }, menuArray, '0');

      const setData = menuArray.map((menu) => {
        if (menu.menuId === selectedMenu.id) {
          return { ...menu, [field]: event.target.value };
        }
        return menu;
      });

      setRootTree(arrayToTree(setData));
    },
    [rootMenuTree, treeToArray, selectedMenu]
  );

  const validate = () => {
    try {
      const menuArray: any[] = [];
      if (rootMenuTree) treeToArray(rootMenuTree, { number: 0 }, menuArray, '0');

      menuArray.forEach((e) => {
        if (e.type === 'page' && !e.pageInfoId) throw new Error();
      });
      save();
    } catch (error) {
      toast.error('Page 타입의 메뉴에 page가 지정되지 않았습니다.');
    }
  };

  const save = () => {
    const seq = { number: 0 };
    const arr: any[] = [];

    if (rootMenuTree) treeToArray(rootMenuTree, seq, arr, '0');

    saveMenu(arr).then(() => {
      toast.success('저장되었습니다.');
    });
  };

  return (
    <Grid container spacing={3} className="menu-edit-tree">
      <Grid item xs={12} md={6} lg={6}>
        <Card sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Tooltip title="그룹 추가">
                <Button
                  variant="outlined"
                  size="medium"
                  color="inherit"
                  onClick={addGroup}
                  startIcon={<Iconify icon="mingcute:folder-line" />}
                  sx={{ mb: 2, mr: 1 }}
                >
                  그룹
                </Button>
              </Tooltip>
              <Tooltip title="페이지 추가">
                <Button
                  variant="outlined"
                  size="medium"
                  color="inherit"
                  onClick={addPage}
                  startIcon={<Iconify icon="mingcute:file-line" />}
                  sx={{ mb: 2 }}
                >
                  페이지
                </Button>
              </Tooltip>
            </Box>
            <Button
              size="medium"
              color="primary"
              variant="contained"
              onClick={validate}
              startIcon={<Iconify icon="mingcute:save-2-line" />}
              sx={{ mb: 2 }}
            >
              저장
            </Button>
          </Box>
          {rootMenuTree && setRootMenuTree && (
            <Container
              rootMenuTree={rootMenuTree}
              setRootMenuTree={setRootMenuTree}
              confirm={confirm}
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
            />
          )}
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
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
                readonly
              />
            </Grid>
            <Grid item xs={12} md={12} className="icon-select">
              <DnaSelectBox
                label="아이콘"
                items={icons}
                value={selectedMenu.icon || ''}
                onValueChange={handleFilterName('icon')}
                valueField="text"
                readonly={selectedMenu.type === 'group'}
                textField="icon"
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <DnaSelectBox
                label="페이지"
                items={pageInfos}
                value={selectedMenu.pageInfoId || ''}
                onValueChange={handleFilterName('pageInfoId')}
                readonly={selectedMenu.type === 'group'}
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
