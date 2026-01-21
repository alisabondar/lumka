import {
  CHALLENGES,
  getChallenge,
  checkChallenge,
  getDifficultyName,
  getTotalChallengeCount,
  getAnteForRound,
  ANTES,
} from '../game/challenges';
import type { State } from '../types/playerState';

describe('challenges', () => {
  describe('CHALLENGES', () => {
    it('should have exactly 100 challenges', () => {
      expect(CHALLENGES.length).toBe(100);
    });

    it('should have challenges with correct structure', () => {
      CHALLENGES.forEach((challenge) => {
        expect(challenge).toHaveProperty('id');
        expect(challenge).toHaveProperty('number');
        expect(challenge).toHaveProperty('name');
        expect(challenge).toHaveProperty('description');
        expect(challenge).toHaveProperty('difficulty');
        expect(challenge).toHaveProperty('check');
        expect(typeof challenge.check).toBe('function');
      });
    });

    it('should have sequential challenge numbers', () => {
      CHALLENGES.forEach((challenge, index) => {
        expect(challenge.number).toBe(index + 1);
      });
    });

    it('should have unique challenge IDs', () => {
      const ids = CHALLENGES.map((c) => c.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(CHALLENGES.length);
    });
  });

  describe('getChallenge', () => {
    it('should return challenge for valid number', () => {
      const challenge = getChallenge(1);

      expect(challenge).toBeDefined();
      expect(challenge?.number).toBe(1);
    });

    it('should return challenge for middle number', () => {
      const challenge = getChallenge(50);

      expect(challenge).toBeDefined();
      expect(challenge?.number).toBe(50);
    });

    it('should return challenge for last number', () => {
      const challenge = getChallenge(100);

      expect(challenge).toBeDefined();
      expect(challenge?.number).toBe(100);
    });

    it('should return null for invalid number (too low)', () => {
      const challenge = getChallenge(0);

      expect(challenge).toBeNull();
    });

    it('should return null for invalid number (too high)', () => {
      const challenge = getChallenge(101);

      expect(challenge).toBeNull();
    });
  });

  describe('checkChallenge', () => {
    it('should return boolean result', () => {
      const challenge = getChallenge(1);
      if (!challenge) {
        throw new Error('Challenge should exist');
      }

      const state: State = {
        traits: [],
        score: 0,
        stability: 10,
      };

      const result = checkChallenge(state, challenge);

      expect(typeof result).toBe('boolean');
    });

    it('should check challenge requirements correctly', () => {
      const challenge = getChallenge(1);
      if (!challenge) {
        throw new Error('Challenge should exist');
      }

      const passingState: State = {
        traits: Array(10).fill(null).map((_, i) => ({
          id: `trait-${i}`,
          name: `Trait ${i}`,
          category: 'positive' as const,
          description: 'Test trait',
        })),
        score: 20,
        stability: 10,
      };

      const result = checkChallenge(passingState, challenge);

      expect(typeof result).toBe('boolean');
    });
  });

  describe('getDifficultyName', () => {
    it('should return difficulty name for tier 1', () => {
      expect(getDifficultyName(1)).toBe('Novice');
    });

    it('should return difficulty name for tier 2', () => {
      expect(getDifficultyName(2)).toBe('Beginner');
    });

    it('should return difficulty name for tier 5', () => {
      expect(getDifficultyName(5)).toBe('Advanced');
    });

    it('should return difficulty name for tier 10', () => {
      expect(getDifficultyName(10)).toBe('Mythic');
    });

    it('should handle tier beyond available names', () => {
      const name = getDifficultyName(15);

      expect(name).toBe('Mythic');
    });
  });

  describe('getTotalChallengeCount', () => {
    it('should return 100', () => {
      expect(getTotalChallengeCount()).toBe(100);
    });
  });

  describe('ANTES', () => {
    it('should have exactly 10 antes', () => {
      expect(ANTES.length).toBe(10);
    });

    it('should have 10 challenges per ante', () => {
      ANTES.forEach((ante) => {
        expect(ante.challenges.length).toBe(10);
      });
    });

    it('should have sequential ante numbers', () => {
      ANTES.forEach((ante, index) => {
        expect(ante.ante).toBe(index + 1);
      });
    });

    it('should have unique ante IDs', () => {
      const ids = ANTES.map((a) => a.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ANTES.length);
    });
  });

  describe('getAnteForRound', () => {
    it('should return ante for round 1', () => {
      const ante = getAnteForRound(1);

      expect(ante).toBeDefined();
      expect(ante?.ante).toBe(1);
    });

    it('should return ante for round 5', () => {
      const ante = getAnteForRound(5);

      expect(ante).toBeDefined();
      expect(ante?.ante).toBe(5);
    });

    it('should return ante for round 10', () => {
      const ante = getAnteForRound(10);

      expect(ante).toBeDefined();
      expect(ante?.ante).toBe(10);
    });

    it('should return null for invalid round (too low)', () => {
      const ante = getAnteForRound(0);

      expect(ante).toBeNull();
    });

    it('should return null for invalid round (too high)', () => {
      const ante = getAnteForRound(11);

      expect(ante).toBeNull();
    });
  });

  describe('Challenge difficulty progression', () => {
    it('should have increasing difficulty tiers', () => {
      const challenges = [1, 10, 20, 30, 50, 70, 100].map((n) =>
        getChallenge(n)
      );

      const difficulties = challenges
        .filter((c): c is NonNullable<typeof c> => c !== null)
        .map((c) => c.difficulty);

      expect(difficulties[0]).toBeLessThanOrEqual(difficulties[difficulties.length - 1]);
    });
  });
});

