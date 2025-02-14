import blogService from '@/services/blogService';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateBlogPage = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success] = useState<boolean>(false);

  const authorId = 1;
  const createdDate = new Date().toISOString();
  const updatedDate = new Date().toISOString();
  const status = 'Accept';

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleCreateBlog = async () => {
    if (!title || !content || !note) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newBlog = {
        title,
        content,
        authorId,
        note,
        createdDate,
        updatedDate,
        status,
      };

      await blogService.createBlog(newBlog);
      setTitle('');
      setContent('');
      setNote('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('An error occurred while creating the blog.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-8 min-h-screen">
      <div className="flex-1 bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Create a New Blog</h1>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <ReactQuill
            value={content}
            onChange={handleContentChange}
            theme="snow"
            placeholder="Write your blog content here..."
            className="bg-white rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <input
            type="text"
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-4">Blog created successfully!</div>}
        {loading && <div className="text-gray-500 text-sm mb-4">Loading...</div>}
        <button
          onClick={handleCreateBlog}
          className="bg-indigo-500 hover:bg-indigo-200 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
        >
          Create Blog
        </button>
      </div>

      <div className="flex-1 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Preview</h2>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default CreateBlogPage;
