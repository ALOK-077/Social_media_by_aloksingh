import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { CommentItem } from "./CommentItem";

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id?: number | null;
}

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) throw new Error("User not logged in");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Comment[];
};

function CommentSection({ postId }: Props) {
  const [newComment, setNewComment] = useState<string>("");
  const { user } = useAuth();

  const { data: comments, isLoading, error } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.username || user?.email
      ),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment) return;
    mutate({ content: newComment, parent_comment_id: null });
    setNewComment("");
  };

  const buildCommentTree = (
    flatComments: Comment[]
  ): (Comment & { children?: Comment[] })[] => {
    const map = new Map<number, Comment & { children?: Comment[] }>();
    const roots: (Comment & { children?: Comment[] })[] = [];
    flatComments.forEach((comment) => map.set(comment.id, { ...comment, children: [] }));
    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) parent.children!.push(map.get(comment.id)!);
      } else {
        roots.push(map.get(comment.id)!);
      }
    });
    return roots;
  };

  if (isLoading) return <div className="text-center py-4 text-gray-600">Loading comments...</div>;
  if (error) return <div className="text-center py-4 text-red-600">Error: {error.message}</div>;

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="mt-6 max-w-3xl mx-auto space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">Comments</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none text-gray-800"
            placeholder="Write a comment..."
            rows={3}
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg font-medium transition-colors"
          >
            {isPending ? "Posting..." : "Post Comment"}
          </button>
          {isError && <p className="text-red-600">Error posting comment.</p>}
        </form>
      ) : (
        <p className="text-gray-600">You must be logged in to post a comment.</p>
      )}

      <div className="space-y-4">
        {commentTree.map((comment, key) => (
          <div
            key={key}
            className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow"
          >
            <CommentItem comment={comment} postId={postId} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
