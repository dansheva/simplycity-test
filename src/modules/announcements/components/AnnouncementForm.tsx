import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Group, Input, Textarea, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import type { Announcement } from "../models";
import { getAnnouncement, createAnnouncement, updateAnnouncement, listCategories } from "../api";

type FormValues = {
  title: string;
  content: string;
  categories: string[]; // category IDs
  publicationDate: Date;
};

export const AnnouncementForm = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: existing, isLoading: isLoadingAnnouncement } = useQuery({
    queryKey: ["announcement", id],
    queryFn: () => getAnnouncement(id!),
    enabled: isEdit,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["ann-cats"],
    queryFn: listCategories,
  });
  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.title }));

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      content: "",
      categories: [],
      publicationDate: new Date(),
    },
  });

  React.useEffect(() => {
    if (isEdit && existing) {
      reset({
        title: existing.title,
        content: existing.content ?? "", // content optional in storage? keep safe
        categories: existing.categories,
        publicationDate: new Date(existing.publicationDate),
      });
    }
  }, [isEdit, existing, reset]);

  const { mutateAsync } = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        title: values.title,
        content: values.content,
        categories: values.categories,
        publicationDate: values.publicationDate.toISOString(),
      } as Omit<Announcement, "id" | "updatedAt">;

      return isEdit ? updateAnnouncement(id!, payload) : createAnnouncement(payload);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["announcements"] });
      notifications.show({ message: "Announcement saved", color: "green" });
      navigate("/announcements");
    },
    onError: (e: unknown) => {
      notifications.show({
        message: e instanceof Error ? e.message : "Failed to save announcement",
        color: "red",
      });
    },
  });

  const onInvalid = (errors: FieldErrors<FormValues>) => {
    const first = Object.values(errors)[0];
    const msg =
      (first?.message as string) || "Please fill in all required fields before publishing.";
    notifications.show({ message: msg, color: "red" });
  };

  const onSubmit = (values: FormValues) => mutateAsync(values);

  return (
    <>
      <Title order={3} mb="md">
        {isEdit ? "Edit the announcement" : "Create announcement"}
      </Title>

      {/* Prevent flashing empty form while loading existing data */}
      {isEdit && isLoadingAnnouncement ? null : (
        <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
          {/* Title */}
          <TextInput
            label="Title"
            placeholder="Title"
            mb="md"
            {...register("title", { required: "Title is required" })}
          />

          {/* Content */}
          <Textarea
            label="Content"
            placeholder="Write your announcement…"
            minRows={6}
            mb="md"
            {...register("content", { required: "Content is required" })}
          />

          {/* Categories */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>Category</label>
            <Controller
              control={control}
              name="categories"
              rules={{ validate: (v) => (v?.length ? true : "Pick at least one category") }}
              render={({ field }) => (
                <Select
                  isMulti
                  options={categoryOptions}
                  value={categoryOptions.filter((o) => field.value?.includes(o.value))}
                  onChange={(vals) => field.onChange(vals.map((v) => v.value))}
                  placeholder="Select categories"
                />
              )}
            />
          </div>

          {/* Publication date */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6 }}>
              Publication date
            </label>
            <Controller
              control={control}
              name="publicationDate"
              rules={{ required: "Publication date is required" }}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(d) => field.onChange(d)}
                  showTimeSelect
                  dateFormat="dd/MM/yyyy HH:mm"
                  customInput={
                    <Input
                      component="input"
                      size="md"
                      radius="md"
                      styles={{ input: { cursor: "pointer" } }}
                    />
                  }
                />
              )}
            />
          </div>

          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => navigate("/announcements")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Publish
            </Button>
          </Group>
        </form>
      )}
    </>
  );
};
