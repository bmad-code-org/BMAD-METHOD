# In-App Bug Reporting - Reference Implementation

This document provides a reference implementation for adding **in-app bug reporting** to your project. The BMAD bug-tracking workflow works without this feature (using manual `bugs.md` input), but in-app reporting provides a better user experience.

## Overview

The in-app bug reporting feature allows users to submit bug reports directly from your application. Reports are stored in your database and then synced to `bugs.md` by the triage workflow.

```
User -> UI Modal -> API -> Database -> Triage Workflow -> bugs.md/bugs.yaml
```

## Components Required

| Component | Purpose | Stack-Specific |
|-----------|---------|----------------|
| Database table | Store pending bug reports | Yes |
| API: Create report | Accept user submissions | Yes |
| API: Get pending | Fetch unsynced reports | Yes |
| API: Mark synced | Update status after sync | Yes |
| UI Modal | Bug report form | Yes |
| Validation schemas | Input validation | Partially |

## 1. Database Schema

### Drizzle ORM (PostgreSQL)

```typescript
// src/lib/server/db/schema.ts

import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';

export const bugReports = pgTable(
  'bug_reports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull(), // For multi-tenant apps
    reporterType: text('reporter_type').notNull(),     // 'staff' | 'member' | 'user'
    reporterId: uuid('reporter_id').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    userAgent: text('user_agent'),
    pageUrl: text('page_url'),
    platform: text('platform'),                        // 'Windows', 'macOS', 'iOS', etc.
    browser: text('browser'),                          // 'Chrome', 'Safari', 'Firefox'
    screenshotUrl: text('screenshot_url'),             // Optional: cloud storage URL
    status: text('status').notNull().default('new'),   // 'new' | 'synced' | 'dismissed'
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    syncedAt: timestamp('synced_at', { withTimezone: true })
  },
  (table) => [
    index('bug_reports_organization_id_idx').on(table.organizationId),
    index('bug_reports_status_idx').on(table.status),
    index('bug_reports_created_at_idx').on(table.createdAt)
  ]
);

export const BUG_REPORT_STATUS = {
  NEW: 'new',
  SYNCED: 'synced',
  DISMISSED: 'dismissed'
} as const;

export const REPORTER_TYPE = {
  STAFF: 'staff',
  MEMBER: 'member',
  USER: 'user'
} as const;
```

### Prisma Schema

```prisma
model BugReport {
  id              String    @id @default(uuid())
  organizationId  String    @map("organization_id")
  reporterType    String    @map("reporter_type")
  reporterId      String    @map("reporter_id")
  title           String
  description     String
  userAgent       String?   @map("user_agent")
  pageUrl         String?   @map("page_url")
  platform        String?
  browser         String?
  screenshotUrl   String?   @map("screenshot_url")
  status          String    @default("new")
  createdAt       DateTime  @default(now()) @map("created_at")
  syncedAt        DateTime? @map("synced_at")

  @@index([organizationId])
  @@index([status])
  @@index([createdAt])
  @@map("bug_reports")
}
```

## 2. Validation Schemas

### Zod (TypeScript)

```typescript
// src/lib/schemas/bug-report.ts

import { z } from 'zod';

export const createBugReportSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be 200 characters or less'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be 5000 characters or less'),
  pageUrl: z.string().url().optional(),
  userAgent: z.string().max(1000).optional(),
  platform: z.string().max(50).optional(),
  browser: z.string().max(50).optional()
});

export const markSyncedSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'At least one ID is required')
});

export const SCREENSHOT_CONFIG = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  maxSizeMB: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'] as const
} as const;
```

## 3. API Endpoints

### POST /api/bug-reports - Create Report

```typescript
// SvelteKit: src/routes/api/bug-reports/+server.ts

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { bugReports } from '$lib/server/db/schema';
import { createBugReportSchema } from '$lib/schemas/bug-report';

export const POST: RequestHandler = async ({ request, locals }) => {
  // Determine reporter from auth context
  if (!locals.user) {
    return json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  const body = await request.json();
  const result = createBugReportSchema.safeParse(body);

  if (!result.success) {
    return json({
      error: { code: 'VALIDATION_ERROR', message: result.error.issues[0]?.message }
    }, { status: 400 });
  }

  const { title, description, pageUrl, userAgent, platform, browser } = result.data;

  const [newReport] = await db
    .insert(bugReports)
    .values({
      organizationId: locals.user.organizationId,
      reporterType: 'staff',
      reporterId: locals.user.id,
      title,
      description,
      pageUrl,
      userAgent,
      platform,
      browser
    })
    .returning();

  return json({
    data: {
      bugReport: {
        id: newReport.id,
        title: newReport.title,
        createdAt: newReport.createdAt.toISOString()
      }
    }
  }, { status: 201 });
};
```

### GET /api/bug-reports/pending - Fetch for Triage

```typescript
// SvelteKit: src/routes/api/bug-reports/pending/+server.ts

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { bugReports, BUG_REPORT_STATUS } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
  const reports = await db
    .select()
    .from(bugReports)
    .where(eq(bugReports.status, BUG_REPORT_STATUS.NEW))
    .orderBy(bugReports.createdAt);

  // Map to workflow-expected format
  const formatted = reports.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    reporterType: r.reporterType,
    reporterName: 'Unknown', // Join with users table for real name
    platform: r.platform,
    browser: r.browser,
    pageUrl: r.pageUrl,
    screenshotUrl: r.screenshotUrl,
    createdAt: r.createdAt.toISOString()
  }));

  return json({
    data: {
      reports: formatted,
      count: formatted.length
    }
  });
};
```

### POST /api/bug-reports/mark-synced - Update After Sync

```typescript
// SvelteKit: src/routes/api/bug-reports/mark-synced/+server.ts

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { bugReports, BUG_REPORT_STATUS } from '$lib/server/db/schema';
import { inArray } from 'drizzle-orm';
import { markSyncedSchema } from '$lib/schemas/bug-report';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const result = markSyncedSchema.safeParse(body);

  if (!result.success) {
    return json({
      error: { code: 'VALIDATION_ERROR', message: result.error.issues[0]?.message }
    }, { status: 400 });
  }

  const updated = await db
    .update(bugReports)
    .set({
      status: BUG_REPORT_STATUS.SYNCED,
      syncedAt: new Date()
    })
    .where(inArray(bugReports.id, result.data.ids))
    .returning({ id: bugReports.id });

  return json({
    data: {
      updatedCount: updated.length,
      updatedIds: updated.map((r) => r.id)
    }
  });
};
```

## 4. UI Component

### Svelte 5 (with shadcn-svelte)

```svelte
<!-- src/lib/components/BugReportModal.svelte -->
<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { toast } from 'svelte-sonner';
  import { Bug } from 'lucide-svelte';
  import { browser } from '$app/environment';

  interface Props {
    open: boolean;
    onClose: () => void;
  }

  let { open = $bindable(), onClose }: Props = $props();

  let title = $state('');
  let description = $state('');
  let loading = $state(false);

  // Auto-detect environment
  let platform = $derived(browser ? detectPlatform() : '');
  let browserName = $derived(browser ? detectBrowser() : '');
  let currentUrl = $derived(browser ? window.location.href : '');

  function detectPlatform(): string {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('mac')) return 'macOS';
    if (ua.includes('win')) return 'Windows';
    return 'Unknown';
  }

  function detectBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edg')) return 'Edge';
    return 'Unknown';
  }

  async function handleSubmit() {
    loading = true;
    try {
      const response = await fetch('/api/bug-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          pageUrl: currentUrl,
          userAgent: navigator.userAgent,
          platform,
          browser: browserName
        })
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error?.message || 'Failed to submit');
        return;
      }

      toast.success('Bug report submitted');
      onClose();
    } finally {
      loading = false;
    }
  }
</script>

<Dialog.Root bind:open onOpenChange={(o) => !o && onClose()}>
  <Dialog.Content class="sm:max-w-[500px]">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2">
        <Bug class="h-5 w-5" />
        Report a Bug
      </Dialog.Title>
    </Dialog.Header>

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
      <div>
        <Input bind:value={title} placeholder="Brief summary" maxlength={200} />
      </div>
      <div>
        <Textarea bind:value={description} placeholder="What happened?" rows={4} />
      </div>
      <div class="rounded-md bg-muted p-3 text-sm text-muted-foreground">
        {platform} / {browserName}
      </div>
      <Dialog.Footer>
        <Button variant="outline" onclick={onClose} disabled={loading}>Cancel</Button>
        <Button type="submit" disabled={loading}>Submit</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
```

### React (with shadcn/ui)

```tsx
// src/components/BugReportModal.tsx

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bug } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function BugReportModal({ open, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const detectPlatform = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('mac')) return 'macOS';
    if (ua.includes('win')) return 'Windows';
    return 'Unknown';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/bug-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          platform: detectPlatform()
        })
      });

      if (!response.ok) throw new Error('Failed to submit');
      toast.success('Bug report submitted');
      onClose();
    } catch {
      toast.error('Failed to submit bug report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Report a Bug
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief summary" />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What happened?" />
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

## 5. Workflow Configuration

Update your project's `.bmad/bmm/config.yaml` to set the `project_url`:

```yaml
# .bmad/bmm/config.yaml

project_url: "http://localhost:5173"  # Dev
# project_url: "https://your-app.com"  # Prod
```

The triage workflow will use this to call your API endpoints.

## 6. API Response Format

The workflow expects these response formats:

### GET /api/bug-reports/pending

```json
{
  "data": {
    "reports": [
      {
        "id": "uuid",
        "title": "Bug title",
        "description": "Bug description",
        "reporterType": "staff",
        "reporterName": "John Doe",
        "platform": "macOS",
        "browser": "Chrome",
        "pageUrl": "https://...",
        "screenshotUrl": "https://...",
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "count": 1
  }
}
```

### POST /api/bug-reports/mark-synced

Request:
```json
{ "ids": ["uuid1", "uuid2"] }
```

Response:
```json
{
  "data": {
    "updatedCount": 2,
    "updatedIds": ["uuid1", "uuid2"]
  }
}
```

## 7. Optional: Screenshot Storage

For screenshot uploads, you'll need cloud storage (R2, S3, etc.):

1. Create an upload endpoint: `POST /api/bug-reports/[id]/upload-screenshot`
2. Upload to cloud storage
3. Update `screenshotUrl` on the bug report record

## 8. Security Considerations

- **Authentication**: Create endpoint should require auth
- **API Key**: Consider adding API key auth for pending/mark-synced endpoints in production
- **Rate Limiting**: Add rate limits to prevent spam
- **Input Sanitization**: Validate all user input (handled by Zod schemas)

## Without In-App Reporting

If you don't implement in-app reporting, the workflow still works:

1. Users manually add bugs to `docs/bugs.md` under `# manual input`
2. Run `/triage` to process them
3. Workflow skips Step 0 (API sync) when no API is available

The workflows are designed to be flexible and work with or without the in-app feature.
