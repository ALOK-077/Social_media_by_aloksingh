import { useState, type ChangeEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { fetchCommunities, type Community } from "./CommunityList";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicUrlData.publicUrl });
  if (error) throw new Error(error.message);
  return data;
};

function CreatePost() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState<number | null>(null);

  const { user } = useAuth();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
      },
      imageFile: selectedFile,
    });
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 space-y-5"
    >
      {/* Heading */}
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
        ✨ Create a New Post
      </h2>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block mb-1 font-medium text-gray-700">
          Title
        </label>
        <input
          className="w-full border border-gray-300 bg-white p-2 rounded focus:ring-2 focus:ring-purple-400 outline-none"
          type="text"
          id="title"
          placeholder="Enter title"
          required
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>

      {/* Content */}
      <div>
        <label
          htmlFor="content"
          className="block mb-1 font-medium text-gray-700"
        >
          Content
        </label>
        <textarea
          className="w-full border border-gray-300 bg-white p-2 rounded focus:ring-2 focus:ring-purple-400 outline-none"
          id="content"
          placeholder="Write your content..."
          required
          rows={5}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </div>

      {/* Community */}
      <div>
        <label
          htmlFor="community"
          className="block mb-1 font-medium text-gray-700"
        >
          Select Community
        </label>
        <select
          id="community"
          onChange={handleCommunityChange}
          aria-label="Choose Community"
          className="w-full border border-gray-300 bg-white p-2 rounded focus:ring-2 focus:ring-purple-400 outline-none"
        >
          <option value={""}> -- Choose a Community -- </option>
          {communities?.map((community, key) => (
            <option key={key} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label
          htmlFor="image"
          className="block mb-1 font-medium text-gray-700"
        >
          Upload Image
        </label>
        <input
          className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 
                     file:rounded-lg file:border-0 
                     file:text-sm file:font-medium 
                     file:bg-purple-500 file:text-white 
                     hover:file:bg-purple-600 cursor-pointer"
          type="file"
          accept="image/*"
          id="image"
          required
          onChange={handleFileChange}
        />
      </div>

      {/* Button */}
      <button
        className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        type="submit"
      >
        {isPending ? "Creating post..." : "Create Post"}
      </button>

      {isError && (
        <p className="text-red-600 text-sm mt-2">You must be logged in for create post.</p>
      )}
    </form>
  );
}

export default CreatePost;
