import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { philosophersApi, termsApi, questionsApi } from '../../api';
import { Card, CardContent, Skeleton, Typography, Box, Button } from '@mui/material';
import { useState } from 'react';
import { UpdatePhilosopherDto } from '@/types';
import { useTranslation } from 'react-i18next';
import { GenericForm } from '@/components/Forms/GenericForm';
import { FormInputs } from '@/types/form';

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

  const { data: allPhilosophers } = useQuery({
    queryKey: ['philosophers'],
    queryFn: philosophersApi.getAll
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

  const onSubmit = async (data: Partial<FormInputs>) => {
    return updatePhilosopherMutation.mutateAsync({
      ...philosopher,
      ...data,
      id: philosopher!.id,
      relatedPhilosophers: data.relatedPhilosophers?.map((p: { id: number } | number) => typeof p === 'number' ? p : p.id),
      relatedQuestions: data.relatedQuestions?.map((q: { id: number } | number) => typeof q === 'number' ? q : q.id),
      relatedTerms: data.relatedTerms?.map((t: { id: number } | number) => typeof t === 'number' ? t : t.id),
    });
  };

  if (!philosopher) {
    return <Typography variant="h6">{t('philosopherNotFound')}</Typography>;
  }

  return (
    <Box p={2}>
      <Button variant="outlined" onClick={() => setIsEditing(!isEditing)} sx={{ m: 2 }}>
        {t(isEditing ? 'view' : 'edit')}
      </Button>

      <GenericForm
        isEdit={true}
        isEditable={isEditing}
        defaultValues={philosopher}
        entityType="Philosopher"
        entityRoute="philosophers"
        relations={[
          {
            name: 'relatedTerms',
            label: t('relatedTerms'),
            options: allTerms || [],
            baseRoute: 'terms'
          },
          {
            name: 'relatedQuestions',
            label: t('relatedQuestions'),
            options: allQuestions || [],
            baseRoute: 'questions'
          },
          {
            name: 'relatedPhilosophers',
            label: t('relatedPhilosophers'),
            options: allPhilosophers || [],
            baseRoute: 'philosophers'
          }
        ]}
        metadata={[
          { label: "Era", value: philosopher.era },
          { label: "Birth Date", value: philosopher.birthdate || 'Unknown' },
          { label: "Death Date", value: philosopher.deathdate || 'Unknown' }
        ]}
        onSubmit={onSubmit}
        setIsEditable={setIsEditing}
      />
    </Box>
  );
}
