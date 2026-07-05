import React from 'react';

function platformLabel(p) {
  return { leetcode: 'LeetCode', codeforces: 'Codeforces', codechef: 'CodeChef' }[p] || p;
}

export default function PlatformBadge({ platform }) {
  return (
    <span className={`platform-pill ${platform}`}>
      {platformLabel(platform)}
    </span>
  );
}
