import { CONFIG } from 'src/config-global';

import { BlankView } from '../../../../../../../sections/blank/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new product | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  return <BlankView />;
}
