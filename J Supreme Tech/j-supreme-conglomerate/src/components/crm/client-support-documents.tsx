"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, File, FileImage, FileText, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CLIENT_FILE_MAX_BYTES } from "@/lib/crm/client-file-rules";

type ListedFile = {
  id: string;
  filename: string;
  mimeType: string;
  byteSize: number;
  createdAt: string;
  downloadUrl: string;
};

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function FileTypeIcon({ mime }: { mime: string }) {
  const m = mime.toLowerCase();
  if (m.startsWith("image/")) {
    return (
      <FileImage
        className="h-4 w-4 shrink-0 text-sky-700 dark:text-sky-300"
        aria-hidden
      />
    );
  }
  if (m === "application/pdf") {
    return (
      <FileText
        className="h-4 w-4 shrink-0 text-rose-700 dark:text-rose-300"
        aria-hidden
      />
    );
  }
  if (m.includes("word") || m.endsWith("document")) {
    return (
      <FileText
        className="h-4 w-4 shrink-0 text-blue-800 dark:text-blue-200"
        aria-hidden
      />
    );
  }
  return (
    <File className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
  );
}

type Props = {
  clientId: string;
  /** False when CRM runs in local/browser-only mode without Supabase persistence. */
  uploadsEnabled: boolean;
};

export function ClientSupportDocuments({ clientId, uploadsEnabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<ListedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const endpoint = `/api/v1/crm/clients/${encodeURIComponent(clientId)}/files`;

  const reload = useCallback(async () => {
    if (!uploadsEnabled) return;
    setLoading(true);
    setLoadError(null);
    try {
      const r = await fetch(endpoint, { method: "GET" });
      const data = (await r.json()) as { files?: ListedFile[]; error?: string };
      if (!r.ok || !data.files) {
        throw new Error(data?.error || r.statusText || "Could not load files.");
      }
      setFiles(data.files);
    } catch (e) {
      setFiles([]);
      setLoadError(e instanceof Error ? e.message : "Could not load files.");
    } finally {
      setLoading(false);
    }
  }, [endpoint, uploadsEnabled]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    setFiles([]);
    setLoadError(null);
    setActionError(null);
    setUploadProgress(null);
  }, [clientId]);

  const onPickFiles = () => inputRef.current?.click();

  const xhrUpload = (file: File) =>
    new Promise<{ ok: boolean; file?: ListedFile; error?: string }>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", endpoint);
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable && ev.total > 0) {
          setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
        }
      };
      xhr.onload = () => {
        try {
          const parsed = JSON.parse(xhr.responseText || "{}") as {
            ok?: boolean;
            file?: ListedFile;
            error?: string;
          };
          if (xhr.status >= 200 && xhr.status < 300 && parsed.ok && parsed.file) {
            resolve({ ok: true, file: parsed.file });
          } else {
            resolve({
              ok: false,
              error: parsed.error || `Upload failed (${xhr.status}).`,
            });
          }
        } catch {
          resolve({ ok: false, error: "Unexpected server response." });
        }
      };
      xhr.onerror = () => resolve({ ok: false, error: "Network error during upload." });
      const fd = new FormData();
      fd.append("file", file);
      xhr.send(fd);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked || !uploadsEnabled) return;

    setActionError(null);
    if (picked.size > CLIENT_FILE_MAX_BYTES) {
      setActionError("File exceeds 15 MB.");
      return;
    }

    setUploadBusy(true);
    setUploadProgress(0);
    try {
      const result = await xhrUpload(picked);
      if (!result.ok || !result.file) {
        setActionError(result.error ?? "Upload failed.");
        setUploadProgress(null);
        return;
      }
      setFiles((prev) => [
        result.file!,
        ...prev.filter((x) => x.id !== result.file!.id),
      ]);
      setUploadProgress(null);
    } finally {
      setUploadBusy(false);
    }
  };

  const onDelete = async (fileId: string) => {
    if (!uploadsEnabled) return;
    if (!window.confirm("Remove this file from the client record?")) return;
    setActionError(null);
    try {
      const url = `${endpoint}?fileId=${encodeURIComponent(fileId)}`;
      const r = await fetch(url, { method: "DELETE" });
      const data = (await r.json()) as { ok?: boolean; error?: string };
      if (!r.ok || !data.ok) {
        throw new Error(data.error || "Could not delete.");
      }
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Delete failed.");
    }
  };

  if (!uploadsEnabled) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 bg-muted/15 p-3 text-xs text-muted-foreground">
        Cloud uploads require Supabase (see project{" "}
        <code className="rounded bg-muted px-1 text-[10px]">.env.example</code>). In
        local-only CRM mode, store links under media URLs instead.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border/50 bg-muted/10 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-foreground">Support documents</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Logos, brand PDFs, Word briefs, images — up to 15 MB each. Files stay in
            Supabase Storage; signed links expire after about an hour (re-open this dialog
            to refresh the list).
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept=".pdf,.doc,.docx,image/*"
            onChange={(e) => void handleFileChange(e)}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1 text-xs"
            disabled={uploadBusy}
            onClick={onPickFiles}
          >
            <UploadCloud className="h-3.5 w-3.5" />
            {uploadBusy ? "Uploading…" : "Choose file"}
          </Button>
        </div>
      </div>

      {uploadProgress != null ? (
        <div className="space-y-1">
          <Progress value={uploadProgress} className="h-1.5" />
          <p className="text-[11px] text-muted-foreground tabular-nums">
            {uploadProgress}%
          </p>
        </div>
      ) : null}

      {loading ? (
        <p className="text-xs text-muted-foreground">Loading files…</p>
      ) : null}
      {loadError ? (
        <p
          role="alert"
          className="rounded border border-destructive/35 bg-destructive/10 px-2 py-1.5 text-xs text-destructive"
        >
          {loadError}
        </p>
      ) : null}
      {actionError ? (
        <p
          role="alert"
          className="rounded border border-destructive/35 bg-destructive/10 px-2 py-1.5 text-xs text-destructive"
        >
          {actionError}
        </p>
      ) : null}

      {!loading && files.length === 0 && !loadError ? (
        <p className="text-xs text-muted-foreground">No uploads yet.</p>
      ) : null}

      {files.length > 0 ? (
        <ul className="max-h-[200px] space-y-1.5 overflow-y-auto pr-0.5 text-xs">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-2 rounded-md border border-border/40 bg-background/60 px-2 py-1.5"
            >
              <FileTypeIcon mime={f.mimeType} />
              <div className="min-w-0 flex-1">
                <a
                  href={f.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open / download"
                  className="inline-flex max-w-full items-center gap-1 truncate font-medium text-primary underline-offset-4 hover:underline"
                >
                  <span className="truncate">{f.filename}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
                </a>
                <p className="text-[10px] text-muted-foreground">
                  {f.mimeType} · {formatBytes(f.byteSize)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                aria-label={`Delete ${f.filename}`}
                onClick={() => void onDelete(f.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
