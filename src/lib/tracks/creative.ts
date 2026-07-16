export const CREATIVE_COURSES = [
  {
    id: 'creative-1',
    track: 'Creative',
    title: 'Photography, editing & videography: speak the language',
    subtitle: 'The vocabulary, jargon & briefing techniques that make creatives execute exactly what you see in your head',
    duration: '14 m',
    level: 'Masters',
    xp: 160,
    sections: [
      {
        title: 'The language gap between clients and creatives',
        content: 'When a client says "make it pop," a photographer hears a thousand different things. The language gap between clients and creatives is responsible for more wasted shoots and revision cycles than any technical failure. Bridging the gap requires learning the vocabulary: aperture (controls depth of field), shutter speed (controls motion blur), ISO (controls sensor sensitivity, also noise). But more importantly: mood references ("I want the feel of a late-afternoon summer market") communicate faster than technical specs.',
        keyPoints: [
          'Shot types: ECU, CU, MS, WS, EWS — learn these',
          'Mood boards: 5-10 reference images communicate better than 500 words',
          'Golden hour: the 30 minutes after sunrise and before sunset',
          'Hero shot, supporting shots, detail shots — brief each separately',
        ],
      },
    ],
  },
  {
    id: 'creative-2',
    track: 'Creative',
    title: 'Video editing: pacing, cuts & the invisible craft',
    subtitle: 'Cut theory, J/L cuts, music sync, colour workflow & exporting for every platform',
    duration: '13 m',
    level: 'Masters',
    xp: 150,
    sections: [
      {
        title: 'The invisible cut',
        content: 'Great editing is invisible — the viewer feels the story without noticing the craft. The J-cut: audio from the next scene begins before the video cuts, pulling the viewer forward. The L-cut: video cuts to the next scene while audio from the previous scene continues, giving a sense of continuity. Both create flow that straight cuts can\'t achieve. Match cuts (cutting between two visually similar compositions) and action cuts (cutting mid-motion) create seamless momentum.',
        keyPoints: [
          'J-cut: hear the next scene before you see it',
          'L-cut: see the next scene while hearing the previous',
          'Match cut: visual rhyme between two scenes',
          'Cut on action: the most natural invisible cut',
        ],
      },
    ],
  },
  {
    id: 'creative-3',
    track: 'Creative',
    title: 'Brand photography: directing shots that are actually usable',
    subtitle: 'Art direction frameworks, prop strategy, location scouting & getting scroll-stopping hero images',
    duration: '13 m',
    level: 'PhD',
    xp: 160,
    sections: [
      {
        title: 'The shoot brief that saves the day',
        content: 'A shoot without a brief is a guess. A shoot with a brief is a plan. The components of a useful brief: deliverables (exactly what images/formats you need), brand guidelines (colors, tone, do\'s and don\'ts), reference images (5-10 images that capture the feel), shot list (specific shots with composition notes), talent direction (poses, expressions, actions), and usage rights (where these images will appear, for how long). Give this brief to the photographer at least 72 hours before the shoot.',
        keyPoints: [
          'Shot list: number them, note the minimum must-haves vs nice-to-haves',
          'Reference images: not "I want this exact thing" but "I want this feeling"',
          'Leave 20% of shoot time for the photographer to explore',
          'Negative space: always request some shots with room for copy overlay',
        ],
      },
    ],
  },
  {
    id: 'creative-4',
    track: 'Creative',
    title: 'Reels & short-form video: the formula behind retention',
    subtitle: 'Hook science, pacing structure, caption strategy & the brief that produces scroll-stopping content',
    duration: '14 m',
    level: 'PhD',
    xp: 170,
    sections: [
      {
        title: 'The hook formula',
        content: 'You have 1.7 seconds to stop the scroll before the algorithm\'s attention data decides your video isn\'t worth promoting. The hook must do three things: create a pattern interrupt (something visually or audibly unexpected), establish a reason to keep watching (curiosity gap, promise, or conflict), and be relevant to the target viewer. The most powerful hooks use what psychologists call the "open loop" — a question or statement that can only be resolved by watching to the end.',
        keyPoints: [
          '1.7 seconds: the decision window',
          'Pattern interrupt + reason to continue + relevance = hook',
          'Open loops create compulsive completion',
          'First frame must work as a still image — many users have autoplay off',
        ],
      },
    ],
  },
  {
    id: 'creative-5',
    track: 'Creative',
    title: 'Creative direction: running shoots that deliver',
    subtitle: 'Mood boards, on-set direction, post-production briefs & approval workflows that cut revision cycles in half',
    duration: '13 m',
    level: 'PhD',
    xp: 170,
    sections: [
      {
        title: 'On-set direction without being annoying',
        content: 'The creative director\'s job on set is not to micromanage every frame — it\'s to hold the vision and give the creative team room to execute. Effective on-set direction: give direction in feeling and intention ("I want this person to look like they just received the best news of their life") rather than technical instruction. Review frames on the monitor, not the camera screen. Call "hold" to check in every 10-15 minutes. Trust the team you hired, but be unambiguous about what\'s not working.',
        keyPoints: [
          'Direction in feelings, not mechanics',
          'The monitor is your tool — use it',
          '"What\'s not working" is more useful than "try this instead"',
          'The best shot usually comes after the talent relaxes — plan for overtime',
        ],
      },
    ],
  }
] as const
