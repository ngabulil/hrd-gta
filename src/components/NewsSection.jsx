import React, { useState } from "react";
import FeaturedPost from "./FeaturedPost";
import SidePostCard from "./SidePostCard";

const NewsSection = ({ posts, onSelectPost }) => {
  // 🔥 Track which post (if any) is expanded
  const [expandedPostId, setExpandedPostId] = useState(null);

  return (
    <section className="grid mb-6 grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Featured Left */}
      <div className="lg:col-span-2">
        <FeaturedPost post={posts[0]} onClick={onSelectPost} />
      </div>

      {/* Side Posts Right */}
      <div className="flex flex-col gap-4">
        {posts.slice(1, 5).map((post, i) => (
          <SidePostCard
            key={i}
            post={post}
            onClick={onSelectPost}
            expandedPostId={expandedPostId}
            setExpandedPostId={setExpandedPostId}
          />
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
