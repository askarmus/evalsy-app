// components/home/CoreWidgets.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardBody, Chip, Skeleton } from '@heroui/react';
import { fetchCoreWidgets } from '@/services/dashboard.service';

const Chart: any = dynamic(() => import('react-apexcharts'), { ssr: false });

type CoreWidgetsResponse = {
  jobs: { open: number; closed: number };
  interviews: { today: number; thisWeek: number };
  cycle: { inviteToInterviewDays: number | null; interviewToDecisionDays: number | null };
  scores: {
    averageTotalScore: number | null;
    selectionPercents: { strongHire: number; hire: number; borderline: number; reject: number };
  };
};

const DEFAULT_WIDGETS: CoreWidgetsResponse = {
  jobs: { open: 0, closed: 0 },
  interviews: { today: 0, thisWeek: 0 },
  cycle: { inviteToInterviewDays: null, interviewToDecisionDays: null },
  scores: {
    averageTotalScore: null,
    selectionPercents: { strongHire: 0, hire: 0, borderline: 0, reject: 0 },
  },
};

const nf = (n: number | null | undefined, digits = 1) => (typeof n === 'number' && isFinite(n) ? n.toFixed(digits) : '—');

// ---- NEW: theme-aware color helpers
function readComputedColor(className: string, property: keyof CSSStyleDeclaration): string | null {
  if (typeof window === 'undefined') return null;
  const el = document.createElement('div');
  el.className = className;
  el.style.position = 'absolute';
  el.style.width = '0';
  el.style.height = '0';
  el.style.pointerEvents = 'none';
  el.style.visibility = 'hidden';
  document.body.appendChild(el);
  const cs = getComputedStyle(el);
  const val = (cs[property] as unknown as string) || '';
  document.body.removeChild(el);
  // Filter out transparent/empty reads
  if (!val || val === 'rgba(0, 0, 0, 0)' || val === 'transparent') return null;
  return val;
}

function pickFirstColor(tries: Array<{ className: string; property: keyof CSSStyleDeclaration }>): string {
  for (const t of tries) {
    const c = readComputedColor(t.className, t.property);
    if (c) return c;
  }
  // Safe fallback
  return 'rgb(120, 40, 200)'; // your secondary accent
}

function useThemePalette() {
  const [palette, setPalette] = useState({
    secondary: 'rgb(120, 40, 200)',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    foreground: '#111827',
    muted: 'rgba(0,0,0,0.15)',
    grid: 'rgba(0,0,0,0.08)',
    isDark: false,
  });

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');

    const secondary = pickFirstColor([
      { className: 'bg-secondary', property: 'backgroundColor' },
      { className: 'text-secondary', property: 'color' },
    ]);

    const success = pickFirstColor([
      { className: 'bg-success', property: 'backgroundColor' },
      { className: 'text-success', property: 'color' },
    ]);

    const warning = pickFirstColor([
      { className: 'bg-warning', property: 'backgroundColor' },
      { className: 'text-warning', property: 'color' },
    ]);

    const danger = pickFirstColor([
      { className: 'bg-danger', property: 'backgroundColor' },
      { className: 'text-danger', property: 'color' },
    ]);

    const foreground = pickFirstColor([
      { className: 'text-foreground', property: 'color' },
      { className: 'text-default-900', property: 'color' },
      { className: 'text-black', property: 'color' },
      { className: 'text-white', property: 'color' }, // in dark mode this might be the one
    ]);

    // a muted/background-ish tone for “Closed” slice etc.
    const muted = pickFirstColor([
      { className: 'bg-content2', property: 'backgroundColor' },
      { className: 'bg-default-200', property: 'backgroundColor' },
      { className: isDark ? 'bg-white/10' : 'bg-black/10', property: 'backgroundColor' },
    ]);

    // subtle grid lines
    const grid = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';

    setPalette({ secondary, success, warning, danger, foreground, muted, grid, isDark });
  }, []);

  return palette;
}

export default function CoreWidgets() {
  const [data, setData] = useState<CoreWidgetsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useThemePalette();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const payload = (await fetchCoreWidgets()) as CoreWidgetsResponse;
        if (mounted) setData(payload);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const safe = data ?? DEFAULT_WIDGETS;
  const { jobs, interviews, cycle, scores } = safe;

  const jobsSeries = [jobs.open || 0, jobs.closed || 0];
  const interviewsSeries = [{ name: 'Count', data: [interviews.today || 0, interviews.thisWeek || 0] }];
  const decisionSeries = [scores.selectionPercents.strongHire || 0, scores.selectionPercents.hire || 0, scores.selectionPercents.borderline || 0, scores.selectionPercents.reject || 0];

  const baseChartOptions = useMemo(
    () => ({
      chart: {
        toolbar: { show: false },
        foreColor: theme.foreground, // axis/legend/tooltip text
      },
      theme: { mode: theme.isDark ? 'dark' : 'light' },
      grid: { borderColor: theme.grid, strokeDashArray: 4 },
      tooltip: {
        theme: theme.isDark ? 'dark' : 'light',
      },
      dataLabels: {
        style: { colors: [theme.foreground] },
      },
      legend: {
        labels: { colors: theme.foreground },
      },
    }),
    [theme]
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="shadow-md">
            <CardBody>
              <Skeleton className="h-4 w-40 mb-4" />
              <Skeleton className="h-[220px] w-full rounded-lg" />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md">Failed to load widgets{error ? `: ${error}` : ''}.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* 1) Active jobs — Open vs Closed */}
      <Card className="p-3">
        <CardBody className="p-3">
          <div className="text-sm font-medium mb-2">Active jobs — Open vs Closed</div>
          <Chart
            type="donut"
            height={220}
            series={jobsSeries}
            options={{
              ...baseChartOptions,
              labels: ['Open', 'Closed'],
              colors: [theme.secondary, theme.muted],
              legend: { position: 'bottom', labels: { colors: theme.foreground } },
              dataLabels: { enabled: true },
              plotOptions: {
                pie: { donut: { size: '65%', labels: { show: false } } },
              },
            }}
          />
          <div className="mt-3 flex justify-between text-sm">
            <span>
              Open: <b>{jobs.open}</b>
            </span>
            <span>
              Closed: <b>{jobs.closed}</b>
            </span>
          </div>
        </CardBody>
      </Card>

      {/* 2) Interviews — today / this week */}
      <Card className="p-3">
        <CardBody className="p-3">
          <div className="text-sm font-medium mb-2">Interviews — today / this week</div>
          <Chart
            type="bar"
            height={220}
            series={interviewsSeries}
            options={{
              ...baseChartOptions,
              colors: [theme.secondary],
              xaxis: { categories: ['Today', 'This week'], axisTicks: { color: theme.grid }, axisBorder: { color: theme.grid } },
              dataLabels: { enabled: true },
              plotOptions: { bar: { columnWidth: '45%', borderRadius: 6 } },
            }}
          />
          <div className="mt-3 flex justify-between text-sm">
            <span>
              Today: <b>{interviews.today}</b>
            </span>
            <span>
              This week: <b>{interviews.thisWeek}</b>
            </span>
          </div>
        </CardBody>
      </Card>

      {/* 4) Avg total score & selection mix */}
      <Card className="p-3">
        <CardBody className="p-3">
          <div className="text-sm font-medium">Avg total score & decision mix</div>
          <div className="text-3xl font-semibold">
            {scores.averageTotalScore !== null ? Number(scores.averageTotalScore).toFixed(1) : '—'} <span className="text-sm"> last 180 days</span>{' '}
          </div>

          <Chart
            type="donut"
            height={220}
            series={decisionSeries}
            options={{
              ...baseChartOptions,
              // StrongHire, Hire, Borderline, Reject mapped to theme
              colors: [theme.success, theme.secondary, theme.warning, theme.danger],
              legend: { show: false },
              dataLabels: { enabled: false },
              tooltip: {
                ...baseChartOptions.tooltip,
                y: { formatter: (val: number) => `${val.toFixed(1)}%` },
              },
              plotOptions: {
                pie: { donut: { size: '65%', labels: { show: false } } },
              },
            }}
          />

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Chip size="sm" radius="sm" color="success">
              Strong: {scores.selectionPercents.strongHire}%
            </Chip>
            <Chip size="sm" radius="sm" color="secondary">
              Hire: {scores.selectionPercents.hire}%
            </Chip>
            <Chip size="sm" radius="sm" color="warning">
              Borderline: {scores.selectionPercents.borderline}%
            </Chip>
            <Chip size="sm" radius="sm" color="danger">
              Reject: {scores.selectionPercents.reject}%
            </Chip>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
