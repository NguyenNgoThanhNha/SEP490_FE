import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import blogService from '@/services/blogService';
import toast from 'react-hot-toast';
import { TBlog } from '@/types/blog.type';

const BlogDetailPage: React.FC = () => {
  const { blogId } = useParams();
  const [blogDetails, setBlogDetails] = useState<TBlog | null> (null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const response = await blogService.getBlogDetail({ blogId: Number(blogId)});
        if (response?.success) {
          setBlogDetails(response.result?.data);
        } else {
          toast.error(response.result?.message || "Failed to fetch blog details.");
        }
      } catch  {
        toast.error("Failed to fetch blog details.");
        setError("Failed to fetch blog details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();

    return () => {
    };
  }, [blogId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!blogDetails) return <div>No blog details available.</div>;

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex flex-col lg:flex-row gap-6 p-8 max-w-6xl w-full">
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4 text-center">{blogDetails.title}</h1>
          <div className="text-sm text-gray-600 mb-4 text-center">
            By Author: {blogDetails.authorName} | Created on {new Date(blogDetails.createdDate).toLocaleDateString()}
          </div>
          <div
            className="bg-white p-4 rounded-lg mb-4"
            dangerouslySetInnerHTML={{ __html: blogDetails.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
