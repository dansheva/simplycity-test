import { Container } from "@mantine/core";
import { AnnouncementsTable } from "../components";

const AnnouncementsPage = () => {
  return (
    <Container size="xl" py="md">
      <AnnouncementsTable />
    </Container>
  );
};

export default AnnouncementsPage;
