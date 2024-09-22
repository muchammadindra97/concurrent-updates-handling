import { useEffect, useState } from "react";
import axios from "axios";
import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import { theme } from "./theme";
import { Box, Card, Container, Divider, Grid, MantineProvider, Text } from "@mantine/core";
import { notifications, Notifications } from "@mantine/notifications";
import BookList from "./components/BookList.tsx";
import BookEdit from "./components/BookEdit.tsx";
import { BookCreate } from "./components/BookCreate.tsx";
import { BACKEND_URL } from "./util/constants.ts";
import { BookModel } from "./util/types.ts";

export default function App() {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [booksForEdit, setBooksForEdit] = useState<{[key: string]: BookModel}>({})

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    setIsLoading(true);
    axios
      .get(`${BACKEND_URL}/books`)
      .then((response) => {
        setBooks(response.data.data)
      })
      .catch(error => {
        let message = 'Something went wrong.'
        if (error.response) {
          const data = error.response.data;
          message = data.message;
        }

        notifications.show({
          color: 'red',
          title: 'Book Load Failed',
          message: message
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const sucessHandler = () => {
    loadBooks();
  }

  const editHandler = (book: BookModel) => {
    setBooksForEdit((prevState) => {
      const keyId = Date.now().toString();
      const newBooksForEdit = {...prevState};
      newBooksForEdit[keyId] = book;
      return newBooksForEdit;
    });
  }

  const deleteHandler = (book: BookModel) => {
    setIsLoading(true);
    axios
      .delete(`${BACKEND_URL}/books/${book.id}`)
      .then((response) => {
        loadBooks();
      })
      .catch(error => {
        let message = 'Something went wrong.'
        if (error.response) {
          const data = error.response.data;
          message = data.message;
        }

        notifications.show({
          color: 'red',
          title: 'Book Delete Failed',
          message: message
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const successEditHandler = (key: string) => {
    const newBooksForEdit = {...booksForEdit};
    delete newBooksForEdit[key];
    setBooksForEdit(newBooksForEdit);
    loadBooks();
  }

  const cancelEditHandler = (key: string) => {
    const newBooksForEdit = {...booksForEdit};
    delete newBooksForEdit[key];
    setBooksForEdit(newBooksForEdit);
  }

  return<MantineProvider theme={theme}>
    <Notifications />
    <Box bg="#697565" py="md" style={{minHeight: '100vh'}}>
      <Container size="md">
        <Grid>
          <Grid.Col>
            <Card shadow="lg" bg="#ECDFCC" radius="0.5rem">
              <Text c="#1E201E" mx="auto" component="h1" size="2rem" fw="bold">Concurrent Update Handling</Text>
            </Card>
          </Grid.Col>
          <Grid.Col>
            <Card shadow="lg" bg="#ECDFCC" radius="0.5rem">
              <Text c="#1E201E" component="h5" size="1.5rem" fw="bold">Create</Text>
              <Divider my="sm" color="#697565" />
              <BookCreate onSuccess={sucessHandler} />
            </Card>
          </Grid.Col>
          <Grid.Col>
            <Card shadow="lg" bg="#ECDFCC" radius="0.5rem">
              <Text c="#1E201E" component="h5" size="1.5rem" fw="bold">List</Text>
              <Divider my="sm" color="#697565" />
              <BookList books={books} isLoading={isLoading} onEdit={editHandler} onDelete={deleteHandler} />
            </Card>
          </Grid.Col>
          {Object.keys(booksForEdit).length > 0 &&
            <Grid.Col>
              <Card shadow="lg" bg="#ECDFCC" radius="0.5rem">
                <Text c="#1E201E" component="h5" size="1.5rem" fw="bold">Edit</Text>
                <Divider my="sm" color="#697565" />
                {Object.entries(booksForEdit).map(([key, book], index) => {
                  return (
                    <div key={key}>
                      <BookEdit book={book} onSuccess={() => successEditHandler(key)} onCancel={() => cancelEditHandler(key)} />
                      {!(Object.keys(booksForEdit).length - 1 === index) && <Divider my="sm" color="#697565" />}
                    </div>
                  );
                })}
              </Card>
            </Grid.Col>
          }
        </Grid>
      </Container>
    </Box>
  </MantineProvider>;
}
