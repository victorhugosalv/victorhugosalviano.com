import { profile } from "@/content/profile";

export default function HomePage() {
  return (
    <main id="conteudo">
      <h1>{profile.name}</h1>
    </main>
  );
}
