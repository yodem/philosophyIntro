import { Container } from '@mui/material';
import { ContentWithRelations } from '@/types';
import { EntityDetailContent } from '../ContentDisplay/EntityDetailContent';

interface EntityDetailDisplayProps {
    entity: ContentWithRelations; // Updated to ContentWithRelations to include related content
    setIsEditable: (editable: boolean) => void;
}

export function EntityDetailDisplay({ entity, setIsEditable }: EntityDetailDisplayProps) {
    return (
        <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
            <EntityDetailContent entity={entity} setIsEditable={setIsEditable} />
        </Container>
    );
}
