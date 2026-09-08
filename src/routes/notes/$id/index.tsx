import { createFileRoute } from "@tanstack/react-router";
import { NoteEditor } from "@/components/content/note-editor";
import { getNote } from "@/mock/content";

export const Route = createFileRoute("/notes/$id/")({
  head: ({ params }) => {
    const note = getNote(params.id);
    return {
      meta: [
        { title: `${note.title} — заметка LifeHub` },
        { name: "description", content: note.excerpt },
        { property: "og:title", content: `${note.title} — заметка LifeHub` },
        { property: "og:description", content: note.excerpt },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: NotePage,
});

function NotePage() {
  const { id } = Route.useParams();
  return <NoteEditor id={id} />;
}
