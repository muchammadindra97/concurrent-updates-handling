import {Box, Button, Grid, LoadingOverlay, Table} from "@mantine/core";
import {BookModel} from "../util/types.ts";

export type BookListProps = {
	books: BookModel[]
	isLoading?: boolean,
	onEdit: (book: BookModel) => void
	onDelete: (book: BookModel) => void
}

export default function BookList(props: BookListProps) {
	const books = props.books
	const isLoading = props.isLoading ?? false;
	const onEdit = props.onEdit;
	const onDelete = props.onDelete;

	const rows = books.map((book) => (
		<Table.Tr key={book.id}>
			<Table.Td>{book.id}</Table.Td>
			<Table.Td>{book.title}</Table.Td>
			<Table.Td>{book.description}</Table.Td>
			<Table.Td>{book.author}</Table.Td>
			<Table.Td>{book.rev}</Table.Td>
			<Table.Td>
				<Grid>
					<Grid.Col span="content">
						<Button variant="filled" color="green" size="xs" type="button" onClick={() => onEdit(book)}>Edit</Button>
					</Grid.Col>
					<Grid.Col span="content">
						<Button variant="filled" color="red" size="xs" type="button" onClick={() => onDelete(book)}>Delete</Button>
					</Grid.Col>
				</Grid>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<Box style={{maxHeight: "350px", overflowY: "auto"}} pos="relative">
			<LoadingOverlay visible={isLoading} />
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Id</Table.Th>
						<Table.Th>Title</Table.Th>
						<Table.Th>Description</Table.Th>
						<Table.Th>Author</Table.Th>
						<Table.Th>Rev</Table.Th>
						<Table.Th>Action</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</Box>
	);
}
