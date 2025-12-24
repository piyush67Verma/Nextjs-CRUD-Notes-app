"use client"

import React, { useState } from 'react'
import toast from 'react-hot-toast';

const NotesClient = ({ initialNotes }) => {
    const [notes, setNotes] = useState(initialNotes);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    // state variables to perform editing 
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    const startEdit = (note) => {
        setEditingId(note._id);
        setEditTitle(note.title);
        setEditContent(note.content);
    }

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
        setEditContent("");
    }

    const updateNote = async (id) => {
        if (!editTitle.trim() || !editContent.trim()) {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ title: editTitle, content: editContent })
            })

            const result = await response.json();

            if (result.success) {
                toast.success("Note updated succesfully");
                setNotes(notes.map((note) => {
                    return (
                        note._id === editingId ?
                            result.data
                            : note
                    )
                }))
                setEditingId(null);
                setEditTitle("");
                setEditContent("");
            }
            setLoading(false);

        } catch (error) {
            console.error("Error Updating Note: ", error);
            toast.error("something went wrong");
        }

    }


    const createNote = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch("/api/notes", {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ title, content })
            });
            const result = await response.json();
            console.log(result);
            setLoading(false);
            if (result.success) {
                setNotes(
                    [
                        result.data, ...notes
                    ]
                );
                toast.success("Note created successfully")
                setTitle("");
                setContent("");
            }
        } catch (error) {
            console.error("Error creating note");
            toast.error("something went wrong");
        }
    }


    const deleteNote = async (id) => {
        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: "DELETE",
            })
            const result = await response.json();
            if (result.success) {
                setNotes(notes.filter((note) => note._id != id))
                toast.success("Note deleted successfully");
                console.log(result.data);
            }
        } catch (error) {
            console.error("Error deleting note");
            toast.error("something went wrong");
        }
    }
    return (
        <div className='space-y-6'>
            <form onSubmit={createNote} className='bg-white p-6 rounded-lg shadow-md'>
                <h2 className='text-xl text-gray-800 font-semibold mb-4'>Create New Note</h2>
                <div className='space-y-4'>
                    <input
                        required
                        type='text'
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                        placeholder='Note Title'
                        className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    ></input>

                    <textarea
                        placeholder='Note Content'
                        value={content}
                        rows={4}
                        className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={(e) => {
                            setContent(e.target.value);
                        }}
                    />
                    <button
                        type='submit'
                        disabled={loading}
                        className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50'>
                        {loading ? 'Creating....' : 'Create Note'}
                    </button>
                </div>
            </form>
            <div className='space-y-4'>
                <h2 className='text-xl font-semibold'>Your Notes ({notes.length})</h2>
                {
                    notes.length === 0 ? (<p className='text-gray-500'>No Notes Yet. Create your First Note Above</p>) :
                        <>

                            {

                                notes?.map((note) => {
                                    return (
                                        note._id === editingId ?
                                            <div key={`editing-${note._id}`} className='space-y-4'>
                                                <input
                                                    required
                                                    type='text'
                                                    value={editTitle}
                                                    onChange={(e) => {
                                                        setEditTitle(e.target.value);
                                                    }}
                                                    placeholder='Note Title'
                                                    className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                ></input>

                                                <textarea
                                                    placeholder='Note Content'
                                                    value={editContent}
                                                    rows={4}
                                                    className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                    onChange={(e) => {
                                                        setEditContent(e.target.value);
                                                    }}
                                                />

                                                <div className='flex gap-2'>
                                                    <button className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50'
                                                        onClick={() => {
                                                            updateNote(note._id);
                                                        }}
                                                        disabled={loading}
                                                    >
                                                        {loading ? "Saving..." : "Save"}
                                                    </button>
                                                    <button
                                                        className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50'
                                                        onClick={() => {
                                                            cancelEdit();
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                            :
                                            <div key={`view-${note._id}`} className='bg-white p-6 rounded-lg shadow-md '>
                                                <div className='flex justify-between items-start mb-2'>
                                                    <h3 className='text-lg font-semibold'>{note.title}</h3>
                                                    <div className='flex gap-2'>
                                                        <button className='text-blue-500 hover:text-blue-700 text-sm'

                                                            onClick={() => {
                                                                startEdit(note)
                                                            }}
                                                        >Edit</button>
                                                        <button className='text-red-500 hover:text-red-700 text-sm'
                                                            onClick={() => {
                                                                deleteNote(note._id);
                                                            }}
                                                        >Delete</button>
                                                    </div>
                                                </div>
                                                <p className='text-gray-700 mb-2'>{note.content}</p>
                                                <p className='text-sm txt-gray-500'>
                                                    Created At: {new Date(note.createdAt).toLocaleDateString()}
                                                </p>
                                                <p className='text-sm txt-gray-500'>
                                                    Last Updated At: {new Date(note.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                    )
                                })


                            }


                        </>
                }
            </div>
        </div>

    )
}

export default NotesClient