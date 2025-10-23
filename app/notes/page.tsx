import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

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

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient
        initialPage={initialPage}
        initialSearch={initialSearch}
      />
    </HydrationBoundary>
  );
}