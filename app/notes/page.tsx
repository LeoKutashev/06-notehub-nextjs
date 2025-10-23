import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { NotesResponse } from "@/types/api";
export default async function NotesPage() {
  const perPage = 12;
  const initialPage = 1;
  const initialSearch = "";

 
  const queryClient = new QueryClient();

 
  await queryClient.prefetchQuery({
    queryKey: ["notes", initialSearch, initialPage],
    queryFn: () => fetchNotes(initialPage, initialSearch, perPage),
  });

 
  const dehydratedState = dehydrate(queryClient);
 const initialData = queryClient.getQueryData<NotesResponse>([
    "notes",
    initialSearch,
    initialPage,
  ]);
  if (!initialData) {
  throw new Error("Failed to fetch initial data");
}
  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient
        initialPage={initialPage}
        initialSearch={initialSearch}
      />
    </HydrationBoundary>
  );
}