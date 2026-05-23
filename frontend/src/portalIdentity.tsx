import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type PortalSignalKind = 'click' | 'hover' | 'choice';

export type PortalSignal = {
  kind: PortalSignalKind;
  label: string;
  route: string;
  source: string;
  detail?: string;
  treeNumber?: number | null;
  treeKind?: 'sephirah' | 'path' | 'signature' | 'route' | null;
  domain?: string | null;
};

export type InitiationChoice = {
  officerId: string;
  officerName: string;
  prompt: string;
  choiceLabel: string;
  choiceDetail: string;
};

export type PortalProfile = {
  mundaneName: string;
  initiatoryName: string;
  magicalMotto: string;
  currentTitle: string;
  lineage: string;
  style: string;
  createdAt: string;
  choices: InitiationChoice[];
};

export type TreeAccomplishment = {
  number: number;
  label: string;
  kind: 'sephirah' | 'path' | 'signature' | 'route';
  clickCount: number;
  hoverCount: number;
  traceCount: number;
  lastSeenAt: string;
  sampleLabels: string[];
};

export type PortalTrace = {
  id: string;
  kind: PortalSignalKind;
  label: string;
  route: string;
  source: string;
  detail?: string;
  treeNumber?: number | null;
  treeKind?: 'sephirah' | 'path' | 'signature' | 'route';
  domain?: string | null;
  timestamp: string;
};

type PortalState = {
  profile: PortalProfile | null;
  traces: PortalTrace[];
  accomplishments: Record<string, TreeAccomplishment>;
};

type PortalContextValue = PortalState & {
  recordSignal: (signal: PortalSignal) => void;
  recordChoice: (choice: InitiationChoice, profileDraft: Omit<PortalProfile, 'createdAt' | 'choices'> & { createdAt?: string; choices?: InitiationChoice[] }) => void;
  clearProfile: () => void;
  saveProfile: (profile: PortalProfile) => void;
};

const STORAGE_KEY = 'crowley.portal.identity.v1';
const ROUTE_TREE_FOCUS: Record<string, number> = {
  '/': 1,
  '/home': 1,
  '/initiation': 2,
  '/works': 3,
  '/grades': 4,
  '/tree': 6,
  '/biography': 9,
  '/people': 7,
  '/saints': 6,
  '/numbers': 8,
  '/dictionary': 8,
  '/character': 10,
};

const DEFAULT_STATE: PortalState = {
  profile: null,
  traces: [],
  accomplishments: {},
};

const PortalContext = createContext<PortalContextValue | null>(null);

function safeParse(json: string | null): PortalState {
  if (!json) return DEFAULT_STATE;
  try {
    const parsed = JSON.parse(json) as Partial<PortalState>;
    return {
      profile: parsed.profile ?? null,
      traces: Array.isArray(parsed.traces) ? parsed.traces : [],
      accomplishments: parsed.accomplishments && typeof parsed.accomplishments === 'object' ? parsed.accomplishments : {},
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: PortalState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function readRoute() {
  if (typeof window === 'undefined') return '/';
  const raw = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
  const route = raw.split('?')[0] || '/';
  return route.startsWith('/') ? route : `/${route}`;
}

function inferFocusNumber(signal: PortalSignal) {
  if (typeof signal.treeNumber === 'number') return signal.treeNumber;
  const route = signal.route.split('?')[0];
  return ROUTE_TREE_FOCUS[route] ?? null;
}

function inferTreeKind(number: number | null, explicit?: PortalSignal['treeKind']) {
  if (explicit) return explicit;
  if (number === null) return 'route';
  if (number >= 1 && number <= 10) return 'sephirah';
  if (number >= 11 && number <= 32) return 'path';
  return 'signature';
}

function makeTraceId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, ' ').trim().slice(0, 120);
}

function buildStateUpdater(signal: PortalSignal, previous: PortalState): PortalState {
  const number = inferFocusNumber(signal);
  const treeKind = inferTreeKind(number, signal.treeKind);
  const trace: PortalTrace = {
    id: makeTraceId(),
    kind: signal.kind,
    label: signal.label,
    route: signal.route,
    source: signal.source,
    detail: signal.detail,
    treeNumber: number ?? undefined,
    treeKind,
    domain: signal.domain,
    timestamp: new Date().toISOString(),
  };

  const traces = [trace, ...previous.traces].slice(0, 180);
  const accomplishments = { ...previous.accomplishments };

  if (number !== null) {
    const key = String(number);
    const existing = accomplishments[key];
    const next: TreeAccomplishment = existing ?? {
      number,
      label: signal.label,
      kind: treeKind,
      clickCount: 0,
      hoverCount: 0,
      traceCount: 0,
      lastSeenAt: trace.timestamp,
      sampleLabels: [],
    };

    next.traceCount += 1;
    next.lastSeenAt = trace.timestamp;
    if (signal.kind === 'click') next.clickCount += 1;
    if (signal.kind === 'hover') next.hoverCount += 1;
    if (!next.sampleLabels.includes(signal.label) && next.sampleLabels.length < 4) {
      next.sampleLabels = [...next.sampleLabels, signal.label];
    }
    next.label = signal.label || next.label;
    next.kind = treeKind;
    accomplishments[key] = next;
  }

  return { ...previous, traces, accomplishments };
}

type NameDraft = {
  mundaneName: string;
  purpose: string;
  current: string;
  key: string;
  tone: string;
};

const PURPOSE_WORDS: Record<string, string> = {
  reveal: 'Will',
  conceal: 'Veil',
  consecrate: 'Seal',
};

const CURRENT_WORDS: Record<string, string> = {
  solar: 'Solar',
  lunar: 'Lunar',
  stellar: 'Stellar',
};

const KEY_WORDS: Record<string, string> = {
  '93': '93',
  '156': '156',
  '418': '418',
  '777': '777',
};

const TONE_WORDS: Record<string, string> = {
  adept: 'Adept',
  oracle: 'Oracle',
  pilgrim: 'Pilgrim',
  scribe: 'Scribe',
};

export function suggestInitiatoryName(draft: NameDraft) {
  const purpose = PURPOSE_WORDS[draft.purpose] ?? 'Will';
  const current = CURRENT_WORDS[draft.current] ?? 'Solar';
  const key = KEY_WORDS[draft.key] ?? '93';
  const tone = TONE_WORDS[draft.tone] ?? 'Adept';
  const base = normalizeText(draft.mundaneName);
  const seed = base ? base.split(' ')[0] : 'Nemo';
  return {
    initiatoryName: `${tone} ${current} ${purpose} ${key}`,
    magicalMotto: `${seed} ${current} ${key}`,
    lineage: `${purpose} through ${current.toLowerCase()}`,
    style: `${tone.toLowerCase()} current`,
  };
}

export function PortalIdentityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PortalState>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATE;
    return safeParse(window.localStorage.getItem(STORAGE_KEY));
  });
  const lastSignalRef = useRef<{ key: string; at: number }>({ key: '', at: 0 });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const recordSignal = useCallback((signal: PortalSignal) => {
    setState(previous => buildStateUpdater(signal, previous));
  }, []);

  const recordChoice = useCallback((choice: InitiationChoice, profileDraft: Omit<PortalProfile, 'createdAt' | 'choices'> & { createdAt?: string; choices?: InitiationChoice[] }) => {
    setState(previous => {
      const profile: PortalProfile = {
        mundaneName: profileDraft.mundaneName,
        initiatoryName: profileDraft.initiatoryName,
        magicalMotto: profileDraft.magicalMotto,
        currentTitle: profileDraft.currentTitle,
        lineage: profileDraft.lineage,
        style: profileDraft.style,
        createdAt: profileDraft.createdAt ?? new Date().toISOString(),
        choices: [...(profileDraft.choices ?? []), choice],
      };
      const next = buildStateUpdater(
        {
          kind: 'choice',
          label: choice.choiceLabel,
          route: readRoute(),
          source: choice.officerName,
          detail: choice.choiceDetail,
          domain: 'initiation',
          treeNumber: ROUTE_TREE_FOCUS['/initiation'],
          treeKind: 'route',
        },
        previous,
      );
      return { ...next, profile };
    });
  }, []);

  const saveProfile = useCallback((profile: PortalProfile) => {
    setState(previous => ({ ...previous, profile }));
  }, []);

  const clearProfile = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const value = useMemo<PortalContextValue>(
    () => ({
      ...state,
      recordSignal,
      recordChoice,
      clearProfile,
      saveProfile,
    }),
    [state, recordSignal, recordChoice, clearProfile, saveProfile],
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleInteraction = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const tracked = target.closest<HTMLElement>('[data-portal-track-hover], [data-portal-track-click]');
      if (!tracked) return;

      const kind = event.type === 'click' ? 'click' : 'hover';
      if (kind === 'click' && !tracked.dataset.portalTrackClick) return;
      if (kind === 'hover' && !tracked.dataset.portalTrackHover) return;

      const label = normalizeText(tracked.dataset.portalTrackLabel || tracked.getAttribute('aria-label') || tracked.textContent || 'Interaction');
      if (!label) return;

      const signal: PortalSignal = {
        kind,
        label,
        route: readRoute(),
        source: tracked.dataset.portalTrackSource || tracked.tagName.toLowerCase(),
        detail: tracked.dataset.portalTrackDetail,
        treeNumber: tracked.dataset.portalTreeNumber ? Number(tracked.dataset.portalTreeNumber) : null,
        treeKind: (tracked.dataset.portalTreeKind as PortalSignal['treeKind']) || null,
        domain: tracked.dataset.portalTrackDomain || null,
      };
      const key = `${signal.kind}:${signal.route}:${signal.source}:${signal.label}:${signal.treeNumber ?? 'none'}`;
      const now = Date.now();
      if (signal.kind === 'hover' && lastSignalRef.current.key === key && now - lastSignalRef.current.at < 750) {
        return;
      }
      lastSignalRef.current = { key, at: now };
      recordSignal(signal);
    };

    document.addEventListener('click', handleInteraction, true);
    document.addEventListener('pointerover', handleInteraction, true);
    return () => {
      document.removeEventListener('click', handleInteraction, true);
      document.removeEventListener('pointerover', handleInteraction, true);
    };
  }, [recordSignal]);

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortalIdentity() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortalIdentity must be used within a PortalIdentityProvider.');
  }
  return context;
}

export function routeToTreeFocus(route: string) {
  return ROUTE_TREE_FOCUS[route] ?? null;
}
