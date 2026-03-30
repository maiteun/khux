import { useState, useRef, useCallback, useEffect } from "react";
import { ImageIcon, Eye, Edit2, Bold, Italic, Heading1, Heading2, List, ListOrdered, Minus, Link, Quote } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import TurndownService from "turndown";
import { uploadImage, proxyUploadImage } from "../../utils/supabase-client";

// HTML → Markdown converter
const turndown = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});

// Keep image tags as markdown
turndown.addRule("images", {
  filter: "img",
  replacement: (_content, node) => {
    const el = node as HTMLElement;
    const src = el.getAttribute("src") || "";
    const alt = el.getAttribute("alt") || "image";
    return `\n![${alt}](${src})\n`;
  },
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef(value);
  useEffect(() => { valueRef.current = value; }, [value]);

  const insertAtCursor = useCallback((text: string) => {
    const ta = textareaRef.current;
    const cur = valueRef.current;
    const pos = ta ? ta.selectionStart : cur.length;
    const newValue = cur.slice(0, pos) + text + cur.slice(pos);
    onChange(newValue);
    valueRef.current = newValue;
  }, [onChange]);

  const insertText = useCallback((before: string, after: string = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const cur = valueRef.current;
    const selected = cur.slice(start, end);
    const newText = cur.slice(0, start) + before + selected + after + cur.slice(end);
    onChange(newText);
    valueRef.current = newText;
    requestAnimationFrame(() => {
      ta.focus();
      const cursorPos = start + before.length + selected.length;
      ta.setSelectionRange(cursorPos, cursorPos);
    });
  }, [onChange]);

  const handleImageUpload = useCallback(async (files: FileList | File[]) => {
    setUploading(true);
    setUploadStatus("이미지 업로드 중...");
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const url = await uploadImage(file);
        const altText = file.name === "image.png" ? "image" : file.name.replace(/\.[^.]+$/, "");
        insertAtCursor(`\n![${altText}](${url})\n`);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      setUploadStatus("");
    }
  }, [insertAtCursor]);

  // Process pasted HTML: convert to markdown and upload images
  const processHtmlPaste = useCallback(async (html: string) => {
    // Convert HTML to markdown
    let markdown = turndown.turndown(html);

    // Find all image URLs in the markdown
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const images: { full: string; alt: string; url: string }[] = [];
    let match;
    while ((match = imgRegex.exec(markdown)) !== null) {
      images.push({ full: match[0], alt: match[1], url: match[2] });
    }

    if (images.length === 0) {
      // No images, just insert the markdown
      insertAtCursor(markdown);
      return;
    }

    // Upload images
    setUploading(true);
    let processed = markdown;

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      setUploadStatus(`이미지 업로드 중... (${i + 1}/${images.length})`);
      try {
        // Skip data URIs that are too small (tracking pixels etc)
        if (img.url.startsWith("data:") && img.url.length < 200) {
          processed = processed.replace(img.full, "");
          continue;
        }

        let newUrl: string;
        if (img.url.startsWith("data:image/")) {
          // Data URL → convert to file and upload
          const res = await fetch(img.url);
          const blob = await res.blob();
          const file = new File([blob], `pasted-image-${i + 1}.png`, { type: blob.type });
          newUrl = await uploadImage(file);
        } else if (img.url.startsWith("http")) {
          // External URL → proxy upload
          try {
            newUrl = await proxyUploadImage(img.url);
          } catch {
            // If proxy fails, keep original URL
            newUrl = img.url;
          }
        } else {
          // Unknown format, skip
          continue;
        }
        processed = processed.replace(img.url, newUrl);
      } catch (error) {
        console.error(`Failed to upload image ${i + 1}:`, error);
        // Keep original URL on failure
      }
    }

    setUploading(false);
    setUploadStatus("");
    insertAtCursor(processed);
  }, [insertAtCursor]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;

    // 1. Check for direct image files (screenshot, copied image file)
    const imageFiles: File[] = [];
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) imageFiles.push(file);
      }
    }

    // 2. Check for rich HTML content (Notion, web pages, etc)
    const html = e.clipboardData.getData("text/html");
    const plainText = e.clipboardData.getData("text/plain");

    // If we have image files AND no HTML, upload directly
    if (imageFiles.length > 0 && !html) {
      e.preventDefault();
      handleImageUpload(imageFiles);
      return;
    }

    // If we have HTML with rich content (not just plain text wrapper)
    if (html) {
      const hasRichContent = /<(h[1-6]|p|img|ul|ol|blockquote|hr|strong|em|table)/i.test(html);
      if (hasRichContent) {
        e.preventDefault();
        processHtmlPaste(html);
        return;
      }
    }

    // If we have image files from clipboard
    if (imageFiles.length > 0) {
      e.preventDefault();
      handleImageUpload(imageFiles);
      return;
    }

    // Otherwise, let default paste behavior handle it (plain text)
  }, [handleImageUpload, processHtmlPaste]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const toolbarButtons = [
    { icon: Bold, action: () => insertText("**", "**"), title: "굵게" },
    { icon: Italic, action: () => insertText("*", "*"), title: "기울임" },
    { icon: Heading1, action: () => insertText("\n## ", "\n"), title: "제목" },
    { icon: Heading2, action: () => insertText("\n### ", "\n"), title: "소제목" },
    { icon: Quote, action: () => insertText("\n> ", "\n"), title: "인용" },
    { icon: List, action: () => insertText("\n- ", "\n"), title: "목록" },
    { icon: ListOrdered, action: () => insertText("\n1. ", "\n"), title: "번호 목록" },
    { icon: Minus, action: () => insertText("\n---\n"), title: "구분선" },
    { icon: Link, action: () => insertText("[", "](url)"), title: "링크" },
  ];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1 flex-1">
          {toolbarButtons.map(({ icon: Icon, action, title }) => (
            <button
              key={title}
              type="button"
              onClick={action}
              title={title}
              className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
          <div className="w-px h-5 bg-border mx-1" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="이미지 삽입"
            className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            disabled={uploading}
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
          />
        </div>

        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm transition-colors ${
              mode === "write"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit2 className="h-3.5 w-3.5" />
            작성
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm transition-colors ${
              mode === "preview"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            미리보기
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      {mode === "write" ? (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            placeholder={placeholder || "마크다운으로 작성하세요... 노션에서 바로 복사-붙여넣기하면 이미지 포함 자동 변환됩니다."}
            className="w-full min-h-[400px] px-4 py-3 bg-background text-foreground focus:outline-none resize-y font-mono text-sm leading-relaxed"
          />
          {uploading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                {uploadStatus || "처리 중..."}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-[400px] px-4 py-3">
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-muted-foreground text-sm">미리보기할 내용이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none prose-invert
      prose-headings:font-bold prose-headings:tracking-tight
      prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
      prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
      prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2
      prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4
      prose-img:rounded-lg prose-img:my-6 prose-img:mx-auto prose-img:max-w-full
      prose-hr:border-border prose-hr:my-8
      prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
      prose-strong:text-foreground
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-li:text-foreground/90
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt || ""}
              loading="lazy"
              className="rounded-lg my-6 mx-auto max-w-full"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
