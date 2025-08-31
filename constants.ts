import { Type } from "@google/genai";

export const DEFAULT_JSON_PROMPT = "Generate three creative and delicious cookie recipes.";

export const DEFAULT_SCHEMA = {
  type: Type.ARRAY,
  description: "A list of cookie recipes.",
  items: {
    type: Type.OBJECT,
    properties: {
      recipe_name: {
        type: Type.STRING,
        description: "The name of the cookie recipe.",
      },
      description: {
        type: Type.STRING,
        description: "A short, enticing description of the cookie.",
      },
      ingredients: {
        type: Type.ARRAY,
        description: "A list of ingredients with quantities.",
        items: {
          type: Type.STRING,
        },
      },
      rating: {
        type: Type.NUMBER,
        description: "A rating from 1 to 5.",
      },
    },
    required: ["recipe_name", "description", "ingredients", "rating"],
  },
};

export const DEFAULT_VEO_PROMPT = `
// This is the "Veo JSON Hack". We are providing a highly-structured,
// JSON-like prompt to guide the video generation with precision.
// Describe scenes, subjects, actions, and camera movements.

{
  "style": "cinematic, hyper-realistic, 8k, dramatic lighting",
  "scenes": [
    {
      "scene": 1,
      "duration": "4 seconds",
      "description": "A majestic eagle soaring through a cloudy sky. The camera is doing a slow dolly zoom out, revealing vast mountain ranges below.",
      "camera_shot": "wide angle, dolly zoom out"
    },
    {
      "scene": 2,
      "duration": "5 seconds",
      "description": "Close up shot of a robotic hand assembling a complex microchip on a futuristic workbench. Tiny sparks fly from the connection points.",
      "camera_shot": "macro, focus pull"
    },
    {
      "scene": 3,
      "duration": "3 seconds",
      "description": "A neon-lit cyberpunk city street at night during a rainstorm. Reflections of the neon signs shimmer on the wet pavement. A flying car speeds by overhead.",
      "camera_shot": "low angle, panning shot"
    }
  ]
}
`.trim();

export const VEO_LOADING_MESSAGES = [
    "Initializing quantum video synthesizer...",
    "Calibrating the cinematic lens array...",
    "Rendering first pass of keyframes...",
    "Applying advanced color grading...",
    "Compositing hyper-realistic visual effects...",
    "Encoding audio-visual stream...",
    "Polishing the final frames...",
    "Almost there, the masterpiece is nearly ready...",
];

export const VEO_CORE_STRUCTURE_PROMPT = `
// This is a comprehensive VEO prompt structure for generating high-fidelity, multi-scene videos.
// By defining global settings and detailing each scene with specific attributes, you gain granular control over the final output.
// Use this template as a starting point for your creative vision.

{
  "video_metadata": {
    "title": "A Journey Through Time",
    "style_reference": "cinematic, high-fantasy, epic, inspired by Lord of the Rings and Blade Runner",
    "overall_mood": "mysterious, awe-inspiring, with moments of tension and wonder",
    "color_palette": "deep blues, vibrant golds, neon pinks, and shadowy blacks",
    "aspect_ratio": "16:9"
  },
  "scenes": [
    {
      "scene_number": 1,
      "duration_seconds": 5,
      "prompt": "An ancient, moss-covered stone archway stands in the middle of a dense, misty forest. Golden light beams pierce through the canopy. A lone figure in a dark cloak walks slowly towards the archway.",
      "environment": {
        "setting": "ancient forest",
        "time_of_day": "dawn",
        "weather": "misty, light fog"
      },
      "subjects": [
        {
          "name": "The Traveler",
          "description": "A figure completely obscured by a dark, heavy cloak. Their identity is a mystery.",
          "action": "walking slowly and deliberately towards the stone archway."
        }
      ],
      "camera_movements": [
        {
          "type": "slow push-in",
          "target": "The Traveler and the archway",
          "speed": "very slow"
        }
      ],
      "audio_cues": "ambient forest sounds, a faint, mystical hum, soft footsteps on damp earth."
    },
    {
      "scene_number": 2,
      "duration_seconds": 6,
      "prompt": "As the traveler passes through the archway, the scene instantly transforms into a futuristic cyberpunk city. The camera is low, looking up at towering skyscrapers covered in holographic ads. Flying vehicles zip between buildings. The traveler looks around in awe.",
      "environment": {
        "setting": "cyberpunk metropolis",
        "time_of_day": "night",
        "weather": "light rain, reflective wet streets"
      },
      "subjects": [
        {
          "name": "The Traveler",
          "description": "Same cloaked figure, now contrasted against the neon glow of the city.",
          "action": "stops just past the archway, head tilted up, observing the new surroundings with a sense of wonder."
        }
      ],
      "camera_movements": [
        {
          "type": "low-angle arc shot",
          "target": "The Traveler",
          "direction": "circling from left to right, revealing the cityscape behind them"
        }
      ],
      "audio_cues": "the hum of flying cars, distant sirens, electronic music, the sizzle of rain on pavement."
    },
    {
      "scene_number": 3,
      "duration_seconds": 4,
      "prompt": "A close-up on the traveler's face, but it's revealed to be a chrome mask with a single glowing blue eye. The eye reflects the chaotic city lights.",
      "subjects": [
        {
          "name": "The Traveler's Face",
          "description": "A highly-detailed chrome mask, seamless and reflective. A single blue optic glows from within.",
          "action": "The blue eye subtly scans the environment."
        }
      ],
      "camera_movements": [
        {
          "type": "extreme close-up",
          "target": "The mask's blue eye"
        },
        {
          "type": "subtle rack focus",
          "from": "the eye",
          "to": "the reflections on the chrome surface"
        }
      ],
      "audio_cues": "a low electronic whirring sound, a sharp digital 'ping'."
    }
  ]
}
`.trim();

export const VEO_ANIMATION_PROMPT = `
// A prompt for creating a stylized 2D animation.
// Focus on visual style, character design, and fluid motion.
{
  "style": "2D animation, cel-shaded, vibrant colors, Studio Ghibli inspired, smooth keyframes",
  "scenes": [
    {
      "scene": 1,
      "duration": "6 seconds",
      "description": "A young girl with a bright red scarf sits on a grassy hill, sketching in a notepad. A gentle breeze makes the grass and her hair sway. A small, fluffy white creature with big eyes pops its head out of her bag.",
      "camera_shot": "medium shot, slight low angle, gentle pan right"
    },
    {
      "scene": 2,
      "duration": "4 seconds",
      "description": "Close up on the creature's face as it looks up at the girl and chirps, a small speech bubble with a heart appears and pops.",
      "camera_shot": "close-up, focus on creature"
    }
  ]
}
`.trim();

export const VEO_DOCUMENTARY_PROMPT = `
// A prompt for a nature documentary style video.
// Emphasizes realism, natural lighting, and observational camera work.
{
  "style": "nature documentary, BBC Earth style, 4k, natural lighting, high detail, steady cam",
  "scenes": [
    {
      "scene": 1,
      "duration": "7 seconds",
      "description": "An extreme close-up of a chameleon on a branch. Its skin slowly changes color to match the leaves around it. Its eye swivels independently, scanning the area.",
      "camera_shot": "macro shot, static, rack focus from eye to skin texture"
    },
    {
      "scene": 2,
      "duration": "5 seconds",
      "description": "Wide shot of a vast savanna at sunset. A herd of elephants walks slowly towards a watering hole. The sky is orange and purple.",
      "camera_shot": "wide establishing shot, slow drone-like movement backwards"
    }
  ]
}
`.trim();

export const VEO_ABSTRACT_PROMPT = `
// A prompt for an abstract, visually experimental video.
// Focus on shapes, colors, textures, and non-narrative movement.
{
  "style": "abstract, experimental, motion graphics, surreal, vibrant, high contrast",
  "scenes": [
    {
      "scene": 1,
      "duration": "5 seconds",
      "description": "Geometric shapes (cubes, spheres, pyramids) in pastel colors float and gently collide in a zero-gravity environment. As they touch, they ripple like liquid.",
      "camera_shot": "slowly tumbling through the field of shapes"
    },
    {
      "scene": 2,
      "duration": "5 seconds",
      "description": "A flowing river of iridescent, liquid metal flows across a dark, textured surface. The light catches on the metallic ripples, creating rainbow patterns.",
      "camera_shot": "top-down view, following the flow of the liquid"
    }
  ]
}
`.trim();