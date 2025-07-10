# feature specification: imagination engine

## 1. feature overview & vision

**pillar:** imagination engine - the partner in creation
**vision:** the `imagination engine` is the most intimate and supportive pillar of the ccplay ecosystem. it functions as a non-judgmental creative partner for a child, specifically designed to overcome the "blank page" problem in storytelling and writing. its vision is to be a gentle guide that helps children articulate their thoughts, providing subtle nudges and suggestions only when they get stuck. by celebrating the act of writing and tracking progress over time, this feature aims to build literary confidence and turn writing from a chore into a joyful act of self-expression.

## 2. target audience & personas

- **primary user:** children aged 6-9 who are beginning to form complex narratives but sometimes struggle with writer's block or finding the right words.
- **persona: "thoughtful leo" (age 8)**
    - leo has big ideas for stories but gets stuck after writing the first few sentences. he doesn't know what should happen next.
    - he feels pressure to write a "good" story and gets discouraged when the words don't flow.
    - he would benefit from a gentle partner that can offer ideas without taking over his story.

## 3. user stories

- **as a child,** i want a simple place where i can just start typing my story without any complicated buttons.
- **as a child,** when i stop typing because i don't know what to write next, i want the app to notice and gently ask if i need a little help.
- **as a child,** i want the suggestions to be simple, like "what if the character finds a mysterious door?" or "what does the room smell like?"
- **as a child,** i want to be able to ignore the suggestion and keep writing my own idea if i have one.
- **as a parent,** i want a tool that encourages my child to write without making them feel graded or judged.
- **as a parent,** i want to see how my child's writing is developing, like if they are writing for longer periods or getting stuck less often over time.
- **as a parent,** i want the option to save my child's stories as special keepsakes.

## 4. functional requirements

### 4.1. the writing canvas
- **fr-ie1:** the system shall provide a minimalist, distraction-free writing canvas with a clean, age-appropriate font.
- **fr-ie2:** the primary interface will consist of a simple text editor with basic formatting (bold, italics).

### 4.2. the ai nudge engine
- **fr-ie3:** the system shall actively monitor user inactivity within the text editor.
- **fr-ie4:** if a user is inactive (no typing) for a configurable period (e.g., 20 seconds), the ai nudge engine will activate.
- **fr-ie5:** upon activation, the engine will display a single, non-intrusive "nudge" in a dismissible ui element. nudges will be context-aware and designed to spark imagination, for example:
    - **sensory prompts:** "what can the character see outside the window?"
    - **plot prompts:** "what happens next?" or "a new character enters the room. who is it?"
    - **dialogue prompts:** "what does the main character say?"
- **fr-ie6:** the user can explicitly dismiss the nudge, or it will fade automatically if the user resumes typing.

### 4.3. draft artifacts & parental tracking
- **fr-ie7:** all writing sessions are automatically saved as "drafts" in a private user portfolio.
- **fr-ie8:** the system shall log metadata for each session, including:
    - duration of the writing session.
    - number of times the nudge engine was activated.
    - word count of the draft.
- **fr-ie9:** a secure, parent-gated dashboard shall provide visualizations of this metadata over time, allowing parents to track their child's creative writing development. for example, a graph showing "time spent writing vs. nudges needed" over the past month.
- **fr-ie10:** parents will have the option to "finalize" a draft, converting it into a more permanent "artifact" that can be saved, exported as a pdf, or (in the future) sent to the `story` pillar to be turned into an illustrated storybook.

## 5. success metrics & measurement

the success of the `imagination engine` is measured by its ability to decrease creative friction and increase writing confidence.

- **metric 2.5.a (engagement - primary):**
    - **metric:** average number of writing sessions initiated per active user per week.
    - **target:** 1 session/user/week.
    - **measurement:** log an event for every new writing session that results in more than 20 words being written. aggregate weekly per user.

- **metric 2.5.b (confidence growth - primary):**
    - **metric:** the ratio of writing time to the number of ai nudges required over time.
    - **target:** see a 25% increase in the `(minutes of writing) / (number of nudges)` ratio over a user's first 3 months.
    - **measurement:** for each session, log the duration and the number of times the nudge engine was triggered. track this ratio over time for each user cohort to demonstrate decreasing reliance on ai assistance.

- **metric 2.5.c (session length - secondary):**
    - **metric:** the average length (in minutes) of a writing session.
    - **target:** increase average session length by 20% over a user's first 3 months.
    - **measurement:** track the duration of each writing session.

## 6. technical considerations

- **contextual awareness:** the ai nudge engine needs to have some level of contextual understanding of the text already written to provide relevant, non-disruptive suggestions. this will require careful llm prompting.
- **real-time inactivity monitoring:** the client-side logic for detecting user inactivity must be efficient and not impact the performance of the text editor.
- **data privacy:** all drafts and tracking data are highly sensitive and must be stored securely with robust access controls, ensuring only the parent/guardian can view the tracking dashboard.

## 7. future enhancements (post-v1)

- **genre-specific nudges:** allow users to select a genre (e.g., "mystery," "sci-fi") at the beginning of a session to receive more tailored suggestions.
- **"finish my story" mode:** an option for the ai to generate a concluding paragraph if the child wants help wrapping up their tale.
- **integration with `story`:** a one-click button to send a completed draft to the `story` pillar, which would then generate a full banner image and format it like a published storybook.
- **co-writing mode:** a real-time collaborative version where two friends can write a story together, with the nudge engine assisting both of them. 