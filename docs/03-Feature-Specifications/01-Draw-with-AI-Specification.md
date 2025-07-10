# feature specification: draw

## 1. feature overview & vision

**pillar:** draw - the canvas for expression
**vision:** the `draw` pillar is the foundational component of the ccplay ecosystem. its purpose is to provide a frictionless and empowering environment for children to translate their imagination into visual art. this feature is designed to be a dynamic and responsive canvas where technical limitations do not hinder creativity. through an intuitive interface and an intelligent assistant, `draw` removes the intimidation of a blank page and makes the act of creation a joyful and confidence-building experience.

## 2. target audience & personas

- **primary user:** children aged 4-8 who have a natural inclination to draw but may lack the technical skills or confidence to fully express their ideas.
- **persona: "imaginative isla" (age 5)**
    - isla has vibrant, complex scenes in her mind but gets frustrated when her drawings on paper don't match her vision.
    - she often knows what she wants to create but doesn't know the specific steps or tools to achieve it.
    - she responds well to encouragement and enjoys seeing her ideas come to life quickly.

## 3. user stories

- **as a child,** i want a simple canvas where i can start drawing immediately without having to navigate complex menus.
- **as a child,** when i draw a wobbly circle for a sun, i want to be able to tell the app, "make the sun perfectly round and bright yellow," and have it understand and help me.
- **as a child,** i want to ask the app to "add three more happy stars" to my drawing of the night sky, and see them appear in a style that matches my drawing.
- **as a child,** if i feel uninspired, i want the app to give me a fun starting point, like a simple outline of a castle or a prompt like "draw a silly monster."
- **as a child,** i want to save all my best drawings in one place so i can look at them later or show them to my parents.
- **as a parent,** i want to be able to easily view, save, and share my child's artwork in a controlled and private way.
- **as a parent,** i want to see how my child's drawings are becoming more complex over time as an indicator of their growing creativity.

## 3.1. feature flow visualization

![feature flow visualization](./assets/feature-flow-visualization.png)

## 3.2. functional requirements overview

the draw feature's functional requirements are organized into four core pillars, each addressing a specific aspect of the user experience:

### the digital canvas
the foundation of the drawing experience, providing the core interface and tools that children need to express their creativity:

- **fr-d1: clean, responsive canvas** - a full-screen digital canvas that adapts to different screen sizes and orientations, providing an uncluttered drawing surface that maximizes creative space.

- **fr-d2: touch gestures** - support for intuitive touch interactions including drawing strokes, canvas panning for larger works, and zooming capabilities to focus on details or work on broader compositions.

- **fr-d3: core drawing tools** - a simplified, icon-driven interface providing essential drawing capabilities:
  - **pen/brush tool:** multiple stroke weights (thin, medium, thick) for varied line expression
  - **color palette:** 24 carefully curated, vibrant colors suitable for children's artwork
  - **eraser tool:** corresponding stroke weights to match the pen tool for precise corrections
  - **undo/redo:** clear, single-tap buttons for easy mistake correction and experimentation
  - **clear canvas:** a confirmation-protected option to start fresh when desired

### the intelligent drawing assistant
the ai-powered companion that enhances the drawing experience through natural language interaction:

- **fr-d4 & fr-d5: text & voice input** - a persistent but non-intrusive prompt bar that accepts both typed text and voice-to-text input, accommodating pre-readers and users who prefer speech interaction.

- **fr-d6: command interpretation** - advanced ai capabilities to understand and execute natural language commands covering:
  - object creation requests ("add a big, red ball")
  - object modification instructions ("make the car bigger")
  - stylistic changes ("make everything sparkly")
  - emotional context adjustments ("make the character look happy")

- **fr-d7: stylistic matching** - ai-generated elements that seamlessly integrate with the user's existing drawing style, maintaining visual cohesion and artistic integrity.

#### voice input flow process
the voice interaction system follows a six-step process:

1. **fr-d5.1: ui button** - a dedicated, animated voicemicrophonebutton provides clear visual feedback for different states (idle, recording, processing, error)

2. **fr-d5.2: start recording** - user tap initiates audio recording with automatic permission handling and user-friendly error messaging

3. **fr-d5.3: recording state** - real-time visual feedback including sound-wave animations and recording duration timer

4. **fr-d5.4: auto-stop** - intelligent recording termination based on silence detection (2 seconds) with maximum duration limits (30 seconds)

5. **fr-d5.5: transcription** - audio processing through the `/api/voice-prompt` endpoint using gemini api for accurate speech-to-text conversion

6. **fr-d5.6: edit text** - user maintains full control to review and edit transcribed text before submission

### idea generation & templates
a comprehensive library of creative starting points to inspire and guide young artists:

- **fr-d8: library of "starters"** - a browsable collection of at least 50 drawing templates and prompts to overcome creative blocks

- **fr-d9: simple to complex scenes** - templates ranging from basic object outlines (cars, trees) to elaborate scenes (underwater worlds, space adventures)

- **fr-d10: proactive suggestions** - intelligent prompting system that offers relevant suggestions after periods of user inactivity (15 seconds) to maintain engagement

### gallery and sharing
a secure and user-friendly system for preserving and sharing creative work:

- **fr-d11: private user gallery** - secure storage for all completed artworks within the user's account

- **fr-d12: thumbnail & full-screen view** - gallery interface displaying drawings as thumbnails with full-screen viewing capabilities for detailed appreciation

- **fr-d13: parent-gated sharing** - controlled export functionality allowing high-resolution png image sharing through device-native options, with parental oversight

## 4. functional requirements

### 4.1. the digital canvas
- **fr-d1:** the system shall provide a clean, responsive, and full-screen digital canvas.
- **fr-d2:** the canvas must support basic touch gestures for drawing, panning, and zooming.
- **fr-d3:** a simplified, icon-driven ui shall provide access to the following core drawing tools:
    - **pen/brush:** with at least three pre-set, easily selectable stroke weights.
    - **color palette:** a curated palette of 24 vibrant, child-friendly colors.
    - **eraser:** with corresponding stroke weights to the pen tool.
    - **undo/redo:** clear, single-tap buttons to revert and restore actions.
    - **clear canvas:** a confirmation-protected button to start over.

### 4.2. the intelligent drawing assistant
- **fr-d4:** the system shall feature a persistent but non-intrusive input field (the "prompt bar") for natural language commands.
- **fr-d5:** the prompt bar must accept both typed text and voice-to-text input to accommodate pre-readers and users who prefer speech.

#### 4.2.1. voice input & recording flow
-   **fr-d5.1 (ui component):** a dedicated, animated `voicemicrophonebutton` shall be present next to the text prompt bar. the button will provide clear visual feedback for its various states (idle, recording, processing, error) using color changes, icons, and animations as defined in the implementation plan.
-   **fr-d5.2 (recording initiation):** a user tap on the `voicemicrophonebutton` will initiate the audio recording process. the system will request microphone permissions if not already granted, with user-friendly error messages for denial or device unavailability.
-   **fr-d5.3 (recording state):** during recording, the button will animate to indicate it is listening. this state will include:
    -   a visual sound-wave or pulsing animation that responds to the user's voice volume in real-time.
    -   a visible timer to show the recording duration.
-   **fr-d5.4 (automatic stop):** the recording will automatically stop after a configurable period of silence (e.g., 2 seconds) to create a natural, hands-free experience. a maximum recording duration (e.g., 30 seconds) will also be enforced. the user can manually stop the recording at any time.
-   **fr-d5.5 (transcription & population):** once the recording stops, it enters a "processing" state. the captured audio blob is sent to the `/api/voice-prompt` backend endpoint. upon successful transcription via the gemini api, the returned text will automatically populate the text prompt bar.
-   **fr-d5.6 (editing):** the user retains full control to edit the transcribed text in the prompt bar before submitting it to the drawing assistant.

![voice input & recording flow](./assets/voice-input-recording-flow.png)

- **fr-d6:** the underlying ai model must be able to interpret commands related to:
    - **object creation:** e.g., "add a big, red ball," "draw a house with two windows."
    - **object modification:** e.g., "make the car bigger," "change the flower's color to purple."
    - **stylistic changes:** e.g., "make everything sparkly," "colorize the whole drawing."
    - **emotional context:** e.g., "make the character look happy."
- **fr-d7:** ai-generated additions or modifications must stylistically match the user's existing drawing to feel like a seamless enhancement, not a replacement.

### 4.3. idea generation & templates
- **fr-d8:** the platform shall provide a browsable library of at least 50 "drawing starters" or templates.
- **fr-d9:** templates will range from simple object outlines (e.g., a car, a tree) to more complex scenes (e.g., an underwater world, a space scene).
- **fr-d10:** the intelligent drawing assistant shall be able to proactively suggest a relevant prompt if the user is inactive on the canvas for a configurable period (e.g., 15 seconds).

### 4.4. gallery and sharing
- **fr-d11:** all completed artworks can be saved to a private, user-specific gallery within the app.
- **fr-d12:** the gallery shall display drawings as thumbnails and allow for full-screen viewing.
- **fr-d13:** a parent-gated sharing feature shall allow exporting of high-resolution images (png format) to the device's native sharing options.

## 5. success metrics & measurement

the success of the `draw` pillar will be measured by its ability to foster engagement and encourage creative exploration.

![success metrics & measurement](./assets/success-metrics-measurement.png)

- **metric 2.1.a (engagement - primary):**
    - **metric:** average number of drawings created per user per week.
    - **target:** 2.5 drawings/user/week.
    - **measurement:** log an event each time a user saves a new creation to their gallery. aggregate weekly per user.

- **metric 2.1.b (feature adoption - primary):**
    - **metric:** percentage of drawing sessions that utilize the intelligent drawing assistant (via text or voice).
    - **target:** 60% of sessions.
    - **measurement:** a session is defined as a period of activity in the `draw` pillar. log an event for every prompt submitted (differentiating between text and voice submissions). calculate `(sessions with at least one prompt event) / (total sessions)`.

- **metric 2.1.d (voice adoption - secondary):**
    - **metric:** percentage of intelligent drawing assistant interactions that originate from voice input.
    - **target:** 40% of all prompts are initiated via voice.
    - **measurement:** calculate `(voice prompt events) / (total prompt events)`.

- **metric 2.1.c (creative complexity - secondary):**
    - **metric:** average number of distinct elements and ai-driven edits per saved drawing.
    - **target:** see a 15% increase in this metric over a user's first 3 months.
    - **measurement:** on save, analyze the drawing's final state. count the number of distinct vector objects and log the number of ai assistant commands used for that artwork. track this average over time for each user cohort.

## 6. technical considerations

- **ai model latency:** all drawing assistant commands must be processed and rendered on the canvas in under 3 seconds to maintain a fluid user experience.
- **stylistic cohesion:** the ai model for object creation must be fine-tuned to analyze the user's current drawing style (e.g., crayon-like, marker-like) and generate new elements that match.
- **device performance:** the canvas must be optimized for smooth performance on a range of target devices, including lower-end tablets.

## 7. future enhancements (post-v1)

- **collaborative drawing:** a real-time, shared canvas for two or more users to draw together.
- **advanced layering:** a simplified layering system for more complex compositions.
- **custom brushes:** allow users to create and save their own simple brush styles.
- **integration with `story`:** use a saved drawing as the banner image for a new story in the `story` pillar.
- **integration with `compete`:** submit a saved drawing directly to a relevant daily challenge.