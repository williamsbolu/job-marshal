"use client";

import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";

export function JsonToHtml({ json }: { json: JSONContent }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }), // types: elements allowed to be aligned
      Typography,
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert",
      },
    },
    editable: false,
    content: json,
  });

  return <EditorContent editor={editor} />;
}
