import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Community[];
};

export const CommunityList = () => {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (isLoading)
    return <div className="text-center py-6 text-gray-600">Loading communities...</div>;

  if (error)
    return (
      <div className="text-center text-red-600 py-6">
        Error: {error.message}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-4 p-4">
      {data?.map((community) => (
        <div
          key={community.id}
          className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <Link
            to={`/community/${community.id}`}
            className="text-xl sm:text-2xl font-semibold text-purple-600 hover:underline"
          >
            {community.name}
          </Link>
          <p className="text-gray-600 mt-2">{community.description}</p>
          <p className="text-xs text-gray-400 mt-3">
            Created on {new Date(community.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};
