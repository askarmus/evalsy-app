// components/dashboard/TopJobsPerformance.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody, Chip, Skeleton, Tooltip } from '@heroui/react';

import { Award, TrendingUp, Cpu } from 'lucide-react';
import { TopJob, topJobsByPerformance } from '@/services/dashboard.service';

const pct = (n: number) => `${Number.isFinite(n) ? n.toFixed(1) : '—'}%`;

export default function TopJobsPerformance() {
  const [rows, setRows] = useState<TopJob[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await topJobsByPerformance({ limit: 10, windowDays: 180, minCompleted: 2 });
        if (mounted) setRows(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardBody className="p-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-4 py-3 grid grid-cols-12 gap-3 items-center border-b border-default-200">
              <Skeleton className="col-span-4 h-4 w-60" />
              <Skeleton className="col-span-2 h-4 w-16" />
              <Skeleton className="col-span-2 h-4 w-16" />
              <Skeleton className="col-span-2 h-4 w-16" />
              <Skeleton className="col-span-2 h-4 w-16" />
            </div>
          ))}
        </CardBody>
      </Card>
    );
  }

  if (!rows || rows.length === 0) {
    return <div className="text-sm opacity-70">No jobs meet the criteria yet.</div>;
  }

  return (
    <Card className="shadow-sm">
      <CardBody className="p-0">
        <div className="px-4 py-3 text-xs font-medium uppercase tracking-wide grid grid-cols-12 gap-3">
          <div className="col-span-4">Job Title</div>
          <div className="col-span-2">Avg Score</div>
          <div className="col-span-2">Positive Rate</div>
          <div className="col-span-2">Completion</div>
          <div className="col-span-2">Perf. Score</div>
        </div>
        <div className="border-t border-default-200" />
        {rows.map((r) => (
          <div key={r.jobId} className="px-4 py-3 grid grid-cols-12 gap-3 items-center border-b border-default-200">
            <div className="col-span-4 flex items-center gap-2">
              <Award className="h-4 w-4 opacity-70" />
              <span className="font-medium">{r.jobTitle}</span>
              <Chip size="sm" variant="flat" color="secondary" className="ml-1">
                {r.interviews} interviews
              </Chip>
              <Chip size="sm" variant="flat" color="default">
                {r.invitations} invites
              </Chip>
            </div>

            <div className="col-span-2 text-sm font-semibold">{r.avgScore.toFixed(1)}</div>

            <div className="col-span-2 text-sm flex items-center gap-2">
              <Chip size="sm" color="success" variant="flat">
                + {pct(r.positiveRate)}
              </Chip>
              <Tooltip content="Strong Hire rate">
                <Chip size="sm" color="success" variant="flat" className="opacity-80">
                  SH {pct(r.strongHireRate)}
                </Chip>
              </Tooltip>
            </div>

            <div className="col-span-2 text-sm">
              <Chip size="sm" color="warning" variant="flat">
                {pct(r.completionRate)}
              </Chip>
            </div>

            <div className="col-span-2 text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 opacity-70" />
              {r.performanceScore.toFixed(1)}
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
