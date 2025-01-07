import { createFileRoute } from '@tanstack/react-router';
import { philosophersApi } from '../../api';
import { Card, CardContent, Skeleton, Typography, Chip, Box, Divider } from '@mui/material';
import { RichTextEditor } from '../../components/RichTextEditor';
import { useState, useEffect } from 'react';

function PhilosopherSkeleton() {
  return (
    <Box p={2}>
      <Card>
        <CardContent>
          <Skeleton variant="text" height={60} width="40%" />
          <Skeleton variant="text" height={24} width="20%" />
          <Skeleton variant="rectangular" height={120} />
          <Skeleton variant="text" height={24} width="60%" sx={{ mt: 2 }} />
          <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    </Box>
  );
}

export const Route = createFileRoute('/philosophers/$id')({
  loader: async ({ params }) => {
    try {
      const philosopher = await philosophersApi.getOne(Number(params.id));
      if (!philosopher) throw new Error('Philosopher not found');
      return philosopher;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  pendingComponent: PhilosopherSkeleton,
  component: PhilosopherComponent,
});

function PhilosopherComponent() {
  const philosopher = Route.useLoaderData();
  const [description, setDescription] = useState(philosopher?.bio || philosopher?.description || '');

  useEffect(() => {
    if (philosopher) {
      setDescription(philosopher.bio || philosopher.description);
    }
  }, [philosopher]);

  if (!philosopher) {
    return <Typography variant="h6">Philosopher not found</Typography>;
  }

  const handleSave = async () => {
    await philosophersApi.update(philosopher.id, { ...philosopher, description });
  };

  return (
    <Box p={2}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {philosopher.name}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {philosopher.birthYear} - {philosopher.deathYear}
          </Typography>
          <RichTextEditor content={description} onChange={setDescription} />
          <button onClick={handleSave}>Save</button>

          {philosopher.terms && philosopher.terms.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Key Terms</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {philosopher.terms.map(term => (
                  <Chip key={term.id} label={term.term} variant="outlined" />
                ))}
              </Box>
            </>
          )}

          {philosopher.questions && philosopher.questions.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Key Questions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {philosopher.questions.map(question => (
                  <Typography key={question.id} variant="body2">
                    • {question.question}
                  </Typography>
                ))}
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
