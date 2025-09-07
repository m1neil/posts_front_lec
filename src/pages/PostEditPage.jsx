import { useParams } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import {
	useAddPostMutation,
	useGetPostByIdQuery,
	useUpdatePostMutation,
} from '@/api/postsApi'

const PostEditPage = () => {
	const { id } = useParams()
	const isEditPage = id !== undefined

	// Запит на додання поста
	const [addPost, { isLoading, isError, isSuccess }] = useAddPostMutation()
	const [
		updatePost,
		{
			isLoading: isLoadingUpdate,
			isError: isErrorUpdate,
			isSuccess: isSuccessUpdate,
		},
	] = useUpdatePostMutation()
	// Запит на отримання поста
	const {
		data: post,
		isLoading: isLoadingPost,
		error,
	} = useGetPostByIdQuery(id)
	const [titlePost, setTitlePost] = useState('')
	const [textPost, setTextPost] = useState('')
	const [isErrorData, setIsErrorData] = useState(false)
	const [isSuccessSendPost, setIsSuccessSendPost] = useState(isSuccess)

	useEffect(() => {
		setIsSuccessSendPost(isEditPage ? isSuccessUpdate : isSuccess)
		let timeoutClearSuccessMsg
		if ((isEditPage && isSuccessUpdate) || (!isEditPage && isSuccess)) {
			timeoutClearSuccessMsg = setTimeout(() => {
				setIsSuccessSendPost(false)
			}, 2000)
		}
		return () => clearTimeout(timeoutClearSuccessMsg)
	}, [isSuccess, isSuccessUpdate])

	useEffect(() => {
		if (!post) return
		setTitlePost(post.title)
		setTextPost(post.body)
	}, [post])

	useEffect(() => {
		let msgError
		if (isError) msgError = 'Не вдалося додати пост!'
		else if (isEditPage && isErrorUpdate) msgError = 'Не вдалося оновити пост!'
		else if (isEditPage && error) msgError = 'Пост на знайдено!'
		setIsErrorData(msgError)
	}, [isError, isErrorUpdate, error])

	const handleSubmitForm = async e => {
		e.preventDefault()

		if (!titlePost.trim() || !textPost.trim()) {
			setIsErrorData('Помилка заповнення даних')
			return
		} else setIsErrorData(false)

		try {
			if (isEditPage) {
				await updatePost({
					...post,
					title: titlePost.trim(),
					content: textPost.trim(),
				}).unwrap()
			} else {
				await addPost({
					title: titlePost.trim(),
					content: textPost.trim(),
				})
					.unwrap()
					.then(() => {
						setTitlePost('')
						setTextPost('')
					})
			}
		} catch (error) {
			console.log(error.message)
		}
	}

	const isDisabledButton =
		isLoading ||
		(isEditPage && isLoadingPost) ||
		isError ||
		(isEditPage && error) ||
		(isEditPage && isLoadingUpdate)

	return (
		<div className="max-w-md mx-auto mt-10 p-8 bg-gray-900 rounded-lg shadow-lg">
			<h1 className="text-2xl font-bold text-center mb-6 text-white">
				{isEditPage ? 'Edit page' : 'Add page'}
			</h1>
			<form onSubmit={handleSubmitForm}>
				<div className="flex flex-col gap-1 mb-3">
					<label
						htmlFor="title-post"
						className="font-medium text-gray-200 mb-1"
					>
						Title
					</label>
					<input
						value={titlePost}
						type="text"
						id="title-post"
						name="title-post"
						onChange={e => setTitlePost(e.target.value)}
						className="p-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="flex flex-col gap-1 mb-3">
					<label htmlFor="text-post" className="font-medium text-gray-200 mb-1">
						Text
					</label>
					<textarea
						value={textPost}
						name="text-post"
						id="text-post"
						onChange={e => setTextPost(e.target.value)}
						className="p-2 rounded border border-gray-700 bg-gray-800 text-white min-h-[100px] resize-y max-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
					></textarea>
				</div>
				{isErrorData && (
					<div className="text-red-600 font-semibold">{isErrorData}</div>
				)}
				{isSuccessSendPost && (
					<div className="text-green-600 font-semibold">
						{isEditPage ? 'Пост успішно оновлений!' : 'Пост успішно доданий!'}
					</div>
				)}
				<button
					disabled={isDisabledButton}
					type="submit"
					className="py-2 w-full rounded bg-blue-700 text-white cursor-pointer font-semibold mt-2 transition hover:bg-blue-800 disabled:bg-gray-700 disabled:cursor-not-allowed"
				>
					{isEditPage ? 'Змінити пост' : 'Додати пост'}
				</button>
			</form>
		</div>
	)
}

export default PostEditPage
