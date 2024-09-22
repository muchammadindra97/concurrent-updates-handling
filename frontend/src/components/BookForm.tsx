import {Box, Grid, Textarea, TextInput} from "@mantine/core";
import {UseFormReturnType} from "@mantine/form";

export type BookFormProps = {
	form: UseFormReturnType<{
		title: string,
		description: string,
		author: string
	}>
}

export default function BookForm(props: BookFormProps) {
	const { form } = props;
	const _labelWidth = "150px";

	return (
		<>
			<Grid>
				<Grid.Col>
					<Grid>
						<Grid.Col span="content"><Box w={_labelWidth}>Title</Box></Grid.Col>
						<Grid.Col span="auto"><TextInput key={form.key('title')} {...form.getInputProps('title')} /></Grid.Col>
					</Grid>
				</Grid.Col>
				<Grid.Col>
					<Grid>
						<Grid.Col span="content"><Box w={_labelWidth}>Description</Box></Grid.Col>
						<Grid.Col span="auto"><Textarea resize="vertical" autosize minRows={4} key={form.key('description')} {...form.getInputProps('description')} /></Grid.Col>
					</Grid>
				</Grid.Col>
				<Grid.Col>
					<Grid>
						<Grid.Col span="content"><Box w={_labelWidth}>Author</Box></Grid.Col>
						<Grid.Col span="auto"><TextInput key={form.key('author')} {...form.getInputProps('author')} /></Grid.Col>
					</Grid>
				</Grid.Col>
			</Grid>
		</>
	);
}
