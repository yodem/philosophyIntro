import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    MenuButtonBold,
    MenuButtonItalic,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    RichTextEditorProvider,
    RichTextField,
} from "mui-tiptap";

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                dir: 'rtl',
            },
        },
    });

    return (
        <RichTextEditorProvider editor={editor}>
            <RichTextField
                controls={
                    <MenuControlsContainer>
                        <MenuSelectHeading />
                        <MenuDivider />
                        <MenuButtonBold />
                        <MenuButtonItalic />
                    </MenuControlsContainer>
                }
            />
        </RichTextEditorProvider>
    );
}
