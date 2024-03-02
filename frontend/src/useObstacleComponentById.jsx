// Maps obstacle IDs to their corresponding React components.

import {WhaleObstacle, TextObstacle, PoopObstacle, GreenCandle_1} from './Level'

export const useObstacleComponentById = (id) => {
    const idToComponentMap = {
        '1': WhaleObstacle,
        '2': TextObstacle,
        '3': PoopObstacle,
        '4': GreenCandle_1,
        // Add more mappings as needed.
    };

    return idToComponentMap[id] || null;
};
