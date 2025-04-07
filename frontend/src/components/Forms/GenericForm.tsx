import { useForm, FormProvider } from "react-hook-form";
import { Box, Button, Card, CardContent, Stack, TextField, Typography, Divider } from "@mui/material";
import { RelationFields } from "./RelationFields";
import { MetadataForm } from "./MetadataForm";
import { ContentWithRelations, ContentTypes, UpdateContent, MetadataDefinition } from "@/types";
import { RelationConfig } from "@/types/form";
import { useEffect, useState } from "react";
import { contentApi } from "@/api";
import { EditableRichText } from "@/components/TextEditor/EditableRichText";
import { enqueueSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Route } from "@/routes/_authenticated/content/$id";

interface GenericFormProps {
    defaultValues: ContentWithRelations;
    isEditable: boolean;
    setIsEditable: (value: boolean) => void;
    onSubmit: (data: UpdateContent) => Promise<unknown>;
}

export function GenericForm({
    defaultValues,
    isEditable,
    setIsEditable,
}: GenericFormProps) {
    const navigate = Route.useNavigate();
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: (data: UpdateContent) => contentApi.update(defaultValues.id!, data),
        onSuccess: () => {
            enqueueSnackbar('נשמר בהצלחה!', { variant: 'success' });
            queryClient.invalidateQueries(['content', defaultValues.id]);
            setIsEditable(false);
            navigate({
                to: "/content/$id",
                params: { id: defaultValues.id! }
            });
        },
        onError: (error) => {
            console.error("Form submission error:", error);
            enqueueSnackbar('שגיאה בשמירת הטופס', { variant: 'error' });
        }
    });

    const [relationOptions, setRelationOptions] = useState<{
        [key: string]: ContentWithRelations[];
    }>({});
    const [metadataSchema, setMetadataSchema] = useState<MetadataDefinition[] | null>(null);

    const methods = useForm<UpdateContent>({
        defaultValues: {
            title: defaultValues.title,
            description: defaultValues.description,
            content: defaultValues.content,
            full_picture: defaultValues.full_picture,
            description_picture: defaultValues.description_picture,
            metadata: defaultValues.metadata || {},
        }
    });

    const { handleSubmit, reset, setValue, control, register, watch } = methods;

    useEffect(() => {
        reset({
            ...defaultValues,
            metadata: defaultValues.metadata || {},
        });
    }, [defaultValues, reset]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [philosophers, questions, terms] = await Promise.all([
                    contentApi.getAll({ type: ContentTypes.PHILOSOPHER }),
                    contentApi.getAll({ type: ContentTypes.QUESTION }),
                    contentApi.getAll({ type: ContentTypes.TERM }),
                ]);

                setRelationOptions({
                    philosopher: philosophers.items || [],
                    question: questions.items || [],
                    term: terms.items || [],
                });
            } catch (error) {
                console.error("Failed to fetch relation options:", error);
            }
        };

        fetchOptions();
    }, []);

    useEffect(() => {
        const fetchMetadataSchema = async () => {
            try {
                const schema = await contentApi.getMetadataSchema(defaultValues.type);
                setMetadataSchema(schema);
            } catch (error) {
                console.error("Failed to fetch metadata schema:", error);
            }
        };

        fetchMetadataSchema();
    }, [defaultValues.type]);

    const relations: RelationConfig[] = [
        { name: "philosopher", label: "פילוסופים קשורים", options: relationOptions.philosopher || [], baseRoute: "philosophers" },
        { name: "question", label: "שאלות קשורות", options: relationOptions.question || [], baseRoute: "questions" },
        { name: "term", label: "מושגים קשורים", options: relationOptions.term || [], baseRoute: "terms" }
    ] as const;

    if (!isEditable) return null;

    const submitHandler = async (formData: UpdateContent) => {
        updateMutation.mutate(formData);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
                <Card>
                    <CardContent>
                        <Stack gap={1}>
                            <TextField fullWidth label="כותרת" {...register("title")} sx={{ mb: 2 }} />
                            <EditableRichText
                                initialContent={watch("content") || ""}
                                onChange={(newContent) => setValue("content", newContent)}
                            />
                            <TextField fullWidth label="תיאור" {...register("description")} sx={{ mb: 2 }} />
                            <TextField fullWidth label="תמונה (URL)" {...register("full_picture")} sx={{ mb: 2 }} />
                            <TextField fullWidth label="תמונה לתיאור (URL)" {...register("description_picture")} sx={{ mb: 2 }} />
                            <RelationFields relations={relations} control={control} />
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h5" gutterBottom>
                                    מידע נוסף
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <MetadataForm
                                    contentType={defaultValues.type}
                                    metadata={defaultValues.metadata || {}}
                                    isEditable={true}
                                    metadataSchema={metadataSchema}
                                />
                            </Box>
                            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? 'שומר...' : 'שמור'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsEditable(false)}
                                    disabled={updateMutation.isPending}
                                >
                                    ביטול
                                </Button>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </form>
        </FormProvider>
    );
}
