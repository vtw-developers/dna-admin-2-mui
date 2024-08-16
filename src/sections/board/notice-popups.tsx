import 'src/styles/list.scss';
import 'src/styles/form.scss';
import 'src/styles/global.scss';
import 'src/styles/dashboard.scss';

import { useState, useEffect } from 'react';

import { getCookie } from 'src/utils/cookie';

import { NoticePopup } from './notice-popup';
import { getPopups } from '../../actions/board';

// ----------------------------------------------------------------------

export function NoticePopups() {
  const [popups, setPopups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookies = getCookie('POPUP_EXPIRES');
        const result = await getPopups();

        setPopups(
          result.map((p) => {
            const popup = { ...p, visible: !cookies?.includes(p.id) };
            return popup;
          })
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {popups.map((popup) => (
        <NoticePopup key={popup.id} popup={popup} />
      ))}
    </>
  );
}
