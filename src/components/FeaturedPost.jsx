import React from "react";
import dayjs from "dayjs";
import { baseHost } from "../services/api";

const FeaturedPost = ({ post, onClick }) => {
  if (!post) return null;

  return (
    <div
      className="cursor-pointer group"
      onClick={() => onClick(post)}
    >
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded">
        <img
            src={`${baseHost}${post.picture.url}`}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
        />
        </div>
      <p className="mt-2 text-sm text-blue-500">{dayjs(post.createdAt).format("MMM D, YYYY")}</p>
      <h2 className="text-2xl font-bold group-hover:underline mt-1">{post.title}</h2>
      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{post.description}</p>
    </div>
  );
};

export default FeaturedPost;
