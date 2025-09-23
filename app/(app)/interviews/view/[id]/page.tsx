'use client';

import React, { useEffect, useState } from 'react';
import { getJobById } from '@/services/job.service';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Chip, Divider, Navbar, NavbarBrand, ScrollShadow, Tabs, Tab, Button, NavbarContent, NavbarItem, Table, TableHeader, TableRow, TableColumn, TableBody, TableCell } from '@heroui/react';
import UploadFiles from '@/app/(app)/interviews/resume/[id]/page';
import { Briefcase, Calendar, Clock, Edit, MapPin, MessageSquare } from 'lucide-react';
import JobOverviewSkeleton from '../JobOverviewSkeleton';
import SocialShareDropdown from '../components/SocialShareDropdown';

export default function JobView() {
  const { id } = useParams() as { id?: string };

  const [data, setData] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const job = await getJobById(id!);
        if (job) setData(job);
      } catch (err) {
        console.error('Failed to fetch job:', err);
      }
    })();
  }, [id]);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      {/* Top bar */}
      <Navbar maxWidth="2xl" className="backdrop-blur supports-[backdrop-filter]:bg-background/70  " isBordered>
        <NavbarBrand>
          <div className="ml-3">
            <div className="text-tiny text-default-500">Interview</div>
            <div className="-mt-0.5 text-xl font-semibold">{data?.jobTitle}</div>
          </div>
        </NavbarBrand>

        <NavbarContent justify="end">
          <NavbarItem>
            <Button radius="full" color="default" onPress={() => router.push(`/interviews/edit/${data.id}`)} variant="bordered" size="sm" startContent={<Edit />}>
              Edit Interview
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Tabs layout */}
      <div className="mx-auto  max-w-[94rem] px-4 py-6">
        <Tabs aria-label="Interview tabs" color="secondary" variant="underlined" className="w-full" defaultSelectedKey="overview">
          <Tab key="overview" title="Overview">
            {!data ? (
              <JobOverviewSkeleton />
            ) : (
              <Card shadow="sm" className="mt-3">
                <CardHeader className="flex items-start justify-between gap-3">
                  {/* Left side: title + chips */}
                  <div className="flex flex-col gap-2">
                    <div className="text-base font-semibold text-default-500">{data?.jobTitle}</div>

                    <div className="flex items-center gap-3">
                      <Chip color="primary" variant="flat">
                        {data?.experienceLevel}
                      </Chip>
                      <Chip color="secondary">{`${data?.minSalary} – ${data?.maxSalary} ${data?.currency}`}</Chip>
                    </div>
                  </div>

                  {/* Right side: share button */}
                  <SocialShareDropdown url="https://www.evalsy.com" title="Evalsy – AI video interviews" />
                </CardHeader>

                <Divider />
                <CardBody className=" ">
                  <div className="grid grid-flow-col auto-cols-[minmax(140px,1fr)] gap-4 w-full overflow-x-auto snap-x snap-mandatory">
                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border snap-start">
                      <MapPin className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">
                          {data?.country}, {data?.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border snap-start">
                      <MessageSquare className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-sm text-secondary">Verbal Questions</p>
                        <p className="font-medium">{data?.totalRandomVerbalQuestion}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border snap-start">
                      <Clock className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-sm text-secondary">Duration </p>
                        <p className="font-medium">{data?.durationInMinutes} Minutes</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border snap-start">
                      <Calendar className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-sm text-secondary">Invitation Expires</p>
                        <p className="font-medium">{data?.invitationExpireInDays} days</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border snap-start">
                      <Briefcase className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-sm text-secondary">Work Type</p>
                        <p className="font-medium">{data?.workplaceType}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 text-sm font-medium">Job Description</div>
                    <Card className="border border-dashed border-default-200 bg-content1" radius="lg" shadow="none">
                      <CardBody>
                        <article className="prose prose-sm max-w-none dark:prose-invert">
                          <div className={`text-primary4 container space-y-4 text-sm pr-2 max-h-full `} dangerouslySetInnerHTML={{ __html: data?.description || '' }} />
                        </article>
                      </CardBody>
                    </Card>
                  </div>
                </CardBody>
              </Card>
            )}
          </Tab>

          <Tab key="questions" title={`Questions (${data?.questions?.length ?? 0})`}>
            <Card shadow="sm" className="mt-3">
              <CardHeader className="flex-col items-start gap-1">
                <div className="text-base font-semibold">Questions</div>
                <div className="text-small text-default-500">Verbal questions included in the session.</div>
              </CardHeader>
              <Divider />
              <CardBody>
                <ScrollShadow className="max-h-[420px]">
                  <Table aria-label="Interview questions" className="p-0">
                    <TableHeader>
                      <TableColumn className="w-14">#</TableColumn>
                      <TableColumn>Question</TableColumn>
                      <TableColumn>.</TableColumn>
                    </TableHeader>

                    <TableBody emptyContent="No questions">
                      {data?.questions?.map((q: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip size="sm" color="secondary" variant="flat" className=" justify-center">
                              {index + 1}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm leading-relaxed">{typeof q === 'string' ? q : q?.text}</span>
                          </TableCell>
                          <TableCell>
                            {q?.isRandom ? (
                              <Chip color="secondary" size="sm" variant="flat">
                                Randon
                              </Chip>
                            ) : (
                              <Chip size="sm" color="primary" variant="flat">
                                Fixed
                              </Chip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollShadow>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="fraud" title="Fraud Detection">
            <Card shadow="sm" className="mt-3">
              <CardHeader className="flex-col items-start gap-1">
                <div className="text-base font-semibold">Fraud Detection</div>
                <div className="text-small text-default-500">Monitoring & anti-cheat signals.</div>
              </CardHeader>
              <Divider />
              <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ToggleRow label="Right Click Detection" on={data?.fraudDetection.rightClick} />
                <ToggleRow label="Tab Switch Detection" on={data?.fraudDetection.tabSwitch} />
                <ToggleRow label="Developer Tools Detection" on={data?.fraudDetection.devTools} />
                <ToggleRow label="Face Not Detected" on={data?.fraudDetection.faceNotDetected} />
                <ToggleRow className="sm:col-span-2" label="Clipboard Monitoring" on={data?.fraudDetection.clipboard} />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="resume" title="AI Shortlist">
            <Card shadow="sm" className="mt-3">
              <CardHeader className="flex-col items-start gap-1">
                <div className="text-base font-semibold">AI Shortlist, Zero Hassle</div>
                <div className="text-small text-default-500">Drop resumes to see ranked matches in seconds</div>
              </CardHeader>
              <Divider />
              <CardBody>
                <UploadFiles />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </main>
  );
}

/* — Helpers — */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-[11px] font-medium uppercase tracking-wide text-default-500">{label}</div>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

function ToggleRow({ label, on, className }: { label: string; on: boolean; className?: string }) {
  return (
    <div className={`flex items-center justify-between rounded-xl border border-default-200 p-3 ${className ?? ''}`}>
      <span className="text-sm font-medium">{label}</span>
      <Chip size="sm" color={on ? 'success' : 'default'} variant="flat">
        {on ? 'Enabled' : 'Disabled'}
      </Chip>
    </div>
  );
}
