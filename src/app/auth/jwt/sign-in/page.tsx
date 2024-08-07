import { CONFIG } from 'src/config-global';

import { JwtSignInView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `로그인 - ${CONFIG.site.name}` };

export default function Page() {
  return <JwtSignInView />;
}
