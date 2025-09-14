import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Post;
};

function PostDetails({ postId }: Props) {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return <div className="text-center text-gray-300">Loading post...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
        {data?.title}
      </h2>

      {/* Image */}
      {data?.image_url && (
        <div className="mt-4">
          <img
            src={data.image_url}
            alt={data?.title}
            className="w-full max-h-[400px] rounded-lg object-cover shadow-md"
          />
        </div>
      )}

      {/* Content */}
      <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
        {data?.content}
      </p>

      {/* Date */}
      <p className="text-gray-300 text-sm italic">
        📅 Posted on: {new Date(data!.created_at).toLocaleDateString()}
      </p>

      {/* Like + Comments */}
      <div className="space-y-4">
        <LikeButton postId={postId} />
        <CommentSection postId={postId} />
      </div>
    </div>
  );
}

export default PostDetails;
