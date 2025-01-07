import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { philosophersApi, termsApi, questionsApi } from '../../api';
import { Card, CardContent, Skeleton, Typography, Box, Divider } from '@mui/material';
import { EditableRichText } from '../../components/EditableRichText';
import { AutocompleteWithButton } from '../../components/AutocompleteWithButton';
import { useState } from 'react';
import { Term, Question, UpdatePhilosopherDto } from '@/types';
import { RouterChip } from '../../components/routerComponents/RouterChip';

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
  const queryClient = useQueryClient();
  const [selectedTerms, setSelectedTerms] = useState(philosopher?.terms || []);
  const [selectedQuestions, setSelectedQuestions] = useState(philosopher?.questions || []);

  const { data: allTerms } = useQuery({
    queryKey: ['terms'],
    queryFn: termsApi.getAll
  });

  const { data: allQuestions } = useQuery({
    queryKey: ['questions'],
    queryFn: questionsApi.getAll
  });

  const updatePhilosopherMutation = useMutation({
    mutationFn: (updatedPhilosopher: UpdatePhilosopherDto) => philosophersApi.update(philosopher!.id, updatedPhilosopher),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['philosopher', philosopher!.id]
      });
    },
  });

  const handleSaveContent = async (content: string) => {
    if (philosopher) {
      updatePhilosopherMutation.mutate({
        ...philosopher,
        description: content,
        terms: philosopher.terms?.map(t => t.id),
        questions: philosopher.questions?.map(q => q.id)
      });
    }
  };

  const handleSaveAdditionalData = async () => {
    if (philosopher) {
      updatePhilosopherMutation.mutate({
        ...philosopher,
        terms: selectedTerms.map(t => t.id),
        questions: selectedQuestions.map(q => q.id)
      });
    }
  };

  const handleTermsChange = (_: React.SyntheticEvent, value: Term[]) => {
    setSelectedTerms(value);
  };

  const handleQuestionsChange = (_: React.SyntheticEvent, value: Question[]) => {
    setSelectedQuestions(value);
  };

  if (!philosopher) {
    return <Typography variant="h6">Philosopher not found</Typography>;
  }

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
          <EditableRichText initialContent={philosopher.description} onSave={handleSaveContent} />
          <AutocompleteWithButton
            options={allTerms || []}
            getOptionLabel={(option) => option.term}
            value={selectedTerms}
            onChange={handleTermsChange}
            label="Key Terms"
            onSave={handleSaveAdditionalData}
          />

          <AutocompleteWithButton
            options={allQuestions || []}
            getOptionLabel={(option) => option.question}
            value={selectedQuestions}
            onChange={handleQuestionsChange}
            label="Key Questions"
            onSave={handleSaveAdditionalData}
          />

          {philosopher.terms && philosopher.terms.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Key Terms</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {philosopher.terms.map(term => (
                  <RouterChip
                    key={term.id}
                    label={term.term}
                    variant="outlined"
                    to={"/terms/$id"}
                    params={{ id: term.id.toString() }}
                  />
                ))}
              </Box>
            </>
          )}

          {philosopher.questions && philosopher.questions.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Key Questions</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {philosopher.questions.map(question => (
                  <RouterChip
                    key={question.id}
                    label={question.question}
                    variant='outlined'
                    to={"/questions/$id"}
                    params={{ id: question.id.toString() }}
                  />
                ))}
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
