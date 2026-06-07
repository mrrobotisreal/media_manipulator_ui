'use client';

import React from 'react';
import Link from 'next/link';
import { Clapperboard, Sparkles, Plus, ArrowLeft, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useLocalization } from '@/i18n/useLocalization';
import { useCreateProject, useRecentProjects } from '@/lib/useStudioProject';
import Editor from './editor';
// import Breadcrumbs from '../tool-landing-page';
// import { useToolPages } from '@/i18n/useToolPages';
// import type { ToolPageContent } from '@/content/toolPages';

const RESOLUTIONS = [
  { key: '1920x1080', label: '1080p — 1920×1080', width: 1920, height: 1080 },
  { key: '1280x720', label: '720p — 1280×720', width: 1280, height: 720 },
  { key: '3840x2160', label: '4K — 3840×2160', width: 3840, height: 2160 },
  { key: '1080x1920', label: 'Vertical — 1080×1920', width: 1080, height: 1920 },
];
const FPS_OPTIONS = [24, 30, 60];

/**
 * Content Studio host page. Switches between the entry screen (new project +
 * recents) and the live editor. The header chrome is shared across both.
 */
const ContentStudioPage: React.FC = () => {
  const { t } = useLocalization('interface');
  // const { toolPages } = useToolPages();
  const [openProjectId, setOpenProjectId] = React.useState<string | null>(null);

  return (
    <div className="max-w-[1800px] mx-auto my-4 px-4">
      <Card className="sci-fi-frame">
        <CardContent className="p-12 md:p-14">
          <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-6">
            {/* <Breadcrumbs tool={toolPages.find((t) => t.slug === 'content-studio')! as ToolPageContent} /> */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 mt-1 rounded-lg bg-blue-600/10 p-3">
                <Clapperboard className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-card-foreground leading-tight">
                    {t('contentStudio.title')}
                  </h1>
                  <Badge className="bg-green-600 text-white hover:bg-green-600">
                    <Sparkles className="w-3 h-3" />
                    {t('contentStudio.badge')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 max-w-3xl">{t('contentStudio.tagline')}</p>
              </div>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-card-foreground transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('contentStudio.backToTools')}
            </Link>
          </header>

          {openProjectId ? (
            <Editor projectId={openProjectId} onClose={() => setOpenProjectId(null)} />
          ) : (
            <EntryScreen onOpen={setOpenProjectId} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const EntryScreen: React.FC<{ onOpen: (id: string) => void }> = ({ onOpen }) => {
  const { t, formatDate } = useLocalization('interface');
  const recents = useRecentProjects();
  const createProject = useCreateProject((project) => onOpen(project.id));

  const [name, setName] = React.useState('');
  const [resKey, setResKey] = React.useState(RESOLUTIONS[0].key);
  const [fps, setFps] = React.useState('30');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = RESOLUTIONS.find((r) => r.key === resKey) ?? RESOLUTIONS[0];
    createProject.mutate({
      name: name.trim() || 'Untitled project',
      fps: Number(fps),
      width: res.width,
      height: res.height,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* new project */}
      <form onSubmit={submit} className="sci-fi-frame-green bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-green-500" />
          <h2 className="text-lg font-semibold text-card-foreground">{t('contentStudio.newProject.title')}</h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cs-name">{t('contentStudio.newProject.name')}</Label>
          <Input id="cs-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('contentStudio.newProject.namePlaceholder')} />
        </div>

        <div className="space-y-2">
          <Label>{t('contentStudio.newProject.resolution')}</Label>
          <Select value={resKey} onValueChange={setResKey}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RESOLUTIONS.map((r) => (
                <SelectItem key={r.key} value={r.key}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('contentStudio.newProject.fps')}</Label>
          <Select value={fps} onValueChange={setFps}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FPS_OPTIONS.map((f) => (
                <SelectItem key={f} value={String(f)}>
                  {f} fps
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={createProject.isPending}>
          {createProject.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          {t('contentStudio.newProject.create')}
        </Button>
      </form>

      {/* recents */}
      <section className="bg-card p-6 sci-fi-frame-inner lg:col-span-2">
        <h2 className="text-lg font-semibold text-card-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          {t('contentStudio.recents.title')}
        </h2>
        {recents.isLoading ? (
          <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t('contentStudio.recents.loading')}
          </p>
        ) : recents.isError ? (
          <p className="text-sm text-destructive">{t('contentStudio.recents.error')}</p>
        ) : recents.data && recents.data.length > 0 ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {recents.data.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => onOpen(project.id)}
                  className="w-full text-left rounded-lg border border-border bg-background/40 p-3 hover:bg-muted/40 transition-colors"
                >
                  <span className="block font-medium text-card-foreground truncate">{project.name}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {project.width}×{project.height} · {project.fps} fps · {formatDate(project.updatedAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{t('contentStudio.recents.empty')}</p>
        )}
      </section>
    </div>
  );
};

export default ContentStudioPage;
