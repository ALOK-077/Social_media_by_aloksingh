import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CommunityInput {
  name: string;
  description: string;
}

const createCommunity = async (community: CommunityInput) => {
  const { error, data } = await supabase.from("communities").insert(community);

  if (error) throw new Error(error.message);
  return data;
};

export const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      navigate("/communities");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, description });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 space-y-5"
    >
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Community
      </h2>

      {/* Community Name */}
      <div>
        <label
          htmlFor="name"
          className="block mb-1 font-medium text-gray-700"
        >
          Community Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 bg-white p-2 rounded focus:ring-2 focus:ring-purple-400 outline-none"
          placeholder="Enter community name"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block mb-1 font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 bg-white p-2 rounded focus:ring-2 focus:ring-purple-400 outline-none"
          rows={3}
          placeholder="Write a short description..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        {isPending ? "Creating..." : "Create Community"}
      </button>

      {isError && (
        <p className="text-red-600 text-sm mt-2">
          You must be logged in to create a community.
        </p>
      )}
    </form>
  );
};
