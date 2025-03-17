import { RichTextEditor } from './RichTextEditor';
import { Box } from '@mui/material';

interface EditableRichTextProps {
    initialContent: string;
    onChange: (content: string) => void;
}

export function EditableRichText({ initialContent, onChange }: EditableRichTextProps) {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }} >
            <RichTextEditor content={initialContent} onChange={onChange} />
        </Box>
    );
}
