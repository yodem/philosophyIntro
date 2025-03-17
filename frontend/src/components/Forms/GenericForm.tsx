import { useForm } from "react-hook-form";
import { Box, Button, Card, CardContent, TextField } from "@mui/material";
import { RelationFields } from "./RelationFields";
import { FormInputs, RelationConfig } from "@/types/form";
import { Content, ContentType } from "@/types";
import { useEffect, useState } from "react";
import { contentApi } from "@/api";

interface GenericFormProps {
    defaultValues: Content;
    isEditable: boolean;
    setIsEditable: (value: boolean) => void;
    onSubmit: (data: FormInputs) => Promise<void>;
}

export function GenericForm({
    defaultValues,
    isEditable,
    setIsEditable,
    onSubmit,
}: GenericFormProps) {
    const [relationOptions, setRelationOptions] = useState<{
        philosopher: Content[];
        question: Content[];
        term: Content[];
    }>({ philosopher: [], question: [], term: [] });

    const { control, handleSubmit, reset, setValue } = useForm<FormInputs>({ defaultValues });

    useEffect(() => { reset(defaultValues); }, [defaultValues, reset]);
    useEffect(() => {
        const fetchOptions = async () => {
            const [philosophers, questions, terms] = await Promise.all([
                contentApi.getAll({}, ContentType.PHILOSOPHER),
                contentApi.getAll({}, ContentType.QUESTION),
                contentApi.getAll({}, ContentType.TERM),
            ]);
            setRelationOptions({
                philosopher: philosophers || [],
                question: questions || [],
                term: terms || [],
            });
        };
        fetchOptions();
    }, []);

    const relations: RelationConfig[] = [
        { name: "philosopher", label: "פילוסופים קשורים", options: relationOptions.philosopher, baseRoute: "philosophers" },
        { name: "question", label: "שאלות קשורות", options: relationOptions.question, baseRoute: "questions" },
        { name: "term", label: "מושגים קשורים", options: relationOptions.term, baseRoute: "terms" }
    ];

    if (!isEditable) return null;

    return (
        <Card>
            <CardContent>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <TextField fullWidth label="כותרת" onChange={(e) => setValue("title", e.target.value)} defaultValue={defaultValues.title} sx={{ mb: 2 }} />
                    <TextField fullWidth multiline rows={8} label="תוכן" onChange={(e) => setValue("content", e.target.value)} defaultValue={defaultValues.content} sx={{ mb: 2 }} />
                    <TextField fullWidth label="תיאור" onChange={(e) => setValue("description", e.target.value)} defaultValue={defaultValues.description || ""} sx={{ mb: 2 }} />
                    <TextField fullWidth label="תמונה (URL)" onChange={(e) => setValue("full_picture", e.target.value)} defaultValue={defaultValues.full_picture || ""} sx={{ mb: 2 }} />
                    <RelationFields relations={relations} control={control} />
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <Button type="submit" variant="contained" color="primary">שמור</Button>
                        <Button variant="outlined" onClick={() => setIsEditable(false)}>ביטול</Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
