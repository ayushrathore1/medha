/**
 * Avatar utility for generating unique gender-based avatars
 * Uses DiceBear API for consistent, unique avatar generation
 */

// Different avatar styles for different genders - includes both human and emoji types
const MALE_STYLES = ['adventurer-neutral', 'avataaars-neutral', 'fun-emoji', 'thumbs'];
const FEMALE_STYLES = ['adventurer', 'avataaars', 'fun-emoji', 'lorelei'];
const OTHER_STYLES = ['bottts', 'fun-emoji', 'thumbs', 'icons'];

/**
 * Generate a unique avatar URL based on seed and gender
 * @param {string} seed - Unique identifier (email or custom seed)
 * @param {string} gender - 'Male', 'Female', or 'Other'
 * @returns {string} Avatar URL
 */
export const generateAvatarUrl = (seed, gender = 'Other') => {
  let style;
  let backgroundColor;
  
  if (gender === 'Male') {
    style = 'adventurer-neutral';
    backgroundColor = 'b6e3f4,c0aede,d1d4f9'; // Blue/purple tones
  } else if (gender === 'Female') {
    style = 'adventurer';
    backgroundColor = 'ffd5dc,ffdfbf,ffc9de'; // Pink/peach tones  
  } else {
    style = 'bottts';
    backgroundColor = 'c0aede,d1d4f9,b6e3f4'; // Neutral tones
  }
  
  const encodedSeed = encodeURIComponent(seed || 'default');
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodedSeed}&backgroundColor=${backgroundColor}`;
};

/**
 * Generate multiple avatar options for the picker
 * @param {string} baseSeed - Base seed (usually email)
 * @param {string} gender - 'Male', 'Female', or 'Other'
 * @returns {Array} Array of avatar objects with url and id
 */
export const generateAvatarOptions = (baseSeed, gender = 'Other') => {
  const avatars = [];
  let styles;
  let backgroundColor;
  
  if (gender === 'Male') {
    styles = MALE_STYLES;
    backgroundColor = 'b6e3f4,c0aede,d1d4f9';
  } else if (gender === 'Female') {
    styles = FEMALE_STYLES;
    backgroundColor = 'ffd5dc,ffdfbf,ffc9de';
  } else {
    styles = OTHER_STYLES;
    backgroundColor = 'c0aede,d1d4f9,b6e3f4';
  }
  
  // Generate 4-5 avatars per style = 16-20 total options
  styles.forEach((style, styleIndex) => {
    for (let i = 0; i < 5; i++) {
      const seed = `${baseSeed}_${styleIndex}_${i}`;
      const encodedSeed = encodeURIComponent(seed);
      avatars.push({
        id: avatars.length,
        url: `https://api.dicebear.com/7.x/${style}/svg?seed=${encodedSeed}&backgroundColor=${backgroundColor}`,
        style: style
      });
    }
  });
  
  return avatars;
};

/**
 * Get avatar URL by index from the options list
 * @param {string} baseSeed - Base seed (usually email)
 * @param {string} gender - 'Male', 'Female', or 'Other'
 * @param {number} index - Avatar index (0-19)
 * @returns {string} Avatar URL
 */
export const getAvatarByIndex = (baseSeed, gender = 'Other', index = 0) => {
  const options = generateAvatarOptions(baseSeed, gender);
  const avatar = options[index] || options[0];
  return avatar.url;
};

export default generateAvatarUrl;

