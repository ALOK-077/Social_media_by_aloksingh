import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import PostItems from "./PostItems";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts");

  if (error) throw new Error(error.message);
  return data as Post[];
};

function PostList() {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 text-lg animate-pulse">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-red-500 text-lg font-semibold">
          Error: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post, key) => (
        <PostItems key={key} post={post} />
      ))}
    </div>
  );
}

export default PostList;
