import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AppShell, Burger, Group, NavLink, ScrollArea, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSpeakerphone } from "@tabler/icons-react";

type Props = {
  children?: React.ReactNode;
  appName?: string;
};

export const AppLayout = ({ children, appName = "Test city" }: Props) => {
  const [opened, { toggle }] = useDisclosure();
  const { pathname } = useLocation();

  const isAnnouncements = pathname === "/" || pathname.startsWith("/announcements");

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 260, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="lg"
    >
      {/* Header */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={4}>{appName}</Title>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Sidebar */}
      <AppShell.Navbar p="md">
        <ScrollArea type="always" style={{ height: "100%" }}>
          <Stack gap="xs">
            <NavLink
              label="Announcements"
              component={Link}
              to="/announcements"
              active={isAnnouncements}
              styles={(theme, { active }) => ({
                root: {
                  borderRadius: theme.radius.md,
                  ...(active && {
                    backgroundColor: theme.colors.yellow[1],
                    color: theme.colors.dark[7],
                  }),
                },
              })}
              leftSection={<IconSpeakerphone size={18} stroke={1.5} />}
            />
          </Stack>
        </ScrollArea>
      </AppShell.Navbar>

      {/* Content */}
      <AppShell.Main>
        {/* Works with both children and Router Outlet */}
        {children ?? <Outlet />}
      </AppShell.Main>
    </AppShell>
  );
};
