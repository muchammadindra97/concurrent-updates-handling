import BookForm from "./BookForm.tsx";
import {Button, Grid, GridCol} from "@mantine/core";
import {isNotEmpty, useForm} from "@mantine/form";
import {useState} from "react";
import axios from "axios";
import {notifications} from "@mantine/notifications";
import {BACKEND_URL} from "../util/constants.ts";

export type BookCreateProps = {
	onSuccess?: (result: any) => void
}

export function BookCreate(props: BookCreateProps) {
	const form = useForm({
		initialValues: {
			title: '',
			description: '',
			author: ''
		},
		validate: {
			title: isNotEmpty('Required'),
			description: isNotEmpty('Required'),
			author: isNotEmpty('Required')
		}
	});
	const [isLoading, setIsLoading] = useState(false);
	const { onSuccess } = props;

	function handleSubmit(values: typeof form.values) {
		setIsLoading(true);
		axios
			.post(`${BACKEND_URL}/books`, values)
			.then((result) => {
				notifications.show({
					title: 'Book Save Success',
					message: 'Data is saved'
				});
				form.reset();

				if (onSuccess) {
					onSuccess(result);
				}
			})
			.catch(error => {
				let message = 'Something went wrong.'
				if (error.response) {
					const data = error.response.data;
					message = data.message;
				}

				notifications.show({
					color: 'red',
					title: 'Save Failed',
					message: message
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Grid>
				<Grid.Col>
					<BookForm form={form} />
				</Grid.Col>
				<Grid.Col ta="center">
					<Button type="submit" loading={isLoading}>Save</Button>
				</Grid.Col>
			</Grid>
		</form>
	);
}
