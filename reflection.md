# Reflection

## What worked

The single biggest win was treating each persona's prompt as a **product**, not a paragraph. My first drafts were generic — "You are Anshuman Singh. Be helpful and direct." The output was indistinguishable from a generic CTO bot. The second draft was longer but still vague. What actually moved the needle was watching real talks and reading real posts, then encoding the *specific phrases* and *specific structures* each person uses.

For Kshitij, that meant putting his actual rhetorical phrases into the prompt — "Ask yourself…", "Now think about this", "Clear?" — and giving the model a Hook-Tension-Insight-Build-Takeaway scaffold to follow silently. For Anshuman, it was the relentless contrast frame ("in competitive programming X, in real systems Y") and concrete numbers like "100 machines" instead of "many machines." For Abhimanyu, it was forcing every answer through the compass/map/destination metaphor and including the actual InterviewBit→Scaler pivot story as a few-shot example.

Mode-switching also helped a lot. Splitting the prompt into a NATURAL mode (greetings, small talk) and a deeper mode (concept explanation or decision framework) stopped the bot from launching into a 300-word Socratic monologue when someone just said "hi." This single split made the bot feel responsive instead of robotic.

## What GIGO taught me

The first time I sent a lazy prompt and got lazy output, the lesson landed. I asked Kshitij to "explain consistent hashing" with only a one-line system prompt — the model gave me a Wikipedia-style definition with bullet points. Same model, same question, but the *prompt* I gave it wasn't a teacher's prompt; it was a reference book's prompt. The model gave back exactly what I asked for, just framed badly.

The deeper realization was that GIGO isn't about typos or vague wording — it's about **specificity at every layer**. If I want a teacher, I need to specify the teaching style. If I want plain prose, I need to forbid markdown by name. If I want short paragraphs, I need to give a sentence count. The model is brutally literal: it does what's specified, and *only* what's specified. Gaps get filled with averages, and averages are boring.

## What I would improve

Three things if I had another iteration. **First**, I'd add explicit "NEVER SAY" banks per persona — right now I scatter forbidden phrases inline, but a dedicated list would scale better. **Second**, I'd add NATURAL-mode few-shot examples. Most of my few-shots are deep-mode answers, so small talk sometimes feels less in-character. **Third**, I'd implement persona-drift correction for long conversations — after 6+ turns the bot occasionally slips into generic assistant mode, and a periodic reminder injection would fix it without bloating the system prompt.

The biggest thing I learned is that prompt engineering is not about writing — it's about **noticing**. The hours I spent watching real Kshitij/Anshuman/Abhimanyu content were worth more than the hours I spent rewording the system prompt. You can't fake specificity you haven't earned.
