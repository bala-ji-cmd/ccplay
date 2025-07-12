import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import logger from '@/lib/client-logger';

interface CharacterPreferences {
  selectedCharacterId: string | null;
  recentCharacters: string[];
  favoriteCharacters: string[];
}

const DEFAULT_PREFERENCES: CharacterPreferences = {
  selectedCharacterId: null,
  recentCharacters: [],
  favoriteCharacters: []
};

const STORAGE_KEY = 'ccplay-character-preferences';

export const useCharacterPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<CharacterPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const savedPreferences = localStorage.getItem(STORAGE_KEY);
        if (savedPreferences) {
          const parsed = JSON.parse(savedPreferences);
          setPreferences({
            selectedCharacterId: parsed.selectedCharacterId || null,
            recentCharacters: parsed.recentCharacters || [],
            favoriteCharacters: parsed.favoriteCharacters || []
          });
        }
      } catch (error) {
        logger.error('Error loading character preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to localStorage whenever they change
  const savePreferences = useCallback((newPreferences: CharacterPreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
      
      logger.info('Character preferences saved', {
        selectedCharacterId: newPreferences.selectedCharacterId,
        recentCount: newPreferences.recentCharacters.length,
        favoriteCount: newPreferences.favoriteCharacters.length,
        userId: user?.id
      });
    } catch (error) {
      logger.error('Error saving character preferences:', error);
    }
  }, [user]);

  // Select a character and update preferences
  const selectCharacter = useCallback((characterId: string) => {
    const newPreferences = {
      ...preferences,
      selectedCharacterId: characterId,
      recentCharacters: [
        characterId,
        ...preferences.recentCharacters.filter(id => id !== characterId)
      ].slice(0, 5) // Keep only last 5 recent characters
    };
    
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  // Add character to favorites
  const addToFavorites = useCallback((characterId: string) => {
    if (preferences.favoriteCharacters.includes(characterId)) {
      return; // Already in favorites
    }
    
    const newPreferences = {
      ...preferences,
      favoriteCharacters: [...preferences.favoriteCharacters, characterId]
    };
    
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  // Remove character from favorites
  const removeFromFavorites = useCallback((characterId: string) => {
    const newPreferences = {
      ...preferences,
      favoriteCharacters: preferences.favoriteCharacters.filter(id => id !== characterId)
    };
    
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  // Check if character is in favorites
  const isFavorite = useCallback((characterId: string) => {
    return preferences.favoriteCharacters.includes(characterId);
  }, [preferences.favoriteCharacters]);

  // Get recommended character (most recent or random)
  const getRecommendedCharacter = useCallback(() => {
    if (preferences.recentCharacters.length > 0) {
      return preferences.recentCharacters[0];
    }
    
    // Return a random character if no recent ones
    const characters = ['friendly-bear', 'cheerful-bunny', 'wise-owl', 'playful-puppy', 'gentle-elephant', 'curious-cat'];
    return characters[Math.floor(Math.random() * characters.length)];
  }, [preferences.recentCharacters]);

  // Clear all preferences
  const clearPreferences = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setPreferences(DEFAULT_PREFERENCES);
      logger.info('Character preferences cleared');
    } catch (error) {
      logger.error('Error clearing character preferences:', error);
    }
  }, []);

  return {
    preferences,
    isLoading,
    selectedCharacterId: preferences.selectedCharacterId,
    recentCharacters: preferences.recentCharacters,
    favoriteCharacters: preferences.favoriteCharacters,
    selectCharacter,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getRecommendedCharacter,
    clearPreferences
  };
}; 