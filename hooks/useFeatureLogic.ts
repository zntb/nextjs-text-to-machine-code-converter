// app/hooks/useFeatureLogic.ts
import { useState, useMemo } from 'react';

export interface Feature {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export function useFeatureLogic(allFeatures: Feature[]) {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredFeatures = useMemo(() => {
    return allFeatures.filter(feature => {
      const matchesSearch =
        feature.title.toLowerCase().includes(search.toLowerCase()) ||
        feature.description.toLowerCase().includes(search.toLowerCase());

      const matchesTag = selectedTag
        ? feature.tags.includes(selectedTag)
        : true;

      return matchesSearch && matchesTag;
    });
  }, [allFeatures, search, selectedTag]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allFeatures.forEach(f => f.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [allFeatures]);

  return {
    filteredFeatures,
    search,
    setSearch,
    selectedTag,
    setSelectedTag,
    allTags,
  };
}
