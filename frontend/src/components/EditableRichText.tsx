import { useState, useEffect } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { Box, Button } from '@mui/material';

interface EditableRichTextProps {
    initialContent: string;
    onSave: (content: string) => Promise<void>;
}

export function EditableRichText({ initialContent, onSave }: EditableRichTextProps) {
    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const handleSave = async () => {
        await onSave(content);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }} >
            <RichTextEditor content={content} onChange={setContent} />
            <Button variant='contained' sx={{ alignSelf: "start" }} onClick={handleSave}>Save Changes</Button>
        </Box>
    );
}
