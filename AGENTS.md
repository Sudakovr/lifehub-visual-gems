<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep logo comparison data and asset references in `src/mock/logos.ts`; `/logo` renders the comparison, so artwork and descriptions can be extended without changing application branding.
- Logo comparison artwork uses alpha masks from generated PNGs and dedicated study tokens; this preserves the source geometry while ensuring flat, consistent color and monochrome versions.
