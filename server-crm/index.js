import React, { useEffect, useState } from 'react'
import CommentTableItem from '../../components/admin/CommentTableItem'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Comments = () => {
    const [comments, setComments] = useState([])
    const [filter, setFilter] = useState('Not Approved')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { axios } = useAppContext();

    // Validate comment data structure
    const validateComment = (comment) => {
        return (
            comment &&
            typeof comment === 'object' &&
            comment._id &&
            typeof comment.isApproved === 'boolean'
        )
    }

    const fetchComments = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const { data } = await axios.get('/api/admin/comments')
            
            if (data && data.success) {
                // Validate and filter comments data
                const validComments = Array.isArray(data.comments) 
                    ? data.comments.filter(validateComment)
                    : []
                
                if (validComments.length !== data.comments?.length) {
                    console.warn('Some comments were filtered out due to invalid data structure')
                }
                
                setComments(validComments)
            } else {
                const errorMessage = data?.message || 'Failed to fetch comments'
                setError(errorMessage)
                toast.error(errorMessage)
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred while fetching comments'
            setError(errorMessage)
            toast.error(errorMessage)
            console.error('Error fetching comments:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [])

    // Filter comments based on approval status
    const filteredComments = comments.filter((comment) => {
        if (filter === "Approved") {
            return comment.isApproved === true
        }
        return comment.isApproved === false
    })

    if (loading) {
        return (
            <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
                <div className='flex justify-center items-center h-64'>
                    <div className='text-gray-500'>Loading comments...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
                <div className='flex justify-center items-center h-64'>
                    <div className='text-red-500'>
                        Error: {error}
                        <button 
                            onClick={fetchComments}
                            className='ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
            <div className='flex justify-between items-center max-w-3xl'>
                <h1>Comments ({filteredComments.length})</h1>
                <div className='flex gap-4'>
                    <button 
                        onClick={() => setFilter('Approved')} 
                        className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs transition-colors ${
                            filter === 'Approved' ? 'text-primary bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Approved ({comments.filter(c => c.isApproved === true).length})
                    </button>
                    <button 
                        onClick={() => setFilter('Not Approved')} 
                        className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs transition-colors ${
                            filter === 'Not Approved' ? 'text-primary bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Not Approved ({comments.filter(c => c.isApproved === false).length})
                    </button>
                </div>
            </div>
            
            <div className='relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-white shadow rounded-lg scrollbar-hide'>
                {filteredComments.length === 0 ? (
                    <div className='flex justify-center items-center h-32 text-gray-500'>
                        No {filter.toLowerCase()} comments found
                    </div>
                ) : (
                    <table className="w-full text-sm text-gray-500">
                        <thead className="text-xs text-gray-700 text-left uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Blog Title & Comment</th>
                                <th scope="col" className="px-6 py-3 max-sm:hidden">Date</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComments.map((comment, index) => (
                                <CommentTableItem 
                                    key={comment._id} 
                                    comment={comment} 
                                    index={index + 1} 
                                    fetchComments={fetchComments} 
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default Comments