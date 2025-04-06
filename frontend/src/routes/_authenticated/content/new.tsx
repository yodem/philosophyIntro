import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { contentApi } from '@/api/contentApi'
import { ContentTypes, ContentWithRelations, SearchParams } from '@/types'
import { GenericForm } from '@/components/Forms/GenericForm'
import { FormInputs } from '@/types/form'
import { useState, useEffect } from 'react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Typography,
} from '@mui/material'

export const Route = createFileRoute('/_authenticated/content/new')({
  validateSearch: (query: Record<string, unknown>): SearchParams => ({
    type: (query.contentType as ContentTypes) || ContentTypes.TERM,
  }),
  component: NewContentComponent,
})

function NewContentComponent() {
  const queryClient = useQueryClient()
  const navigate = Route.useNavigate()
  const { type: initialType } = Route.useSearch()

  const [isEditable, setIsEditable] = useState(true)
  const [contentType, setContentType] = useState<ContentTypes | undefined>(
    initialType,
  )

  // Update the contentType when the URL search param changes
  useEffect(() => {
    if (initialType && initialType !== contentType) {
      setContentType(initialType)
    }
  }, [initialType, contentType])

  const createContentMutation = useMutation({
    mutationFn: (newContent: Partial<ContentWithRelations>) =>
      contentApi.create(newContent),
    onSuccess: (data) => {
      const queryKey = data.type ? [data.type.toLowerCase() + 's'] : ['content']
      queryClient.invalidateQueries({ queryKey })
      navigate({
        to: '/content/$id',
        search: { type: data.type },
        params: { id: data.id },
      })
    },
  })

  const onSubmit = async (data: FormInputs) => {
    await createContentMutation.mutateAsync({ ...data, type: contentType })
    return // explicitly return void
  }

  // Update URL search parameter name for consistency
  const handleContentTypeChange = (newType: ContentTypes) => {
    setContentType(newType)
    navigate({
      search: (prev) => ({ ...prev, type: newType }),
      replace: true,
    })
  }

  const getDefaultValues = () => ({
    id: '',
    title: '',
    content: '',
    description: '',
    full_picture: '',
    description_picture: '',
    type: contentType,
  })

  const contentTypeLabels: Record<string, string> = {
    [ContentTypes.TERM]: 'יצירת מושג חדש',
    [ContentTypes.QUESTION]: 'יצירת שאלה חדשה',
    [ContentTypes.PHILOSOPHER]: 'הוספת פילוסוף חדש',
  }

  const getContentTypeTitle = () =>
    contentTypeLabels[contentType as ContentTypes] ?? 'יצירת תוכן חדש'

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          px: 2,
        }}
      >
        <Typography variant="h5">{getContentTypeTitle()}</Typography>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="new-content-type-select-label">סוג תוכן</InputLabel>
          <Select
            labelId="new-content-type-select-label"
            id="new-content-type-select"
            value={contentType}
            onChange={(e) =>
              handleContentTypeChange(e.target.value as ContentTypes)
            }
            label="סוג תוכן"
          >
            <MenuItem value={ContentTypes.TERM}>מושג</MenuItem>
            <MenuItem value={ContentTypes.QUESTION}>שאלה</MenuItem>
            <MenuItem value={ContentTypes.PHILOSOPHER}>פילוסוף</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <GenericForm
        defaultValues={getDefaultValues() as ContentWithRelations}
        isEditable={isEditable}
        setIsEditable={setIsEditable}
        onSubmit={onSubmit}
      />
    </>
  )
}
