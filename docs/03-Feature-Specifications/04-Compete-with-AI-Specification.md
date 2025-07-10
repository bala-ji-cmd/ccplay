# feature specification: compete

## 1. feature overview & vision

**pillar:** compete - the playground for collaboration
**vision:** the `compete` pillar redefines what "competition" means in a creative context. it is designed as a collaborative playground, not a zero-sum contest. the vision is to foster a sense of community and shared experience by encouraging children to tackle the same creative prompt in their own unique ways. by celebrating the creative *process* over the final *product*, this feature teaches resilience, celebrates diversity of thought, and shows children that there are many valid and valuable ways to be creative.

## 2. target audience & personas

- **primary user:** children aged 5-8 who are developing social awareness and are motivated by seeing how their work compares to and differs from their peers.
- **persona: "curious chloe" (age 7)**
    - chloe is naturally curious and loves seeing how other kids solve problems.
    - she sometimes feels her drawings aren't as "good" as others, so traditional contests can be discouraging.
    - she is motivated by recognition for effort and originality, not just for technical skill.

## 3. user stories

- **as a child,** i want to join a fun daily challenge and see what all the other kids are drawing for the same idea.
- **as a child,** i want to see other kids' drawings happening in real-time, so it feels like we're all in a big, friendly art room together.
- **as a child,** i want to know that even if i change my mind and erase my whole drawing to start again, the app thinks that's a cool and brave thing to do.
- **as a child,** i want to have a chance to be a "winner" for having a wild idea or using my favorite color a lot, not just for drawing the most realistic picture.
- **as a parent,** i want my child to engage in social play that is positive, inclusive, and builds creative confidence rather than tearing it down.
- **as a parent,** i want to see the app celebrate different kinds of creativity, so my child learns that their unique approach is valuable.

## 4. functional requirements

### 4.1. the daily challenge
- **fr-c1:** the system shall present a single, universal drawing prompt to all active users each day. the prompt will reset at a configurable time (e.g., midnight utc).
- **fr-c2:** prompts shall be simple and open-ended (e.g., "a surprising superhero," "a fruit that tells jokes," "a vehicle for an ant").
- **fr-c3:** the `compete` screen will clearly display the day's prompt and a canvas for the user to work on.

### 4.2. the collaborative environment
- **fr-c4:** the ui will feature a dynamic display of other participants' in-progress work. this will be implemented as anonymized, "ghosted" sketches that update in near real-time, giving the sense of a live, shared studio.
- **fr-c5:** privacy shall be paramount. no user-identifying information will be displayed during the creation phase.

### 4.3. journey-based scoring
- **fr-c6:** the system shall not analyze the final image for "quality." instead, it will log key events during the creation process for each user.
- **fr-c7:** the journey-based scoring algorithm will calculate a score for each participant based on a weighted combination of logged events, including:
    - **ideation efforts:** number of major canvas clears or erasures (>50% of canvas).
    - **color diversity:** the total number of unique colors used.
    - **tool variety:** the number of different drawing tools (brush, pen, shapes) employed.
    - **time distribution:** analysis of time spent in different phases (e.g., initial sketching vs. detailing).
    - **originality vector:** (advanced) semantic analysis of the drawing's elements compared to the prompt, to reward unconventional interpretations.

### 4.4. multi-winner recognition
- **fr-c8:** at the end of the daily challenge period, the system will not declare a single "winner."
- **fr-c9:** instead, the results screen will showcase multiple participants in several rotating, positive award categories. examples include:
    - **"bravest idea" award:** for the user with the most "ideation efforts."
    - **"rainbow" award:** for the user with the highest "color diversity" score.
    - **"tool explorer" award:** for the user who demonstrated the most "tool variety."
    - **"most unconventional" award:** for the user with the highest "originality vector."
- **fr-c10:** the results screen will display the user's creation, their anonymized username, and the award they received. all participants will be able to view the creations of the highlighted users.

## 5. success metrics & measurement

the success of the `compete` pillar is measured by its ability to foster positive social interaction and reinforce creative confidence.

- **metric 2.4.a (participation rate - primary):**
    - **metric:** the percentage of daily active users who submit a drawing to the daily challenge.
    - **target:** 40% participation rate.
    - **measurement:** log an event for every submission. calculate `(unique users who submitted) / (daily active users)`.

- **metric 2.4.b (session depth - secondary):**
    - **metric:** the average time spent per user in the `compete` pillar.
    - **target:** 8 minutes.
    - **measurement:** track the time from when a user enters the `compete` screen to when they exit.

- **metric 2.4.c (positive reinforcement - primary):**
    - **metric:** the percentage of weekly active participants who receive at least one award over a 30-day period.
    - **target:** 75% of active participants will be recognized at least once a month.
    - **measurement:** track award recipients. over a rolling 30-day window, calculate `(unique users who received an award) / (unique users who participated)`. this ensures the system is inclusive and not just rewarding the same power users.

## 6. technical considerations

- **real-time communication:** a low-latency websocket or similar technology is required to power the "ghosted" view of other users' progress without significant performance impact.
- **process logging:** a robust event logging system is needed to capture all the data points required for the journey-based scoring algorithm (tool changes, erasures, color selections, etc.).
- **scoring algorithm calibration:** the weighting of the journey-based scoring algorithm will need to be carefully tested and calibrated to ensure the award distribution feels fair, varied, and encouraging.

## 7. future enhancements (post-v1)

- **team challenges:** allow users to form small teams to collaborate on a single canvas for a challenge.
- **themed weeks:** introduce week-long themes that connect the daily challenges into a larger narrative or project.
- **reactions:** allow users to leave positive, pre-defined emoji reactions (e.g., 👍, 🎉, 💡) on the creations of the highlighted award recipients.
- **personal best tracking:** show users their own progress over time, such as, "you used more colors today than you ever have before!"