import { ControllerRenderProps } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { MenuBar } from "./MenuBar";

interface iAppProps {
  field: ControllerRenderProps;
}

export const JobDescriptionEditor = ({ field }: iAppProps) => {
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
          "min-h-[300px] p-4 max-w-none focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert",
      },
    },
    // OnUpdate runs everytime the content updates
    onUpdate({ editor }) {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : "",
  });

  return (
    <div className="w-full border rounded-lg overflow-hidden bg-card">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

// i use the prose classname to add styles to tiptap editor because by default typography styles are not added or i think tailwind removes them, so i installed a package from tailwind to fix this issue:
