'use client';

import { createContext } from 'react';

import type { RoleContextValue } from '../types';

// ----------------------------------------------------------------------

export const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export const AuthConsumer = RoleContext.Consumer;
