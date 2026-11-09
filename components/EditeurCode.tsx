"use client";

import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

const theme = EditorView.theme({
  "&": {
    fontSize: "16px", // 16px : évite le zoom automatique d'iOS au focus
    backgroundColor: "#f4f5ee",
    color: "#2e3d28",
    border: "2px solid #2e3d28",
    borderRadius: "12px",
  },
  "&.cm-focused": { outline: "3px solid #a9b887" },
  ".cm-scroller": {
    fontFamily: "ui-monospace, Menlo, Consolas, monospace",
    minHeight: "160px",
    maxHeight: "320px",
    overflow: "auto",
  },
  ".cm-gutters": { backgroundColor: "#e8e9df", color: "#2e3d28", border: "none" },
  ".cm-activeLine": { backgroundColor: "rgba(169, 184, 135, 0.25)" },
  ".cm-activeLineGutter": { backgroundColor: "rgba(169, 184, 135, 0.4)" },
});

interface Props {
  /** Valeur initiale : l'éditeur garde ensuite son propre état. */
  valeur: string;
  langage: "html" | "css";
  etiquette: string;
  lectureSeule?: boolean;
  onChange?: (valeur: string) => void;
}

export default function EditeurCode({ valeur, langage, etiquette, lectureSeule = false, onChange }: Props) {
  const hote = useRef<HTMLDivElement>(null);
  const rappel = useRef(onChange);

  useEffect(() => {
    rappel.current = onChange;
  });

  useEffect(() => {
    if (!hote.current) return;
    const vue = new EditorView({
      parent: hote.current,
      state: EditorState.create({
        doc: valeur,
        extensions: [
          basicSetup,
          langage === "html" ? html() : css(),
          theme,
          EditorView.lineWrapping,
          EditorState.readOnly.of(lectureSeule),
          EditorView.contentAttributes.of({ "aria-label": etiquette }),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) rappel.current?.(u.state.doc.toString());
          }),
        ],
      }),
    });
    return () => vue.destroy();
    // `valeur` n'est lue qu'au montage : l'éditeur est la source de vérité ensuite.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langage, lectureSeule, etiquette]);

  return <div ref={hote} />;
}
