'use client';

import React, { useEffect, useState } from 'react';
import { getJobById } from '@/services/job.service';
import { useParams } from 'next/navigation';
import { Card, CardBody, CardHeader, Chip, Divider, Navbar, NavbarBrand, ScrollShadow, Switch, Tabs, Tab } from '@heroui/react';
import UploadFiles from '@/app/(app)/interviews/resume/[id]/page';

export default function JobView() {
  const { id } = useParams() as { id?: string };

  const [data, setData] = useState<any>();

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
      <Navbar maxWidth="xl" className="backdrop-blur supports-[backdrop-filter]:bg-background/70" isBordered>
        <NavbarBrand>
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600" />
          <div className="ml-3">
            <div className="text-tiny text-default-500">Interview</div>
            <div className="-mt-0.5 text-small font-semibold">Read-only Overview</div>
          </div>
        </NavbarBrand>
      </Navbar>

      {/* Tabs layout */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Tabs aria-label="Interview tabs" color="secondary" variant="underlined" className="w-full" defaultSelectedKey="overview">
          <Tab key="overview" title="Overview">
            <Card shadow="sm" className="mt-3">
              <CardHeader className="flex-col items-start gap-1">
                <div className="text-base font-semibold">Interview Details</div>
                <div className="text-small text-default-500">Role and compensation overview.</div>
              </CardHeader>
              <Divider />
              <CardBody className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Role Name">{data?.roleName}</Field>
                <Field label="Experience Level">{data?.experienceLevel}</Field>
                <Field label="Workplace Type">{data?.workplaceType}</Field>
                <Field label="Salary Range">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>sds</span>
                    <Chip size="sm" variant="flat">
                      {data?.salary?.currencyLabel}
                    </Chip>
                  </div>
                </Field>
                <Field label="Location">
                  <div className="flex flex-wrap gap-2">
                    <span>{data?.location?.country}</span>
                    <span className="text-default-400">•</span>
                    <span>{data?.location?.city}</span>
                  </div>
                </Field>
                <Field label="Show salary in JD">
                  <Switch size="sm" isSelected={!!data?.showInJD} isDisabled aria-label="Show salary in JD" />
                </Field>

                <div className="md:col-span-2">
                  <div className="mb-2 text-sm font-medium">Job Description</div>
                  <Card className="border border-dashed border-default-200 bg-content1" radius="lg" shadow="none">
                    <CardBody>
                      <article className="prose prose-sm max-w-none dark:prose-invert">
                        {/* {jdParagraphs.map((p) => (
                          <p key={p.id} className="whitespace-pre-wrap">
                            {p.text}
                          </p>
                        ))} */}
                      </article>
                    </CardBody>
                  </Card>
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="questions" title={`Questions (${data?.settings?.selectedVerbalQuestions}/${data?.settings?.totalVerbalQuestions})`}>
            <Card shadow="sm" className="mt-3">
              <CardHeader className="flex-col items-start gap-1">
                <div className="text-base font-semibold">Questions</div>
                <div className="text-small text-default-500">Verbal questions included in the session.</div>
              </CardHeader>
              <Divider />
              <CardBody className="p-0">
                <ScrollShadow className="max-h-[420px]">
                  {/* <Listbox aria-label="Interview questions" variant="flat" className="p-0">
                    {questionItems.map((q) => (
                      <ListboxItem
                        key={q.id}
                        textValue={q.text}
                        startContent={
                          <Chip size="sm" color="secondary" variant="flat" className="min-w-7 justify-center">
                            {q.n}
                          </Chip>
                        }
                      >
                        <span className="text-sm leading-relaxed">{q.text}</span>
                      </ListboxItem>
                    ))}
                  </Listbox> */}
                </ScrollShadow>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="settings" title="Settings">
            <Card shadow="sm" className="mt-3">
              <CardHeader className="flex-col items-start gap-1">
                <div className="text-base font-semibold">Interview Settings</div>
                <div className="text-small text-default-500">Session configuration.</div>
              </CardHeader>
              <Divider />
              <CardBody className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Field label="Total verbal questions">{data?.settings?.totalVerbalQuestions}</Field>
                <Field label="Selected verbal questions">{data?.settings?.selectedVerbalQuestions}</Field>
                <Field label="Duration (minutes)">{data?.settings?.durationMinutes}</Field>
                <Field label="Invitation expires">{data?.settings?.invitationExpire}</Field>
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
