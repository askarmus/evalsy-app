'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';

import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';

import { Button } from '@heroui/react';
import { AiOutlineBold, AiOutlineItalic, AiOutlineUnderline, AiOutlineUnorderedList, AiOutlineOrderedList, AiOutlineCode } from 'react-icons/ai';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const lowlight = createLowlight();

  lowlight.register('javascript', javascript);
  lowlight.register('typescript', typescript);
  lowlight.register('python', python);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value || '<p></p>',

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      editor.commands.scrollIntoView();
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border-2 border-gray-200 dark:border-zinc-700 rounded-xl p-4 space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2">
        <Button isIconOnly variant="ghost" size="sm" onPress={() => editor.chain().focus().toggleBold().run()} aria-label="Bold">
          <AiOutlineBold />
        </Button>
        <Button isIconOnly variant="ghost" size="sm" onPress={() => editor.chain().focus().toggleItalic().run()} aria-label="Italic">
          <AiOutlineItalic />
        </Button>
        <Button isIconOnly variant="ghost" size="sm" onPress={() => editor.chain().focus().toggleUnderline().run()} aria-label="Underline">
          <AiOutlineUnderline />
        </Button>
        <Button isIconOnly variant="ghost" size="sm" onPress={() => editor.chain().focus().toggleBulletList().run()} aria-label="Bullet List">
          <AiOutlineUnorderedList />
        </Button>
        <Button isIconOnly variant="ghost" size="sm" onPress={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Numbered List">
          <AiOutlineOrderedList />
        </Button>
        <Button isIconOnly variant="ghost" size="sm" onPress={() => editor.chain().focus().toggleCodeBlock().run()} aria-label="Code Block">
          <AiOutlineCode />
        </Button>
      </div>

      {/* Scrollable Editor Container */}
      <div className="max-h-64 overflow-y-auto border-1 border-gray-200 dark:border-zinc-700 p-2">
        <EditorContent editor={editor} className="tiptap prose prose-sm max-w-none min-h-[53px] focus:outline-none focus:ring-0" />
      </div>
    </div>
  );
}
