import * as React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Button, Group, Table, Text, Title } from "@mantine/core";
import { format } from "date-fns";

import type { Announcement } from "../models";
import { listAnnouncements, listCategories } from "../api";
import { Loader } from "@app/layout";
import { IconPencil } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const ch = createColumnHelper<Announcement>();

export const AnnouncementsTable = () => {
  const {
    data: announcements = [],
    isLoading,
    isError: errorAnnouncements,
  } = useQuery({
    queryKey: ["announcements"],
    queryFn: listAnnouncements,
    select: (data) =>
      data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
  });

  const { data: categories = [], isError: isErrorCategories } = useQuery({
    queryKey: ["announcements-categories"],
    queryFn: listCategories,
  });

  const categoryMap = React.useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.title])) as Record<string, string>,
    [categories],
  );

  const columns = React.useMemo(
    () => [
      ch.accessor("title", {
        header: "Title",
        cell: (info) => (
          <Text
            component={Link}
            to={`/announcements/${info.row.original.id}/edit`}
            style={{ textDecoration: "none" }}
          >
            {info.getValue()}
          </Text>
        ),
      }),
      ch.accessor("publicationDate", {
        header: "Publication date",
        cell: (info) => format(new Date(info.getValue()), "MMM d, yyyy HH:mm"),
      }),
      ch.accessor("updatedAt", {
        header: "Last update",
        cell: (info) => format(new Date(info.getValue()), "MMM d, yyyy HH:mm"),
      }),
      ch.accessor("categories", {
        header: "Categories",
        cell: (info) =>
          info
            .getValue()
            .map((id) => categoryMap[id] ?? id)
            .join(", "),
      }),
      ch.display({
        id: "actions",
        header: "",
        cell: (info) => (
          <Group justify="flex-end">
            <Button
              component={Link}
              variant="transparent"
              to={`/announcements/${info.row.original.id}/edit`}
            >
              <IconPencil size={18} stroke={1.5} />
            </Button>
          </Group>
        ),
      }),
    ],
    [categoryMap],
  );

  const table = useReactTable({
    data: announcements,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  React.useEffect(() => {
    if (errorAnnouncements || isErrorCategories) {
      notifications.show({
        message: "Failed to load announcements",
        color: "red",
      });
    }
  }, [errorAnnouncements, isErrorCategories]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={3}>Announcements</Title>
        <Button component={Link} to="/announcements/new">
          New
        </Button>
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          {table.getHeaderGroups().map((hg) => (
            <Table.Tr key={hg.id}>
              {hg.headers.map((h) => (
                <Table.Th key={h.id}>
                  {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>

        <Table.Tbody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={columns.length}>
                <Text c="dimmed">No announcements yet.</Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </>
  );
};
