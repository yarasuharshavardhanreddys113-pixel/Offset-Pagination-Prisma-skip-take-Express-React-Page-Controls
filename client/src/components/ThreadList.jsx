import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getThreads } from "../services/threads.service";
import ThreadItem from "./ThreadItem.jsx";
import { useState } from "react";

export default function ThreadList() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["threads", { page }],
    queryFn: () => getThreads(page),
    placeholderData: keepPreviousData,
  });

  const threads = data?.threads ?? [];

  if (isPending) {
    return <p className="muted">Loading threads…</p>;
  }

  if (isError) {
    return (
      <p className="error">
        Could not load threads: {error.message}
      </p>
    );
  }

  if (threads.length === 0) {
    return <p className="muted">No threads found.</p>;
  }

  return (
    <>
      <ul className="threads">
        {threads.map((thread) => (
          <ThreadItem key={thread.id} thread={thread} />
        ))}
      </ul>

      <div className="pagination">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>Page {page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data.hasMore}
        >
          Next
        </button>
      </div>
    </>
  );
}