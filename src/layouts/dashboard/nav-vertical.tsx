import type { Breakpoint } from '@mui/material/styles';
import type { NavSectionProps } from 'src/components/nav-section';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { varAlpha, hideScrollY } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { NavSectionMini, NavSectionVertical } from 'src/components/nav-section';

import { icon } from '../config-nav-dashboard';
import { getMenuView } from '../../actions/menu';
import { useAuthContext } from '../../auth/hooks';
import { NavToggleButton } from '../components/nav-toggle-button';

// ----------------------------------------------------------------------

export type NavVerticalProps = NavSectionProps & {
  isNavMini: boolean;
  layoutQuery: Breakpoint;
  onToggleNav: () => void;
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
};

export function NavVertical({
  sx,
  data,
  slots,
  isNavMini,
  layoutQuery,
  onToggleNav,
  ...other
}: NavVerticalProps) {
  const theme = useTheme();
  const [list, setList] = useState<NavSectionProps['data']>([]);
  const nav = async () => getMenuView();
  const { user } = useAuthContext();

  useEffect(() => {
    nav().then((result) => {
      const group = result
        .filter((e: { type: string }) => e.type === 'group')
        .map((e: { menuId: any; name: any }) => ({
          id: e.menuId,
          subheader: e.name,
          items: [],
        }));
      result
        .filter((e: { type: string }) => e.type === 'page')
        .forEach((e: { upperMenuId: any; pageInfoPath: any; name: any; icon: string }) =>
          group
            .find((f: { id: any }) => f.id === e.upperMenuId)
            ?.items.push({
              path: e.pageInfoPath,
              title: e.name,
              icon: icon(
                `ic-${e.icon?.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase())}`
              ),
              /* info: (
                <Label color="info" variant="inverted">
                  +3
                </Label>
              ), */
            })
        );
      setList([...group.filter((e: any) => e.items.length > 0)]);
    });
  }, [user]);

  const renderNavVertical = (
    <>
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
          <Logo />
        </Box>
      )}

      <Scrollbar fillContent>
        <NavSectionVertical data={data} list={list} sx={{ px: 2, flex: '1 1 auto' }} {...other} />

        {/* {slots?.bottomArea ?? <NavUpgrade />} */}
      </Scrollbar>
    </>
  );

  const renderNavMini = (
    <>
      {slots?.topArea ?? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5 }}>
          <Logo />
        </Box>
      )}

      <NavSectionMini
        data={data}
        list={list}
        sx={{ pb: 2, px: 0.5, ...hideScrollY, flex: '1 1 auto', overflowY: 'auto' }}
        {...other}
      />

      {slots?.bottomArea}
    </>
  );

  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        transition: theme.transitions.create(['width'], {
          easing: 'var(--layout-transition-easing)',
          duration: 'var(--layout-transition-duration)',
        }),
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavToggleButton
        isNavMini={isNavMini}
        onClick={onToggleNav}
        sx={{
          display: 'none',
          [theme.breakpoints.up(layoutQuery)]: {
            display: 'inline-flex',
          },
        }}
      />
      {isNavMini ? renderNavMini : renderNavVertical}
    </Box>
  );
}
