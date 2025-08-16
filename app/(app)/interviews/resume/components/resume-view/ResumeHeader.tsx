import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip, Tooltip, Divider, CircularProgress, Accordion, AccordionItem } from '@heroui/react';
import { Mail, Phone, MapPin, Building2, Briefcase, ShieldCheck, AlertCircle, CheckCircle2, XCircle, Gauge, ThumbsUp, ThumbsDown, BarChart3, Trophy } from 'lucide-react';
import { HiringGradeUtil } from '@/app/utils/hiring-grade.util';

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
      <div className="p-4">
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
              <Chip variant="flat">{candidate_info.total_experience} total exp</Chip>
              <Chip color={is_match ? 'success' : 'danger'} variant="flat">
                {is_match ? 'Recommended match' : 'Not a match'}
              </Chip>
              <Chip color={validitystatus ? 'success' : 'warning'} variant="flat">
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

          <Card shadow="none" radius="none" className="md:w-[260px]">
            <CardBody className="pb-0">
              <div className="mx-auto flex flex-col items-center gap-2">
                <CircularProgress
                  color={HiringGradeUtil.getHiringRecommendation(matchscore).color}
                  classNames={{
                    svg: 'w-32 h-32 drop-shadow-none',
                    track: 'stroke-gray-200',
                    value: 'text-2xl font-semibold',
                  }}
                  showValueLabel
                  strokeWidth={3}
                  value={matchscore}
                />
                <Chip size="sm" color={HiringGradeUtil.getHiringRecommendation(matchscore).color} variant="bordered">
                  {HiringGradeUtil.getHiringRecommendation(matchscore).recommendation}
                </Chip>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card shadow="sm" radius="sm">
            <CardBody className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
              <div>
                <p className="text-sm text-neutral-500">
                  Strengths : <strong>{why_match.length}</strong>
                </p>
              </div>
            </CardBody>
          </Card>
          <Card shadow="sm" radius="sm">
            <CardBody className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-rose-600" aria-hidden />
              <div>
                <p className="text-sm text-neutral-500">
                  Gaps <strong>{why_not_match.length}</strong>{' '}
                </p>
              </div>
            </CardBody>
          </Card>
          <Card shadow="sm" radius="sm">
            <CardBody className="flex items-center gap-3">
              {validitystatus ? <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden /> : <AlertCircle className="h-5 w-5 text-amber-600" aria-hidden />}
              <div>
                <p className="text-sm text-neutral-500">
                  Validity: <strong>{validitystatus ? 'Verified' : 'Check required'}</strong>
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex items-center gap-2">
              <div className="flex items-center gap-2  ">
                <div className="w-8 h-8 bg-green-100 rounded-full p-2 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Why it matches ({why_match.length})</h3>
              </div>
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
              <div className="flex items-center gap-2  ">
                <div className="w-8 h-8 bg-danger-100 rounded-full p-2 flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-danger-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Why it does not match ({why_not_match.length})</h3>
              </div>
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
      </div>
    </div>
  );
}
