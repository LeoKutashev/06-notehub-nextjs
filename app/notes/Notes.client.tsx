"use client";

import { useState } from "react";
import { fetchNotes } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import NoteList from "@/components/NoteList/NoteList";
import NoteModal from "@/components/Modal/Modal";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import type { NotesResponse } from "@/types/api";
import css from "./NotesPage.module.css";

type NotesClientProps = {
  initialPage?: number;
  initialSearch?: string;
};

export default function NotesClient({
  initialPage = 1,
  initialSearch = "",
}: NotesClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const perPage = 12;


  const { data, isLoading } = useQuery<NotesResponse>({
    queryKey: ["notes", debouncedSearchTerm, currentPage],
    queryFn: () => fetchNotes(currentPage, debouncedSearchTerm, perPage),
    staleTime: 5000, 
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearchChange = (newTerm: string) => {
    setSearchTerm(newTerm);
    setCurrentPage(1);
  };

 
  const notesData = data; 

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={handleSearchChange} />

      
        {notesData && notesData.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            pageCount={notesData.totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

    
      {isLoading ? (
        <p>Loading notes...</p>
      ) : (
        notesData?.notes && <NoteList notes={notesData.notes} />
      )}

    
      {isModalOpen && <NoteModal onClose={closeModal} onSuccess={closeModal} />}
    </div>
  );
}
