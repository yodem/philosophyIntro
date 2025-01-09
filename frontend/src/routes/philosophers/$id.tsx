import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { philosophersApi, termsApi, questionsApi } from '../../api';
import { Card, CardContent, Skeleton, Typography, Box, Button } from '@mui/material';
import { useState } from 'react';
import { UpdatePhilosopherDto } from '@/types';
import { PhilosopherForm } from '../../components/Forms/PhilosopherForm';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const philosopher = Route.useLoaderData();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

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
      setIsEditing(false);
    },
  });

  const onSubmit = async (data: UpdatePhilosopherDto) => {
    return updatePhilosopherMutation.mutateAsync({
      ...philosopher,
      ...data
    });
  };

  if (!philosopher) {
    return <Typography variant="h6">{t('philosopherNotFound')}</Typography>;
  }

  console.log('Philosopher:', philosopher);

  return (
    <Box key={philosopher.id} p={2}>
      <Button
        variant="outlined"
        onClick={() => setIsEditing(!isEditing)}
        sx={{ m: 2 }}
      >
        {t(isEditing ? 'view' : 'edit')}
      </Button>

      <PhilosopherForm
        isEdit={true}
        isEditable={isEditing}
        key={philosopher.id}
        defaultValues={{
          ...philosopher,
          relatedTerms: philosopher.relatedTerms || [],
          relatedQuestions: philosopher.relatedQuestions || [],
          relatedPhilosophers: philosopher.relatedPhilosophers || [],
        }}
        allTerms={allTerms || []}
        allQuestions={allQuestions || []}
        onSubmit={isEditing ? onSubmit : undefined}
      />
    </Box>
  );
}
