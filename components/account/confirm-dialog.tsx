"use client";

import * as React from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description: React.ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  /** Runs on the confirm click. The dialog stays open until the caller closes it. */
  onConfirm: () => void | Promise<void>;
  busy?: boolean;
  /**
   * Type-to-confirm: the confirm button stays disabled until the field holds exactly this
   * string (case-sensitive, no trimming; it is what the API itself demands).
   */
  requireText?: string;
  requireLabel?: string;
  requireHint?: string;
  /** Extra body (impact numbers, progress, errors). */
  children?: React.ReactNode;
  /** Replaces the footer's confirm button area (re-auth step). */
  hideConfirm?: boolean;
}

/**
 * The one confirmation dialog behind every destructive action on /account. Radix AlertDialog:
 * focus-trapped, Escape cancels, and focus lands on Cancel, never on the destructive button.
 * Using a plain Button (not AlertDialogAction) for confirm keeps the dialog open while the
 * request runs.
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  busy = false,
  requireText,
  requireLabel,
  requireHint,
  children,
  hideConfirm = false,
}) => {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => (busy ? undefined : onOpenChange(next))}
    >
      {/* The body is a child component: Radix unmounts it on close, so a reopened dialog
          starts with an empty confirmation field. */}
      <ConfirmBody
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        onConfirm={onConfirm}
        busy={busy}
        requireText={requireText}
        requireLabel={requireLabel}
        requireHint={requireHint}
        hideConfirm={hideConfirm}
      >
        {children}
      </ConfirmBody>
    </AlertDialog>
  );
};

const ConfirmBody: React.FC<
  Omit<ConfirmDialogProps, "open" | "onOpenChange">
> = ({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  busy = false,
  requireText,
  requireLabel,
  requireHint,
  children,
  hideConfirm = false,
}) => {
  const [typed, setTyped] = React.useState("");
  const inputId = React.useId();
  const armed = requireText === undefined || typed === requireText;
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      {children}
      {requireText !== undefined ? (
        <div className="grid gap-2">
          {requireHint ? (
            <p className="text-sm text-foreground">{requireHint}</p>
          ) : null}
          <Label htmlFor={inputId} className="sr-only">
            {requireLabel}
          </Label>
          <Input
            id={inputId}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={busy}
            className="min-h-11"
          />
        </div>
      ) : null}
      <AlertDialogFooter>
        <AlertDialogCancel disabled={busy} className="min-h-11">
          {cancelLabel}
        </AlertDialogCancel>
        {hideConfirm ? null : (
          <Button
            type="button"
            variant="destructive"
            className="min-h-11"
            disabled={!armed || busy}
            onClick={() => void onConfirm()}
          >
            {confirmLabel}
          </Button>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
