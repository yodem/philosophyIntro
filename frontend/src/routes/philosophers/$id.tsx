import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { philosophersApi, termsApi, questionsApi } from '../../api';
import { Card, CardContent, Skeleton, Typography, Box, Button } from '@mui/material';
import { useState } from 'react';
import { UpdatePhilosopherDto } from '@/types';
import { GenericForm } from '@/components/Forms/GenericForm';
import { FormInputs } from '@/types/form';
import { LABELS, METADATA_LABELS } from '@/constants';

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
      const philosopher = await philosophersApi.getOne(params.id);
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
      associatedPhilosophers: data.associatedPhilosophers?.map((p: { id: string } | string) => typeof p === 'string' ? p : p.id),
      associatedQuestions: data.associatedQuestions?.map((q: { id: string } | string) => typeof q === 'string' ? q : q.id),
      associatedTerms: data.associatedTerms?.map((t: { id: string } | string) => typeof t === 'string' ? t : t.id),
    });
  };

  if (!philosopher) {
    return <Typography variant="h6">{LABELS.PHILOSOPHER_NOT_FOUND}</Typography>;
  }

  return (
    <Box p={2}>
      <Button variant="outlined" onClick={() => setIsEditing(!isEditing)} sx={{ m: 2 }}>
        {isEditing ? LABELS.VIEW : LABELS.EDIT}
      </Button>

      <GenericForm
        isEdit={true}
        isEditable={isEditing}
        defaultValues={{
          ...philosopher,
          images: philosopher.images
        }}
        entityType="Philosopher"
        entityRoute="philosophers"
        relations={[
          {
            name: 'associatedTerms',
            label: LABELS.RELATED_TERMS,
            options: allTerms || [],
            baseRoute: 'terms'
          },
          {
            name: 'associatedQuestions',
            label: LABELS.RELATED_QUESTIONS,
            options: allQuestions || [],
            baseRoute: 'questions'
          },
          {
            name: 'associatedPhilosophers',
            label: LABELS.RELATED_PHILOSOPHERS,
            options: allPhilosophers || [],
            baseRoute: 'philosophers'
          }
        ]}
        metadata={[
          { label: METADATA_LABELS.ERA, value: philosopher.era || LABELS.UNKNOWN },
          { label: METADATA_LABELS.BIRTH_DATE, value: philosopher.birthDate || LABELS.UNKNOWN },
          { label: METADATA_LABELS.DEATH_DATE, value: philosopher.deathDate || LABELS.UNKNOWN }
        ]}
        onSubmit={onSubmit}
        setIsEditable={setIsEditing}
      />
    </Box>
  );
}
