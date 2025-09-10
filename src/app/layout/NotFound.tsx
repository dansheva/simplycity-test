import { Container, Title, Text } from "@mantine/core";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <Container size="sm" pt="xl">
      <Title order={2} mb="sm">
        404 – Page not found
      </Title>
      <Text mb="md">Sorry, the page you are looking for does not exist.</Text>
      <Text>
        <Link to="/announcements">Go back to Announcements</Link>
      </Text>
    </Container>
  );
};
