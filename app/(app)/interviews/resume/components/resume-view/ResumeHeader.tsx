import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip, Tooltip, Divider, CircularProgress, Accordion, AccordionItem } from '@heroui/react';
import { Mail, Phone, MapPin, Building2, Briefcase, ShieldCheck, AlertCircle, CheckCircle2, XCircle, Gauge, ThumbsUp, ThumbsDown, BarChart3 } from 'lucide-react';

const THRESHOLD = 70;

function colorForScore(pct: number): 'success' | 'warning' | 'danger' {
  if (pct >= 70) return 'success';
  if (pct >= 41) return 'warning';
  return 'danger';
}

export function bgTint(pct: number) {
  if (pct >= 70) return 'bg-green-50';
  if (pct >= 41) return 'bg-amber-50';
  return 'bg-rose-50';
}

export default function ResumeHeader({ data }: { data: any }) {
  const { candidate_info, matchscore, is_match, why_match, why_not_match, validitystatus } = data;

  return (
    <div>
      <div className="mx-auto max-w-6xl p-6 md:p-10">
        {/* Header */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">{candidate_info.candidatename}</h1>
              <p className="mt-1 text-neutral-600 flex flex-wrap items-center gap-2">
                <Briefcase className="h-4 w-4" aria-hidden />
                <span className="font-medium">{candidate_info.current_role}</span>
                <span>·</span>
                <Building2 className="h-4 w-4" aria-hidden />
                <span>{candidate_info.current_company}</span>
                <span>·</span>
                <MapPin className="h-4 w-4" aria-hidden />
                <span>{candidate_info.current_country}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Chip variant="flat" startContent={<BarChart3 className="h-3.5 w-3.5" />}>
                {candidate_info.total_experience} total exp
              </Chip>
              <Chip color={is_match ? 'success' : 'danger'} variant="flat" startContent={is_match ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}>
                {is_match ? 'Recommended match' : 'Not a match'}
              </Chip>
              <Chip color={validitystatus ? 'success' : 'warning'} variant="flat" startContent={validitystatus ? <ShieldCheck className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}>
                {validitystatus ? 'Data verified' : 'Needs verification'}
              </Chip>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
              <a className="inline-flex items-center gap-2 hover:text-neutral-800 underline-offset-2 hover:underline" href={`mailto:${candidate_info.email}`}>
                <Mail className="h-4 w-4" aria-hidden />
                {candidate_info.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" aria-hidden />
                {candidate_info.mobile}
              </span>
            </div>
          </div>

          {/* Score Card */}
          <Card className="md:w-[260px]">
            <CardBody className="flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <CircularProgress aria-label="Match score" value={matchscore} color={colorForScore(matchscore)} size="lg" showValueLabel={true} />
                <Tooltip content={`Threshold: ${THRESHOLD}%`}>
                  <Chip size="sm" variant="flat">
                    Threshold {THRESHOLD}%
                  </Chip>
                </Tooltip>
                <Chip size="sm" color={matchscore >= THRESHOLD ? 'success' : 'danger'} variant="flat" className="mt-1">
                  {matchscore >= THRESHOLD ? 'Above threshold' : 'Below threshold'}
                </Chip>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardBody className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
              <div>
                <p className="text-sm text-neutral-500">Strengths</p>
                <p className="text-lg font-semibold text-neutral-900">{why_match.length}</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-rose-600" aria-hidden />
              <div>
                <p className="text-sm text-neutral-500">Gaps</p>
                <p className="text-lg font-semibold text-neutral-900">{why_not_match.length}</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex items-center gap-3">
              {validitystatus ? <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden /> : <AlertCircle className="h-5 w-5 text-amber-600" aria-hidden />}
              <div>
                <p className="text-sm text-neutral-500">Validity</p>
                <p className="text-lg font-semibold text-neutral-900">{validitystatus ? 'Verified' : 'Check required'}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold">Why it matches ({why_match.length})</span>
            </CardHeader>
            <Divider />
            <CardBody>
              <ul className="space-y-3">
                {why_match.map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 flex-none" aria-hidden />
                    <span className="text-sm text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-rose-600" />
              <span className="text-sm font-semibold">Why it does not match ({why_not_match.length})</span>
            </CardHeader>
            <Divider />
            <CardBody>
              <ul className="space-y-3">
                {why_not_match.map((item, idx) => (
                  <li key={idx} className="flex gap-3">
                    <XCircle className="mt-0.5 h-4 w-4 text-rose-600 flex-none" aria-hidden />
                    <span className="text-sm text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* Summary / Actions + JSON */}
        <Card className="mt-6">
          <CardBody className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-neutral-700">
                Final decision:
                <Chip size="sm" className="ml-2" color={is_match ? 'success' : 'danger'} variant="flat" startContent={is_match ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}>
                  {is_match ? 'Proceed to next stage' : 'Do not shortlist'}
                </Chip>
              </p>
              <p className="text-xs text-neutral-500">Automatically derived from the provided analysis payload.</p>
            </div>
            <div className="flex gap-2">
              <Button color="primary" startContent={<ThumbsUp className="h-4 w-4" />}>
                Shortlist
              </Button>
              <Button variant="bordered" startContent={<ThumbsDown className="h-4 w-4" />}>
                Reject
              </Button>
            </div>
          </CardBody>
          <Divider />
        </Card>
      </div>
    </div>
  );
}
