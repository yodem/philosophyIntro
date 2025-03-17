import { Container } from '@mui/material';
import { Content } from '@/types';
import { EntityDetailContent } from '../ContentDisplay/EntityDetailContent';

interface EntityDetailDisplayProps {
    entity: Content;
    setIsEditable: (editable: boolean) => void;
}

export function EntityDetailDisplay({ entity, setIsEditable }: EntityDetailDisplayProps) {
    return (
        <Container maxWidth="md" sx={{ pt: 4, pb: 6 }}>
            <EntityDetailContent entity={entity} setIsEditable={setIsEditable} />
        </Container>
    );
}
