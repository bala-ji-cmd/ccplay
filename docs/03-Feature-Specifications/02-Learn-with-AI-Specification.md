# feature specification: learn

## 1. feature overview & vision

**pillar:** learn - the pathway to skill
**vision:** the `learn` pillar is the educational core of ccplay, designed to demystify the process of drawing and build a child's technical skills in a way that feels like play, not work. our vision is to eliminate the frustration of "i can't draw that" by breaking down complex subjects into a series of simple, confidence-building steps. this feature transforms artistic learning from a daunting task into an engaging and rewarding journey of mastery.

## 2. target audience & personas

- **primary user:** children aged 4-8 who are eager to draw specific things but lack the foundational knowledge of how to construct them from simple shapes.
- **persona: "determined daniel" (age 6)**
    - daniel loves dinosaurs and wants to draw a t-rex, but his attempts end up as frustrated scribbles.
    - he is a visual learner who benefits from seeing a process broken down into manageable parts.
    - he feels a huge sense of accomplishment when he can successfully replicate a drawing and show it to his parents.

## 3. user stories

- **as a child,** i want to find a tutorial that shows me exactly how to draw a cool pirate ship, step-by-step.
- **as a child,** i want the steps to be super simple, like starting with just a circle or a square.
- **as a child,** after i finish learning to draw a robot, i want the app to suggest i learn how to draw a spaceship next.
- **as a parent,** i want to see all the drawings my child has learned to create in one place, so i can see how their skills are improving.
- **as a parent,** i want to know the tutorials are designed by experts to actually teach drawing fundamentals, not just to keep my child busy.

## 4. functional requirements

### 4.1. tutorial library & discovery
- **fr-l1:** the platform shall provide a browsable and searchable library of drawing tutorials.
- **fr-l2:** the library must contain a minimum of 100 tutorials at launch, categorized by themes (e.g., animals, vehicles, fantasy, nature).
- **fr-l3:** each tutorial in the library will be represented by a visually appealing thumbnail of the final drawing.
- **fr-l4:** the system shall feature a "recommended for you" section on the `learn` homepage, populated by the adaptive learning engine (see fr-l6).

### 4.2. the interactive learning interface
- **fr-l5:** each tutorial shall consist of 5-8 sequential, interactive steps. each step will:
    - display a simple instruction (e.g., "step 1: draw a large circle for the head").
    - show a clear visual example of the lines or shapes to be added in that step.
    - provide a canvas space for the user to practice the step.
- **fr-l6:** users must be able to navigate forwards and backwards through the steps at their own pace.
- **fr-l7:** upon completing the final step, the user will be shown a "you did it!" confirmation screen, and the completed tutorial will be added to their learning portfolio.

### 4.3. adaptive learning path
- **fr-l8:** the system shall track every tutorial a user completes.
- **fr-l9:** based on the user's completion history and the difficulty/category of completed tutorials, the system's recommendation engine will suggest a personalized "next tutorial." the algorithm will prioritize tutorials that build upon recently learned skills (e.g., after drawing a cat, it might suggest a lion).

### 4.4. learning portfolio
- **fr-l10:** a dedicated "portfolio" section shall display a gallery of all the tutorials the user has successfully completed.
- **fr-l11:** the portfolio will be organized chronologically to give parents and children a clear visual representation of their learning journey and progress over time.

## 5. success metrics & measurement

the success of the `learn` pillar is measured by its effectiveness in teaching skills and building user confidence.

- **metric 2.2.a (completion rate - primary):**
    - **metric:** the percentage of users who complete a tutorial after starting it.
    - **target:** 80% completion rate.
    - **measurement:** log an event when a user starts a tutorial (views step 1) and another when they reach the final confirmation screen. calculate `(completion events) / (start events)`.

- **metric 2.2.b (progression - primary):**
    - **metric:** average number of tutorials completed per active user per month.
    - **target:** 5 tutorials/user/month.
    - **measurement:** count the total number of completion events per user and aggregate monthly.

- **metric 2.2.c (skill transfer - secondary):**
    - **metric:** a qualitative and quantitative analysis of drawings created in the `draw` pillar, comparing work from before and after a user engages with the `learn` pillar.
    - **target:** see a measurable improvement in the structural quality and complexity of free-form drawings after a user completes 5 or more tutorials.
    - **measurement:**
        - **quantitative:** for users who have completed >5 tutorials, analyze their subsequent free-form drawings for an increase in the number of distinct shapes and lines compared to their pre-`learn` baseline.
        - **qualitative:** periodically, have human reviewers score anonymized before-and-after drawings on a 1-5 scale for "structural integrity" to validate the quantitative data.

## 6. technical considerations

- **tutorial content pipeline:** a streamlined internal tool must be developed for artists and educators to create, tag, and upload new tutorials into the system.
- **recommendation algorithm:** the logic for the adaptive learning path needs to be carefully designed to balance skill reinforcement with the introduction of new concepts to keep the user engaged.
- **state management:** the system must reliably save a user's progress within a tutorial, so they can leave and come back to it later without losing their place.

## 7. future enhancements (post-v1)

- **video-based tutorials:** incorporate short video clips to demonstrate more complex techniques.
- **learning paths:** create curated "courses" or learning paths (e.g., "introduction to animal drawing," "vehicle design 101") that group related tutorials into a structured curriculum.
- **skill badges:** award users with digital badges for completing specific tutorials or learning paths to further gamify the experience.
- **integration with `draw`:** allow users to take an element they learned to draw (e.g., a tree) and instantly add it to their free-form canvas in the `draw` pillar.
