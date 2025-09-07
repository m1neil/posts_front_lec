import React, { useState } from 'react'
import {
	useGetPostsPQuery,
	useDeletePostMutation,
	useLikePostMutation,
	useDislikePostMutation,
} from '../../api/postsApi'
import { useNavigate } from 'react-router'

const PostsList = ({ onSelect }) => {
	const [page, setPage] = useState(1)
	const { data, isLoading, isError, isFetching } = useGetPostsPQuery({
		page,
		limit: 5,
	})

	const [deletePost] = useDeletePostMutation()
	const [likePost] = useLikePostMutation()
	const [dislikePost] = useDislikePostMutation()

	const navigate = useNavigate()

	if (isLoading) return <p>Завантаження...</p>
	if (isError) return <p>Помилка завантаження постів</p>

	const { items, totalPages, remaining } = data

	return (
		<div>
			<ul style={{ padding: 0, listStyle: 'none' }}>
				{items.map(post => (
					<li
						key={post.id}
						style={{
							marginBottom: '10px',
							borderBottom: '1px solid #ccc',
							paddingBottom: '10px',
						}}
					>
						<strong>{post.title}</strong>
						<div>
							Лайки: {post.likesNumber}{' '}
							<button
								className="rounded-[8px] basis-[40px] cursor-pointer transition-colors border border-solid border-transparent px-[15px] py-[10px] font-medium bg-[#1a1a1a] hover:border-purple-600"
								onClick={() => likePost(post.id)}
							>
								👍
							</button>{' '}
							Дислайки: {post.dislikesNumber}{' '}
							<button
								className="rounded-[8px] basis-[40px] cursor-pointer transition-colors border border-solid border-transparent px-[15px] py-[10px] font-medium bg-[#1a1a1a] hover:border-purple-600"
								onClick={() => dislikePost(post.id)}
							>
								👎
							</button>{' '}
							<button
								className="rounded-[8px] basis-[40px] cursor-pointer transition-colors border border-solid border-transparent px-[15px] py-[10px] font-medium bg-[#1a1a1a] hover:border-purple-600"
								onClick={() => onSelect(post.id)}
							>
								Деталі
							</button>{' '}
							<button
								className="rounded-[8px] cursor-pointer transition-colors border border-solid border-transparent px-[15px] py-[10px] font-medium bg-[#1a1a1a] hover:border-purple-600"
								onClick={() => navigate(`/posts/edit/${post.id}`)}
							>
								Редагувати
							</button>{' '}
							<button
								className="rounded-[8px] cursor-pointer transition-colors px-[15px] py-[10px] font-medium bg-red-600 hover:bg-red-700"
								onClick={() => {
									if (window.confirm('Видалити пост?')) deletePost(post.id)
								}}
							>
								Видалити
							</button>
						</div>
					</li>
				))}
			</ul>
			{isFetching && <p>Оновлення...</p>}
			<hr />
			<div className="flex flex-wrap justify-center gap-x-2 gap-y-2 mt-[20px] mb-[15px]">
				<button
					onClick={() => setPage(p => Math.max(p - 1, 1))}
					disabled={page === 1}
				>
					Попередня
				</button>
				{[...Array(totalPages)].map((_, i) => (
					<button
						className="rounded-[8px] basis-[40px] cursor-pointer transition-colors border border-solid border-transparent px-[10px] py-[10px] font-medium bg-[#1a1a1a] hover:border-purple-600"
						key={i}
						onClick={() => setPage(i + 1)}
						style={{
							fontWeight: page === i + 1 ? 'bold' : 'normal',
							color: page === i + 1 ? 'red' : '',
						}}
					>
						{i + 1}
					</button>
				))}
				<button
					onClick={() => setPage(p => (remaining > 0 ? p + 1 : p))}
					disabled={remaining === 0}
				>
					Наступна
				</button>
			</div>
		</div>
	)
}

export default PostsList
