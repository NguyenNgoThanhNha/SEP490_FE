import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { Table } from "@/components/organisms/Table/Table";
import blogService from "@/services/blogService";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/formatDate";
import { TBlog } from "@/types/blog.type";
import toast from "react-hot-toast";


const BlogList = () => {
  const [blogs, setBlogs] = useState<TBlog[]>([]);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllBlog({ status: "accept", page: 1, pageSize: 5 });
      if (response?.success) {
        setBlogs(response.result?.data || []);
      } else {
        toast.error(response.result?.message || "Failed to fetch blogs.");
      }
    } catch {
      toast.error("Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };



  const handleEdit = (blogId: number) => {
    console.log(blogId);
    navigate(`/blog/${blogId}`);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const headers = [
    { label: "Title", key: "title" },
    { label: "Author", key: "authorName" },
    { label: "Created At", key: "createdDate", render: (createdDate: string) => formatDate(createdDate) },
        { label: "Status", key: "status" },
  ];

  const badgeConfig = {
    key: "status",
    values: {
      accept: { label: "Accept", color: "green", textColor: "white" },
      Draft: { label: "Draft", color: "blue", textColor: "white" },
      Archived: { label: "Archived", color: "red", textColor: "white" },
    },
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <Table
          headers={headers}
          selectable={true}
          data={blogs.length > 0 ? blogs : []}
          badgeConfig={badgeConfig}
          actions={(row) => (
            <div className="flex space-x-2">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleEdit(row.blogId as number)}
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default BlogList;
