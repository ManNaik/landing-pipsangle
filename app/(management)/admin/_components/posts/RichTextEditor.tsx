"use client";

import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  Undo2,
  Unlink,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Separator } from "@/app/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Textarea } from "@/app/components/ui/textarea";
import { Toggle } from "@/app/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/components/ui/tooltip";

type Mode = "visual" | "html";

/** Editor HTML without the empty paragraphs left behind by pressing Enter at the end. */
function editorHtml(editor: Editor): string {
  return editor.getHTML().replace(/(<p><\/p>)+$/, "");
}

function isAllowedHref(href: string): boolean {
  return /^https?:\/\/\S+$/i.test(href) || (href.startsWith("/") && !href.startsWith("//"));
}

function ToolbarToggle({
  label,
  pressed,
  onPressedChange,
  disabled,
  children,
}: {
  label: string;
  pressed: boolean;
  onPressedChange: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <Toggle
            size="sm"
            pressed={pressed}
            onPressedChange={onPressedChange}
            onMouseDown={(event) => event.preventDefault()}
            disabled={disabled}
            aria-label={label}
          >
            {children}
          </Toggle>
        </span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function LinkControl({ editor, active }: { editor: Editor; active: boolean }) {
  const [open, setOpen] = useState(false);
  const [href, setHref] = useState("");
  const [error, setError] = useState<string | null>(null);

  function apply() {
    const value = href.trim();
    if (!value) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setOpen(false);
      return;
    }
    if (!isAllowedHref(value)) {
      setError("Use a full https:// address or a site path such as /news.");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: value }).run();
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setHref((editor.getAttributes("link").href as string | undefined) ?? "");
          setError(null);
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Toggle size="sm" pressed={active} aria-label="Link">
              <LinkIcon />
            </Toggle>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Link</TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-80">
        <form
          className="grid gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            apply();
          }}
        >
          <Input autoFocus value={href} onChange={(event) => setHref(event.target.value)} placeholder="https://… or /page" />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
          <div className="flex justify-end gap-2">
            {active ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  editor.chain().focus().extendMarkRange("link").unsetLink().run();
                  setOpen(false);
                }}
              >
                <Unlink />
                Remove
              </Button>
            ) : null}
            <Button type="submit" size="sm">
              Apply
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const [mode, setMode] = useState<Mode>("visual");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        underline: false,
        trailingNode: false,
        link: { openOnClick: false, autolink: true, HTMLAttributes: { target: null, rel: null } },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "admin-prose min-h-[26rem] px-5 py-4 text-[0.95rem] outline-none" },
    },
    onUpdate: ({ editor: current }) => onChange(current.isEmpty ? "" : editorHtml(current)),
  });

  const state = useEditorState({
    editor,
    selector: ({ editor: current }) =>
      current
        ? {
            paragraph: current.isActive("paragraph"),
            h2: current.isActive("heading", { level: 2 }),
            h3: current.isActive("heading", { level: 3 }),
            bold: current.isActive("bold"),
            italic: current.isActive("italic"),
            bulletList: current.isActive("bulletList"),
            orderedList: current.isActive("orderedList"),
            blockquote: current.isActive("blockquote"),
            link: current.isActive("link"),
            canUndo: current.can().undo(),
            canRedo: current.can().redo(),
          }
        : null,
  });

  // Keep the editor in step with content loaded or edited outside it (loading, HTML view).
  useEffect(() => {
    if (!editor || mode !== "visual") return;
    const current = editor.isEmpty ? "" : editorHtml(editor);
    if (current !== value) editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value, mode]);

  const chain = () => editor!.chain().focus();

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-wrap items-center gap-1 border-b px-2 py-1.5">
        {mode === "visual" && editor && state ? (
          <>
            <ToolbarToggle label="Paragraph" pressed={state.paragraph} onPressedChange={() => chain().setParagraph().run()}>
              <Pilcrow />
            </ToolbarToggle>
            <ToolbarToggle label="Heading 2" pressed={state.h2} onPressedChange={() => chain().toggleHeading({ level: 2 }).run()}>
              <Heading2 />
            </ToolbarToggle>
            <ToolbarToggle label="Heading 3" pressed={state.h3} onPressedChange={() => chain().toggleHeading({ level: 3 }).run()}>
              <Heading3 />
            </ToolbarToggle>
            <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-5" />
            <ToolbarToggle label="Bold" pressed={state.bold} onPressedChange={() => chain().toggleBold().run()}>
              <Bold />
            </ToolbarToggle>
            <ToolbarToggle label="Italic" pressed={state.italic} onPressedChange={() => chain().toggleItalic().run()}>
              <Italic />
            </ToolbarToggle>
            <LinkControl editor={editor} active={state.link} />
            <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-5" />
            <ToolbarToggle label="Bulleted list" pressed={state.bulletList} onPressedChange={() => chain().toggleBulletList().run()}>
              <List />
            </ToolbarToggle>
            <ToolbarToggle label="Numbered list" pressed={state.orderedList} onPressedChange={() => chain().toggleOrderedList().run()}>
              <ListOrdered />
            </ToolbarToggle>
            <ToolbarToggle label="Quote" pressed={state.blockquote} onPressedChange={() => chain().toggleBlockquote().run()}>
              <Quote />
            </ToolbarToggle>
            <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-5" />
            <ToolbarToggle label="Undo" pressed={false} disabled={!state.canUndo} onPressedChange={() => chain().undo().run()}>
              <Undo2 />
            </ToolbarToggle>
            <ToolbarToggle label="Redo" pressed={false} disabled={!state.canRedo} onPressedChange={() => chain().redo().run()}>
              <Redo2 />
            </ToolbarToggle>
          </>
        ) : (
          <span className="px-2 text-xs text-muted-foreground">
            Allowed tags: p, h2, h3, ul, ol, li, strong, em, a, blockquote. Others are removed when you save.
          </span>
        )}
        <Tabs value={mode} onValueChange={(next) => setMode(next as Mode)} className="ml-auto">
          <TabsList className="h-8">
            <TabsTrigger value="visual" className="text-xs">
              Visual
            </TabsTrigger>
            <TabsTrigger value="html" className="text-xs">
              HTML
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {mode === "visual" ? (
        <EditorContent editor={editor} />
      ) : (
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          className="min-h-[26rem] rounded-none border-0 bg-transparent font-mono text-xs leading-relaxed shadow-none focus-visible:ring-0 dark:bg-transparent"
          aria-label="HTML source"
        />
      )}
    </div>
  );
}
