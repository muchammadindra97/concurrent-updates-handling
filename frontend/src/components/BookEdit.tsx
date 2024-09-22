import {BookModel} from "../util/types.ts";
import {useForm} from "@mantine/form";
import {isNotEmpty} from "@mantine/form";
import {Button, Grid, LoadingOverlay, Text} from "@mantine/core";
import BookForm from "./BookForm.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {BACKEND_URL} from "../util/constants.ts";
import {notifications} from "@mantine/notifications";

export type BookEditProps = {
	book: BookModel,
	onSuccess?: () => void,
	onCancel?: () => void
}

export default function BookEdit(props: BookEditProps) {
	const form = useForm({
		initialValues: {...props.book, etag: ''},
		validate: {
			title: isNotEmpty('Required'),
			description: isNotEmpty('Required'),
			author: isNotEmpty('Required')
		}
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		axios
			.get(`${BACKEND_URL}/books/${props.book.id}`)
			.then((result) => {
				form.setValues((prev) => ({ ...prev, etag: result.headers.etag }));
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
	}, [props.book]);

	const submitHandler = (values: typeof form.values) => {
		setIsLoading(true);
		axios
			.put(
				`${BACKEND_URL}/books/${props.book.id}`,
				{
					title: values.title,
					description: values.description,
					author: values.author,
				},
				{
					headers: {
						'If-Match': values.etag
					}
				}
			)
			.then((result) => {
				if (props.onSuccess) {
					props.onSuccess();
				}

				notifications.show({
					title: 'Book Update Success',
					message: 'Data is updated'
				});
			})
			.catch(error => {
				let message = 'Something went wrong.'
				if (error.response) {
					const data = error.response.data;
					message = data.message;
				}

				notifications.show({
					color: 'red',
					title: 'Book Update Failed',
					message: message
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<form style={{position: 'relative'}} onSubmit={form.onSubmit(submitHandler)}>
			<LoadingOverlay visible={isLoading} />
			<Grid>
				<Grid.Col>
					<Text mb="sm" component="p" fw="bold">Etag: {form.getValues().etag}</Text>
					<BookForm form={form} />
				</Grid.Col>
				<Grid.Col ta="center">
					<Grid justify="center">
						<Grid.Col span="content">
							<Button type="submit">Save</Button>
						</Grid.Col>
						<Grid.Col span="content">
							<Button type="button" color="gray" onClick={() => { if (props.onCancel) props.onCancel() }}>Cancel</Button>
						</Grid.Col>
					</Grid>
				</Grid.Col>
			</Grid>
		</form>
	);
}
