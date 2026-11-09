import { Suspense } from "react";
import { notFound } from "next/navigation";
import Jeu from "@/components/Jeu";

export function generateStaticParams() {
  return [{ niveau: "1" }, { niveau: "2" }, { niveau: "3" }];
}

export default async function Page({ params }: PageProps<"/jouer/[niveau]">) {
  const { niveau } = await params;
  if (niveau !== "1" && niveau !== "2" && niveau !== "3") notFound();
  // Suspense : Jeu lit ?date= (useSearchParams) côté client.
  return (
    <Suspense fallback={<p>Chargement du défi…</p>}>
      <Jeu niveau={Number(niveau) as 1 | 2 | 3} />
    </Suspense>
  );
}
