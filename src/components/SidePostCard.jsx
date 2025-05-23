import React from "react";
import dayjs from "dayjs";
import { baseHost } from "../services/api";
import PlayCircle from "../assets/play-circle.svg";

const SidePostCard = ({ post, onClick, expandedPostId, setExpandedPostId }) => {
  const isVideo = post.video;
  return (
    <div
      className="flex gap-4 cursor-pointer group"
      onClick={() => onClick(post)}
    >
      {/* Image */}
      <div className="w-24 h-24 overflow-hidden rounded">
        {isVideo ? (
          <div className="relative size-full">
            <img
              src={`${baseHost}${post.picture.url}`}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img src={PlayCircle} className="size-[24px]" alt="Play" />
            </div>
          </div>
        ) : (
          <img
            src={`${baseHost}${post.picture.url}`}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Text Content */}
      <div className="flex-1">
        <p className="text-xs text-blue-500">
          {dayjs(post.createdAt).format("MMM D, YYYY")}
        </p>
        <h3 className="text-sm font-semibold group-hover:underline dark:text-white">
          {post.title}
        </h3>

        {/* Description preview or full */}
        <p
          className={`text-sm text-gray-700 dark:text-gray-300 mt-2 ${
            expandedPostId === post.id ? "line-clamp-4" : "line-clamp-2"
          }`}
        >
          {expandedPostId === post.id
            ? post.description
            : `${post.description.slice(0, 100)}...`}
        </p>

        {/* "See more / less" toggle */}
        {post.description.length > 100 && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering the modal
              setExpandedPostId(expandedPostId === post.id ? null : post.id);
            }}
            className="mt-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {expandedPostId === post.id ? "See less" : "See more"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SidePostCard;
